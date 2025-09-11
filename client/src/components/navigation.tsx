import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Scale } from "lucide-react";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-platinum-300/30 shadow-lg shadow-charcoal-900/5' 
          : 'bg-white border-b border-platinum-100'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center h-20 lg:h-24">
          {/* Premium Brand Identity */}
          <div className="flex items-center group">
            <div className="flex items-center space-x-3">
              <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-charcoal-900 to-charcoal-700 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Scale className="h-6 w-6 lg:h-7 lg:w-7 text-bronze-500" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-bronze-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <h1 className="typography-h4 lg:typography-h3 text-gradient font-display tracking-tight" data-testid="text-law-firm-name">
                  Mason Martin Law
                </h1>
                <div className="typography-overline text-platinum-500 -mt-1 hidden lg:block">
                  Premium Legal Services
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'practice-areas', label: 'Practice Areas' },
                { id: 'radio-show', label: 'Radio Show' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)} 
                  className="nav-link-premium"
                  data-testid={`button-nav-${item.id}`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="h-6 w-px bg-platinum-300 mx-4" />
              
              <Button 
                variant="ghost"
                asChild
                className="nav-link-premium"
                data-testid="button-nav-client-portal"
              >
                <Link href="/client-portal">
                  Client Portal
                </Link>
              </Button>
              
              <Button 
                onClick={() => scrollToSection('consultation')} 
                className="btn-premium-primary ml-4"
                data-testid="button-schedule-consultation"
              >
                Schedule Consultation
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              className="mobile-menu-trigger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label="Toggle mobile menu"
            >
              <div className="relative">
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-charcoal-700 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="h-6 w-6 text-charcoal-700 transition-transform duration-300" />
                )}
              </div>
            </button>
          </div>
        </div>
        
        {/* Premium Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className="mobile-menu-content">
            <div className="py-6 space-y-2">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'practice-areas', label: 'Practice Areas' },
                { id: 'radio-show', label: 'Radio Show' },
                { id: 'contact', label: 'Contact' }
              ].map((item, index) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)} 
                  className="mobile-nav-link"
                  style={{ animationDelay: `${index * 50}ms` }}
                  data-testid={`button-mobile-nav-${item.id}`}
                >
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
              
              <div className="pt-4 mt-4 border-t border-platinum-300/30">
                <Button 
                  variant="ghost"
                  asChild
                  className="mobile-nav-link justify-start"
                  data-testid="button-mobile-nav-client-portal"
                >
                  <Link href="/client-portal" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="relative z-10">Client Portal</span>
                  </Link>
                </Button>
                
                <Button 
                  onClick={() => scrollToSection('consultation')} 
                  className="btn-premium-primary w-full mt-4 justify-center"
                  data-testid="button-mobile-schedule-consultation"
                >
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}