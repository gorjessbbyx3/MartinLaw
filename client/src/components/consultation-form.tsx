import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { Video, Handshake, Camera } from "lucide-react";

interface ConsultationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  caseType: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  description: string;
}

export function ConsultationForm() {
  const [formData, setFormData] = useState<ConsultationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    caseType: "",
    consultationType: "",
    preferredDate: "",
    preferredTime: "",
    description: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: ConsultationFormData) => {
      const consultationData = {
        clientEmail: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        type: data.consultationType,
        caseType: data.caseType,
        scheduledAt: new Date(`${data.preferredDate}T${data.preferredTime}`).toISOString(),
        description: data.description,
        rate: data.consultationType === "phone" ? "0" : data.consultationType === "virtual" ? "200" : "250",
      };

      await apiRequest("POST", "/api/consultations", consultationData);
    },
    onSuccess: () => {
      toast({
        title: "Consultation Scheduled",
        description: "Your consultation request has been submitted. We will contact you within 24 hours to confirm.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        caseType: "",
        consultationType: "",
        preferredDate: "",
        preferredTime: "",
        description: "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
    },
    onError: (error) => {
      console.error("Consultation booking error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error scheduling your consultation. Please try again or call our office.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.consultationType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(formData);
  };

  const handleInputChange = (field: keyof ConsultationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid lg:grid-cols-2 gap-16 items-start">
      <div>
        <h2 className="text-4xl font-serif font-bold text-navy-900 mb-6" data-testid="text-consultation-title">
          Schedule Your Consultation
        </h2>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed" data-testid="text-consultation-description">
          Get personalized legal advice for your specific situation. Initial consultations include case evaluation and strategic planning.
        </p>
        
        {/* Consultation Types */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-border" data-testid="card-virtual-consultation">
            <div className="bg-navy-900 p-2 rounded-lg">
              <Video className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-navy-900" data-testid="text-virtual-title">Virtual Consultation</h4>
              <p className="text-sm text-muted-foreground" data-testid="text-virtual-price">Secure video conference - $200/hour</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-border" data-testid="card-in-person-consultation">
            <div className="bg-gold-500 p-2 rounded-lg">
              <Handshake className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-navy-900" data-testid="text-in-person-title">In-Person Meeting</h4>
              <p className="text-sm text-muted-foreground" data-testid="text-in-person-price">Honolulu office - $250/hour</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gold-50 p-6 rounded-xl border border-gold-200" data-testid="card-free-review">
          <h4 className="font-semibold text-navy-900 mb-2" data-testid="text-free-review-title">Free Initial Review</h4>
          <p className="text-sm text-muted-foreground" data-testid="text-free-review-description">
            15-minute phone consultation to determine if your case is a good fit for our practice
          </p>
        </div>
      </div>
      
      {/* Booking Form */}
      <Card className="shadow-lg border border-border" data-testid="card-booking-form">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="block text-sm font-semibold text-navy-900 mb-2">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="John"
                  className="focus:ring-navy-500 focus:border-transparent"
                  data-testid="input-first-name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="block text-sm font-semibold text-navy-900 mb-2">Last Name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Doe"
                  className="focus:ring-navy-500 focus:border-transparent"
                  data-testid="input-last-name"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="block text-sm font-semibold text-navy-900 mb-2">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john@example.com"
                className="focus:ring-navy-500 focus:border-transparent"
                data-testid="input-email"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="block text-sm font-semibold text-navy-900 mb-2">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(808) 555-0123"
                className="focus:ring-navy-500 focus:border-transparent"
                data-testid="input-phone"
              />
            </div>
            
            <div>
              <Label className="block text-sm font-semibold text-navy-900 mb-2">Case Type</Label>
              <Select onValueChange={(value) => handleInputChange("caseType", value)} data-testid="select-case-type">
                <SelectTrigger className="focus:ring-navy-500 focus:border-transparent">
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
              <Label className="block text-sm font-semibold text-navy-900 mb-2">Consultation Type *</Label>
              <RadioGroup
                value={formData.consultationType}
                onValueChange={(value) => handleInputChange("consultationType", value)}
                className="space-y-2"
                data-testid="radio-consultation-type"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone" className="text-sm">Free 15-minute phone review</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="virtual" id="virtual" />
                  <Label htmlFor="virtual" className="text-sm">Virtual consultation ($200/hour)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-person" id="in-person" />
                  <Label htmlFor="in-person" className="text-sm">In-person meeting ($250/hour)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label className="block text-sm font-semibold text-navy-900 mb-2">Preferred Date & Time</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                  className="focus:ring-navy-500 focus:border-transparent"
                  data-testid="input-preferred-date"
                />
                <Input
                  type="time"
                  value={formData.preferredTime}
                  onChange={(e) => handleInputChange("preferredTime", e.target.value)}
                  className="focus:ring-navy-500 focus:border-transparent"
                  data-testid="input-preferred-time"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="block text-sm font-semibold text-navy-900 mb-2">Brief Case Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Please provide a brief overview of your legal matter..."
                className="focus:ring-navy-500 focus:border-transparent"
                data-testid="textarea-description"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full btn-navy py-4 text-lg"
              disabled={mutation.isPending}
              data-testid="button-schedule-consultation"
            >
              {mutation.isPending ? "Scheduling..." : "Schedule Consultation"}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center" data-testid="text-disclaimer">
              By submitting this form, you agree to our privacy policy and terms of service. This does not establish an attorney-client relationship.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
