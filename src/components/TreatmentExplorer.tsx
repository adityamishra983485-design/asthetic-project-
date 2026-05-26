import { Treatment } from "../types/clinic";
import { CLINIC_TREATMENTS } from "../utils/skincareData";
import { useState, useMemo } from "react";
import { Search, Filter, Sparkles, Plus, Check, Clock, Eye, AlertTriangle } from "lucide-react";

interface TreatmentExplorerProps {
  plannerItems: Treatment[];
  onAddToPlanner: (treatment: Treatment) => void;
  onRemoveFromPlanner: (id: string) => void;
  onBookImmediate: (treatment: Treatment) => void;
}

export default function TreatmentExplorer({
  plannerItems,
  onAddToPlanner,
  onRemoveFromPlanner,
  onBookImmediate,
}: TreatmentExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedConcern, setSelectedConcern] = useState<string>("all");
  const [focusedTreatment, setFocusedTreatment] = useState<Treatment | null>(null);

  const concernsList = useMemo(() => {
    const list = new Set<string>();
    CLINIC_TREATMENTS.forEach((t) => t.concerns.forEach((c) => list.add(c)));
    return ["all", ...Array.from(list)];
  }, []);

  const categories = [
    { value: "all", label: "All Treatments" },
    { value: "facial", label: "Skin Facials" },
    { value: "laser", label: "Laser & RF Devices" },
    { value: "injectable", label: "Injectables & Fillers" },
    { value: "peel", label: "Clinical Peels" },
  ];

  const filteredTreatments = useMemo(() => {
    return CLINIC_TREATMENTS.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tagline.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === "all" || t.category === selectedCategory;
      const matchConcern = selectedConcern === "all" || t.concerns.includes(selectedConcern);

      return matchSearch && matchCategory && matchConcern;
    });
  }, [searchQuery, selectedCategory, selectedConcern]);

  const isInPlanner = (id: string) => {
    return plannerItems.some((item) => item.id === id);
  };

  const handlePlannerToggle = (treatment: Treatment) => {
    if (isInPlanner(treatment.id)) {
      onRemoveFromPlanner(treatment.id);
    } else {
      onAddToPlanner(treatment);
    }
  };

  return (
    <section id="treatments" className="py-24 bg-[#faf6f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div id="treatments-header" className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#c5a880] font-semibold block mb-2">
            Clinical Catalog
          </span>
          <h2 className="text-3xl sm:text-4xl font-sans tracking-tight text-[#1a1c1d] mb-4">
            Curated Skin & Laser Rituals
          </h2>
          <div className="w-12 h-[1px] bg-[#c5a880] mx-auto mb-6" />
          <p className="text-sm text-[#1a1c1d]/60 leading-relaxed font-light">
            Each formula and laser frequency is custom tailored to cellular renewal and high-end elegance. Browse our selection and plan your aesthetic journey.
          </p>
        </div>

        {/* Filter Bar Grid */}
        <div id="filter-controls" className="bg-[#fdfbf7] p-4 sm:p-6 rounded-3xl border border-[#c5a880]/15 shadow-sm max-w-5xl mx-auto mb-12 flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1c1d]/40" />
            <input
              id="treatment-search-input"
              type="text"
              placeholder="Search treatments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#faf6f0] border border-[#c5a880]/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#1a1c1d] placeholder-[#1a1c1d]/40 focus:outline-none focus:border-[#c5a880] transition-colors"
            />
          </div>

          {/* Quick Category Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.value}
                id={`cat-filter-${cat.value}`}
                onClick={() => setSelectedCategory(cat.value)}
                className={`text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-full transition-all duration-350 font-medium ${
                  selectedCategory === cat.value
                    ? "bg-[#1a1c1d] text-[#fdfbf7]"
                    : "bg-[#faf6f0] text-[#1a1c1d]/75 hover:bg-[#faf6f0]/50 border border-[#c5a880]/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Concerns Selector */}
          <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
            <Filter className="w-3.5 h-3.5 text-[#c5a880]" />
            <select
              id="concern-filter-dropdown"
              value={selectedConcern}
              onChange={(e) => setSelectedConcern(e.target.value)}
              className="bg-[#faf6f0] border border-[#c5a880]/20 rounded-2xl px-3 py-2 text-xs text-[#1a1c1d] focus:outline-none focus:border-[#c5a880]"
            >
              <option value="all">Target Skin Concern</option>
              {concernsList.filter((c) => c !== "all").map((concern) => (
                <option key={concern} value={concern}>
                  {concern}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredTreatments.length === 0 ? (
          <div className="text-center py-16 bg-[#fdfbf7] rounded-3xl border border-[#c5a880]/10 max-w-lg mx-auto">
            <Sparkles className="w-8 h-8 text-[#c5a880]/50 mx-auto mb-3" />
            <p className="text-xs uppercase tracking-widest text-[#1a1c1d]/60 font-medium font-sans">
              No matching clinical treatments found
            </p>
            <p className="text-[11px] text-[#1a1c1d]/40 mt-1">
              Try adjusting your search queries or category filters.
            </p>
          </div>
        ) : (
          <div id="treatments-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTreatments.map((treatment) => {
              const inCart = isInPlanner(treatment.id);
              return (
                <article
                  key={treatment.id}
                  id={`treatment-card-${treatment.id}`}
                  className="bg-[#fdfbf7] rounded-3xl border border-[#c5a880]/15 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  {/* Photo Head */}
                  <div className="relative h-56 overflow-hidden bg-[#faf6f0]">
                    <img
                      src={treatment.imageUrl}
                      alt={treatment.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 bg-[#fdfbf7]/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-semibold text-[#c5a880] border border-[#c5a880]/20">
                      {treatment.category}
                    </span>
                    <span className="absolute bottom-4 right-4 bg-[#1a1c1d]/85 text-[#fdfbf7] px-3 py-1 rounded-full text-[10px] font-mono tracking-widest">
                      ${treatment.estimatedPrice} est.
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-sans text-[#1a1c1d] font-normal leading-tight tracking-tight mb-1">
                        {treatment.name}
                      </h3>
                      <p className="text-[10px] text-[#c5a880] uppercase tracking-wider font-medium mb-3">
                        {treatment.tagline}
                      </p>
                      <p className="text-xs text-[#1a1c1d]/75 font-light leading-relaxed mb-4">
                        {treatment.description}
                      </p>

                      {/* Info Pills */}
                      <div className="grid grid-cols-2 gap-2 bg-[#faf6f0]/60 p-3 rounded-2xl mb-4 text-[11px]">
                        <div className="flex items-center space-x-1.5 text-[#1a1c1d]/70">
                          <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
                          <span>{treatment.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[#1a1c1d]/70">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#c5a880]" />
                          <span>Downtime: {treatment.downtime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Panel */}
                    <div className="pt-4 border-t border-[#c5a880]/10 flex items-center justify-between gap-2 mt-4">
                      <button
                        id={`btn-view-details-${treatment.id}`}
                        onClick={() => setFocusedTreatment(treatment)}
                        className="flex items-center space-x-1.5 text-[10px] uppercase tracking-wider text-[#1a1c1d]/80 hover:text-[#c5a880] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          id={`btn-toggle-cart-${treatment.id}`}
                          onClick={() => handlePlannerToggle(treatment)}
                          className={`p-2 rounded-full border transition-all duration-300 flex items-center justify-center ${
                            inCart
                              ? "bg-[#c5a880]/15 border-[#c5a880] text-[#c5a880]"
                              : "border-[#c5a880]/30 hover:border-[#c5a880] text-[#1a1c1d]/60 hover:text-[#c5a880]"
                          }`}
                          title={inCart ? "Remove from treatment planer" : "Add to treatment planner"}
                        >
                          {inCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>

                        <button
                          id={`btn-book-direct-${treatment.id}`}
                          onClick={() => onBookImmediate(treatment)}
                          className="bg-[#1a1c1d] hover:bg-[#c5a880] text-[#fdfbf7] text-[10px] uppercase tracking-widest px-3.5 py-2.5 rounded-xl transition-all duration-300"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Dialog Modal */}
      {focusedTreatment && (
        <div className="fixed inset-0 bg-[#1a1c1d]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div
            id="treatment-detail-modal"
            className="bg-[#fdfbf7] rounded-3xl border border-[#c5a880]/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
          >
            <button
              onClick={() => setFocusedTreatment(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#faf6f0] text-[#1a1c1d]/60 transition-colors"
            >
              <Check className="w-5 h-5 hidden" />
              <span className="text-xs uppercase tracking-widest font-mono">X Close</span>
            </button>

            <div className="p-6 sm:p-8">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#c5a880] font-bold">
                {focusedTreatment.category} therapy
              </span>
              <h3 className="text-2xl font-sans tracking-tight text-[#1a1c1d] mt-1 mb-2">
                {focusedTreatment.name}
              </h3>
              <p className="text-xs italic text-[#c5a880] mb-6">{focusedTreatment.tagline}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-semibold text-[#1a1c1d] mb-3">
                    Overview and Protocol
                  </h4>
                  <p className="text-xs text-[#1a1c1d]/70 leading-relaxed font-light mb-4">
                    {focusedTreatment.description}
                  </p>

                  <h4 className="text-xs uppercase tracking-widest font-semibold text-[#1a1c1d] mb-2">
                    Key Clinical Benefits
                  </h4>
                  <ul className="space-y-2">
                    {focusedTreatment.benefits.map((b, idx) => (
                      <li key={idx} className="text-xs text-[#1a1c1d]/85 flex items-start space-x-2">
                        <span className="text-[#c5a880] mt-0.5">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#faf6f0] p-4 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-semibold text-[#1a1c1d] mb-4">
                      Clinical Parameters
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs border-b border-[#c5a880]/10 pb-2">
                        <span className="text-[#1a1c1d]/60">Treatment Duration:</span>
                        <span className="font-semibold text-[#1a1c1d]">{focusedTreatment.duration}</span>
                      </div>
                      <div className="flex justify-between text-xs border-b border-[#c5a880]/10 pb-2">
                        <span className="text-[#1a1c1d]/60">Downtime Indicator:</span>
                        <span className="font-semibold text-[#1a1c1d]">{focusedTreatment.downtime}</span>
                      </div>
                      <div className="flex justify-between text-xs border-b border-[#c5a880]/10 pb-2">
                        <span className="text-[#1a1c1d]/60">Sensory Pain Scale:</span>
                        <span className="font-semibold text-[#1a1c1d]">{focusedTreatment.painLevel}</span>
                      </div>
                      <div className="flex justify-between text-xs pb-1">
                        <span className="text-[#1a1c1d]/60">Expected Cost:</span>
                        <span className="font-semibold text-[#1a1c1d]">{focusedTreatment.priceRange} (${focusedTreatment.estimatedPrice})</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-2">
                    <button
                      onClick={() => {
                        handlePlannerToggle(focusedTreatment);
                        setFocusedTreatment(null);
                      }}
                      className="flex-1 text-center border border-[#c5a880] hover:bg-[#c5a880]/10 text-[#1a1c1d] text-xs uppercase tracking-widest py-3 rounded-full transition-colors"
                    >
                      {isInPlanner(focusedTreatment.id) ? "Remove from Plan" : "Add to Skin Plan"}
                    </button>
                    <button
                      onClick={() => {
                        onBookImmediate(focusedTreatment);
                        setFocusedTreatment(null);
                      }}
                      className="flex-1 text-center bg-[#1a1c1d] hover:bg-[#c5a880] text-[#fdfbf7] text-xs uppercase tracking-widest py-3 rounded-full transition-colors"
                    >
                      Book Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
