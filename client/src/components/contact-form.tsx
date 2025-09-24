import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

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
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "Failed to Send Message",
        description: "Please try again or contact us directly by phone.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="animate-fade-in">
      {/* Simple Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-black" data-testid="text-contact-title">
          Contact Our Office
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" data-testid="text-contact-description">
          Get in touch to discuss your legal matter. We respond promptly to every inquiry.
        </p>
      </div>
      
      {/* Simple Contact Information */}
      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        {/* Office Location */}
        <div className="text-center" data-testid="card-office-location">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-black flex items-center justify-center">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black" data-testid="text-office-location">Office Location</h3>
          <div className="space-y-1 text-gray-600" data-testid="text-office-address">
            <p>Downtown Honolulu</p>
            <p>Hawaii 96813</p>
            <p className="text-sm">Address provided upon scheduling</p>
          </div>
        </div>
        
        {/* Phone */}
        <div className="text-center" data-testid="card-phone">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-black flex items-center justify-center">
            <Phone className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black" data-testid="text-phone-title">Direct Phone</h3>
          <div className="space-y-1">
            <a 
              href="tel:+18085551234" 
              className="text-lg font-medium text-black hover:text-gray-600 transition-colors" 
              data-testid="link-phone"
            >
              (808) 555-1234
            </a>
            <p className="text-sm text-gray-600" data-testid="text-phone-hours">
              Monday - Friday: 9:00 AM - 5:00 PM HST
            </p>
          </div>
        </div>
        
        {/* Email */}
        <div className="text-center" data-testid="card-email">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-black flex items-center justify-center">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black" data-testid="text-email-title">Email</h3>
          <div className="space-y-1">
            <a 
              href="mailto:mason@masonmartinlaw.com" 
              className="text-lg font-medium text-black hover:text-gray-600 transition-colors break-words" 
              data-testid="link-email"
            >
              mason@masonmartinlaw.com
            </a>
            <p className="text-sm text-gray-600" data-testid="text-email-response">
              Response within 24 hours
            </p>
          </div>
        </div>
      </div>
      
      {/* Simple Contact Form */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-50 p-8 lg:p-12 rounded-lg" data-testid="card-contact-form">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4 text-black" data-testid="text-send-message-title">
              Send a Message
            </h3>
            <p className="text-gray-600">
              Share the details of your legal matter and we'll respond with a consultation plan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 px-4 bg-white border border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-black/10"
                  placeholder="Enter your full name"
                  data-testid="input-contact-name"
                  required
                />
              </div>
              
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-12 px-4 bg-white border border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-black/10"
                  placeholder="your.email@example.com"
                  data-testid="input-contact-email"
                  required
                />
              </div>
              
              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-black font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="h-12 px-4 bg-white border border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-black/10"
                  placeholder="(808) 555-0123"
                  data-testid="input-contact-phone"
                />
              </div>
              
              {/* Subject Field */}
              <div className="space-y-2">
                <Label className="text-black font-medium">Subject</Label>
                <Select onValueChange={(value) => handleInputChange("subject", value)} data-testid="select-contact-subject">
                  <SelectTrigger className="h-12 px-4 bg-white border border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-black/10">
                    <SelectValue placeholder="Choose a subject..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded-lg shadow-lg">
                    <SelectItem value="general">General Legal Inquiry</SelectItem>
                    <SelectItem value="consultation">New Case Consultation</SelectItem>
                    <SelectItem value="existing-case">Existing Case Update</SelectItem>
                    <SelectItem value="radio-show">Radio Show Question</SelectItem>
                    <SelectItem value="media">Media Interview Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-black font-medium">
                Message *
              </Label>
              <Textarea
                id="message"
                rows={6}
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Please describe your legal matter in detail. Include relevant dates, parties involved, and specific questions you have."
                className="p-4 bg-white border border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-black/10 resize-none"
                data-testid="textarea-contact-message"
                required
              />
            </div>
            
            {/* Submit Button */}
            <div className="text-center pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary" 
                data-testid="button-send-message"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Message"
                )}
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                Your message is sent securely and treated with complete confidentiality.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}