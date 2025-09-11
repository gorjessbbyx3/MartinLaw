import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { Plus, Briefcase, Calendar, DollarSign, User, Edit, Clock } from "lucide-react";

interface CaseFormData {
  clientId: string;
  title: string;
  caseType: string;
  status: string;
  description: string;
}

export function Cases() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<any>(null);
  const [formData, setFormData] = useState<CaseFormData>({
    clientId: "",
    title: "",
    caseType: "",
    status: "active",
    description: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cases, isLoading } = useQuery({
    queryKey: ["/api/cases"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: clients } = useQuery({
    queryKey: ["/api/clients"],
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: CaseFormData) => {
      await apiRequest("POST", "/api/cases", data);
    },
    onSuccess: () => {
      toast({
        title: "Case Created",
        description: "New case has been created successfully.",
      });
      setIsDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
    },
    onError: (error) => {
      console.error("Create case error:", error);
      toast({
        title: "Error",
        description: "Failed to create case. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CaseFormData) => {
      await apiRequest("PUT", `/api/cases/${editingCase.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Case Updated",
        description: "Case has been updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingCase(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
    },
    onError: (error) => {
      console.error("Update case error:", error);
      toast({
        title: "Error",
        description: "Failed to update case. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      clientId: "",
      title: "",
      caseType: "",
      status: "active",
      description: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.title || !formData.caseType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingCase) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (case_: any) => {
    setEditingCase(case_);
    setFormData({
      clientId: case_.clientId || "",
      title: case_.title || "",
      caseType: case_.caseType || "",
      status: case_.status || "active",
      description: case_.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleInputChange = (field: keyof CaseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'closed':
        return 'bg-gray-500';
      case 'on-hold':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients?.find((c: any) => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Unknown Client';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy-900" data-testid="text-cases-title">Cases</h2>
          <p className="text-muted-foreground" data-testid="text-cases-description">
            Manage active and closed legal cases
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="btn-navy"
              onClick={() => {
                setEditingCase(null);
                resetForm();
              }}
              data-testid="button-add-case"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" data-testid="dialog-case-form">
            <DialogHeader>
              <DialogTitle data-testid="text-dialog-title">
                {editingCase ? "Edit Case" : "Add New Case"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="clientId" className="block text-sm font-semibold text-navy-900 mb-2">
                  Client *
                </Label>
                <Select value={formData.clientId} onValueChange={(value) => handleInputChange("clientId", value)}>
                  <SelectTrigger data-testid="select-client">
                    <SelectValue placeholder="Select a client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client: any) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.firstName} {client.lastName} - {client.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title" className="block text-sm font-semibold text-navy-900 mb-2">
                  Case Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter case title..."
                  data-testid="input-case-title"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="caseType" className="block text-sm font-semibold text-navy-900 mb-2">
                    Case Type *
                  </Label>
                  <Select value={formData.caseType} onValueChange={(value) => handleInputChange("caseType", value)}>
                    <SelectTrigger data-testid="select-case-type">
                      <SelectValue placeholder="Select case type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="civil-litigation">Civil Litigation</SelectItem>
                      <SelectItem value="trial-advocacy">Trial Advocacy</SelectItem>
                      <SelectItem value="appellate-law">Appellate Law</SelectItem>
                      <SelectItem value="military-law">Military Law</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status" className="block text-sm font-semibold text-navy-900 mb-2">
                    Status
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger data-testid="select-case-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="block text-sm font-semibold text-navy-900 mb-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Case description and details..."
                  rows={4}
                  data-testid="textarea-case-description"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn-navy"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-case"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : 
                   editingCase ? "Update Case" : "Create Case"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card data-testid="card-cases-table">
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground" data-testid="text-loading-cases">Loading cases...</p>
            </div>
          ) : !cases || cases.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground" data-testid="text-no-cases">
                No cases found. Create your first case to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Total Fees</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((case_: any, index: number) => (
                  <TableRow key={case_.id} data-testid={`row-case-${index}`}>
                    <TableCell>
                      <div>
                        <p className="font-medium" data-testid={`text-case-title-${index}`}>
                          {case_.title}
                        </p>
                        {case_.description && (
                          <p className="text-sm text-muted-foreground truncate max-w-xs" data-testid={`text-case-description-${index}`}>
                            {case_.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span data-testid={`text-case-client-${index}`}>
                          {getClientName(case_.clientId)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize" data-testid={`text-case-type-${index}`}>
                        {case_.caseType?.replace('-', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getStatusColor(case_.status)} text-white`}
                        data-testid={`badge-case-status-${index}`}
                      >
                        {case_.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span data-testid={`text-case-created-${index}`}>
                          {formatDate(case_.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span data-testid={`text-case-fees-${index}`}>
                          {formatCurrency(case_.totalFees)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(case_)}
                        data-testid={`button-edit-case-${index}`}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {cases && cases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card data-testid="card-active-cases">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {cases.filter((c: any) => c.status === 'active').length}
                </div>
                <p className="text-sm text-muted-foreground">Active Cases</p>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-on-hold-cases">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {cases.filter((c: any) => c.status === 'on-hold').length}
                </div>
                <p className="text-sm text-muted-foreground">On Hold</p>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-closed-cases">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {cases.filter((c: any) => c.status === 'closed').length}
                </div>
                <p className="text-sm text-muted-foreground">Closed Cases</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
