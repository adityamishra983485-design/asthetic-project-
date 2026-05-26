import { Treatment, Specialist, Appointment } from "../types/clinic";
import { CLINIC_SPECIALISTS, CLINIC_TREATMENTS } from "../utils/skincareData";
import { useState, useEffect, FormEvent } from "react";
import { Calendar, Clock, User, Check, Scissors, AlertCircle, Trash2, ShieldCheck, Tag, Info } from "lucide-react";

interface BookingCalendarProps {
  plannerItems: Treatment[];
  onRemoveFromPlanner: (id: string) => void;
  onClearPlanner: () => void;
  preSelectedTreatment: Treatment | null;
}

export default function BookingCalendar({
  plannerItems,
  onRemoveFromPlanner,
  onClearPlanner,
  preSelectedTreatment,
}: BookingCalendarProps) {
  // Local active bookings list
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist>(CLINIC_SPECIALISTS[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"book" | "manage">("book");

  // Load appointments database
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hope_aesthetics_bookings");
      if (saved) {
        setAppointments(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load appointments:", e);
    }
  }, []);

  // Pre-fill if a treatment was booked directly
  useEffect(() => {
    if (preSelectedTreatment) {
      // already added via App state so we just ensure active Tab is book
      setActiveTab("book");
    }
  }, [preSelectedTreatment]);

  // Available dates (next 10 days starting from today, skipping Sundays)
  const availableDates = (() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      if (nextDate.getDay() !== 0) { // Skip Sunday
        dates.push({
          raw: nextDate.toISOString().split("T")[0],
          formatted: nextDate.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
        });
      }
    }
    return dates;
  })();

  const timeSlots = ["09:00 AM", "10:30 AM", "11:30 AM", "01:30 PM", "03:00 PM", "04:30 PM", "06:00 PM"];

  // Pricing math
  const subTotal = plannerItems.reduce((acc, curr) => acc + curr.estimatedPrice, 0);
  const discountRate = plannerItems.length >= 2 ? 0.15 : 0; // 15% discount for combo planner packages!
  const discountValue = Math.floor(subTotal * discountRate);
  const totalAmount = subTotal - discountValue;

  const handleMakeBooking = (e: FormEvent) => {
    e.preventDefault();
    if (plannerItems.length === 0) {
      alert("Please add at least one clinical treatment to your plan to secure coordinates.");
      return;
    }
    if (!selectedDate) {
      alert("Please select your clinical calendar date.");
      return;
    }
    if (!selectedTimeSlot) {
      alert("Please select a convenient treatment hour slot.");
      return;
    }

    // Capture each treatment as clinical reservations
    const newBookings: Appointment[] = plannerItems.map((item, index) => ({
      id: `booking-${Date.now()}-${index}`,
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
      clientPhone: clientInfo.phone,
      treatmentId: item.id,
      treatmentName: item.name,
      specialistId: selectedSpecialist.id,
      specialistName: selectedSpecialist.name,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      notes: clientInfo.notes,
      status: "confirmed",
      pricePaid: item.estimatedPrice - Math.floor(item.estimatedPrice * discountRate),
    }));

    const updatedAppts = [...newBookings, ...appointments];
    setAppointments(updatedAppts);
    localStorage.setItem("hope_aesthetics_bookings", JSON.stringify(updatedAppts));

    // Clear Form & Planner
    setClientInfo({ name: "", email: "", phone: "", notes: "" });
    setSelectedDate("");
    setSelectedTimeSlot("");
    onClearPlanner();

    setBookingSuccessMsg(`Bespoke session booked successfully for ${newBookings[0].clientName}. Dr. Hope's reception has lock-in your coordinates.`);
    setActiveTab("manage");

    // Clear success banner after 8s
    setTimeout(() => {
      setBookingSuccessMsg(null);
    }, 8000);
  };

  const cancelAppointment = (id: string) => {
    const updated = appointments.map((appt) =>
      appt.id === id ? { ...appt, status: "cancelled" as const } : appt
    );
    setAppointments(updated);
    localStorage.setItem("hope_aesthetics_bookings", JSON.stringify(updated));
  };

  return (
    <section id="booking" className="py-24 bg-[#faf6f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#c5a880] font-semibold block mb-2">
            Secure Consultation
          </span>
          <h2 className="text-3xl sm:text-4xl font-sans tracking-tight text-[#1a1c1d] mb-4">
            Aesthetic Scheduling Suite
          </h2>
          <div className="w-12 h-[1px] bg-[#c5a880] mx-auto mb-6" />
          <p className="text-sm text-[#1a1c1d]/60 leading-relaxed font-light">
            Customize and book clinical sessions with our accredited physicians below. Choose singular treatments or bundle multiple therapies inside your planner to leverage elite savings.
          </p>
        </div>

        {/* Calendar core UI */}
        <div className="max-w-6xl mx-auto bg-[#fdfbf7] rounded-3xl border border-[#c5a880]/15 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Main Action Tabs Sidebar */}
          <div className="lg:col-span-3 bg-[#faf6f0]/60 p-6 border-r border-[#c5a880]/10 space-y-4">
            <button
              id="tab-btn-book"
              onClick={() => setActiveTab("book")}
              className={`w-full text-left p-4 rounded-2xl transition-all font-sans text-xs uppercase tracking-widest flex items-center space-x-3 font-medium ${
                activeTab === "book"
                  ? "bg-[#1a1c1d] text-[#fdfbf7]"
                  : "bg-white hover:bg-white/80 text-[#1a1c1d]/85"
              }`}
            >
              <Calendar className="w-4 h-4 text-[#c5a880]" />
              <span>Register Visit</span>
            </button>

            <button
              id="tab-btn-manage"
              onClick={() => setActiveTab("manage")}
              className={`w-full text-[#1a1c1d] text-left p-4 rounded-2xl transition-all font-sans text-xs uppercase tracking-widest flex items-center justify-between font-medium ${
                activeTab === "manage"
                  ? "bg-[#1a1c1d] text-[#fdfbf7]"
                  : "bg-white hover:bg-white/80 text-[#1a1c1d]/90"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-[#c5a880]" />
                <span>My Appointments</span>
              </div>
              {appointments.filter((a) => a.status === "confirmed").length > 0 && (
                <span className="bg-[#c5a880] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {appointments.filter((a) => a.status === "confirmed").length}
                </span>
              )}
            </button>

            <div className="pt-8 border-t border-[#c5a880]/15 space-y-3">
              <span className="text-[10px] uppercase text-[#1a1c1d]/40 font-semibold tracking-wider block">Specialist Hours</span>
              <div className="text-[11px] space-y-1.5 text-[#1a1c1d]/65 font-light">
                <p>Mon &ndash; Fri: 08:30 AM &ndash; 07:30 PM</p>
                <p>Saturday: 09:00 AM &ndash; 05:00 PM</p>
                <p className="text-[#c5a880]" >Sunday: Closed (In-suite sterilization)</p>
              </div>
            </div>
          </div>

          {/* Action Center Content desk */}
          <div className="lg:col-span-9 p-6 sm:p-10">
            {bookingSuccessMsg && (
              <div className="bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#1a1c1d] p-4 rounded-2xl text-xs mb-6 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-[#c5a880] flex-shrink-0 mt-0.5" />
                <span>{bookingSuccessMsg}</span>
              </div>
            )}

            {activeTab === "book" ? (
              <form onSubmit={handleMakeBooking} className="space-y-8">
                {/* 1. Chosen Treatment Plan items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#c5a880]/10 pb-2">
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-[#1a1c1d] flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>1. Your Custom Treatment Plan</span>
                    </h3>
                    {plannerItems.length > 0 && (
                      <button
                        type="button"
                        onClick={onClearPlanner}
                        className="text-[9px] uppercase tracking-wider text-red-700/80 hover:text-red-700 font-semibold"
                      >
                        Reset Stack
                      </button>
                    )}
                  </div>

                  {plannerItems.length === 0 ? (
                    <div className="bg-[#faf6f0]/50 border border-dashed border-[#c5a880]/15 p-6 rounded-2xl text-center">
                      <p className="text-xs text-[#1a1c1d]/50 italic">
                        No clinical sessions selected. Please choose treatments in the grid catalog or submit a diagnostic form.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {plannerItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-[#c5a880]/10 text-xs shadow-xs"
                        >
                          <div className="flex items-center space-x-3">
                            <Check className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                            <div>
                              <span className="font-semibold text-[#1a1c1d]">{item.name}</span>
                              <span className="text-[10px] text-[#1a1c1d]/40 block">{item.duration} &bull; Downtime: {item.downtime}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-mono text-[#1a1c1d]/80">${item.estimatedPrice}</span>
                            <button
                              type="button"
                              onClick={() => onRemoveFromPlanner(item.id)}
                              className="text-red-700/60 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Package Math Footer inside the booking checkout */}
                      <div className="bg-[#faf6f0] p-4 rounded-2xl border border-[#c5a880]/15 space-y-2 text-xs">
                        <div className="flex justify-between text-[#1a1c1d]/60">
                          <span>Subtotal Estimated:</span>
                          <span className="font-mono">${subTotal}</span>
                        </div>
                        {discountValue > 0 && (
                          <div className="flex justify-between text-[#c5a880]">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Info className="w-3 h-3" />
                              Multi-Treatment Bundle Savings (15%):
                            </span>
                            <span className="font-mono font-semibold">-${discountValue}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm border-t border-[#c5a880]/10 pt-2 font-semibold text-[#1a1c1d]">
                          <span>Consolidated Investment:</span>
                          <span className="font-mono text-[#c5a880]">${totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Choose Clinical Specialist */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-[#1a1c1d] border-b border-[#c5a880]/10 pb-2">
                    2. Select Resident Medical Specialist
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {CLINIC_SPECIALISTS.map((specialist) => (
                      <button
                        key={specialist.id}
                        type="button"
                        id={`specialist-select-${specialist.id}`}
                        onClick={() => setSelectedSpecialist(specialist)}
                        className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between h-40 ${
                          selectedSpecialist.id === specialist.id
                            ? "bg-[#1a1c1d] text-[#fdfbf7] border-[#1a1c1d] shadow-sm"
                            : "bg-white border-[#c5a880]/10 text-[#1a1c1d] hover:bg-[#faf6f0]"
                        }`}
                      >
                        <div>
                          <span className={`text-[10px] tracking-wider uppercase font-bold block ${
                            selectedSpecialist.id === specialist.id ? "text-[#c5a880]" : "text-[#1a1c1d]/40"
                          }`}>
                            {specialist.role.split(" &")[0]}
                          </span>
                          <span className="font-sans text-xs font-semibold block mt-1">{specialist.name}</span>
                          <p className={`text-[10px] mt-2 leading-snug line-clamp-3 font-light ${
                            selectedSpecialist.id === specialist.id ? "text-[#fdfbf7]/80" : "text-[#1a1c1d]/60"
                          }`}>
                            {specialist.bio}
                          </p>
                        </div>
                        <span className={`text-[9px] uppercase tracking-wider block font-semibold ${
                          selectedSpecialist.id === specialist.id ? "text-[#c5a880]" : "text-[#1a1c1d]/40"
                        }`}>
                          Avail: {specialist.availability.slice(0, 3).join(", ")}...
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Slot Schedule picker */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Calendar Dates */}
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#1a1c1d] block">
                      3. Pick Medical Date
                    </label>
                    <div className="grid grid-cols-2 gap-2 h-44 overflow-y-auto pr-1">
                      {availableDates.map((d) => (
                        <button
                          key={d.raw}
                          type="button"
                          id={`date-slot-${d.raw}`}
                          onClick={() => setSelectedDate(d.raw)}
                          className={`p-3 text-xs rounded-xl border text-center transition-all ${
                            selectedDate === d.raw
                              ? "bg-[#1a1c1d] text-[#fdfbf7] border-[#1a1c1d] font-semibold"
                              : "bg-white border-[#c5a880]/10 text-[#1a1c1d]/85 hover:bg-[#faf6f0]"
                          }`}
                        >
                          {d.formatted}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hour slots */}
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#1a1c1d] block">
                      4. Choose Treatment Hour
                    </label>
                    <div className="grid grid-cols-2 gap-2 h-44 overflow-y-auto pr-1">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          id={`time-slot-${slot.replace(/\s+/g, '-')}`}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`p-3 text-xs rounded-xl border text-center transition-all ${
                            selectedTimeSlot === slot
                              ? "bg-[#1a1c1d] text-[#fdfbf7] border-[#1a1c1d] font-semibold"
                              : "bg-white border-[#c5a880]/10 text-[#1a1c1d]/85 hover:bg-[#faf6f0]"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Patient Coordinates fields */}
                <div className="space-y-4 pt-4 border-t border-[#c5a880]/15">
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-[#1a1c1d]">
                    5. Patient Authentication Info
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#1a1c1d]/60">Full Name</label>
                      <input
                        id="form-client-name"
                        type="text"
                        required
                        placeholder="Alexis Quinn"
                        value={clientInfo.name}
                        onChange={(e) => setClientInfo((c) => ({ ...c, name: e.target.value }))}
                        className="w-full bg-white border border-[#c5a880]/20 rounded-xl p-3 text-xs text-[#1a1c1d] focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#1a1c1d]/60">Email Address</label>
                      <input
                        id="form-client-email"
                        type="email"
                        required
                        placeholder="alexis.quinn@domain.com"
                        value={clientInfo.email}
                        onChange={(e) => setClientInfo((c) => ({ ...c, email: e.target.value }))}
                        className="w-full bg-white border border-[#c5a880]/20 rounded-xl p-3 text-xs text-[#1a1c1d] focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#1a1c1d]/60">Phone Contact</label>
                      <input
                        id="form-client-phone"
                        type="tel"
                        required
                        placeholder="+1 (555) 394-8239"
                        value={clientInfo.phone}
                        onChange={(e) => setClientInfo((c) => ({ ...c, phone: e.target.value }))}
                        className="w-full bg-white border border-[#c5a880]/20 rounded-xl p-3 text-xs text-[#1a1c1d] focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#1a1c1d]/60">Physiological/Anatomical Notes</label>
                    <textarea
                      id="form-client-notes"
                      rows={2}
                      placeholder="Specify dermal allergens or cosmetic treatment history info..."
                      value={clientInfo.notes}
                      onChange={(e) => setClientInfo((c) => ({ ...c, notes: e.target.value }))}
                      className="w-full bg-white border border-[#c5a880]/20 rounded-xl p-3.5 text-xs text-[#1a1c1d] focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Final Submit CTA */}
                <div className="pt-6 flex justify-end">
                  <button
                    id="btn-confirm-checkout-booking"
                    type="submit"
                    className="w-full sm:w-auto bg-[#c5a880] hover:bg-[#b0936b] text-[#fdfbf7] text-xs uppercase tracking-widest px-8 py-4 rounded-full font-bold transition-all shadow-sm shadow-[#c5a880]/15"
                  >
                    Confirm Medical Space Reservation
                  </button>
                </div>
              </form>
            ) : (
              /* Manage bookings view */
              <div id="booking-manage-pane" className="space-y-6">
                <div className="border-b border-[#c5a880]/10 pb-4">
                  <h3 className="text-xl font-sans tracking-tight text-[#1a1c1d]">Your Clinic Reservation History</h3>
                  <p className="text-xs text-[#1a1c1d]/50 font-light mt-0.5">Manage details or verify status locks directly.</p>
                </div>

                {appointments.length === 0 ? (
                  <div className="text-center py-16 bg-[#faf6f0]/50 border border-dashed border-[#c5a880]/15 p-6 rounded-2xl">
                    <AlertCircle className="w-8 h-8 text-[#c5a880]/40 mx-auto mb-2" />
                    <p className="text-xs text-[#1a1c1d]/50 italic">
                      No medical space reservations found. Secure coordinates inside the calendar tab.
                    </p>
                  </div>
                ) : (
                  <div id="booking-ledger-items" className="space-y-4">
                    {appointments.map((appt) => (
                      <div
                        key={appt.id}
                        className="bg-white p-5 rounded-3xl border border-[#c5a880]/15 shadow-sm flex flex-col md:flex-row justify-between gap-4"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className={`p-4 rounded-2xl flex items-center justify-center ${
                            appt.status === "confirmed" ? "bg-[#c5a880]/10 text-[#c5a880]" : "bg-red-50 text-red-700"
                          }`}>
                            <Calendar className="w-6 h-6" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-sans text-sm font-semibold text-[#1a1c1d]">{appt.treatmentName}</span>
                              <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                                appt.status === "confirmed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                              }`}>
                                {appt.status}
                              </span>
                            </div>
                            <p className="text-xs text-[#1a1c1d]/60 font-light">With specialist: {appt.specialistName}</p>
                            <div className="flex items-center space-x-2.5 text-[11px] text-[#1a1c1d]/40 font-mono">
                              <span>Date: {appt.date}</span>
                              <span>&bull;</span>
                              <span>Hour: {appt.timeSlot}</span>
                              <span>&bull;</span>
                              <span>Est Invoice: ${appt.pricePaid}</span>
                            </div>
                          </div>
                        </div>

                        {appt.status === "confirmed" && (
                          <div className="flex items-center justify-end">
                            <button
                              id={`cancel-appt-btn-${appt.id}`}
                              onClick={() => cancelAppointment(appt.id)}
                              className="text-xs text-red-700/60 hover:text-red-700 font-bold border border-red-200/50 hover:bg-red-50/50 px-4 py-2.5 rounded-xl transition-all font-sans tracking-wider uppercase col-span-3 block"
                            >
                              Cancel Booking
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
