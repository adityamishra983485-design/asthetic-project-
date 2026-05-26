export interface Treatment {
  id: string;
  name: string;
  category: "laser" | "injectable" | "facial" | "peel" | "body";
  tagline: string;
  description: string;
  benefits: string[];
  duration: string; // e.g. "45 Mins"
  painLevel: "None" | "Mild" | "Moderate" | "Varies";
  downtime: string; // e.g. "None", "1-2 Days"
  priceRange: string; // e.g. "$$$", "$$$$"
  estimatedPrice: number;
  imageUrl: string;
  concerns: string[]; // skin concerns this target
}

export interface Specialist {
  id: string;
  name: string;
  role: string;
  bio: string;
  specialty: string[];
  imageUrl: string;
  availability: string[]; // days of week
}

export interface ConsultationProfile {
  name: string;
  age: string;
  skinType: string;
  concerns: string[];
  routine: string;
  sunExposure: string;
  goals: string[];
  message: string;
}

export interface ConsultationRecord {
  id: string;
  timestamp: string;
  profile: ConsultationProfile;
  analysis: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  treatmentId: string;
  treatmentName: string;
  specialistId: string;
  specialistName: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: "confirmed" | "cancelled";
  pricePaid: number;
}

export interface BeforeAfterCase {
  id: string;
  title: string;
  treatment: string;
  concern: string;
  timeline: string; // e.g. "After 3 sessions"
  beforeUrl: string;
  afterUrl: string;
  description: string;
}
