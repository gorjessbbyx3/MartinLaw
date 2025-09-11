import { Card } from "@/components/ui/card";
import { GraduationCap, Award, Scale, Heart } from "lucide-react";

export function About() {
  return (
    <section id="about" className="section-padding bg-white relative">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-50/30 to-transparent"></div>
      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gold-50 rounded-full px-6 py-2 mb-8 border border-gold-200">
              <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
              <span className="text-sm font-semibold text-gold-600 uppercase tracking-wider">25+ Years Experience</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-serif font-bold text-navy-900 mb-8 leading-tight">
              About <span className="text-gradient">Mason Martin</span>
            </h2>
            <div className="space-y-8 text-lg text-gray-600 leading-relaxed">
              <p className="text-xl text-gray-700 font-medium">
                With over 25 years of legal experience, Mason Martin has established himself as one of Hawaii's premier litigation attorneys.
              </p>
              <p>
                His extensive courtroom experience spans state, federal, territorial, and military courts, providing clients with unparalleled expertise across diverse legal landscapes.
              </p>
              <p>
                Mason's dedication to his clients and thorough understanding of complex legal matters has resulted in successful outcomes across a wide range of practice areas, from civil litigation to military law.
              </p>
              <p>
                He is committed to providing personalized legal representation and ensuring that each client receives the attention and expertise their case deserves.
              </p>
            </div>
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => scrollToSection('consultation')} 
                className="btn-navy px-8 py-4 text-lg"
              >
                Schedule Consultation
              </Button>
              <div className="flex items-center gap-4 text-navy-700">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">5.0 Client Rating</span>
                </div>
              </div>
            </div>
          </div>
          <div className="animate-slide-up">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-navy-500 to-gold-400 rounded-3xl blur opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Professional lawyer in office setting with law books and gavel" 
                className="relative rounded-3xl shadow-2xl w-full animate-float"
                data-testid="img-about-lawyer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}