import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { Scale } from "lucide-react";

interface LoginData {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard.",
      });
      setLocation("/admin");
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleInputChange = (field: keyof LoginData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md" data-testid="card-admin-login">
        <CardHeader className="text-center">
          <div className="bg-gradient-to-br from-charcoal-900 to-charcoal-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Scale className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-serif font-bold text-charcoal-900" data-testid="text-admin-login-title">
            Admin Portal
          </CardTitle>
          <p className="text-muted-foreground" data-testid="text-admin-login-subtitle">
            Mason Martin Law CRM System
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-semibold text-charcoal-900 mb-2">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="admin@masonmartinlaw.com"
                className="focus:ring-bronze-500 focus:border-bronze-500 border-platinum-300"
                data-testid="input-admin-email"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="block text-sm font-semibold text-charcoal-900 mb-2">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="focus:ring-bronze-500 focus:border-bronze-500 border-platinum-300"
                data-testid="input-admin-password"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full btn-premium-primary py-3"
              disabled={mutation.isPending}
              data-testid="button-admin-login"
            >
              {mutation.isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
