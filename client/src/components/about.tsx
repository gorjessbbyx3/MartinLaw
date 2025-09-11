import { Card } from "@/components/ui/card";
import { GraduationCap, Award, Scale, Heart } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <img 
              src="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Military courthouse representing JAG Officer background" 
              className="rounded-2xl shadow-lg"
              data-testid="img-military-courthouse"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-navy-900 mb-8" data-testid="text-about-title">About Mason Martin</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed" data-testid="text-about-description-1">
              With over 25 years of distinguished legal experience, Mason Martin brings unparalleled expertise to civil litigation in Hawaii. His unique background as a former JAG Officer provides clients with strategic military precision combined with deep understanding of complex legal proceedings.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed" data-testid="text-about-description-2">
              Licensed to practice in four states and maintaining active memberships in corresponding federal district and appellate courts, Mason has successfully handled cases across multiple jurisdictions. His business acumen, enhanced by a Masters Degree in Accounting from the University of Hawaii at Manoa, provides clients with comprehensive legal and financial guidance.
            </p>
            
            {/* Credentials Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 card-hover" data-testid="card-education">
                <div className="flex items-start space-x-4">
                  <div className="bg-navy-900 p-3 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-900 text-lg" data-testid="text-education-title">Education</h4>
                    <p className="text-muted-foreground" data-testid="text-education-degree">Masters in Accounting</p>
                    <p className="text-sm text-navy-700" data-testid="text-education-school">University of Hawaii at Manoa</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 card-hover" data-testid="card-military-service">
                <div className="flex items-start space-x-4">
                  <div className="bg-gold-500 p-3 rounded-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-900 text-lg" data-testid="text-military-title">Military Service</h4>
                    <p className="text-muted-foreground" data-testid="text-military-service">10+ years as JAG Officer</p>
                    <p className="text-sm text-navy-700" data-testid="text-military-medal">Meritorious Service Medal</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 card-hover" data-testid="card-legal-practice">
                <div className="flex items-start space-x-4">
                  <div className="bg-navy-900 p-3 rounded-lg">
                    <Scale className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-900 text-lg" data-testid="text-legal-title">Legal Practice</h4>
                    <p className="text-muted-foreground" data-testid="text-legal-states">Active in 4 States</p>
                    <p className="text-sm text-navy-700" data-testid="text-legal-courts">Federal & Appellate Courts</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 card-hover" data-testid="card-pro-bono">
                <div className="flex items-start space-x-4">
                  <div className="bg-gold-500 p-3 rounded-lg">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-900 text-lg" data-testid="text-pro-bono-title">Pro Bono Work</h4>
                    <p className="text-muted-foreground" data-testid="text-pro-bono-recipient">Award Recipient</p>
                    <p className="text-sm text-navy-700" data-testid="text-pro-bono-years">2019, 2020, 2021</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
