import { Navigation } from "@/components/navigation";
import { ConsultationForm } from "@/components/consultation-form";

export default function Consultation() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-navy-900 mb-6" data-testid="text-consultation-page-title">
              Schedule a Legal Consultation
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-consultation-page-description">
              Take the first step toward resolving your legal matter with a comprehensive consultation
            </p>
          </div>
          <ConsultationForm />
        </div>
      </div>
    </div>
  );
}
