import { useState, useEffect } from "react";
import AestheticHeader from "./components/AestheticHeader";
import TreatmentExplorer from "./components/TreatmentExplorer";
import BeforeAfterSlider from "./components/BeforeAfterSlider";
import VirtualConsultation from "./components/VirtualConsultation";
import BookingCalendar from "./components/BookingCalendar";
import AestheticAppFooter from "./components/AestheticAppFooter";
import { Treatment } from "./types/clinic";
import { CLINIC_TREATMENTS, SKINCARE_TIPS, CLINIC_SPECIALISTS } from "./utils/skincareData";
import { Sparkles, ArrowRight, UserCheck, ShieldCheck, Heart, Star, Compass, Award, Instagram, Flame } from "lucide-react";

export default function App() {
  const [plannerItems, setPlannerItems] = useState<Treatment[]>([]);
  const [activeSection, setActiveSection] = useState("hero");
  const [preSelectedTreatment, setPreSelectedTreatment] = useState<Treatment | null>(null);

  // Scroll section tracking observer
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "treatments", "beforeafter", "advisor", "planner", "booking"];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll handler
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  // Treatment Planner Add/Remove methods
  const handleAddToPlanner = (treatment: Treatment) => {
    if (!plannerItems.some((item) => item.id === treatment.id)) {
      setPlannerItems([...plannerItems, treatment]);
    }
  };

  const handleRemoveFromPlanner = (id: string) => {
    setPlannerItems(plannerItems.filter((item) => item.id !== id));
  };

  const handleClearPlanner = () => {
    setPlannerItems([]);
    setPreSelectedTreatment(null);
  };

  // Immediate Quick-Book Handler
  const handleBookImmediate = (treatment: Treatment) => {
    // Add to planner if not present
    if (!plannerItems.some((item) => item.id === treatment.id)) {
      setPlannerItems([...plannerItems, treatment]);
    }
    setPreSelectedTreatment(treatment);
    // Scroll directly to booking scheduler
    setTimeout(() => {
      handleScrollToSection("booking");
    }, 100);
  };

  // AI consultant recommend treatment handler
  const handleAISuggestTreatment = (treatmentName: string) => {
    // Find matching treatment in clinical list
    const found = CLINIC_TREATMENTS.find(
      (t) => t.name.toLowerCase().includes(treatmentName.toLowerCase()) ||
             treatmentName.toLowerCase().includes(t.name.toLowerCase())
    );

    if (found) {
      handleBookImmediate(found);
    } else {
      // Find backup or do first element
      handleBookImmediate(CLINIC_TREATMENTS[0]);
    }
  };

  return (
    <div className="bg-[#fdfbf7] text-[#1a1c1d] min-h-screen font-sans selection:bg-[#c5a880]/30 selection:text-[#1a1c1d]">
      {/* Luxury Sticky Header with cart notifications */}
      <AestheticHeader
        onNavClick={handleScrollToSection}
        activeSection={activeSection}
        cartCount={plannerItems.length}
      />

      {/* Hero Welcome Slide */}
      <section
        id="hero"
        className="relative min-h-[92vh] flex items-center justify-center pt-24 overflow-hidden bg-[#faf6f0]"
      >
        {/* Subtle Luxury Atmospheric Background Panel */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=50"
            alt="Luxurious Spa environment overview"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover blur-xs transition-transform duration-1000"
          />
          {/* Subtle gold overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#faf6f0] via-[#faf6f0]/70 to-[#c5a880]/15" />
        </div>

        {/* Hero content container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-15 text-center space-y-8 mt-6">
          <span className="text-[11px] uppercase tracking-[0.45em] text-[#c5a880] font-semibold flex items-center justify-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a880] animate-pulse" />
            <span>Sculpting Cellular Radiance</span>
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans tracking-tight text-[#1a1c1d] font-light max-w-4xl mx-auto leading-[1.1]">
            Experience Skincare Redefined with{" "}
            <span className="font-extralight italic text-[#c5a880] block mt-1">Hope Aesthetics</span>
          </h1>

          <div className="w-16 h-[1px] bg-[#c5a880] mx-auto" />

          <p className="text-sm md:text-base text-[#1a1c1d]/65 max-w-2xl mx-auto leading-relaxed font-light">
            Indulge in certified medical laser procedures, advanced needle remodeling, and restorative clinical facials custom formulated by Beverly Hills' elite team.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="hero-cta-advisor"
              onClick={() => handleScrollToSection("advisor")}
              className="w-full sm:w-auto bg-[#1a1c1d] hover:bg-[#c5a880] text-[#fdfbf7] text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-sm flex items-center justify-center space-x-2 font-medium"
            >
              <span>Consult AI Skin Expert</span>
              <ArrowRight className="w-4 h-4 text-[#c5a880]" />
            </button>

            <button
              id="hero-cta-treatments"
              onClick={() => handleScrollToSection("treatments")}
              className="w-full sm:w-auto bg-transparent hover:bg-[#1a1c1d]/5 hover:border-[#1a1c1d] text-[#1a1c1d] text-xs uppercase tracking-widest px-8 py-4 rounded-full border border-[#c5a880] transition-all duration-300 font-medium"
            >
              Explore Clinical Rituals
            </button>
          </div>

          {/* Scrolling Down visual Indicator */}
          <div className="pt-12 text-[#1a1c1d]/30 text-[9px] uppercase tracking-[0.3em]">
            scroll down to begin
          </div>
        </div>
      </section>

      {/* Wellness Clinic Specs & Credentials */}
      <section id="features-highlights" className="bg-[#fdfbf7] py-16 border-y border-[#c5a880]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <Award className="w-6 h-6 text-[#c5a880] mx-auto" />
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1a1c1d]">Medical Devices</h4>
            <p className="text-[11px] text-[#1a1c1d]/50 font-light">FDA-approved laser & radiofrequency devices only</p>
          </div>
          <div className="text-center space-y-2 border-l border-[#c5a880]/15">
            <UserCheck className="w-6 h-6 text-[#c5a880] mx-auto" />
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1a1c1d]">Accredited Team</h4>
            <p className="text-[11px] text-[#1a1c1d]/50 font-light">Board-certified dermatologists & master estheticians</p>
          </div>
          <div className="text-center space-y-2 border-l border-[#c5a880]/15">
            <ShieldCheck className="w-6 h-6 text-[#c5a880] mx-auto" />
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1a1c1d]">Cellular Blueprint</h4>
            <p className="text-[11px] text-[#1a1c1d]/50 font-light">No generic layers. Standard customized skin formulas</p>
          </div>
          <div className="text-center space-y-2 border-l border-[#c5a880]/15">
            <Heart className="w-6 h-6 text-[#c5a880] mx-auto" />
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1a1c1d]">Post-Care Sinks</h4>
            <p className="text-[11px] text-[#1a1c1d]/50 font-light">Integrated recovery tracking roadmaps</p>
          </div>
        </div>
      </section>

      {/* Treatment Catalog Explorer Component */}
      <TreatmentExplorer
        plannerItems={plannerItems}
        onAddToPlanner={handleAddToPlanner}
        onRemoveFromPlanner={handleRemoveFromPlanner}
        onBookImmediate={handleBookImmediate}
      />

      {/* Before and After Interactive drag Slider */}
      <BeforeAfterSlider />

      {/* Luxury Virtual Consultation desk backed by server-side Gemini 3.5 */}
      <VirtualConsultation onSuggestTreatment={handleAISuggestTreatment} />

      {/* Skincare Tips / Wisdom Carousel */}
      <section id="skincare-wisdom" className="py-20 bg-[#faf6f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#c5a880] font-semibold">Scientific Education</span>
            <h3 className="text-2xl font-sans tracking-tight text-[#1a1c1d] mt-1">Dermatological Principles</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SKINCARE_TIPS.map((tip, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-3xl border border-[#c5a880]/10 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="bg-[#c5a880]/15 text-[#c5a880] font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                    {tip.tag}
                  </span>
                  <h4 className="text-sm font-semibold text-[#1a1c1d] tracking-tight mt-4 mb-2">
                    {tip.title}
                  </h4>
                  <p className="text-xs text-[#1a1c1d]/60 leading-relaxed font-light">
                    {tip.content}
                  </p>
                </div>
                <div className="pt-4 mt-6 border-t border-[#c5a880]/10 flex items-center justify-between text-[10px] uppercase font-bold text-[#c5a880] tracking-wider cursor-pointer hover:text-[#1a1c1d] transition-colors">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Skincare Planner review bar (sticky helper if planner possesses elements) */}
      {plannerItems.length > 0 && (
        <section
          id="planner"
          className="bg-[#1a1c1d] text-[#fdfbf7] py-6 border-y border-[#c5a880]/15 sticky bottom-0 z-40 shadow-xl transition-all"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <span className="bg-[#c5a880] text-[#1a1c1d] font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center font-mono">
                {plannerItems.length}
              </span>
              <div>
                <span className="text-xs uppercase tracking-widest block font-semibold text-[#c5a880]">Active Aesthetic Plan</span>
                <span className="text-[10px] text-[#fdfbf7]/60 block">
                  {plannerItems.map((item) => item.name.split(" ")[0]).join(", ")} selected. combo bundling active (15% off)!
                </span>
              </div>
            </div>

            <button
              onClick={() => handleScrollToSection("booking")}
              className="bg-[#c5a880] hover:bg-[#b0936b] text-[#1a1c1d] text-[10px] uppercase tracking-widest px-6 py-3 rounded-full font-bold transition-all shadow-sm"
            >
              Secure slot & Redeem bundle savings
            </button>
          </div>
        </section>
      )}

      {/* Clinical Space scheduler & past appointment dashboard */}
      <BookingCalendar
        plannerItems={plannerItems}
        onRemoveFromPlanner={handleRemoveFromPlanner}
        onClearPlanner={handleClearPlanner}
        preSelectedTreatment={preSelectedTreatment}
      />

      {/* Pure Premium Footer */}
      <AestheticAppFooter />
    </div>
  );
}
