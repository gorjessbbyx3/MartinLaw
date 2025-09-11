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
      // Create proper date/time or use a default future date
      let scheduledAt;
      if (data.preferredDate && data.preferredTime) {
        scheduledAt = new Date(`${data.preferredDate}T${data.preferredTime}`).toISOString();
      } else {
        // Default to tomorrow at 10 AM if no date/time specified
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        scheduledAt = tomorrow.toISOString();
      }

      const consultationData = {
        clientEmail: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        type: data.consultationType,
        caseType: data.caseType,
        scheduledAt,
        description: data.description,
        rate: data.consultationType === "phone" ? "0" : data.consultationType === "virtual" ? "200" : "250",
      };

      console.log('Form data before processing:', JSON.stringify(data, null, 2));
      console.log('Computed scheduledAt:', scheduledAt);
      console.log('Full consultation data being sent:', JSON.stringify(consultationData, null, 2));
      const result = await apiRequest("POST", "/api/consultations", consultationData);
      console.log('Consultation created:', result);
      return result;
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
    console.log('Form data:', formData);

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.consultationType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    console.log('Submitting consultation form');
    mutation.mutate(formData);
  };

  const handleInputChange = (field: keyof ConsultationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="consultation" className="section-padding bg-navy-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffd700" fill-opacity="0.03"%3E%3Cpath d="M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm20-20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-gold-400/30">
            <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gold-400 uppercase tracking-wider">Free Consultation</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-serif font-bold mb-8 leading-tight">
            Schedule Your Free Consultation
          </h2>
          <p className="text-xl text-navy-50/90 max-w-2xl mx-auto leading-relaxed">
            Get expert legal advice tailored to your specific situation with no obligation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h3 className="text-4xl font-serif font-bold text-white mb-6" data-testid="text-consultation-title">
              Why Choose Us
            </h3>
            <p className="text-lg text-navy-50 mb-8 leading-relaxed" data-testid="text-consultation-description">
              Our experienced legal team is dedicated to providing you with the best possible outcome. We offer personalized strategies and clear communication throughout your legal journey.
            </p>

            {/* Consultation Types */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4 p-6 bg-navy-800 rounded-xl border border-navy-700 shadow-lg" data-testid="card-virtual-consultation">
                <div className="bg-gold-500 p-3 rounded-lg">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg" data-testid="text-virtual-title">Virtual Consultation</h4>
                  <p className="text-sm text-navy-300" data-testid="text-virtual-price">Secure video conference - $200/hour</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-navy-800 rounded-xl border border-navy-700 shadow-lg" data-testid="card-in-person-consultation">
                <div className="bg-gold-500 p-3 rounded-lg">
                  <Handshake className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg" data-testid="text-in-person-title">In-Person Meeting</h4>
                  <p className="text-sm text-navy-300" data-testid="text-in-person-price">Honolulu office - $250/hour</p>
                </div>
              </div>
            </div>

            <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg" data-testid="card-free-review">
              <h4 className="font-semibold text-white mb-2 text-lg" data-testid="text-free-review-title">Free Initial Review</h4>
              <p className="text-sm text-navy-300" data-testid="text-free-review-description">
                15-minute phone consultation to determine if your case is a good fit for our practice.
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <Card className="shadow-xl border border-border bg-navy-800/50 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-3xl font-serif font-bold text-white text-center mb-6">Book Your Appointment</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="block text-sm font-semibold text-white mb-2">First Name *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="John"
                      className="focus:ring-gold-500 focus:border-gold-500 bg-navy-800 border-navy-700 text-white placeholder-navy-400"
                      data-testid="input-first-name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="block text-sm font-semibold text-white mb-2">Last Name *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Doe"
                      className="focus:ring-gold-500 focus:border-gold-500 bg-navy-800 border-navy-700 text-white placeholder-navy-400"
                      data-testid="input-last-name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="block text-sm font-semibold text-white mb-2">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john@example.com"
                    className="focus:ring-gold-500 focus:border-gold-500 bg-navy-800 border-navy-700 text-white placeholder-navy-400"
                    data-testid="input-email"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(808) 555-0123"
                    className="focus:ring-gold-500 focus:border-gold-500 bg-navy-800 border-navy-700 text-white placeholder-navy-400"
                    data-testid="input-phone"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-semibold text-white mb-2">Case Type</Label>
                  <Select value={formData.caseType} onValueChange={(value) => handleInputChange("caseType", value)} data-testid="select-case-type">
                    <SelectTrigger className="focus:ring-gold-500 focus:border-gold-500 bg-navy-800 border-navy-700 text-white placeholder-navy-400">
                      <SelectValue placeholder="Select case type..." />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-800 border-navy-700 text-white">
                      <SelectItem value="civil-litigation" className="hover:bg-navy-700">Civil Litigation</SelectItem>
                      <SelectItem value="trial-advocacy" className="hover:bg-navy-700">Trial Advocacy</SelectItem>
                      <SelectItem value="appellate-law" className="hover:bg-navy-700">Appellate Law</SelectItem>
                      <SelectItem value="military-law" className="hover:bg-navy-700">Military Law</SelectItem>
                      <SelectItem value="other" className="hover:bg-navy-700">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block text-sm font-semibold text-white mb-2">Consultation Type *</Label>
                  <RadioGroup
                    value={formData.consultationType}
                    onValueChange={(value) => handleInputChange("consultationType", value)}
                    className="space-y-3"
                    data-testid="radio-consultation-type"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="phone" id="phone" className="border-navy-700 data-[state=checked]:bg-gold-500 data-[state=checked]:text-white" />
                      <Label htmlFor="phone" className="text-sm text-navy-300 cursor-pointer">Free 15-minute phone review</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="virtual" id="virtual" className="border-navy-700 data-[state=checked]:bg-gold-500 data-[state=checked]:text-white" />
                      <Label htmlFor="virtual" className="text-sm text-navy-300 cursor-pointer">Virtual consultation ($200/hour)</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="in-person" id="in-person" className="border-navy-700 data-[state=checked]:bg-gold-500 data-[state=checked]:text-white" />
                      <Label htmlFor="in-person" className="text-sm text-navy-300 cursor-pointer">In-person meeting ($250/hour)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="block text-sm font-semibold text-white mb-2">Preferred Date & Time</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                      className="focus:ring-gold-500 focus:border-gold-500 bg-navy-800 border-navy-700 text-white placeholder-navy-400"
                      data-testid="input-preferred-date"
                    />
                    <Input
                      type="time"
                      value={formData.preferredTime}
                      onChange={(e) => handleInputChange("preferredTime", e.target.value)}
                      className="focus:ring-gold-500 focus:border-gold-500 bg-navy-800 border-navy-700 text-white placeholder-navy-400"
                      data-testid="input-preferred-time"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="block text-sm font-semibold text-white mb-2">Brief Case Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Please provide a brief overview of your legal matter..."
                    className="focus:ring-gold-500 focus:border-gold-500 bg-navy-800 border-navy-700 text-white placeholder-navy-400 resize-none"
                    data-testid="textarea-description"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full btn-gold py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
                  disabled={mutation.isPending}
                  data-testid="button-schedule-consultation"
                >
                  {mutation.isPending ? "Scheduling..." : "Schedule Consultation"}
                </Button>

                <p className="text-xs text-navy-400 text-center" data-testid="text-disclaimer">
                  By submitting this form, you agree to our privacy policy and terms of service. This does not establish an attorney-client relationship.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}