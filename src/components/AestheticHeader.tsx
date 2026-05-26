import { Sparkles, Calendar, UserCheck, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  onNavClick: (sectionId: string) => void;
  activeSection: string;
  cartCount: number;
}

export default function AestheticHeader({ onNavClick, activeSection, cartCount }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "hero", label: "Heritage" },
    { id: "treatments", label: "Treatments" },
    { id: "beforeafter", label: "Before & After" },
    { id: "advisor", label: "AI Skin Advisor" },
    { id: "planner", label: "Treatment Planner" },
    { id: "booking", label: "Book Appointment" },
  ];

  const handleItemClick = (id: string) => {
    onNavClick(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-app-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#faf6f0]/95 backdrop-blur-md shadow-sm border-b border-[#faf6f0]/30 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with Spacing */}
        <div
          id="brand-logo"
          onClick={() => handleItemClick("hero")}
          className="cursor-pointer group flex flex-col items-start"
        >
          <span className="text-xl sm:text-2xl font-sans tracking-[0.25em] font-light text-[#1a1c1d] transition-colors group-hover:text-[#c5a880]">
            H O P E
          </span>
          <span className="text-[9px] uppercase tracking-[0.35em] text-[#c5a880] mt-0.5">
            Aesthetics Center
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => handleItemClick(item.id)}
              className={`text-xs uppercase tracking-widest font-medium transition-all duration-300 relative py-1 ${
                activeSection === item.id
                  ? "text-[#c5a880] font-semibold"
                  : "text-[#1a1c1d]/75 hover:text-[#c5a880]"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#c5a880] transition-all duration-300" />
              )}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div id="header-actions" className="hidden md:flex items-center space-x-4">
          <button
            id="nav-advisor-button"
            onClick={() => handleItemClick("advisor")}
            className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#1a1c1d]/90 hover:text-[#c5a880] border border-[#c5a880]/30 hover:border-[#c5a880] px-4 py-2 rounded-full transition-all duration-300"
          >
            <Sparkles className="w-3 h-3 text-[#c5a880]" />
            <span>AI skin expert</span>
          </button>

          <button
            id="nav-quick-book-button"
            onClick={() => handleItemClick("booking")}
            className="flex items-center space-x-2 bg-[#1a1c1d] hover:bg-[#c5a880] text-[#fdfbf7] text-xs uppercase tracking-widest px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm shadow-[#1a1c1d]/10 relative overflow-hidden"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Now</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c5a880] text-[#fdfbf7] text-[10px] rounded-full flex items-center justify-center font-bold border border-[#fdfbf7]">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="lg:hidden flex items-center space-x-3">
          {cartCount > 0 && (
            <button
              onClick={() => handleItemClick("planner")}
              className="relative p-2 text-[#1a1c1d]"
            >
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#c5a880] rounded-full" />
              <Sparkles className="w-5 h-5" />
            </button>
          )}

          <button
            id="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#1a1c1d] hover:text-[#c5a880] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden fixed inset-0 top-[64px] bg-[#faf6f0] z-40 flex flex-col px-6 py-8 space-y-6 border-t border-[#c5a880]/10 overflow-y-auto"
        >
          <div className="flex flex-col space-y-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`text-sm uppercase tracking-widest font-medium text-left py-2.5 border-b border-[#c5a880]/10 ${
                  activeSection === item.id ? "text-[#c5a880]" : "text-[#1a1c1d]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-6 flex flex-col space-y-4">
            <button
              id="mobile-advisor-cta"
              onClick={() => handleItemClick("advisor")}
              className="flex items-center justify-center space-x-2 text-xs uppercase tracking-widest text-[#1a1c1d] border border-[#c5a880] w-full py-3.5 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-[#c5a880]" />
              <span>AI skin advisor</span>
            </button>

            <button
              id="mobile-booking-cta"
              onClick={() => handleItemClick("booking")}
              className="flex items-center justify-center space-x-2 bg-[#1a1c1d] text-[#fdfbf7] text-xs uppercase tracking-widest w-full py-3.5 rounded-full"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Slot ({cartCount} chosen)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
