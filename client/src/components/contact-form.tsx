import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, MessageSquare, Clock, CheckCircle } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please Complete Required Fields",
        description: "Name, email, and message are required to send your inquiry.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Message Sent Successfully",
      description: "Thank you for contacting us. We will respond within 24 hours.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="animate-fade-in">
      {/* Premium Header Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 via-charcoal-700 to-charcoal-500 opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-bronze-500/20 via-transparent to-bronze-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <MessageSquare className="h-10 w-10 text-white relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
        </div>
        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6" data-testid="text-contact-title">
          Contact <span className="text-gradient">Our Office</span>
        </h2>
        <p className="text-lg text-charcoal-500 max-w-4xl mx-auto leading-relaxed" data-testid="text-contact-description">
          Experience personalized legal service with multiple convenient ways to connect with our team. 
          We're committed to responding promptly and professionally to every inquiry.
        </p>
      </div>
      
      {/* Premium Contact Information Cards */}
      <div className="grid lg:grid-cols-3 gap-6 mb-16">
        {/* Office Location Card */}
        <div className="card-hover group relative bg-gradient-to-br from-white via-charcoal-50/50 to-platinum-100/30 p-8 rounded-3xl border border-platinum-300/50 shadow-lg hover:shadow-2xl transition-all duration-500" data-testid="card-office-location">
          <div className="absolute inset-0 bg-gradient-to-br from-bronze-500/5 via-transparent to-bronze-600/10 opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-500"></div>
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-charcoal-900 to-charcoal-700 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-bronze-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <MapPin className="h-10 w-10 text-white relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-xl lg:text-2xl font-semibold mb-4 text-charcoal-900" data-testid="text-office-location">Premium Office Location</h3>
            <div className="space-y-3" data-testid="text-office-address">
              <p className="typography-body text-charcoal-700 font-medium">Downtown Honolulu</p>
              <p className="typography-body text-charcoal-700">Hawaii 96813</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-bronze-50 rounded-xl border border-bronze-400/20">
                <Clock className="h-4 w-4 text-bronze-600" />
                <span className="typography-body-small text-bronze-600 font-medium">Address provided upon scheduling</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Phone Card */}
        <div className="card-hover group relative bg-gradient-to-br from-white via-charcoal-50/50 to-platinum-100/30 p-8 rounded-3xl border border-platinum-300/50 shadow-lg hover:shadow-2xl transition-all duration-500" data-testid="card-phone">
          <div className="absolute inset-0 bg-gradient-to-br from-bronze-500/5 via-transparent to-bronze-600/10 opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-500"></div>
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-bronze-500 to-bronze-600 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Phone className="h-10 w-10 text-charcoal-900 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-xl lg:text-2xl font-semibold mb-4 text-charcoal-900" data-testid="text-phone-title">Direct Phone Line</h3>
            <div className="space-y-4">
              <a 
                href="tel:+18085551234" 
                className="typography-subtitle text-charcoal-900 hover:text-bronze-600 transition-colors duration-300 font-semibold block" 
                data-testid="link-phone"
              >
                (808) 555-1234
              </a>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal-50 rounded-xl border border-charcoal-100">
                <Clock className="h-4 w-4 text-charcoal-500" />
                <span className="typography-body-small text-charcoal-500 font-medium" data-testid="text-phone-hours">
                  Monday - Friday: 9:00 AM - 5:00 PM HST
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Email Card */}
        <div className="card-hover group relative bg-gradient-to-br from-white via-charcoal-50/50 to-platinum-100/30 p-8 rounded-3xl border border-platinum-300/50 shadow-lg hover:shadow-2xl transition-all duration-500" data-testid="card-email">
          <div className="absolute inset-0 bg-gradient-to-br from-bronze-500/5 via-transparent to-bronze-600/10 opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-500"></div>
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-charcoal-900 to-charcoal-700 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-bronze-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Mail className="h-10 w-10 text-white relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-xl lg:text-2xl font-semibold mb-4 text-charcoal-900" data-testid="text-email-title">Professional Email</h3>
            <div className="space-y-4">
              <a 
                href="mailto:mason@masonmartinlaw.com" 
                className="typography-subtitle text-charcoal-900 hover:text-bronze-600 transition-colors duration-300 font-semibold block break-words" 
                data-testid="link-email"
              >
                mason@masonmartinlaw.com
              </a>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal-50 rounded-xl border border-charcoal-100">
                <CheckCircle className="h-4 w-4 text-charcoal-500" />
                <span className="typography-body-small text-charcoal-500 font-medium" data-testid="text-email-response">
                  Response within 24 hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Premium Contact Form */}
      <div className="max-w-5xl mx-auto">
        <div className="relative">
          {/* Premium Background with Subtle Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal-50 via-white to-platinum-100/50 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-bronze-500/3 via-transparent to-bronze-600/5 rounded-3xl"></div>
          
          <Card className="relative bg-white/70 backdrop-blur-sm p-8 lg:p-12 rounded-3xl border border-platinum-300/50 shadow-2xl" data-testid="card-contact-form">
            {/* Premium Form Header */}
            <div className="text-center mb-8">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-charcoal-900" data-testid="text-send-message-title">
                Send a <span className="text-gradient">Confidential Message</span>
              </h3>
              <p className="text-base text-charcoal-500 max-w-2xl mx-auto">
                Share the details of your legal matter with complete confidentiality. We'll respond with a personalized consultation plan.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Premium Form Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Name Field */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="typography-label text-charcoal-900">
                    Full Name <span className="text-bronze-500">*</span>
                  </Label>
                  <div className="relative group">
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="h-14 px-6 text-lg bg-white/80 border-2 border-platinum-300 rounded-xl focus:border-bronze-400 focus:ring-4 focus:ring-bronze-500/10 transition-all duration-300 placeholder:text-charcoal-500/50"
                      placeholder="Enter your full name"
                      data-testid="input-contact-name"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-bronze-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                {/* Email Field */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="typography-label text-charcoal-900">
                    Email Address <span className="text-bronze-500">*</span>
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="h-14 px-6 text-lg bg-white/80 border-2 border-platinum-300 rounded-xl focus:border-bronze-400 focus:ring-4 focus:ring-bronze-500/10 transition-all duration-300 placeholder:text-charcoal-500/50"
                      placeholder="your.email@example.com"
                      data-testid="input-contact-email"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-bronze-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                {/* Phone Field */}
                <div className="space-y-3">
                  <Label htmlFor="phone" className="typography-label text-charcoal-900">Phone Number</Label>
                  <div className="relative group">
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="h-14 px-6 text-lg bg-white/80 border-2 border-platinum-300 rounded-xl focus:border-bronze-400 focus:ring-4 focus:ring-bronze-500/10 transition-all duration-300 placeholder:text-charcoal-500/50"
                      placeholder="(808) 555-0123"
                      data-testid="input-contact-phone"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-bronze-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                {/* Subject Field */}
                <div className="space-y-3">
                  <Label className="typography-label text-charcoal-900">Subject Category</Label>
                  <div className="relative group">
                    <Select onValueChange={(value) => handleInputChange("subject", value)} data-testid="select-contact-subject">
                      <SelectTrigger className="h-14 px-6 text-lg bg-white/80 border-2 border-platinum-300 rounded-xl focus:border-bronze-400 focus:ring-4 focus:ring-bronze-500/10 transition-all duration-300">
                        <SelectValue placeholder="Choose a subject category..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-lg border border-platinum-300 rounded-xl shadow-2xl">
                        <SelectItem value="general" className="text-lg py-3 hover:bg-bronze-50">General Legal Inquiry</SelectItem>
                        <SelectItem value="consultation" className="text-lg py-3 hover:bg-bronze-50">New Case Consultation</SelectItem>
                        <SelectItem value="existing-case" className="text-lg py-3 hover:bg-bronze-50">Existing Case Update</SelectItem>
                        <SelectItem value="radio-show" className="text-lg py-3 hover:bg-bronze-50">Radio Show Question</SelectItem>
                        <SelectItem value="media" className="text-lg py-3 hover:bg-bronze-50">Media Interview Request</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-bronze-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>
              
              {/* Message Field */}
              <div className="space-y-3">
                <Label htmlFor="message" className="typography-label text-charcoal-900">
                  Detailed Message <span className="text-bronze-500">*</span>
                </Label>
                <div className="relative group">
                  <Textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please describe your legal matter in detail. Include relevant dates, parties involved, and specific questions you have. All information is kept strictly confidential."
                    className="min-h-[160px] p-6 text-lg bg-white/80 border-2 border-platinum-300 rounded-xl focus:border-bronze-400 focus:ring-4 focus:ring-bronze-500/10 transition-all duration-300 placeholder:text-charcoal-500/50 resize-none"
                    data-testid="textarea-contact-message"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-bronze-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
              
              {/* Premium Submit Button */}
              <div className="text-center pt-8">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-premium-primary px-12 py-6 text-lg font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]" 
                  data-testid="button-send-message"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending Message...
                    </div>
                  ) : (
                    "Send Confidential Message"
                  )}
                </Button>
                <p className="typography-body-small text-charcoal-500 mt-4 max-w-md mx-auto">
                  Your message is sent securely and treated with the utmost confidentiality under attorney-client privilege.
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
