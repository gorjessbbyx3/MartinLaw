import { Award, Users, Scale, TrendingUp } from "lucide-react";
import { Button } from '@/components/ui/button';
import aboutPhoto from "@assets/IMG_4754_1757576560414.jpeg";

export function About() {
  return (
    <section id="about" className="bg-black text-white section">
      <div className="container">
        {/* Simple Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Meet Mason Martin
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            25+ years of litigation expertise across Hawaii's state, federal, territorial, and military courts.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Content Section */}
          <div className="space-y-8">
            {/* Professional Summary */}
            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                Mason Martin stands as Hawaii's experienced litigation attorney, delivering comprehensive legal counsel to clients across the Pacific. His courtroom presence spans multiple jurisdictions, providing clients with multi-jurisdictional expertise.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Mason's approach to complex litigation has consistently yielded favorable outcomes for Hawaii's legal challenges, with a focus on personalized strategic counsel tailored to each client's unique circumstances.
              </p>
            </div>

            {/* Simple Credentials */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Scale, label: "Multi-Jurisdiction", value: "Expert" },
                { icon: Users, label: "Client Success", value: "98%" },
                { icon: Award, label: "Court Victories", value: "500+" },
                { icon: TrendingUp, label: "Case Value", value: "$50M+" }
              ].map((credential, index) => (
                <div
                  key={index}
                  className="simple-card"
                  data-testid={`credential-${credential.label.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-gray-800">
                      <credential.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">
                        {credential.value}
                      </div>
                      <div className="text-sm text-gray-400">
                        {credential.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Excellence Pillars */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white mb-6">Practice Approach</h3>
              <div className="space-y-4">
                {[
                  "Dedicated client advocacy and case excellence",
                  "Comprehensive litigation across multiple court systems", 
                  "Strategic counsel tailored to unique circumstances",
                  "Proven track record in high-stakes matters"
                ].map((pillar, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-900 transition-colors"
                    data-testid={`pillar-${index}`}
                  >
                    <div className="flex-shrink-0 w-2 h-2 bg-white rounded-full mt-3"></div>
                    <p className="text-gray-300 leading-relaxed">{pillar}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-8">
              <Button
                onClick={() => {
                  const element = document.getElementById('consultation');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary"
                data-testid="button-schedule-consultation"
              >
                Schedule Consultation
              </Button>
            </div>
          </div>

          {/* Simple Image Section */}
          <div className="animate-fade-in">
            <img
              src={aboutPhoto}
              alt="Mason Martin - Hawaii Attorney"
              className="rounded-lg w-full h-auto"
              data-testid="img-about-lawyer"
            />
          </div>
        </div>

        {/* Simple Stats */}
        <div className="mt-16 animate-fade-in">
          <div className="bg-gray-900 rounded-lg p-8 lg:p-10">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { value: "500+", label: "Cases Won" },
                { value: "1000+", label: "Clients Served" },
                { value: "4", label: "Court Systems" },
                { value: "25+", label: "Years Practice" }
              ].map((stat, index) => (
                <div key={index} data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}