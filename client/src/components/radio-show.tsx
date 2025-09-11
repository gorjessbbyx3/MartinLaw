import { Button } from "@/components/ui/button";
import { Mic, Radio, MessageSquare } from "lucide-react";

export function RadioShow() {
  return (
    <section id="radio-show" className="py-20 bg-navy-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-navy-700"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-gold-500 text-navy-900 px-4 py-2 rounded-full typography-overline mb-6 inline-block" data-testid="badge-live-radio">
              <Radio className="w-4 h-4 inline mr-2" />
              LIVE RADIO SHOW
            </div>
            <h2 className="typography-h2 typography-light mb-6" data-testid="text-radio-show-title">
              On-Air and Off-The-Record
            </h2>
            <p className="typography-lead text-navy-100 mb-6" data-testid="text-radio-show-description">
              Join Mason Martin every Saturday at 10:00 AM on AM690/94.3FM - The Answer for legal insights, case discussions, and expert commentary on current legal issues affecting Hawaii and beyond.
            </p>
            <div className="bg-navy-700 p-6 rounded-2xl mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="typography-subtitle text-gold-400" data-testid="text-next-show">Next Show</h4>
                  <p className="typography-body text-navy-100" data-testid="text-show-time">Saturday, 10:00 AM HST</p>
                </div>
                <div className="text-right">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <Mic className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <p className="typography-body-small text-navy-100" data-testid="text-show-topic">
                Discussing recent developments in Hawaii civil litigation and answering listener questions
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button className="btn-gold" data-testid="button-listen-live">
                <Radio className="w-4 h-4 mr-2" />
                Listen Live
              </Button>
              <Button variant="outline" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-navy-900 transition-all typography-button" data-testid="button-past-episodes">
                <MessageSquare className="w-4 h-4 mr-2" />
                Past Episodes
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-navy-900 transition-all typography-button" data-testid="button-submit-question">
                <MessageSquare className="w-4 h-4 mr-2" />
                Submit Question
              </Button>
            </div>
          </div>
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Radio broadcasting studio with microphone and equipment" 
              className="rounded-2xl shadow-2xl"
              data-testid="img-radio-studio"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
