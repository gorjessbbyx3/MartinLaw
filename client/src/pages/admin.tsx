import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dashboard } from "@/components/admin/dashboard";
import { Clients } from "@/components/admin/clients";
import { Consultations } from "@/components/admin/consultations";
import { Cases } from "@/components/admin/cases";
import { Invoices } from "@/components/admin/invoices";
import { Documents } from "@/components/admin/documents";
import ProfileSettings from "@/components/admin/profile-settings";
import { Users, Calendar, Briefcase, FileText, LogOut, Scale, User } from "lucide-react";

export default function Admin() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Redirect to login if not authenticated using useEffect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/admin-login");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-navy-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Scale className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-muted-foreground" data-testid="text-loading">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setLocation("/admin-login");
  };

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
              <h1 className="text-xl font-serif font-bold text-navy-900" data-testid="text-admin-title">
                Mason Martin Law - Admin Portal
              </h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-white p-1 border border-border rounded-lg">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center space-x-2 data-[state=active]:bg-navy-900 data-[state=active]:text-white"
              data-testid="tab-dashboard"
            >
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="clients" 
              className="flex items-center space-x-2 data-[state=active]:bg-navy-900 data-[state=active]:text-white"
              data-testid="tab-clients"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Clients</span>
            </TabsTrigger>
            <TabsTrigger 
              value="consultations" 
              className="flex items-center space-x-2 data-[state=active]:bg-navy-900 data-[state=active]:text-white"
              data-testid="tab-consultations"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Consultations</span>
            </TabsTrigger>
            <TabsTrigger 
              value="cases" 
              className="flex items-center space-x-2 data-[state=active]:bg-navy-900 data-[state=active]:text-white"
              data-testid="tab-cases"
            >
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Cases</span>
            </TabsTrigger>
            <TabsTrigger 
              value="invoices" 
              className="flex items-center space-x-2 data-[state=active]:bg-navy-900 data-[state=active]:text-white"
              data-testid="tab-invoices"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Invoices</span>
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="flex items-center space-x-2 data-[state=active]:bg-navy-900 data-[state=active]:text-white"
              data-testid="tab-documents"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="flex items-center space-x-2 data-[state=active]:bg-navy-900 data-[state=active]:text-white"
              data-testid="tab-profile"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" data-testid="content-dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="clients" data-testid="content-clients">
            <Clients />
          </TabsContent>

          <TabsContent value="consultations" data-testid="content-consultations">
            <Consultations />
          </TabsContent>

          <TabsContent value="cases" data-testid="content-cases">
            <Cases />
          </TabsContent>

          <TabsContent value="invoices" data-testid="content-invoices">
            <Invoices />
          </TabsContent>

          <TabsContent value="documents" data-testid="content-documents">
            <Documents />
          </TabsContent>

          <TabsContent value="profile" data-testid="content-profile">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}