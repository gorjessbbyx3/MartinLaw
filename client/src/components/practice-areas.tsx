import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, Building, Scroll, Shield, ArrowRight, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PracticeAreas() {
  const practiceAreas = [
    {
      icon: Gavel,
      title: "Civil Litigation",
      description: "Complex civil disputes, personal injury, contract disputes, and business litigation with proven courtroom excellence",
      gradientClass: "from-charcoal-900 to-charcoal-700",
      accentColor: "bronze",
      specialties: ["Contract Disputes", "Personal Injury", "Business Litigation", "Property Disputes"]
    },
    {
      icon: Building,
      title: "Trial Advocacy",
      description: "Distinguished courtroom representation across state, federal, and territorial courts with unmatched trial expertise",
      gradientClass: "from-charcoal-700 to-charcoal-900",
      accentColor: "platinum",
      specialties: ["Federal Courts", "State Courts", "Jury Trials", "Bench Trials"]
    },
    {
      icon: Scroll,
      title: "Appellate Law",
      description: "Sophisticated appeals and appellate brief writing for complex legal matters with meticulous attention to detail",
      gradientClass: "from-charcoal-900 to-charcoal-700",
      accentColor: "bronze",
      specialties: ["Appeal Briefs", "Legal Research", "Oral Arguments", "Case Analysis"]
    },
    {
      icon: Shield,
      title: "Military Law",
      description: "Comprehensive military justice, administrative proceedings, and veteran affairs with distinguished military experience",
      gradientClass: "from-charcoal-700 to-charcoal-900",
      accentColor: "platinum",
      specialties: ["Military Justice", "Veterans Affairs", "Court Martial", "Administrative Law"]
    }
  ];

  return (
    <section id="practice-areas" className="py-16 lg:py-20 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-platinum-100 via-white to-charcoal-50/20"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-bronze-500/3 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-charcoal-900/5 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23D4AF37%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2240%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Premium Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 glass-effect rounded-2xl px-8 py-4 mb-8 border border-bronze-500/20">
            <div className="relative">
              <div className="w-3 h-3 bg-bronze-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-bronze-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <Scale className="w-5 h-5 text-bronze-500" />
            <span className="typography-overline text-bronze-500 tracking-wider">Legal Expertise</span>
          </div>

          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6">
            <span className="text-gradient">Practice Areas</span>
          </h2>

          <div className="w-32 h-1 bg-gradient-to-r from-bronze-500 to-bronze-600 rounded-full mx-auto mb-8"></div>

          <p className="text-lg max-w-4xl mx-auto leading-relaxed">
            <span className="text-bronze-500 font-semibold">Distinguished legal representation</span> across multiple areas of law, 
            backed by <span className="text-charcoal-900 font-medium">25+ years of courtroom excellence</span> and an unwavering commitment to client success.
          </p>
        </div>

        {/* Practice Areas Grid */}
        <div className="grid lg:grid-cols-3 gap-10 mb-20">
          {practiceAreas.map((area, index) => (
            <Card 
              key={area.title} 
              className="group relative p-10 border-0 bg-gradient-to-br from-white via-charcoal-50/60 to-platinum-100/40 hover:from-charcoal-50 hover:via-platinum-100/80 hover:to-bronze-50/40 backdrop-blur-md card-hover shimmer-effect rounded-3xl"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Card Background with Premium Styling */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-platinum-50 rounded-3xl border border-platinum-300/40 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                {/* Inner Premium Border */}
                <div className="absolute inset-0 rounded-3xl border border-bronze-500/10 group-hover:border-bronze-500/20 transition-all duration-500"></div>
              </div>

              {/* Elegant Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-br from-bronze-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>

              {/* Card Content */}
              <CardContent className="relative z-10 bg-transparent p-0 m-0">
                {/* Premium Icon Container */}
                <div className="relative mb-6">
                  <div className={`relative w-16 h-16 bg-gradient-to-br ${area.gradientClass} rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}>
                    <area.icon className="w-8 h-8 text-bronze-500" />

                    {/* Icon Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-bronze-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                    {/* Premium Badge Indicator */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-bronze-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Floating Background Element */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-bronze-500/5 rounded-xl blur-sm group-hover:bg-bronze-500/10 transition-all duration-500"></div>
                </div>

                {/* Premium Typography */}
                <CardTitle className="text-xl lg:text-2xl font-semibold mb-4 group-hover:text-bronze-600 transition-colors duration-300">
                  {area.title}
                </CardTitle>
              </CardContent>

              <CardContent className="px-0 pb-0 pt-4">
                {/* Enhanced Description */}
                <p className="text-base text-charcoal-700 mb-4 leading-relaxed">
                  {area.description}
                </p>

                {/* Premium Specialty Badges */}
                <div className="space-y-4 mb-6">
                  <div className="typography-caption text-charcoal-500 font-medium">SPECIALIZATIONS</div>
                  <div className="flex flex-wrap gap-2">
                    {area.specialties.map((specialty, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className={`typography-body-small px-3 py-1.5 rounded-full border transition-all duration-300 ${
                          area.accentColor === 'bronze' 
                            ? 'bg-bronze-50 text-bronze-700 border-bronze-200/50 hover:bg-bronze-100 hover:border-bronze-300' 
                            : 'bg-platinum-100 text-charcoal-700 border-platinum-300/50 hover:bg-platinum-200 hover:border-charcoal-300'
                        }`}
                        data-testid={`badge-specialty-${specialty.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Premium Call-to-Action */}
                <div className="flex items-center justify-between pt-4 border-t border-platinum-300/30">
                  <div className="typography-body-small text-charcoal-500 font-medium">
                    Learn More
                  </div>
                  <div className="flex items-center space-x-2 text-bronze-600 group-hover:text-bronze-500 transition-colors duration-300">
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Premium Bottom Section */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="inline-flex items-center gap-4 glass-effect rounded-2xl px-8 py-6 border border-platinum-300/40">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-bronze-500 rounded-full animate-pulse"></div>
              <span className="typography-body text-charcoal-700 font-medium">Ready to discuss your case?</span>
            </div>
            <div className="h-4 w-px bg-platinum-300/50"></div>
            <button 
              onClick={() => {
                const element = document.getElementById('consultation');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="typography-body-small text-bronze-600 hover:text-bronze-500 transition-colors duration-300 font-semibold"
              data-testid="button-schedule-consultation-from-practice-areas"
            >
              Schedule Consultation →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}