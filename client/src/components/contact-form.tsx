import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail } from "lucide-react";

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

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would send the message via API
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We will contact you within 24 hours.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-navy-900 mb-6" data-testid="text-contact-title">
          Contact Information
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-contact-description">
          Multiple ways to reach our office for your convenience
        </p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-8 bg-muted/30 rounded-2xl" data-testid="card-office-location">
          <div className="bg-navy-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-serif font-bold text-navy-900 mb-4" data-testid="text-office-location">Office Location</h3>
          <p className="text-muted-foreground leading-relaxed" data-testid="text-office-address">
            Downtown Honolulu<br />
            Hawaii 96813<br />
            <span className="text-sm">(Exact address provided upon scheduling)</span>
          </p>
        </div>
        
        <div className="text-center p-8 bg-muted/30 rounded-2xl" data-testid="card-phone">
          <div className="bg-gold-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Phone className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-serif font-bold text-navy-900 mb-4" data-testid="text-phone-title">Phone</h3>
          <p className="text-muted-foreground leading-relaxed">
            <a href="tel:+18085551234" className="hover:text-navy-700 transition-colors" data-testid="link-phone">(808) 555-1234</a><br />
            <span className="text-sm" data-testid="text-phone-hours">Monday - Friday: 9:00 AM - 5:00 PM HST</span>
          </p>
        </div>
        
        <div className="text-center p-8 bg-muted/30 rounded-2xl" data-testid="card-email">
          <div className="bg-navy-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-serif font-bold text-navy-900 mb-4" data-testid="text-email-title">Email</h3>
          <p className="text-muted-foreground leading-relaxed">
            <a href="mailto:mason@masonmartinlaw.com" className="hover:text-navy-700 transition-colors" data-testid="link-email">mason@masonmartinlaw.com</a><br />
            <span className="text-sm" data-testid="text-email-response">Response within 24 hours</span>
          </p>
        </div>
      </div>
      
      {/* Contact Form */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-muted/20 p-8 lg:p-12 rounded-2xl" data-testid="card-contact-form">
          <h3 className="text-2xl font-serif font-bold text-navy-900 mb-8 text-center" data-testid="text-send-message-title">Send a Message</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="block text-sm font-semibold text-navy-900 mb-2">Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="focus:ring-navy-500 focus:border-transparent"
                data-testid="input-contact-name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="block text-sm font-semibold text-navy-900 mb-2">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="focus:ring-navy-500 focus:border-transparent"
                data-testid="input-contact-email"
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
                className="focus:ring-navy-500 focus:border-transparent"
                data-testid="input-contact-phone"
              />
            </div>
            
            <div>
              <Label className="block text-sm font-semibold text-navy-900 mb-2">Subject</Label>
              <Select onValueChange={(value) => handleInputChange("subject", value)} data-testid="select-contact-subject">
                <SelectTrigger className="focus:ring-navy-500 focus:border-transparent">
                  <SelectValue placeholder="Select subject..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="consultation">New Case Consultation</SelectItem>
                  <SelectItem value="existing-case">Existing Case Update</SelectItem>
                  <SelectItem value="radio-show">Radio Show Question</SelectItem>
                  <SelectItem value="media">Media Interview</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="message" className="block text-sm font-semibold text-navy-900 mb-2">Message *</Label>
              <Textarea
                id="message"
                rows={6}
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Please describe your legal matter or question..."
                className="focus:ring-navy-500 focus:border-transparent"
                data-testid="textarea-contact-message"
                required
              />
            </div>
            
            <div className="md:col-span-2 text-center">
              <Button type="submit" className="btn-navy px-8 py-4 text-lg" data-testid="button-send-message">
                Send Message
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
