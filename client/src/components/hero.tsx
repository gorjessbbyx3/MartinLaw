import { Button } from "@/components/ui/button";
import { Award, Shield, Gavel, Star, Phone, Calendar } from "lucide-react";
import attorneyPhoto from "@assets/IMG_4760_1757575612514.jpeg";

export function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-gradient text-white py-16 lg:py-24 relative overflow-hidden">
      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0">
        {/* Primary Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.015%22%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2240%22%20r%3D%221.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        {/* Elegant Geometric Overlays */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-bronze-500/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-charcoal-900/20 to-transparent"></div>
        
        {/* Premium Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(212,175,55,0.08)_0%,transparent_50%)] opacity-60"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 xl:gap-16 items-center min-h-[70vh]">
          {/* Premium Content Section */}
          <div className="lg:col-span-7 xl:col-span-6 animate-fade-in space-y-6">
            {/* Exclusive Status Badge */}
            <div className="inline-flex items-center gap-3 glass-effect rounded-2xl px-8 py-4 border border-bronze-500/20 backdrop-blur-lg">
              <div className="relative">
                <div className="w-3 h-3 bg-bronze-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-bronze-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="typography-overline text-bronze-500 tracking-wider">Exclusive Legal Representation</span>
            </div>

            {/* Premium Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tighter text-white">
                Premier Litigation
                <span className="block text-bronze-500 font-black">Attorney</span>
                <span className="block text-platinum-300 font-light text-3xl lg:text-4xl">Honolulu, Hawaii</span>
              </h1>
              
              {/* Elegant Subheadline */}
              <div className="w-24 h-1 bg-gradient-to-r from-bronze-500 to-bronze-600 rounded-full mb-6"></div>
              <p className="text-lg leading-relaxed max-w-2xl text-white">
                <span className="text-bronze-500 font-medium">25+ years</span> of distinguished trial excellence across state, federal, territorial and military courts. 
                <span className="block mt-2 text-platinum-300">Delivering results for Hawaii's most discerning clients.</span>
              </p>
            </div>

            {/* Premium Call-to-Action Section */}
            <div className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  onClick={() => scrollToSection('consultation')} 
                  className="btn-bronze text-lg px-10 py-6 rounded-2xl shadow-2xl hover:shadow-bronze-500/25 transition-all duration-500 group"
                  data-testid="button-schedule-free-consultation"
                >
                  <Calendar className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  Schedule Private Consultation
                  <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
                
                <Button 
                  onClick={() => scrollToSection('practice-areas')} 
                  variant="outline"
                  className="glass-effect border-2 border-platinum-300/40 text-white px-10 py-6 typography-button text-lg rounded-2xl hover:bg-platinum-300/10 hover:border-bronze-500/50 hover:text-bronze-500 transition-all duration-500 backdrop-blur-lg group"
                  data-testid="button-view-practice-areas"
                >
                  <Gavel className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  Practice Areas
                </Button>
              </div>

              {/* Quick Contact Option */}
              <div className="flex items-center gap-4 pt-2">
                <div className="w-px h-8 bg-platinum-300/30"></div>
                <Button 
                  variant="ghost"
                  className="text-platinum-300 hover:text-bronze-500 transition-colors duration-300 p-0 h-auto group"
                  data-testid="button-call-now"
                >
                  <Phone className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="typography-body-small font-medium">Call Now: (808) 555-0123</span>
                </Button>
              </div>
            </div>

            {/* Premium Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-platinum-300/20">
              <div className="flex items-center space-x-3 group">
                <div className="p-3 rounded-xl bg-bronze-500/10 border border-bronze-500/20 group-hover:bg-bronze-500/20 transition-colors duration-300">
                  <Award className="h-6 w-6 text-bronze-500" />
                </div>
                <div>
                  <div className="typography-body-small font-medium text-white" data-testid="text-jag-officer">JAG Officer</div>
                  <div className="typography-caption text-platinum-300">Retired</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 group">
                <div className="p-3 rounded-xl bg-bronze-500/10 border border-bronze-500/20 group-hover:bg-bronze-500/20 transition-colors duration-300">
                  <Shield className="h-6 w-6 text-bronze-500" />
                </div>
                <div>
                  <div className="typography-body-small font-medium text-white" data-testid="text-meritorious-service">Meritorious Service</div>
                  <div className="typography-caption text-platinum-300">Medal Recipient</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 group">
                <div className="p-3 rounded-xl bg-bronze-500/10 border border-bronze-500/20 group-hover:bg-bronze-500/20 transition-colors duration-300">
                  <Star className="h-6 w-6 text-bronze-500" />
                </div>
                <div>
                  <div className="typography-body-small font-medium text-white" data-testid="text-state-licenses">Multi-State</div>
                  <div className="typography-caption text-platinum-300">Licensed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Image Section */}
          <div className="lg:col-span-5 xl:col-span-6 lg:pl-8 xl:pl-12 animate-fade-in">
            <div className="relative">
              {/* Image Container with Premium Styling */}
              <div className="relative z-10 group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-bronze-500/20 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative">
                  <img 
                    src={attorneyPhoto} 
                    alt="Mason Martin - Distinguished Attorney" 
                    className="rounded-3xl shadow-2xl w-full max-w-lg mx-auto lg:max-w-none border-2 border-bronze-500/20 group-hover:border-bronze-500/30 transition-all duration-500"
                    data-testid="img-attorney-headshot"
                  />
                  
                  {/* Premium Overlay Elements */}
                  <div className="absolute top-8 right-8 glass-effect rounded-2xl p-4 border border-bronze-500/20 backdrop-blur-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-bronze-500 rounded-full animate-pulse"></div>
                      <span className="typography-caption text-bronze-500">Available</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Background Elements */}
              <div className="absolute top-1/4 -right-8 w-32 h-32 bg-bronze-500/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-1/4 -left-8 w-24 h-24 bg-platinum-300/5 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
