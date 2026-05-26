import { ConsultationProfile, ConsultationRecord } from "../types/clinic";
import { useState, useEffect } from "react";
import { Sparkles, Calendar, ArrowRight, User, Settings, CheckCircle, ShieldCheck, RefreshCw, BookOpen, Clock } from "lucide-react";

interface VirtualConsultationProps {
  onSuggestTreatment: (treatmentName: string) => void;
}

export default function VirtualConsultation({ onSuggestTreatment }: VirtualConsultationProps) {
  const [profile, setProfile] = useState<ConsultationProfile>({
    name: "",
    age: "25-34",
    skinType: "Combination",
    concerns: [],
    routine: "Moderate (Cleansing & Moisturizer)",
    sunExposure: "Moderate",
    goals: [],
    message: "",
  });

  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [history, setHistory] = useState<ConsultationRecord[]>([]);
  const [loadingText, setLoadingText] = useState("Dr. Hope is reviewing your epidermal parameters...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hope_skin_consultations");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load consultations diary:", e);
    }
  }, []);

  // Loading text cycler
  useEffect(() => {
    if (!isSubmitting) return;
    const tips = [
      "Dr. Hope is reviewing your epidermal parameters...",
      "Simulating moisture barrier retention curves...",
      "Mapping dermal concerns against clinical lasers...",
      "Formulating custom peptide & acid sequencing schedule...",
      "Polishing your custom luxury skin passport roadmap...",
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % tips.length;
      setLoadingText(tips[index]);
    }, 3500);
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const toggleConcern = (concern: string) => {
    setProfile((prev) => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter((c) => c !== concern)
        : [...prev.concerns, concern],
    }));
  };

  const toggleGoal = (goal: string) => {
    setProfile((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const currentYear = new Date().getFullYear();

  const handleConsultSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to communicate with the virtual consultant.");
      }

      setAnalysisResult(data.analysis);

      // Save to timeline record
      const newRecord: ConsultationRecord = {
        id: `consult-${Date.now()}`,
        timestamp: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        profile: { ...profile },
        analysis: data.analysis,
      };

      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("hope_skin_consultations", JSON.stringify(updatedHistory));
      setActiveStep(4); // show analysis
    } catch (err: any) {
      console.error("Error submitting evaluation:", err);
      setErrorMsg(err.message || "An unexpected issue occurred while contact clinical advisor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPastConsult = (record: ConsultationRecord) => {
    setProfile(record.profile);
    setAnalysisResult(record.analysis);
    setActiveStep(4);
  };

  const handleStartOver = () => {
    setProfile({
      name: "",
      age: "25-34",
      skinType: "Combination",
      concerns: [],
      routine: "Moderate (Cleansing & Moisturizer)",
      sunExposure: "Moderate",
      goals: [],
      message: "",
    });
    setAnalysisResult(null);
    setActiveStep(1);
    setErrorMsg(null);
  };

  // Safe and ultra-gorgeous markdown routine formatter
  const renderFormattedMarkdown = (markdown: string) => {
    const lines = markdown.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Bold titles
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={idx} className="text-sm font-sans font-semibold uppercase tracking-wider text-[#c5a880] mt-6 mb-3">
            {trimmed.replace("###", "").trim()}
          </h4>
        );
      }
      if (trimmed.startsWith("##")) {
        return (
          <h3 key={idx} className="text-base font-sans font-medium text-[#1a1c1d] mt-8 mb-4 border-b border-[#c5a885]/10 pb-2">
            {trimmed.replace("##", "").trim()}
          </h3>
        );
      }
      if (trimmed.startsWith("#")) {
        return (
          <h2 key={idx} className="text-xl font-sans text-[#1a1c1d] tracking-tight mt-10 mb-4 font-normal">
            {trimmed.replace("#", "").trim()}
          </h2>
        );
      }

      // Check bullet items
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const bulletContent = trimmed.slice(1).trim();
        // Check if has bold prefix
        const boldMatch = bulletContent.match(/^\*\*(.*?)\*\*(.*)/);
        if (boldMatch) {
          return (
            <li key={idx} className="list-none text-xs text-[#1a1c1d]/85 mb-2 pl-4 border-l border-[#c5a880]/40 py-0.5 leading-relaxed">
              <strong className="text-[#1a1c1d] font-semibold">{boldMatch[1]}</strong>
              <span>{boldMatch[2]}</span>
            </li>
          );
        }
        return (
          <li key={idx} className="list-none text-xs text-[#1a1c1d]/85 mb-2 pl-4 border-l border-[#c5a880]/30 py-0.5 leading-relaxed">
            {bulletContent}
          </li>
        );
      }

      // Check generic numbered items
      const numMatch = trimmed.match(/^\d+\.\s+(.*)/);
      if (numMatch) {
        const content = numMatch[1];
        const boldMatch = content.match(/^\*\*(.*?)\*\*(.*)/);
        return (
          <div key={idx} className="flex items-start space-x-3 mb-4 bg-[#faf6f0]/50 p-3 rounded-2xl border border-[#c5a880]/10">
            <span className="bg-[#1a1c1d] text-[#fdfbf7] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono">
              {trimmed.match(/^\d+/)?.[0]}
            </span>
            <div className="flex-1 text-xs text-[#1a1c1d]/85 leading-relaxed">
              {boldMatch ? (
                <>
                  <strong className="text-[#1a1c1d] font-semibold block mb-0.5">{boldMatch[1]}</strong>
                  <span>{boldMatch[2]}</span>
                </>
              ) : (
                <span>{content}</span>
              )}
            </div>
          </div>
        );
      }

      // Simple empty line
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      // Line with inline styles
      const parts = [];
      let currentString = trimmed;
      const boldRegex = /\*\*(.*?)\*\*/g;
      let match;
      let lastIndex = 0;

      while ((match = boldRegex.exec(currentString)) !== null) {
        if (match.index > lastIndex) {
          parts.push(currentString.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-semibold text-[#1a1c1d]">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < currentString.length) {
        parts.push(currentString.substring(lastIndex));
      }

      return (
        <p key={idx} className="text-xs text-[#1a1c1d]/75 font-light leading-relaxed mb-4">
          {parts.length > 0 ? parts : trimmed}
        </p>
      );
    });
  };

  const skinTypes = ["Dry", "Oily", "Combination", "Normal", "Sensitive"];
  const skinConcernsList = [
    "Acne & Clogged Pores",
    "Scars & Uneven Texture",
    "Dark spots & Pigmentation",
    "Aging, Fine Lines & Wrinkles",
    "Loss of Firmness & Volume",
    "Redness & Reactive Skin",
  ];
  const skinGoalsList = [
    "Dewy Hydration",
    "Acne Clearing",
    "Texture Smoothing",
    "Hyper-Pigmentation Reduction",
    "Collagen Remodeling & Lift",
    "Soothing Core Protection",
  ];

  return (
    <section id="advisor" className="py-24 bg-[#f4efe6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#c5a880] font-semibold block mb-2">
            AI SKINCARE EXPERT
          </span>
          <h2 className="text-3xl sm:text-4xl font-sans tracking-tight text-[#1a1c1d] mb-4">
            Dr. Hope&rsquo;s Digital Consultation
          </h2>
          <div className="w-12 h-[1px] bg-[#c5a880] mx-auto mb-6" />
          <p className="text-sm text-[#1a1c1d]/60 leading-relaxed font-light">
            Skip general routines. Submit your complex skin traits to our smart medical simulator and instantly receive custom cellular plans, treatment recommendations, and morning/night schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
          {/* History Sidebar / Saved Passports */}
          <div className="lg:col-span-4 bg-[#fdfbf7] p-6 rounded-3xl border border-[#c5a880]/15 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 border-b border-[#c5a880]/10 pb-4">
              <BookOpen className="w-4 h-4 text-[#c5a880]" />
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#1a1c1d]">
                Skin Passport Timeline
              </h3>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-8 text-[#1a1c1d]/40">
                <Clock className="w-6 h-6 mx-auto mb-2 text-[#c5a880]/40" />
                <p className="text-[11px] font-sans uppercase tracking-widest leading-relaxed">
                  Your Digital Consultations Will Appear Here
                </p>
              </div>
            ) : (
              <div id="timeline-list" className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {history.map((record) => (
                  <button
                    key={record.id}
                    id={`past-consult-${record.id}`}
                    onClick={() => handleSelectPastConsult(record)}
                    className="w-full text-left p-3.5 rounded-2xl bg-[#faf6f0] hover:bg-[#c5a880]/10 border border-[#c5a880]/10 hover:border-[#c5a880]/30 transition-all flex items-start gap-3 group"
                  >
                    <User className="w-3.5 h-3.5 text-[#c5a880] mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#1a1c1d] block truncate">
                          {record.profile.name || "Skin Audit Guest"}
                        </span>
                        <span className="text-[10px] text-[#1a1c1d]/40 font-mono">
                          {record.timestamp}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#c5a880] block mt-0.5">
                        Type: {record.profile.skinType}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-[#c5a880]/10 flex flex-col items-stretch">
              <button
                id="btn-start-fresh"
                onClick={handleStartOver}
                className="text-center bg-[#1a1c1d] hover:bg-[#c5a880] text-[#fdfbf7] text-[10px] uppercase tracking-widest py-3 rounded-xl transition-all font-medium"
              >
                Inquire Fresh Audit
              </button>
            </div>
          </div>

          {/* Interactive Flow Container */}
          <div className="lg:col-span-8 bg-[#fdfbf7] p-6 sm:p-10 rounded-3xl border border-[#c5a880]/15 shadow-sm min-h-[500px] flex flex-col justify-between">
            {isSubmitting ? (
              /* High-tech clinical loading animation */
              <div id="consultation-loading" className="flex-1 flex flex-col items-center justify-center text-center py-20 space-y-6">
                <div className="relative w-24 h-24">
                  {/* Outer glowing rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#c5a880]/20 animate-spin" />
                  <div className="absolute -inset-1.5 rounded-full border-2 border-[#1a1c1d]/5 animate-ping" />
                  <div className="absolute inset-4 rounded-full bg-[#1a1c1d] flex items-center justify-center text-[#c5a880]">
                    <RefreshCw className="w-6 h-6 animate-spin spin-slow" />
                  </div>
                </div>
                <div className="space-y-2 max-w-md">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-[#1a1c1d]/60 font-semibold">
                    Clinical Engine Parsing
                  </h4>
                  <p className="text-sm font-light text-[#1a1c1d]/80 leading-relaxed italic">
                    &ldquo;{loadingText}&rdquo;
                  </p>
                </div>
              </div>
            ) : activeStep === 1 ? (
              /* Step 1: Human bio traits */
              <div id="step-1" className="space-y-6">
                <div className="border-b border-[#c5a880]/10 pb-4">
                  <span className="text-[10px] text-[#c5a880] uppercase tracking-widest font-bold">Step 1 of 3</span>
                  <h3 className="text-xl font-sans tracking-tight text-[#1a1c1d] mt-1">Skin & Personal Profile</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#1a1c1d]">Your Name</label>
                    <input
                      id="input-guest-name"
                      type="text"
                      placeholder="e.g. Alexis Quinn"
                      value={profile.name}
                      onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                      className="w-full bg-[#faf6f0] border border-[#c5a880]/10 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] rounded-2xl p-3.5 text-xs focus:outline-none focus:bg-white text-[#1a1c1d]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#1a1c1d]">Age Group</label>
                    <select
                      id="select-age-group"
                      value={profile.age}
                      onChange={(e) => setProfile((p) => ({ ...p, age: e.target.value }))}
                      className="w-full bg-[#faf6f0] border border-[#c5a880]/10 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] rounded-2xl p-3.5 text-xs text-[#1a1c1d] focus:outline-none"
                    >
                      <option>Under 18</option>
                      <option>18-24</option>
                      <option>25-34</option>
                      <option>35-44</option>
                      <option>45-54</option>
                      <option>55+</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#1a1c1d] block">Primary Skin Type</label>
                  <p className="text-[11px] text-[#1a1c1d]/40 mb-2">Select the description that best fits your bare skin after wash:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {skinTypes.map((st) => (
                      <button
                        key={st}
                        id={`skintype-${st}`}
                        onClick={() => setProfile((p) => ({ ...p, skinType: st }))}
                        className={`text-xs p-3 px-4 rounded-xl border text-center transition-all ${
                          profile.skinType === st
                            ? "bg-[#1a1c1d] text-[#fdfbf7] border-[#1a1c1d] font-medium"
                            : "bg-[#faf6f0] text-[#1a1c1d]/85 hover:bg-[#faf6f0]/60 border-[#c5a880]/10"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#c5a880]/10 flex justify-end">
                  <button
                    id="btn-next-step-1"
                    onClick={() => setActiveStep(2)}
                    className="bg-[#1a1c1d] hover:bg-[#c5a880] text-[#fdfbf7] text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-full transition-all flex items-center space-x-2 font-medium"
                  >
                    <span>Analyze Specific Concerns</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : activeStep === 2 ? (
              /* Step 2: Concerns Selector */
              <div id="step-2" className="space-y-6">
                <div className="border-b border-[#c5a880]/10 pb-4">
                  <span className="text-[10px] text-[#c5a880] uppercase tracking-widest font-bold">Step 2 of 3</span>
                  <h3 className="text-xl font-sans tracking-tight text-[#1a1c1d] mt-1">Specific concerns and Sun habits</h3>
                </div>

                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#1a1c1d] block">Skin Concerns (Select all that apply)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {skinConcernsList.map((c) => {
                      const selected = profile.concerns.includes(c);
                      return (
                        <button
                          key={c}
                          id={`concern-btn-${c.replace(/\s+/g, '-')}`}
                          onClick={() => toggleConcern(c)}
                          className={`text-xs p-3.5 text-left rounded-2xl border transition-all flex items-center justify-between ${
                            selected
                              ? "bg-[#c5a880]/10 border-[#c5a880] text-[#1a1c1d] font-semibold"
                              : "bg-[#faf6f0] border-[#c5a880]/10 text-[#1a1c1d]/80 hover:bg-[#faf6f0]/70"
                          }`}
                        >
                          <span>{c}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                            selected ? "bg-[#c5a880] text-[#fdfbf7] border-[#c5a880]" : "border-[#1a1c1d]/20"
                          }`}>
                            {selected && "✓"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#1a1c1d] block">Daily Sun Exposure</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Low (Mostly Indoor)", "Moderate (Short Commute)", "High (Outdoor/Sport)"].map((opt) => (
                      <button
                        key={opt}
                        id={`sun-${opt.substring(0, 3)}`}
                        onClick={() => setProfile((p) => ({ ...p, sunExposure: opt }))}
                        className={`text-[10px] sm:text-xs p-3.5 rounded-xl border text-center transition-all leading-tight ${
                          profile.sunExposure === opt
                            ? "bg-[#1a1c1d] text-[#fdfbf7] border-[#1a1c1d] font-medium"
                            : "bg-[#faf6f0] text-[#1a1c1d]/85 hover:bg-[#faf6f0]/60 border-[#c5a880]/10"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#c5a880]/10 flex items-center justify-between">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-[#1a1c1d]/60 hover:text-[#c5a880] text-xs uppercase tracking-widest font-semibold"
                  >
                    Back
                  </button>

                  <button
                    id="btn-next-step-2"
                    onClick={() => setActiveStep(3)}
                    className="bg-[#1a1c1d] hover:bg-[#c5a880] text-[#fdfbf7] text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-full transition-all flex items-center space-x-2 font-medium"
                  >
                    <span>Define Beauty Goals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : activeStep === 3 ? (
              /* Step 3: Aesthetic Goals & Submission */
              <div id="step-3" className="space-y-6">
                <div className="border-b border-[#c5a880]/10 pb-4">
                  <span className="text-[10px] text-[#c5a880] uppercase tracking-widest font-bold">Step 3 of 3</span>
                  <h3 className="text-xl font-sans tracking-tight text-[#1a1c1d] mt-1">Aesthetic targets & Custom details</h3>
                </div>

                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#1a1c1d] block">Primary Visual Targets</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {skinGoalsList.map((g) => {
                      const selected = profile.goals.includes(g);
                      return (
                        <button
                          key={g}
                          id={`goal-btn-${g.replace(/\s+/g, '-')}`}
                          onClick={() => toggleGoal(g)}
                          className={`text-xs p-3.5 text-left rounded-2xl border transition-all flex items-center justify-between ${
                            selected
                              ? "bg-[#c5a880]/10 border-[#c5a880] text-[#1a1c1d] font-semibold"
                              : "bg-[#faf6f0] border-[#c5a880]/10 text-[#1a1c1d]/85 hover:bg-[#faf6f0]/70"
                          }`}
                        >
                          <span>{g}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                            selected ? "bg-[#c5a880] text-[#fdfbf7] border-[#c5a880]" : "border-[#1a1c1d]/20"
                          }`}>
                            {selected && "✓"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#1a1c1d] block">Additional Skincare Message (Optional)</label>
                  <textarea
                    id="text-custom-skin-msg"
                    rows={3}
                    placeholder="Tell us about active triggers, skincare allergies, or specific laser desires..."
                    value={profile.message}
                    onChange={(e) => setProfile((p) => ({ ...p, message: e.target.value }))}
                    className="w-full bg-[#faf6f0] border border-[#c5a880]/10 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] rounded-2xl p-4 text-xs focus:outline-none focus:bg-white text-[#1a1c1d] resize-none"
                  />
                </div>

                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-2xl mt-4">
                    {errorMsg}
                  </div>
                )}

                <div className="pt-6 border-t border-[#c5a880]/10 flex items-center justify-between">
                  <button
                    onClick={() => setActiveStep(2)}
                    className="text-[#1a1c1d]/60 hover:text-[#c5a880] text-xs uppercase tracking-widest font-semibold"
                  >
                    Back
                  </button>

                  <button
                    id="btn-submit-consultation"
                    onClick={handleConsultSubmit}
                    className="bg-[#c5a880] hover:bg-[#b0936b] text-[#fdfbf7] text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-full transition-all flex items-center space-x-2 font-bold"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Clinical Passport</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Step 4: Display Analysis results with stunning medical grade format */
              <div id="step-4" className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#c5a880]/10 pb-4 gap-4">
                  <div>
                    <span className="text-[10px] text-[#c5a880] uppercase tracking-widest font-bold block">
                      Hope Signature Roadmap
                    </span>
                    <h3 className="text-lg font-sans text-[#1a1c1d]">
                      Prescribed Skincare Diary: {profile.name || "Valued Client"}
                    </h3>
                  </div>

                  <button
                    id="btn-consult-start-over"
                    onClick={handleStartOver}
                    className="text-[10px] uppercase tracking-wider border border-[#c5a880] hover:bg-[#c5a880]/10 text-[#1a1c1d] px-4 py-2 rounded-full transition-colors font-medium cursor-pointer"
                  >
                    Inquire New Audit
                  </button>
                </div>

                {/* Main Prescription Paper */}
                <div className="bg-[#fdfbf7] p-4 sm:p-6 rounded-3xl border border-[#c5a880]/10 max-h-[500px] overflow-y-auto pr-2 space-y-4">
                  {analysisResult ? (
                    <div id="markdown-analysis-render" className="prose max-w-none text-left">
                      {renderFormattedMarkdown(analysisResult)}
                    </div>
                  ) : (
                    <p className="text-xs text-[#1a1c1d]/50 text-center py-10">
                      Empty consultation sheet details. Start a fresh audit now.
                    </p>
                  )}
                </div>

                {/* Recommended treatments quick book suggestions */}
                <div className="bg-[#faf6f0] p-4 rounded-2xl border border-[#c5a880]/15 mt-6">
                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#1a1c1d] mb-2 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
                    <span>Suggested Next Action</span>
                  </h4>
                  <p className="text-xs text-[#1a1c1d]/75 leading-relaxed font-light mb-3">
                    Based on your consultation details, we recommend looking into a clinical consultation in our medical suites. Let&rsquo;s get you scheduled.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onSuggestTreatment("Hope Signature HydraFacial MD")}
                      className="text-[9px] uppercase tracking-wider bg-white border border-[#c5a880]/40 text-[#c5a880] hover:bg-[#faf6f0] px-3.5 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
                    >
                      Signature HydraFacial MD
                    </button>
                    <button
                      onClick={() => onSuggestTreatment("Morpheus8 RF Microneedling")}
                      className="text-[9px] uppercase tracking-wider bg-white border border-[#c5a880]/40 text-[#c5a880] hover:bg-[#faf6f0] px-3.5 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
                    >
                      Morpheus8 Remodeling
                    </button>
                    <button
                      onClick={() => onSuggestTreatment("Clear & Brilliant Laser Laser Reveal")}
                      className="text-[9px] uppercase tracking-wider bg-white border border-[#c5a880]/40 text-[#c5a880] hover:bg-[#faf6f0] px-3.5 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
                    >
                      Clear & Brilliant Laser
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
