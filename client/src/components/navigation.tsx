import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-serif font-bold text-navy-900" data-testid="text-law-firm-name">Mason Martin Law</h1>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-muted-foreground hover:text-navy-700 px-3 py-2 text-sm font-medium transition-colors"
                data-testid="button-nav-home"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-muted-foreground hover:text-navy-700 px-3 py-2 text-sm font-medium transition-colors"
                data-testid="button-nav-about"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('practice-areas')} 
                className="text-muted-foreground hover:text-navy-700 px-3 py-2 text-sm font-medium transition-colors"
                data-testid="button-nav-practice-areas"
              >
                Practice Areas
              </button>
              <button 
                onClick={() => scrollToSection('radio-show')} 
                className="text-muted-foreground hover:text-navy-700 px-3 py-2 text-sm font-medium transition-colors"
                data-testid="button-nav-radio-show"
              >
                Radio Show
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-muted-foreground hover:text-navy-700 px-3 py-2 text-sm font-medium transition-colors"
                data-testid="button-nav-contact"
              >
                Contact
              </button>
              <Link href="/client-portal">
                <button 
                  className="text-muted-foreground hover:text-navy-700 px-3 py-2 text-sm font-medium transition-colors"
                  data-testid="button-nav-client-portal"
                >
                  Client Portal
                </button>
              </Link>
              <Button 
                onClick={() => scrollToSection('consultation')} 
                className="btn-navy"
                data-testid="button-schedule-consultation"
              >
                Schedule Consultation
              </Button>
            </div>
          </div>
          
          <div className="md:hidden">
            <button 
              className="text-muted-foreground hover:text-navy-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-border">
              <button 
                onClick={() => scrollToSection('home')} 
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-navy-700 w-full text-left"
                data-testid="button-mobile-nav-home"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-navy-700 w-full text-left"
                data-testid="button-mobile-nav-about"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('practice-areas')} 
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-navy-700 w-full text-left"
                data-testid="button-mobile-nav-practice-areas"
              >
                Practice Areas
              </button>
              <button 
                onClick={() => scrollToSection('radio-show')} 
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-navy-700 w-full text-left"
                data-testid="button-mobile-nav-radio-show"
              >
                Radio Show
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-navy-700 w-full text-left"
                data-testid="button-mobile-nav-contact"
              >
                Contact
              </button>
              <Link href="/client-portal">
                <button 
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-navy-700 w-full text-left"
                  data-testid="button-mobile-nav-client-portal"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Client Portal
                </button>
              </Link>
              <Button 
                onClick={() => scrollToSection('consultation')} 
                className="btn-navy w-full mt-4"
                data-testid="button-mobile-schedule-consultation"
              >
                Schedule Consultation
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
