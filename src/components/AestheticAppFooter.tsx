import { Mail, Phone, MapPin, Instagram, Sparkles, Star, ShieldAlert } from "lucide-react";

export default function AestheticAppFooter() {
  const socialItems = [
    {
      icon: <Instagram className="w-4 h-4" />,
      href: "https://www.instagram.com/hope_aesthetics_center?igsh=MXQ0Ym5vM3FwbjdrbA==",
      label: "@hope_aesthetics_center",
    },
  ];

  const coreServices = [
    "Signature HydraFacial MD",
    "Morpheus8 Collagen remodeling",
    "Clear & Brilliant Skin Resurfacing",
    "Aesthetic Botox Precisons",
    "Dermal Juvederm Augmentations",
    "Cellular Repair Chemical Peels",
  ];

  return (
    <footer id="app-footer" className="bg-[#1a1c1d] text-[#fdfbf7] border-t border-[#c5a880]/15 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-[#c5a880]/10 pb-16 mb-12">
        {/* Brand Focus */}
        <div className="space-y-4">
          <span className="text-sm font-sans tracking-[0.3em] font-light text-[#fdfbf7]">H O P E</span>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#c5a880] block">Aesthetics Center</span>
          <p className="text-xs text-[#fdfbf7]/60 leading-relaxed font-light">
            An elite clinical space where science meets luxury. Guided by advanced dermal devices, organic cellular biology, and natural outcomes.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            {socialItems.map((social, id) => (
              <a
                key={id}
                href={social.href}
                target="_blank"
                rel="no-referrer noreferrer"
                className="w-8 h-8 rounded-full border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] hover:bg-[#c5a880] hover:text-[#1a1c1d] transition-all"
                title={social.label}
              >
                {social.icon}
              </a>
            ))}
            <span className="text-[11px] text-[#fdfbf7]/50 font-light truncate">@hope_aesthetics_center</span>
          </div>
        </div>

        {/* Dynamic Rituals */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-[#c5a880]">Our Clinical Services</h4>
          <ul className="space-y-2.5">
            {coreServices.map((service, id) => (
              <li key={id} className="text-xs text-[#fdfbf7]/60 font-light hover:text-[#c5a880] transition-colors cursor-pointer">
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* Real Contacts & Local maps */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-[#c5a880]">Clinic Coordinates</h4>
          <ul className="space-y-3.5 text-xs text-[#fdfbf7]/60 font-light">
            <li className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-[#c5a880] mt-0.5 flex-shrink-0" />
              <span>180 Royal Palm Boulevard, Suite 300, Beverly Hills, CA 90210</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
              <span>+1 (310) 555-4673</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
              <span>concierge@hopeaesthetics.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter / Club */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-[#c5a880]">The Luminous Club</h4>
          <p className="text-xs text-[#fdfbf7]/60 leading-relaxed font-light">
            Subscribe to receive priority booking invitations, seasonal retinol secrets, and dynamic aesthetic advice from Dr. Hope.
          </p>
          <div className="flex gap-2">
            <input
              id="newsletter-email-input"
              type="email"
              placeholder="Your email address"
              className="bg-[#242627] border border-[#c5a880]/20 rounded-xl px-3 py-2 text-xs text-[#fdfbf7] placeholder-[#fdfbf7]/40 focus:outline-none focus:border-[#c5a880] w-full"
            />
            <button
              onClick={() => alert("Successfully joined the Luminous Club. Welcome to premium skincare.")}
              className="bg-[#c5a880] hover:bg-[#b0936b] text-[#1a1c1d] px-4 rounded-xl text-xs font-semibold transition-colors"
            >
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Copy & Disclaimers block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#fdfbf7]/40 font-light pt-4 space-y-4 sm:space-y-0">
        <div>
          &copy; {new Date().getFullYear()} Hope Aesthetics Center. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
          <span>&middot;</span>
          <span className="hover:text-white cursor-pointer">Privacy Protocols</span>
          <span>&middot;</span>
          <span className="flex items-center space-x-1 hover:text-white cursor-pointer text-yellow-500/80">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Simulated Medical Content</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
