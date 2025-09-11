
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, Trash2, Download, Send } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import type { Invoice, Client, Case } from "@shared/schema";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client;
  case_?: Case;
  invoice?: Invoice;
}

export function InvoiceGenerator({ isOpen, onClose, client, case_, invoice }: InvoiceGeneratorProps) {
  const { showSuccess, showError } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: client?.id || '',
    caseId: case_?.id || '',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    tax: 0,
    notes: '',
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: 'Legal Services', quantity: 1, rate: 0, amount: 0 }
  ]);

  const addLineItem = () => {
    const newId = (lineItems.length + 1).toString();
    setLineItems([...lineItems, {
      id: newId,
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    }));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (formData.tax / 100);
  const total = subtotal + taxAmount;

  const generateInvoice = async () => {
    setIsLoading(true);
    try {
      const invoiceData = {
        ...formData,
        lineItems,
        amount: subtotal,
        tax: taxAmount,
        totalAmount: total,
        status: 'draft'
      };

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });

      if (!response.ok) throw new Error('Failed to generate invoice');

      showSuccess('Invoice generated successfully');
      onClose();
    } catch (error) {
      showError('Failed to generate invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/invoices/${invoice?.id}/pdf`);
      if (!response.ok) throw new Error('Failed to download PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice?.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      showError('Failed to download PDF');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {invoice ? 'Edit Invoice' : 'Generate Invoice'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client and Case Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Client</Label>
              <p className="text-sm text-muted-foreground">
                {client ? `${client.firstName} ${client.lastName}` : 'No client selected'}
              </p>
            </div>
            <div>
              <Label>Case</Label>
              <p className="text-sm text-muted-foreground">
                {case_ ? case_.title : 'No case selected'}
              </p>
            </div>
          </div>

          {/* Due Date and Tax */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Due Date</Label>
              <DatePicker
                date={formData.dueDate}
                onDateChange={(date) => setFormData({ ...formData, dueDate: date || new Date() })}
              />
            </div>
            <div>
              <Label>Tax Rate (%)</Label>
              <Input
                type="number"
                value={formData.tax}
                onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Line Items</Label>
              <Button type="button" onClick={addLineItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-2">
              {lineItems.map((item) => (
                <div key={item.id} className="grid grid-cols-6 gap-2 items-center">
                  <div className="col-span-2">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                  />
                  <div className="text-right">
                    ${item.amount.toFixed(2)}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            {invoice && (
              <Button type="button" variant="outline" onClick={downloadPDF} disabled={isLoading}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            )}
            <Button onClick={generateInvoice} disabled={isLoading}>
              {invoice ? 'Update Invoice' : 'Generate Invoice'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
