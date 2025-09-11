import { Card } from "@/components/ui/card";
import { Gavel, Building, Scroll, Shield } from "lucide-react";

export function PracticeAreas() {
  const practiceAreas = [
    {
      icon: Gavel,
      title: "Civil Litigation",
      description: "Complex civil disputes, personal injury, contract disputes, and business litigation",
      color: "bg-navy-900"
    },
    {
      icon: Building,
      title: "Trial Advocacy",
      description: "Experienced courtroom representation across state and federal trial courts",
      color: "bg-gold-500"
    },
    {
      icon: Scroll,
      title: "Appellate Law",
      description: "Appeals and appellate brief writing for complex legal matters",
      color: "bg-navy-900"
    },
    {
      icon: Shield,
      title: "Military Law",
      description: "Military justice, administrative proceedings, and veteran affairs",
      color: "bg-gold-500"
    }
  ];

  return (
    <section id="practice-areas" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-navy-900 mb-6" data-testid="text-practice-areas-title">
            Practice Areas
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-practice-areas-description">
            Comprehensive legal representation across multiple areas of law, backed by decades of courtroom experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {practiceAreas.map((area, index) => (
            <Card key={index} className="p-8 card-hover text-center" data-testid={`card-practice-area-${index}`}>
              <div className={`${area.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                <area.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-navy-900 mb-4" data-testid={`text-practice-area-title-${index}`}>
                {area.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed" data-testid={`text-practice-area-description-${index}`}>
                {area.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
