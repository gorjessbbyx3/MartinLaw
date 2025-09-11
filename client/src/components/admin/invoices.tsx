import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { Plus, FileText, Calendar, DollarSign, User, Edit, Download } from "lucide-react";

interface InvoiceFormData {
  clientId: string;
  amount: string;
  tax: string;
  dueDate: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
}

export function Invoices() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [formData, setFormData] = useState<InvoiceFormData>({
    clientId: "",
    amount: "",
    tax: "0",
    dueDate: "",
    lineItems: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["/api/invoices"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: clients } = useQuery({
    queryKey: ["/api/clients"],
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const invoiceData = {
        ...data,
        invoiceNumber: `INV-${Date.now()}`,
        totalAmount: (parseFloat(data.amount) + parseFloat(data.tax)).toString(),
      };
      await apiRequest("POST", "/api/invoices", invoiceData);
    },
    onSuccess: () => {
      toast({
        title: "Invoice Created",
        description: "New invoice has been created successfully.",
      });
      setIsDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
    },
    onError: (error) => {
      console.error("Create invoice error:", error);
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, paidAt }: { id: string; status: string; paidAt?: string }) => {
      const updateData: any = { status };
      if (status === 'paid' && !paidAt) {
        updateData.paidAt = new Date().toISOString();
      }
      await apiRequest("PUT", `/api/invoices/${id}`, updateData);
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Invoice status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
    },
    onError: (error) => {
      console.error("Update invoice error:", error);
      toast({
        title: "Error",
        description: "Failed to update invoice status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      clientId: "",
      amount: "",
      tax: "0",
      dueDate: "",
      lineItems: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.amount || !formData.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof InvoiceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: "", quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newLineItems = [...prev.lineItems];
      newLineItems[index] = { ...newLineItems[index], [field]: value };
      
      // Calculate amount if quantity or rate changes
      if (field === 'quantity' || field === 'rate') {
        newLineItems[index].amount = newLineItems[index].quantity * newLineItems[index].rate;
      }
      
      return { ...prev, lineItems: newLineItems };
    });
  };

  const removeLineItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index)
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-500';
      case 'sent':
        return 'bg-blue-500';
      case 'overdue':
        return 'bg-red-500';
      case 'draft':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients?.find((c: any) => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Unknown Client';
  };

  const handleStatusUpdate = (invoiceId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: invoiceId, status: newStatus });
  };

  const calculateTotal = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = parseFloat(formData.tax) || 0;
    return subtotal + tax;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy-900" data-testid="text-invoices-title">Invoices</h2>
          <p className="text-muted-foreground" data-testid="text-invoices-description">
            Manage client invoices and billing
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="btn-navy"
              onClick={() => {
                setEditingInvoice(null);
                resetForm();
              }}
              data-testid="button-add-invoice"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="dialog-invoice-form">
            <DialogHeader>
              <DialogTitle data-testid="text-dialog-title">
                Create New Invoice
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientId" className="block text-sm font-semibold text-navy-900 mb-2">
                    Client *
                  </Label>
                  <Select value={formData.clientId} onValueChange={(value) => handleInputChange("clientId", value)}>
                    <SelectTrigger data-testid="select-invoice-client">
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
                  <Label htmlFor="dueDate" className="block text-sm font-semibold text-navy-900 mb-2">
                    Due Date *
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                    data-testid="input-due-date"
                    required
                  />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-sm font-semibold text-navy-900">Line Items</Label>
                  <Button type="button" onClick={addLineItem} variant="outline" size="sm" data-testid="button-add-line-item">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {formData.lineItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg" data-testid={`line-item-${index}`}>
                      <div className="col-span-5">
                        <Label className="text-sm">Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          placeholder="Service description..."
                          data-testid={`input-description-${index}`}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm">Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          min="1"
                          data-testid={`input-quantity-${index}`}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm">Rate</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          data-testid={`input-rate-${index}`}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm">Amount</Label>
                        <Input
                          value={formatCurrency(item.amount.toString())}
                          disabled
                          data-testid={`input-amount-${index}`}
                        />
                      </div>
                      <div className="col-span-1">
                        {formData.lineItems.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeLineItem(index)}
                            data-testid={`button-remove-item-${index}`}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span data-testid="text-subtotal">
                        {formatCurrency(formData.lineItems.reduce((sum, item) => sum + item.amount, 0).toString())}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="tax" className="text-sm">Tax:</Label>
                      <Input
                        id="tax"
                        type="number"
                        step="0.01"
                        value={formData.tax}
                        onChange={(e) => handleInputChange("tax", e.target.value)}
                        className="w-24 text-right"
                        placeholder="0.00"
                        data-testid="input-tax"
                      />
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span data-testid="text-total">
                        {formatCurrency(calculateTotal().toString())}
                      </span>
                    </div>
                  </div>
                </div>
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
                  disabled={createMutation.isPending}
                  data-testid="button-create-invoice"
                >
                  {createMutation.isPending ? "Creating..." : "Create Invoice"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card data-testid="card-invoices-table">
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground" data-testid="text-loading-invoices">Loading invoices...</p>
            </div>
          ) : !invoices || invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground" data-testid="text-no-invoices">
                No invoices found. Create your first invoice to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice: any, index: number) => (
                  <TableRow key={invoice.id} data-testid={`row-invoice-${index}`}>
                    <TableCell>
                      <span className="font-medium" data-testid={`text-invoice-number-${index}`}>
                        {invoice.invoiceNumber}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span data-testid={`text-invoice-client-${index}`}>
                          {getClientName(invoice.clientId)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium" data-testid={`text-invoice-amount-${index}`}>
                          {formatCurrency(invoice.totalAmount)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span data-testid={`text-invoice-due-date-${index}`}>
                          {formatDate(invoice.dueDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getStatusColor(invoice.status)} text-white`}
                        data-testid={`badge-invoice-status-${index}`}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground" data-testid={`text-invoice-created-${index}`}>
                        {formatDate(invoice.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Select
                          value={invoice.status}
                          onValueChange={(value) => handleStatusUpdate(invoice.id, value)}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger className="w-24" data-testid={`select-invoice-status-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {invoices && invoices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card data-testid="card-total-invoices">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-navy-900">
                  {invoices.length}
                </div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-paid-invoices">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {invoices.filter((i: any) => i.status === 'paid').length}
                </div>
                <p className="text-sm text-muted-foreground">Paid</p>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-outstanding-invoices">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {invoices.filter((i: any) => i.status === 'sent').length}
                </div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-overdue-invoices">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {invoices.filter((i: any) => i.status === 'overdue').length}
                </div>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
