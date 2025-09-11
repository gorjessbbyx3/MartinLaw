import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-sm border-b border-gray-800' 
          : 'bg-black border-b border-gray-800'
      }`}
    >
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Simple Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white" data-testid="text-law-firm-name">
              Mason Martin Law
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-6">
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
                  className="nav-link"
                  data-testid={`button-nav-${item.id}`}
                >
                  {item.label}
                </button>
              ))}
              
              <Button 
                variant="ghost"
                asChild
                className="nav-link"
                data-testid="button-nav-client-portal"
              >
                <Link href="/client-portal">
                  Client Portal
                </Link>
              </Button>
              
              <Button 
                onClick={() => scrollToSection('consultation')} 
                className="btn-primary ml-6"
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
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="mobile-menu-content">
            <div className="py-4 space-y-1">
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
                  className="mobile-nav-link"
                  data-testid={`button-mobile-nav-${item.id}`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 mt-4 border-t border-gray-800">
                <Button 
                  variant="ghost"
                  asChild
                  className="mobile-nav-link"
                  data-testid="button-mobile-nav-client-portal"
                >
                  <Link href="/client-portal" onClick={() => setIsMobileMenuOpen(false)}>
                    Client Portal
                  </Link>
                </Button>
                
                <Button 
                  onClick={() => scrollToSection('consultation')} 
                  className="btn-primary w-full mt-4"
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