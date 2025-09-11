import { Card } from "@/components/ui/card";
import { GraduationCap, Award, Scale, Heart, Star, Shield, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Button } from '@/components/ui/button';
import aboutPhoto from "@assets/IMG_4754_1757576560414.jpeg";

export function About() {
  return (
    <section id="about" className="relative bg-gradient-to-br from-charcoal-50 via-white to-platinum-100 overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-bronze-500/5 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-charcoal-900/3 via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-transparent via-platinum-100/20 to-transparent"></div>
      </div>
      
      <div className="py-20 lg:py-28 relative">
        <div className="container-custom">
          {/* Section Header */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-charcoal-50 to-platinum-100 rounded-3xl px-10 py-5 mb-10 border border-platinum-300 shadow-xl glow-effect shimmer-effect">
              <div className="w-4 h-4 bg-gradient-to-r from-bronze-500 to-bronze-600 rounded-full animate-pulse"></div>
              <span className="typography-overline text-bronze-500 font-bold tracking-wider">Distinguished Legal Excellence</span>
            </div>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6">
              Meet <span className="text-gradient">Mason Martin</span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-charcoal-700 leading-relaxed">
              Platinum-tier litigation expertise refined through 25+ years of distinguished courtroom excellence across Hawaii's most complex legal landscapes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Content Section */}
            <div className="animate-fade-in space-y-8">
              {/* Professional Summary */}
              <div className="space-y-6">
                <div className="space-y-6">
                  <p className="typography-body-large text-charcoal-700 leading-relaxed">
                    With an unparalleled quarter-century of legal mastery, Mason Martin stands as Hawaii's preeminent litigation authority, delivering platinum-grade legal counsel to discerning clients across the Pacific.
                  </p>
                  <p className="typography-body text-charcoal-500 leading-relaxed">
                    His distinguished courtroom presence spans state, federal, territorial, and military jurisdictions, providing clients with exclusive access to multi-jurisdictional expertise that few attorneys can match. Mason's meticulous approach to complex litigation has consistently yielded exceptional outcomes for Hawaii's most sophisticated legal challenges.
                  </p>
                </div>
              </div>

              {/* Premium Credentials Grid */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Scale, label: "Multi-Jurisdiction", value: "Expert", color: "bronze" },
                  { icon: Users, label: "Client Success", value: "98%", color: "charcoal" },
                  { icon: Award, label: "Court Victories", value: "500+", color: "bronze" },
                  { icon: TrendingUp, label: "Case Value", value: "$50M+", color: "charcoal" }
                ].map((credential, index) => (
                  <div
                    key={index}
                    className="group relative p-6 bg-white rounded-2xl border border-platinum-300 shadow-lg hover:shadow-2xl transition-all duration-500 card-hover"
                    data-testid={`credential-${credential.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${credential.color === 'bronze' ? 'bg-bronze-500/10' : 'bg-charcoal-900/10'} transition-all duration-300 group-hover:scale-110`}>
                        <credential.icon className={`w-6 h-6 ${credential.color === 'bronze' ? 'text-bronze-500' : 'text-charcoal-900'}`} />
                      </div>
                      <div>
                        <div className={`typography-h4 ${credential.color === 'bronze' ? 'text-bronze-500' : 'text-charcoal-900'} font-bold`}>
                          {credential.value}
                        </div>
                        <div className="typography-body-small text-charcoal-500 font-medium">
                          {credential.label}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Professional Pillars */}
              <div className="space-y-6">
                <h3 className="text-xl lg:text-2xl font-semibold text-charcoal-900 mb-6">Excellence Pillars</h3>
                <div className="space-y-4">
                  {[
                    "Uncompromising dedication to client advocacy and case excellence",
                    "Comprehensive mastery of complex litigation across multiple court systems",
                    "Personalized strategic counsel tailored to each client's unique circumstances",
                    "Proven track record of securing favorable outcomes in high-stakes matters"
                  ].map((pillar, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-charcoal-50/50 transition-all duration-300"
                      data-testid={`pillar-${index}`}
                    >
                      <div className="flex-shrink-0 w-2 h-2 bg-bronze-500 rounded-full mt-3"></div>
                      <p className="typography-body text-charcoal-700 leading-relaxed">{pillar}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium CTAs */}
              <div className="flex flex-col sm:flex-row gap-6 pt-8">
                <Button
                  onClick={() => {
                    const element = document.getElementById('consultation');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-premium-primary flex-1"
                  data-testid="button-schedule-consultation"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Schedule Private Consultation
                </Button>
                <div className="flex items-center justify-center gap-6 px-6 py-4 bg-gradient-to-r from-charcoal-50 to-platinum-100 rounded-xl border border-platinum-300">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-bronze-500 fill-current" />
                    ))}
                  </div>
                  <div className="text-center">
                    <div className="typography-h4 text-charcoal-900">5.0</div>
                    <div className="typography-body-small text-charcoal-500">Client Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Image Section */}
            <div className="animate-slide-up">
              <div className="relative group">
                {/* Sophisticated Background Effects */}
                <div className="absolute -inset-8 bg-gradient-to-br from-charcoal-900/10 via-bronze-500/5 to-charcoal-700/10 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-all duration-700"></div>
                <div className="absolute -inset-4 bg-gradient-to-br from-charcoal-900 via-charcoal-700 to-bronze-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                
                {/* Main Image Container */}
                <div className="relative bg-gradient-to-br from-white to-charcoal-50 p-3 rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <img
                    src={aboutPhoto}
                    alt="Mason Martin - Distinguished Hawaii Attorney"
                    className="relative rounded-2xl shadow-xl w-full h-auto transform group-hover:scale-[1.02] transition-transform duration-700 animate-float"
                    data-testid="img-about-lawyer"
                  />
                  
                  {/* Premium Overlay Badge */}
                  <div className="absolute top-8 left-8 bg-gradient-to-r from-charcoal-900 to-charcoal-700 text-white px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm border border-white/20">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-bronze-500" />
                      <span className="typography-body-small font-semibold tracking-wide">Premier Counsel</span>
                    </div>
                  </div>

                  {/* Achievement Badge */}
                  <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-md px-6 py-4 rounded-xl shadow-xl border border-platinum-300">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-bronze-500 to-bronze-600 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="typography-h4 text-charcoal-900">25+</div>
                        <div className="typography-body-small text-charcoal-500 font-medium">Years Excellence</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-bronze-500/20 to-bronze-600/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-charcoal-900/10 to-charcoal-700/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>

          {/* Premium Trust Indicators */}
          <div className="mt-16 animate-fade-in">
            <div className="bg-gradient-to-r from-charcoal-900 to-charcoal-700 rounded-3xl p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-bronze-500/5 via-transparent to-bronze-500/5"></div>
              <div className="relative grid md:grid-cols-4 gap-8 text-center">
                {[
                  { icon: CheckCircle, value: "500+", label: "Cases Won", description: "Successful Outcomes" },
                  { icon: Users, value: "1000+", label: "Clients Served", description: "Trusted Representation" },
                  { icon: Scale, value: "4", label: "Court Systems", description: "Multi-Jurisdiction Expert" },
                  { icon: Star, value: "25+", label: "Years Practice", description: "Proven Experience" }
                ].map((stat, index) => (
                  <div key={index} className="group" data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
                    <div className="mb-4 flex justify-center">
                      <div className="p-4 bg-bronze-500/10 rounded-2xl group-hover:bg-bronze-500/20 transition-all duration-300 group-hover:scale-110">
                        <stat.icon className="w-8 h-8 text-bronze-500" />
                      </div>
                    </div>
                    <div className="typography-hero text-white mb-2">{stat.value}</div>
                    <div className="typography-h5 text-bronze-500 mb-1">{stat.label}</div>
                    <div className="typography-body-small text-charcoal-100">{stat.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}