import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";
import attorneyPhoto from "@assets/IMG_4760_1757575612514.jpeg";

export function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="bg-background py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Content */}
          <div className="space-y-10">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground">
              Experienced Legal Advocacy When It Matters Most
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
              Hawaii's trusted litigation attorney with 25+ years defending clients across state, federal, territorial, and military courts. Dedicated to achieving the best possible outcomes for every case.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button 
                onClick={() => scrollToSection('consultation')} 
                className="btn-primary text-lg"
                data-testid="button-schedule-consultation"
              >
                <Calendar className="mr-3 w-5 h-5" />
                Schedule Consultation
              </Button>
              
              <Button 
                onClick={() => scrollToSection('practice-areas')} 
                className="btn-secondary text-lg"
                data-testid="button-view-practice-areas"
              >
                View Practice Areas
              </Button>
            </div>

            <div className="pt-6">
              <Button 
                variant="ghost"
                className="text-muted-foreground hover:text-foreground p-0 h-auto text-lg"
                data-testid="button-call-now"
              >
                <Phone className="mr-3 w-5 h-5" />
                Call: (808) 555-0123
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="lg:pl-8">
            <div className="relative">
              <img 
                src={attorneyPhoto} 
                alt="Mason Martin - Attorney" 
                className="rounded-2xl w-full max-w-lg mx-auto shadow-2xl"
                data-testid="img-attorney-headshot"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}