import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, Building, Scroll, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PracticeAreas() {
  const practiceAreas = [
    {
      icon: Gavel,
      title: "Civil Litigation",
      description: "Complex civil disputes, personal injury, contract disputes, and business litigation",
      color: "bg-navy-900",
      specialties: ["Contracts", "Personal Injury", "Business Disputes"]
    },
    {
      icon: Building,
      title: "Trial Advocacy",
      description: "Experienced courtroom representation across state and federal trial courts",
      color: "bg-gold-500",
      specialties: ["Courtroom Representation", "Federal Law", "State Law"]
    },
    {
      icon: Scroll,
      title: "Appellate Law",
      description: "Appeals and appellate brief writing for complex legal matters",
      color: "bg-navy-900",
      specialties: ["Appeals", "Brief Writing", "Legal Research"]
    },
    {
      icon: Shield,
      title: "Military Law",
      description: "Military justice, administrative proceedings, and veteran affairs",
      color: "bg-gold-500",
      specialties: ["Military Justice", "Veterans Affairs", "Administrative Law"]
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
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-navy-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-navy-200 transition-colors">
                  <area.icon className="w-6 h-6 text-navy-600" />
                </div>
                <CardTitle className="text-xl font-serif text-navy-900 group-hover:text-navy-700 transition-colors">
                  {area.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {area.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {area.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs bg-navy-50 text-navy-700 hover:bg-navy-100">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}