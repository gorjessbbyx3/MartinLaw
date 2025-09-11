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
    <section id="home" className="bg-black text-white py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Treating each case like we're young and it's 1971
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              25 years of trial experience across state, federal, territorial and military courts in Hawaii.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => scrollToSection('consultation')} 
                className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                data-testid="button-schedule-consultation"
              >
                <Calendar className="mr-2 w-5 h-5" />
                Schedule Consultation
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => scrollToSection('practice-areas')} 
                className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-semibold"
                data-testid="button-view-practice-areas"
              >
                View Practice Areas
              </Button>
            </div>

            <div className="pt-4">
              <Button 
                variant="ghost"
                className="text-gray-300 hover:text-white p-0 h-auto"
                data-testid="button-call-now"
              >
                <Phone className="mr-2 w-4 h-4" />
                Call: (808) 555-0123
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="lg:pl-8">
            <img 
              src={attorneyPhoto} 
              alt="Mason Martin - Attorney" 
              className="rounded-lg w-full max-w-lg mx-auto"
              data-testid="img-attorney-headshot"
            />
          </div>
        </div>
      </div>
    </section>
  );
}