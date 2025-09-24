
import { Navigation } from "@/components/navigation";
import { About } from "@/components/about";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <About />
      <footer className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-serif font-bold mb-4">Mason Martin Law</h3>
              <p className="text-navy-100 mb-6 leading-relaxed">
                Experienced litigation attorney serving Hawaii with integrity, expertise, and dedication. 25+ years of proven results in state, federal, and military courts.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-navy-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold-500 transition-colors" data-testid="link-linkedin">
                  <i className="fab fa-linkedin text-sm"></i>
                </a>
                <a href="#" className="bg-navy-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold-500 transition-colors" data-testid="link-facebook">
                  <i className="fab fa-facebook text-sm"></i>
                </a>
                <a href="#" className="bg-navy-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold-500 transition-colors" data-testid="link-twitter">
                  <i className="fab fa-twitter text-sm"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gold-400">Practice Areas</h4>
              <ul className="space-y-2 text-navy-100">
                <li><a href="/#practice-areas" className="hover:text-gold-400 transition-colors" data-testid="link-civil-litigation">Civil Litigation</a></li>
                <li><a href="/#practice-areas" className="hover:text-gold-400 transition-colors" data-testid="link-trial-advocacy">Trial Advocacy</a></li>
                <li><a href="/#practice-areas" className="hover:text-gold-400 transition-colors" data-testid="link-appellate-law">Appellate Law</a></li>
                <li><a href="/#practice-areas" className="hover:text-gold-400 transition-colors" data-testid="link-military-law">Military Law</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gold-400">Resources</h4>
              <ul className="space-y-2 text-navy-100">
                <li><a href="/client-portal" className="hover:text-gold-400 transition-colors" data-testid="link-client-portal">Client Portal</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors" data-testid="link-legal-resources">Legal Resources</a></li>
                <li><a href="/#radio-show" className="hover:text-gold-400 transition-colors" data-testid="link-radio-archives">Radio Show Archives</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors" data-testid="link-case-studies">Case Studies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-navy-700 mt-12 pt-8 text-center text-navy-200">
            <p>&copy; 2024 Mason Martin Law. All rights reserved. | 
               <a href="#" className="hover:text-gold-400 transition-colors" data-testid="link-privacy">Privacy Policy</a> | 
               <a href="#" className="hover:text-gold-400 transition-colors" data-testid="link-terms">Terms of Service</a> | 
               <a href="/admin-login" className="opacity-30 hover:opacity-100 hover:text-gold-400 transition-all duration-300" data-testid="link-admin-portal">Portal</a>
            </p>
            <p className="mt-2 text-sm">Attorney Advertising. Prior results do not guarantee a similar outcome.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
