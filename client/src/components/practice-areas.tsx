import { Gavel, Building, Scroll, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PracticeAreas() {
  const practiceAreas = [
    {
      icon: Gavel,
      title: "Civil Litigation",
      description: "Complex civil disputes, personal injury, contract disputes, and business litigation with proven courtroom excellence",
      specialties: ["Contract Disputes", "Personal Injury", "Business Litigation", "Property Disputes"]
    },
    {
      icon: Building,
      title: "Trial Advocacy",
      description: "Distinguished courtroom representation across state, federal, and territorial courts with unmatched trial expertise",
      specialties: ["Federal Courts", "State Courts", "Jury Trials", "Bench Trials"]
    },
    {
      icon: Scroll,
      title: "Appellate Law",
      description: "Sophisticated appeals and appellate brief writing for complex legal matters with meticulous attention to detail",
      specialties: ["Appeal Briefs", "Legal Research", "Oral Arguments", "Case Analysis"]
    },
    {
      icon: Shield,
      title: "Military Law", 
      description: "Comprehensive military justice, administrative proceedings, and veteran affairs with distinguished military experience",
      specialties: ["Military Justice", "Veterans Affairs", "Court Martial", "Administrative Law"]
    }
  ];

  return (
    <section id="practice-areas" className="bg-black text-white section">
      <div className="container">
        {/* Simple Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Practice Areas
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Comprehensive legal representation across multiple areas of law, backed by 25+ years of courtroom excellence.
          </p>
        </div>

        {/* Simple Practice Areas Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {practiceAreas.map((area, index) => (
            <div 
              key={area.title}
              className="space-y-4"
            >
              {/* Simple Icon and Title */}
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-gray-800">
                  <area.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {area.title}
                </h3>
              </div>

              {/* Simple Description */}
              <p className="text-gray-300 leading-relaxed">
                {area.description}
              </p>

              {/* Simple Specialties List */}
              <div className="space-y-2">
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wide">
                  Specializations
                </div>
                <div className="flex flex-wrap gap-2">
                  {area.specialties.map((specialty, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-md"
                      data-testid={`badge-specialty-${specialty.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Simple CTA */}
        <div className="text-center">
          <p className="text-gray-300 mb-6">
            Ready to discuss your case?
          </p>
          <Button 
            onClick={() => {
              const element = document.getElementById('consultation');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-primary"
            data-testid="button-schedule-consultation-from-practice-areas"
          >
            Schedule Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}