import { BEFORE_AFTER_CASES } from "../utils/skincareData";
import { useState, useRef, MouseEvent, TouchEvent } from "react";
import { Sparkles, Calendar, MoveLeft, MoveRight } from "lucide-react";

export default function BeforeAfterSlider() {
  const [activeCase, setActiveCase] = useState(BEFORE_AFTER_CASES[0]);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  };

  return (
    <section id="beforeafter" className="py-24 bg-[#fdfbf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#c5a880] font-semibold block mb-2">
            Proven Outcomes
          </span>
          <h2 className="text-3xl sm:text-4xl font-sans tracking-tight text-[#1a1c1d] mb-4">
            The Mirror of Cellular Renewal
          </h2>
          <div className="w-12 h-[1px] bg-[#c5a880] mx-auto mb-6" />
          <p className="text-sm text-[#1a1c1d]/60 leading-relaxed font-light">
            Slide the elegant dividing line to witness the real-world transformations designed by our medical team. Results are clean, natural, and sustained.
          </p>
        </div>

        {/* Tab Selection */}
        <div id="case-selector-tabs" className="flex justify-center gap-3 mb-12">
          {BEFORE_AFTER_CASES.map((cs) => (
            <button
              key={cs.id}
              onClick={() => {
                setActiveCase(cs);
                setSliderPosition(50);
              }}
              className={`text-xs uppercase tracking-widest px-5 py-3 rounded-full transition-all duration-300 font-medium ${
                activeCase.id === cs.id
                  ? "bg-[#1a1c1d] text-[#fdfbf7] shadow-sm"
                  : "bg-[#faf6f0] text-[#1a1c1d]/75 hover:bg-[#faf6f0]/70 border border-[#c5a880]/10"
              }`}
            >
              {cs.title}
            </button>
          ))}
        </div>

        {/* Interactive Comparison Core */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Card Info */}
          <div className="space-y-6">
            <span className="bg-[#c5a880]/10 text-[#c5a880] text-[10px] uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full font-bold border border-[#c5a880]/15 inline-block">
              {activeCase.timeline}
            </span>
            <h3 className="text-2xl sm:text-3xl font-sans text-[#1a1c1d] tracking-tight leading-tight">
              Bespoke {activeCase.treatment}
            </h3>
            <div className="w-8 h-[1.5px] bg-[#c5a880]" />
            <p className="text-xs text-[#1a1c1d]/50 font-mono tracking-wider">
              Primary Concern Focus: {activeCase.concern}
            </p>
            <p className="text-sm text-[#1a1c1d]/70 leading-relaxed font-light">
              {activeCase.description}
            </p>

            <div className="bg-[#faf6f0] p-6 rounded-3xl border border-[#c5a880]/10 border-dashed text-xs">
              <div className="flex items-center space-x-2 mb-2 text-[#c5a880]">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-semibold uppercase tracking-wider text-[10px]">Senior Esthetician Comment</span>
              </div>
              <p className="text-[#1a1c1d]/70 font-light italic leading-relaxed">
                &ldquo;By combining microthermal restructuring with custom clinical peptides, we observed instant hydration locks that shortened recovery time while magnifying facial contours.&rdquo;
              </p>
            </div>
          </div>

          {/* Interactive Slider */}
          <div className="flex flex-col items-center">
            <div
              id="slider-container"
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchMove={handleTouchMove}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              className="relative select-none overflow-hidden w-full aspect-[4/3] rounded-3xl border border-[#c5a880]/20 shadow-lg bg-[#faf6f0] cursor-ew-resize"
            >
              {/* After Product (Lower Background) */}
              <img
                src={activeCase.afterUrl}
                alt="After treatment clinical result"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute bottom-4 right-4 bg-[#1a1c1d]/70 backdrop-blur-md text-[#fdfbf7] text-[10px] uppercase tracking-widest py-1 px-3.5 rounded-full font-mono font-medium">
                After Therapy
              </div>

              {/* Before Product (Absolute Overlaid with variable clip) */}
              <div
                className="absolute inset-x-0 inset-y-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                {/* Fixed size child matching container helps overlay perfectly */}
                <div className="absolute inset-0 w-[400vw] sm:w-[500px] md:w-[600px] lg:w-[480px] xl:w-[480px] h-full">
                  {/* Since image overflows its cut, it matches the sizing */}
                  <img
                    src={activeCase.beforeUrl}
                    alt="Before treatment skin state"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover rounded-3xl"
                    style={{ width: containerRef.current?.getBoundingClientRect().width }}
                  />
                </div>
                <div className="absolute bottom-4 left-4 bg-red-950/70 backdrop-blur-md text-[#fdfbf7] text-[10px] uppercase tracking-widest py-1 px-3.5 rounded-full font-mono font-medium">
                  Before Therapy
                </div>
              </div>

              {/* Divider Line Bar */}
              <div
                className="absolute inset-y-0 w-0.5 bg-[#c5a880]/80 cursor-ew-resize flex items-center justify-center transition-all"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-[#1a1c1d] border border-[#c5a880] text-[#c5a880] shadow-md flex items-center justify-center -translate-x-1/2 select-none hover:scale-110 active:scale-95 transition-transform">
                  <div className="flex space-x-0.5 pointer-events-none">
                    <MoveLeft className="w-2.5 h-2.5" />
                    <MoveRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Interaction Tooltip Label */}
            <p className="text-[10px] text-[#1a1c1d]/40 font-light uppercase tracking-widest mt-4 flex items-center justify-center space-x-1.5">
              <span>Drag or swipe the central gold circle to compare</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
