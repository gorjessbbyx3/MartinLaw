import { Button } from "@/components/ui/button";
import { Award, Shield, Gavel } from "lucide-react";
import attorneyPhoto from "@assets/image_1757573946693.jpeg";

export function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-gradient text-white py-24 lg:py-40 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gold-400">Available for New Clients</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-tight mb-8">
              Experienced Litigation Attorney in 
              <span className="text-gold-400 block lg:inline"> Honolulu, Hawaii</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-10 text-navy-50/90 leading-relaxed max-w-2xl">
              25+ years of trial, appellate, administrative and military hearings across state, federal, territorial and military courts
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <Button 
                onClick={() => scrollToSection('consultation')} 
                className="btn-gold px-10 py-5 text-lg font-semibold shadow-2xl"
                data-testid="button-schedule-free-consultation"
              >
                Schedule Free Consultation
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
              <Button 
                onClick={() => scrollToSection('practice-areas')} 
                variant="outline"
                className="glass-effect border-2 border-white/30 text-white px-10 py-5 text-lg font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300"
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
              src={attorneyPhoto} 
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
