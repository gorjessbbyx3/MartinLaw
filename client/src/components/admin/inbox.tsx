
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Inbox, Mail, MailOpen, Clock, User, Phone, MessageSquare, Tag, Archive, Trash2, Reply, Star } from "lucide-react";
import type { ContactMessage } from "@shared/schema";

export function InboxComponent() {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
    staleTime: 30 * 1000, // 30 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/contact-messages/${id}/read`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to mark as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
    },
  });

  const updateMessageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContactMessage> }) => {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update message");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
      toast({
        title: "Message Updated",
        description: "The contact message has been updated successfully.",
      });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete message");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
      setSelectedMessage(null);
      toast({
        title: "Message Deleted",
        description: "The contact message has been deleted successfully.",
      });
    },
  });

  const filteredMessages = messages.filter(message => {
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || message.priority === priorityFilter;
    const matchesSearch = searchQuery === "" || 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleMessageClick = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === "unread") {
      markAsReadMutation.mutate(message.id);
    }
  };

  const handleStatusUpdate = (status: string) => {
    if (!selectedMessage) return;
    updateMessageMutation.mutate({
      id: selectedMessage.id,
      data: { status },
    });
    setSelectedMessage({ ...selectedMessage, status });
  };

  const handlePriorityUpdate = (priority: string) => {
    if (!selectedMessage) return;
    updateMessageMutation.mutate({
      id: selectedMessage.id,
      data: { priority },
    });
    setSelectedMessage({ ...selectedMessage, priority });
  };

  const handleNotesUpdate = (notes: string) => {
    if (!selectedMessage) return;
    updateMessageMutation.mutate({
      id: selectedMessage.id,
      data: { notes },
    });
    setSelectedMessage({ ...selectedMessage, notes });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread": return "bg-red-100 text-red-800";
      case "read": return "bg-blue-100 text-blue-800";
      case "replied": return "bg-green-100 text-green-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "normal": return "bg-blue-100 text-blue-800";
      case "low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(m => m.status === "unread").length;

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Inbox className="h-6 w-6" />
            <span>Contact Messages</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Messages ({filteredMessages.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading messages...
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No messages found
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedMessage?.id === message.id ? 'bg-muted' : ''
                        } ${message.status === 'unread' ? 'border-l-4 border-l-red-500' : ''}`}
                        onClick={() => handleMessageClick(message)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {message.status === 'unread' ? (
                              <Mail className="h-4 w-4 text-red-500" />
                            ) : (
                              <MailOpen className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="font-medium text-sm truncate">
                              {message.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge className={`text-xs ${getStatusColor(message.status)}`}>
                              {message.status}
                            </Badge>
                            <Badge className={`text-xs ${getPriorityColor(message.priority)}`}>
                              {message.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {message.subject || "No subject"}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {message.message}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {formatDate(message.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">
                      {selectedMessage.subject || "No Subject"}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{selectedMessage.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{selectedMessage.email}</span>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{selectedMessage.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(selectedMessage.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={selectedMessage.status} onValueChange={handleStatusUpdate}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedMessage.priority} onValueChange={handlePriorityUpdate}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMessageMutation.mutate(selectedMessage.id)}
                      disabled={deleteMessageMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Message Content */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Message</Label>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="whitespace-pre-wrap text-sm">
                      {selectedMessage.message}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your inquiry'}`)}
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Reply via Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${selectedMessage.phone}`)}
                    disabled={!selectedMessage.phone}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>

                {/* Admin Notes */}
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
                    Internal Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={selectedMessage.notes || ''}
                    onChange={(e) => handleNotesUpdate(e.target.value)}
                    placeholder="Add internal notes about this message..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[400px]">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                  <p>Select a message to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
