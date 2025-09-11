import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { Calendar, Clock, DollarSign, User, Edit } from "lucide-react";

export function Consultations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: consultations, isLoading } = useQuery({
    queryKey: ["/api/consultations"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: clients } = useQuery({
    queryKey: ["/api/clients"],
    staleTime: 5 * 60 * 1000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PUT", `/api/consultations/${id}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Consultation status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
    },
    onError: (error) => {
      console.error("Update consultation error:", error);
      toast({
        title: "Error",
        description: "Failed to update consultation status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      case 'scheduled':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'no-show':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients?.find((c: any) => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Unknown Client';
  };

  const handleStatusUpdate = (consultationId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: consultationId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy-900" data-testid="text-consultations-title">Consultations</h2>
          <p className="text-muted-foreground" data-testid="text-consultations-description">
            Manage client consultations and appointments
          </p>
        </div>
      </div>

      <Card data-testid="card-consultations-table">
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground" data-testid="text-loading-consultations">Loading consultations...</p>
            </div>
          ) : !consultations || consultations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground" data-testid="text-no-consultations">
                No consultations scheduled. New consultations will appear here.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Case Type</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.map((consultation: any, index: number) => (
                  <TableRow key={consultation.id} data-testid={`row-consultation-${index}`}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium" data-testid={`text-consultation-client-${index}`}>
                          {getClientName(consultation.clientId)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize" data-testid={`text-consultation-type-${index}`}>
                        {consultation.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize" data-testid={`text-consultation-case-type-${index}`}>
                        {consultation.caseType?.replace('-', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span data-testid={`text-consultation-date-${index}`}>
                          {formatDate(consultation.scheduledAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {consultation.rate ? (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span data-testid={`text-consultation-rate-${index}`}>
                            {formatCurrency(consultation.rate)}/hr
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Free</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getStatusColor(consultation.status)} text-white`}
                        data-testid={`badge-consultation-status-${index}`}
                      >
                        {consultation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={consultation.status}
                        onValueChange={(value) => handleStatusUpdate(consultation.id, value)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-32" data-testid={`select-consultation-status-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="no-show">No Show</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {consultations && consultations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card data-testid="card-scheduled-consultations">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {consultations.filter((c: any) => c.status === 'scheduled').length}
                </div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-completed-consultations">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {consultations.filter((c: any) => c.status === 'completed').length}
                </div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-cancelled-consultations">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {consultations.filter((c: any) => c.status === 'cancelled').length}
                </div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-no-show-consultations">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {consultations.filter((c: any) => c.status === 'no-show').length}
                </div>
                <p className="text-sm text-muted-foreground">No Show</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
