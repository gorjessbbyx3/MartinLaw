import { Button } from "@/components/ui/button";
import { Award, Shield, Gavel } from "lucide-react";

export function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-gradient text-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              Experienced Litigation Attorney in 
              <span className="text-gold-400"> Honolulu, Hawaii</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-navy-50 leading-relaxed">
              25+ years of trial, appellate, administrative and military hearings across state, federal, territorial and military courts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                onClick={() => scrollToSection('consultation')} 
                className="btn-gold px-8 py-4 text-lg"
                data-testid="button-schedule-free-consultation"
              >
                Schedule Free Consultation
              </Button>
              <Button 
                onClick={() => scrollToSection('practice-areas')} 
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 text-lg hover:bg-white hover:text-navy-900 transition-all"
                data-testid="button-view-practice-areas"
              >
                View Practice Areas
              </Button>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-gold-400" />
                <span data-testid="text-jag-officer">JAG Officer (Retired)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-gold-400" />
                <span data-testid="text-meritorious-service">Meritorious Service Medal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Gavel className="h-5 w-5 text-gold-400" />
                <span data-testid="text-state-licenses">4 State Licenses</span>
              </div>
            </div>
          </div>
          <div className="lg:text-center animate-fade-in">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800" 
              alt="Mason Martin - Professional Attorney Headshot" 
              className="rounded-2xl shadow-2xl mx-auto max-w-lg w-full"
              data-testid="img-attorney-headshot"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
