import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Briefcase, FileText, DollarSign, Clock } from "lucide-react";

export function Dashboard() {
  const { data: clients } = useQuery({
    queryKey: ["/api/clients"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: consultations } = useQuery({
    queryKey: ["/api/consultations"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: cases } = useQuery({
    queryKey: ["/api/cases"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: invoices } = useQuery({
    queryKey: ["/api/invoices"],
    staleTime: 5 * 60 * 1000,
  });

  const totalClients = clients?.length || 0;
  const totalConsultations = consultations?.length || 0;
  const totalCases = cases?.length || 0;
  const totalInvoices = invoices?.length || 0;

  const pendingConsultations = consultations?.filter(c => c.status === 'scheduled')?.length || 0;
  const activeCases = cases?.filter(c => c.status === 'active')?.length || 0;
  const unpaidInvoices = invoices?.filter(i => i.status === 'sent' || i.status === 'overdue')?.length || 0;

  const totalRevenue = invoices?.filter(i => i.status === 'paid')
    ?.reduce((sum, invoice) => sum + parseFloat(invoice.totalAmount), 0) || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const recentConsultations = consultations?.slice(0, 5) || [];
  const recentCases = cases?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card data-testid="card-total-clients">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-clients">{totalClients}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-pending-consultations">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Consultations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pending-consultations">{pendingConsultations}</div>
            <p className="text-xs text-muted-foreground">
              of {totalConsultations} total
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-active-cases">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-cases">{activeCases}</div>
            <p className="text-xs text-muted-foreground">
              of {totalCases} total
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-revenue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-revenue">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {unpaidInvoices} unpaid invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-recent-consultations">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Consultations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentConsultations.length === 0 ? (
              <p className="text-muted-foreground text-center py-4" data-testid="text-no-recent-consultations">
                No recent consultations
              </p>
            ) : (
              <div className="space-y-4">
                {recentConsultations.map((consultation, index) => (
                  <div key={consultation.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg" data-testid={`consultation-item-${index}`}>
                    <div>
                      <p className="font-medium text-sm" data-testid={`consultation-type-${index}`}>
                        {consultation.type} - {consultation.caseType}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`consultation-date-${index}`}>
                        {new Date(consultation.scheduledAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      consultation.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`} data-testid={`consultation-status-${index}`}>
                      {consultation.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-recent-cases">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>Recent Cases</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentCases.length === 0 ? (
              <p className="text-muted-foreground text-center py-4" data-testid="text-no-recent-cases">
                No recent cases
              </p>
            ) : (
              <div className="space-y-4">
                {recentCases.map((case_, index) => (
                  <div key={case_.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg" data-testid={`case-item-${index}`}>
                    <div>
                      <p className="font-medium text-sm" data-testid={`case-title-${index}`}>
                        {case_.title}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`case-type-${index}`}>
                        {case_.caseType}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      case_.status === 'active' ? 'bg-green-100 text-green-800' :
                      case_.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`} data-testid={`case-status-${index}`}>
                      {case_.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
