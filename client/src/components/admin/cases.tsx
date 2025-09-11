import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Calendar, DollarSign, User, Edit, Plus, AlertTriangle } from "lucide-react";
import type { Case, Client } from "@shared/schema";

const caseFormSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  title: z.string().min(1, "Case title is required"),
  caseType: z.string().min(1, "Case type is required"),
  status: z.string().min(1, "Status is required"),
  description: z.string().optional(),
});

type CaseFormValues = z.infer<typeof caseFormSchema>;

export function Cases() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cases = [], isLoading } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(caseFormSchema),
    defaultValues: {
      clientId: "",
      title: "",
      caseType: "",
      status: "open",
      description: "",
    },
  });

  const createCaseMutation = useMutation({
    mutationFn: async (data: CaseFormValues) => {
      await apiRequest("POST", "/api/cases", data);
    },
    onSuccess: () => {
      toast({
        title: "Case Created",
        description: "New case has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
      setIsCreateDialogOpen(false);
      form.reset();
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

  const updateCaseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CaseFormValues> }) => {
      await apiRequest("PUT", `/api/cases/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Case Updated",
        description: "Case has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
      setIsEditDialogOpen(false);
      setSelectedCase(null);
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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PUT", `/api/cases/${id}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Case status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
    },
    onError: (error) => {
      console.error("Update status error:", error);
      toast({
        title: "Error",
        description: "Failed to update case status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CaseFormValues) => {
    if (selectedCase) {
      updateCaseMutation.mutate({ id: selectedCase.id, data });
    } else {
      createCaseMutation.mutate(data);
    }
  };

  const openEditDialog = (caseItem: Case) => {
    setSelectedCase(caseItem);
    form.reset({
      clientId: caseItem.clientId,
      title: caseItem.title,
      caseType: caseItem.caseType,
      status: caseItem.status,
      description: caseItem.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : "Unknown Client";
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Number(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'closed':
        return 'bg-green-500';
      case 'settled':
        return 'bg-purple-500';
      case 'dismissed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const caseTypes = [
    "Civil Litigation",
    "Personal Injury",
    "Contract Dispute",
    "Employment Law",
    "Family Law",
    "Criminal Defense",
    "Appeals",
    "Military Law",
    "Real Estate",
    "Business Law"
  ];

  const caseStatuses = [
    "open",
    "in-progress",
    "closed",
    "settled",
    "dismissed"
  ];

  if (isLoading) {
    return <div className="p-6">Loading cases...</div>;
  }

  return (
    <div className="space-y-6" data-testid="cases-container">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cases</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your legal cases</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-case">
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-client">
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.firstName} {client.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Title</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-case-title" placeholder="Enter case title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="caseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-case-type">
                            <SelectValue placeholder="Select case type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {caseTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-case-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {caseStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} data-testid="textarea-case-description" placeholder="Enter case description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createCaseMutation.isPending} data-testid="button-submit-case">
                    {createCaseMutation.isPending ? "Creating..." : "Create Case"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Active Cases ({cases.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table data-testid="table-cases">
            <TableHeader>
              <TableRow>
                <TableHead>Case Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Fees</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((caseItem) => (
                <TableRow key={caseItem.id} data-testid={`row-case-${caseItem.id}`}>
                  <TableCell className="font-medium" data-testid={`text-case-title-${caseItem.id}`}>
                    {caseItem.title}
                  </TableCell>
                  <TableCell data-testid={`text-client-name-${caseItem.id}`}>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {getClientName(caseItem.clientId)}
                    </div>
                  </TableCell>
                  <TableCell data-testid={`text-case-type-${caseItem.id}`}>
                    {caseItem.caseType}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={caseItem.status}
                      onValueChange={(status) => updateStatusMutation.mutate({ id: caseItem.id, status })}
                      data-testid={`select-status-${caseItem.id}`}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={`${getStatusColor(caseItem.status)} text-white`}>
                          {caseItem.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {caseStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell data-testid={`text-total-fees-${caseItem.id}`}>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                      {formatCurrency(caseItem.totalFees || 0)}
                    </div>
                  </TableCell>
                  <TableCell data-testid={`text-created-date-${caseItem.id}`}>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {caseItem.createdAt ? new Date(caseItem.createdAt).toLocaleDateString() : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(caseItem)}
                      data-testid={`button-edit-${caseItem.id}`}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {cases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8" data-testid="text-no-cases">
                    <div className="flex flex-col items-center space-y-2">
                      <AlertTriangle className="h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">No cases found. Create your first case to get started.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Case</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.firstName} {client.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter case title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="caseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select case type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {caseTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {caseStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter case description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateCaseMutation.isPending}>
                  {updateCaseMutation.isPending ? "Updating..." : "Update Case"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}