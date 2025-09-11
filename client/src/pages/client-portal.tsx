import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { 
  Scale, 
  User, 
  Briefcase, 
  Calendar, 
  FileText, 
  Mail, 
  Phone,
  MapPin,
  Clock,
  DollarSign
} from "lucide-react";

interface ClientData {
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  cases: any[];
  consultations: any[];
  invoices: any[];
}

export default function ClientPortal() {
  const [match, params] = useRoute("/client-portal/:token?");
  const [email, setEmail] = useState("");
  const [accessToken, setAccessToken] = useState(params?.token || "");
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  const { toast } = useToast();

  const { data: clientData, isLoading, error } = useQuery<ClientData>({
    queryKey: ["/api/client-portal", accessToken],
    enabled: !!accessToken,
    retry: false,
  });

  const requestAccess = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to access the client portal.",
        variant: "destructive",
      });
      return;
    }

    setIsRequestingAccess(true);
    try {
      const response = await apiRequest("POST", "/api/client-portal/access", { email });
      const data = await response.json();
      
      toast({
        title: "Access Token Generated",
        description: "A secure access link has been sent to your email address.",
      });
      
      // In a real implementation, this would be sent via email
      // For demo purposes, we'll set it directly
      setAccessToken(data.token);
    } catch (error) {
      console.error("Access request error:", error);
      toast({
        title: "Access Failed",
        description: "Unable to generate access token. Please verify your email address.",
        variant: "destructive",
      });
    } finally {
      setIsRequestingAccess(false);
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'scheduled':
        return 'bg-yellow-500';
      case 'paid':
        return 'bg-green-500';
      case 'sent':
        return 'bg-blue-500';
      case 'draft':
        return 'bg-gray-500';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md" data-testid="card-portal-access">
          <CardHeader className="text-center">
            <div className="bg-navy-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-serif font-bold text-navy-900" data-testid="text-portal-title">
              Client Portal Access
            </CardTitle>
            <p className="text-muted-foreground" data-testid="text-portal-subtitle">
              Mason Martin Law
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-semibold text-navy-900 mb-2">
                  Your Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="focus:ring-navy-500 focus:border-transparent"
                  data-testid="input-client-email"
                />
              </div>
              
              <Button
                onClick={requestAccess}
                disabled={isRequestingAccess}
                className="w-full btn-navy py-3"
                data-testid="button-request-access"
              >
                {isRequestingAccess ? "Requesting Access..." : "Request Portal Access"}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center" data-testid="text-portal-disclaimer">
                A secure access link will be sent to your registered email address.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-navy-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Scale className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-muted-foreground" data-testid="text-loading">Loading your information...</p>
        </div>
      </div>
    );
  }

  if (error || !clientData) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center" data-testid="card-access-error">
          <CardContent className="pt-6">
            <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Scale className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-navy-900 mb-2" data-testid="text-access-denied">
              Access Denied
            </h2>
            <p className="text-muted-foreground mb-4" data-testid="text-access-error">
              Invalid or expired access token. Please request a new access link.
            </p>
            <Button 
              onClick={() => setAccessToken("")} 
              className="btn-navy"
              data-testid="button-try-again"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-navy-900 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-serif font-bold text-navy-900" data-testid="text-client-portal-title">
                Mason Martin Law - Client Portal
              </h1>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-navy-900" data-testid="text-client-name">
                {clientData.client.firstName} {clientData.client.lastName}
              </p>
              <p className="text-xs text-muted-foreground" data-testid="text-client-email">
                {clientData.client.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-dashboard-cases">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
                  <p className="text-2xl font-bold text-navy-900">
                    {clientData.cases.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-navy-900" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-dashboard-consultations">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Consultations</p>
                  <p className="text-2xl font-bold text-navy-900">
                    {clientData.consultations.filter(c => c.status === 'scheduled' && new Date(c.scheduledAt) > new Date()).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-navy-900" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-dashboard-invoices">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Invoices</p>
                  <p className="text-2xl font-bold text-navy-900">
                    {clientData.invoices.filter(i => i.status === 'sent' || i.status === 'overdue').length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-navy-900" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-dashboard-total-fees">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Outstanding</p>
                  <p className="text-2xl font-bold text-navy-900">
                    {formatCurrency(
                      clientData.invoices
                        .filter(i => i.status === 'sent' || i.status === 'overdue')
                        .reduce((sum, invoice) => sum + parseFloat(invoice.totalAmount), 0)
                    )}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-navy-900" />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Client Info Card */}
        <Card className="mb-8" data-testid="card-client-info">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Client Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-navy-900">Email</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-info-email">
                    {clientData.client.email}
                  </p>
                </div>
              </div>
              {clientData.client.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-navy-900">Phone</p>
                    <p className="text-sm text-muted-foreground" data-testid="text-info-phone">
                      {clientData.client.phone}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-navy-900">Attorney</p>
                  <p className="text-sm text-muted-foreground">Mason Martin</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="cases" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white p-1 border border-border rounded-lg">
            <TabsTrigger 
              value="cases" 
              className="flex items-center space-x-2 data-[state=active]:bg-navy-900 data-[state=active]:text-white"
              data-testid="tab-cases"
            >
              <Briefcase className="h-4 w-4" />
              <span>Cases</span>
            </TabsTrigger>
            <TabsTrigger 
              value="consultations" 
              className="flex items-center space-x-2 data-[state=active]:bg-navy-900 data-[state=active]:text-white"
              data-testid="tab-consultations"
            >
              <Calendar className="h-4 w-4" />
              <span>Consultations</span>
            </TabsTrigger>
            <TabsTrigger 
              value="invoices" 
              className="flex items-center space-x-2 data-[state=active]:bg-navy-900 data-[state=active]:text-white"
              data-testid="tab-invoices"
            >
              <FileText className="h-4 w-4" />
              <span>Invoices</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cases" data-testid="content-cases">
            <div className="space-y-4">
              {clientData.cases.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground" data-testid="text-no-cases">
                      No active cases found.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                clientData.cases.map((case_, index) => (
                  <Card key={case_.id} data-testid={`card-case-${index}`}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-navy-900 text-lg" data-testid={`text-case-title-${index}`}>
                            {case_.title}
                          </h3>
                          <p className="text-muted-foreground" data-testid={`text-case-type-${index}`}>
                            {case_.caseType}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(case_.status)} text-white`} data-testid={`badge-case-status-${index}`}>
                          {case_.status}
                        </Badge>
                      </div>
                      {case_.description && (
                        <p className="text-sm text-muted-foreground mb-4" data-testid={`text-case-description-${index}`}>
                          {case_.description}
                        </p>
                      )}
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Created:</span> {formatDate(case_.createdAt)}
                        </div>
                        {case_.totalFees && (
                          <div>
                            <span className="font-medium">Total Fees:</span> {formatCurrency(case_.totalFees)}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="consultations" data-testid="content-consultations">
            <div className="space-y-4">
              {clientData.consultations.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground" data-testid="text-no-consultations">
                      No consultations scheduled.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                clientData.consultations.map((consultation, index) => (
                  <Card key={consultation.id} data-testid={`card-consultation-${index}`}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-navy-900 text-lg" data-testid={`text-consultation-type-${index}`}>
                            {consultation.type} Consultation
                          </h3>
                          <p className="text-muted-foreground" data-testid={`text-consultation-case-type-${index}`}>
                            {consultation.caseType}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(consultation.status)} text-white`} data-testid={`badge-consultation-status-${index}`}>
                          {consultation.status}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            <span className="font-medium">Scheduled:</span> {formatDate(consultation.scheduledAt)}
                          </span>
                        </div>
                        {consultation.rate && (
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>
                              <span className="font-medium">Rate:</span> {formatCurrency(consultation.rate)}/hour
                            </span>
                          </div>
                        )}
                      </div>
                      {consultation.description && (
                        <p className="text-sm text-muted-foreground mt-4" data-testid={`text-consultation-description-${index}`}>
                          {consultation.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="invoices" data-testid="content-invoices">
            <div className="space-y-4">
              {clientData.invoices.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground" data-testid="text-no-invoices">
                      No invoices found.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                clientData.invoices.map((invoice, index) => (
                  <Card key={invoice.id} data-testid={`card-invoice-${index}`}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-navy-900 text-lg" data-testid={`text-invoice-number-${index}`}>
                            Invoice #{invoice.invoiceNumber}
                          </h3>
                          <p className="text-muted-foreground">
                            Due: {formatDate(invoice.dueDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(invoice.status)} text-white mb-2`} data-testid={`badge-invoice-status-${index}`}>
                            {invoice.status}
                          </Badge>
                          <p className="text-2xl font-bold text-navy-900" data-testid={`text-invoice-amount-${index}`}>
                            {formatCurrency(invoice.totalAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Created:</span> {formatDate(invoice.createdAt)}
                        </div>
                        {invoice.paidAt && (
                          <div>
                            <span className="font-medium">Paid:</span> {formatDate(invoice.paidAt)}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
