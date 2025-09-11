import { Card, CardContent } from "@/components/ui/card";
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
    <section id="practice-areas" className="section-padding bg-gradient-to-br from-gray-50 to-navy-50/30">
      <div className="container-custom">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-navy-100 rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 bg-navy-500 rounded-full"></div>
            <span className="text-sm font-semibold text-navy-700 uppercase tracking-wider">Legal Expertise</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-serif font-bold text-navy-900 mb-8">
            Practice Areas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive legal representation across multiple areas of law with proven track record of success
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {practiceAreas.map((area, index) => (
            <Card 
              key={area.title} 
              className="card-hover p-8 h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="text-navy-500 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {area.icon}
                </div>
                <h3 className="text-2xl font-bold text-navy-900 mb-4 group-hover:text-navy-700 transition-colors">
                  {area.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {area.description}
                </p>
                <div className="mt-6 pt-4 border-t border-navy-100">
                  <span className="text-navy-500 font-medium text-sm uppercase tracking-wider">
                    Learn More →
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}