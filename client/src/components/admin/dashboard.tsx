
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Briefcase, FileText, DollarSign, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import type { Client, Consultation, Case, Invoice } from "@shared/schema";

export function Dashboard() {
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: consultations = [] } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: cases = [] } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: invoices = [] } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
    staleTime: 5 * 60 * 1000,
  });

  // Analytics calculations
  const totalClients = clients.length;
  const totalConsultations = consultations.length;
  const totalCases = cases.length;
  const totalInvoices = invoices.length;

  const pendingConsultations = consultations.filter(c => c.status === 'scheduled').length;
  const activeCases = cases.filter(c => c.status === 'active').length;
  const unpaidInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').length;
  const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;

  const totalRevenue = invoices.filter(i => i.status === 'paid')
    .reduce((sum, invoice) => sum + parseFloat(invoice.totalAmount), 0);

  const pendingRevenue = invoices.filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, invoice) => sum + parseFloat(invoice.totalAmount), 0);

  // Monthly analytics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthConsultations = consultations.filter(c => {
    const date = new Date(c.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const thisMonthCases = cases.filter(c => {
    const date = new Date(c.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const thisMonthRevenue = invoices.filter(i => {
    const date = new Date(i.createdAt);
    return i.status === 'paid' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).reduce((sum, invoice) => sum + parseFloat(invoice.totalAmount), 0);

  // Case type distribution
  const caseTypeStats = cases.reduce((acc, case_) => {
    acc[case_.caseType] = (acc[case_.caseType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recent activity for timeline
  const recentActivity = [
    ...consultations.slice(0, 3).map(c => ({
      type: 'consultation',
      title: `${c.type} consultation scheduled`,
      date: c.createdAt,
      status: c.status
    })),
    ...cases.slice(0, 3).map(c => ({
      type: 'case',
      title: `New case: ${c.title}`,
      date: c.createdAt,
      status: c.status
    })),
    ...invoices.slice(0, 3).map(i => ({
      type: 'invoice',
      title: `Invoice ${i.invoiceNumber} ${i.status}`,
      date: i.createdAt,
      status: i.status
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <Calendar className="h-4 w-4" />;
      case 'case': return <Briefcase className="h-4 w-4" />;
      case 'invoice': return <FileText className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'scheduled':
      case 'paid':
        return 'text-green-600';
      case 'overdue':
        return 'text-red-600';
      case 'sent':
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card data-testid="card-total-clients">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-clients">{totalClients}</div>
            <p className="text-xs text-muted-foreground">Active client relationships</p>
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
              {thisMonthConsultations} scheduled this month
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
              {thisMonthCases} new cases this month
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
              {formatCurrency(thisMonthRevenue)} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card data-testid="card-pending-revenue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingRevenue)}</div>
            <p className="text-xs text-muted-foreground">{unpaidInvoices} unpaid invoices</p>
          </CardContent>
        </Card>

        <Card data-testid="card-overdue-invoices">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueInvoices}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card data-testid="card-case-completion-rate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Case Completion Rate</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalCases > 0 ? Math.round((cases.filter(c => c.status === 'closed').length / totalCases) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Cases successfully closed</p>
          </CardContent>
        </Card>
      </div>

      {/* Case Type Distribution and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-case-type-distribution">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>Case Type Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(caseTypeStats).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No cases found</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(caseTypeStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{type}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-navy-900 h-2 rounded-full" 
                            style={{ width: `${(count / totalCases) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-recent-activity">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-muted p-2 rounded-full">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-900 truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.date)}
                        </p>
                        <span className={`text-xs ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card data-testid="card-quick-actions">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {overdueInvoices > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">Overdue Invoices</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  {overdueInvoices} invoices need follow-up
                </p>
              </div>
            )}
            
            {pendingConsultations > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Upcoming Consultations</span>
                </div>
                <p className="text-sm text-yellow-600 mt-1">
                  {pendingConsultations} consultations scheduled
                </p>
              </div>
            )}

            {activeCases > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Active Cases</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  {activeCases} cases require attention
                </p>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Revenue This Month</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                {formatCurrency(thisMonthRevenue)} collected
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
