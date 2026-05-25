"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CONTAINER = "mx-auto w-full px-6" as const;
const MAX_W = { maxWidth: 1100 } as const;

interface FAQItem {
  question: string;
  answer: string;
}

const FAQs: FAQItem[] = [
  {
    question: "How quickly will a mechanic arrive?",
    answer: "On average, a matched mechanic arrives at your location within 15 to 30 minutes. This timeline depends on traffic, weather conditions, and how close you are to the nearest active mechanic."
  },
  {
    question: "How are roadside service rates calculated?",
    answer: "Mech-Mate promotes full price transparency. You will be quoted a base dispatch fee of $49, and your mechanic will provide a breakdown of parts and labor on-screen. You approve the cost before any work begins."
  },
  {
    question: "What qualifications do Mech-Mate mechanics have?",
    answer: "All technicians on our platform undergo a background check, manual identity check, and qualification verification (ASE or equivalent automotive certifications). They must maintain a high rating from motorists to remain active."
  },
  {
    question: "Is cash accepted for payments?",
    answer: "To ensure safety and speed, Mech-Mate operates a 100% cashless, digital system. You pay securely via the app using credit/debit cards or mobile wallets once the mechanic completes the repair."
  }
];

export default function Contact() {
  const router = useRouter();
  
  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // FAQ Accordion State
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Simple validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMsg("All fields are required. Please fill in all fields.");
      return;
    }

    setLoading(true);

    // Simulate API Submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Geist Sans', Arial, sans-serif", overflowX: "hidden", minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fafafa" }}>

      {/* ===== NAVBAR ===== */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "#fff", borderBottom: "1px solid #f3f4f6", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", height: 64 }}>
        <div className={CONTAINER} style={{ ...MAX_W, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", color: "#b91c1c", textDecoration: "none" }}>MECH-MATE</Link>
          <nav>
            <ul style={{ display: "flex", alignItems: "center", gap: 32, listStyle: "none", margin: 0, padding: 0 }}>
              <li>
                <Link href="/" style={{ textDecoration: "none", fontSize: 14, fontWeight: 500, color: "#374151" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#b91c1c")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
                >Home</Link>
              </li>
              <li>
                <Link href="/how-it-works" style={{ textDecoration: "none", fontSize: 14, fontWeight: 500, color: "#374151" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#b91c1c")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
                >How it works</Link>
              </li>
              <li>
                <Link href="/contact" style={{ textDecoration: "none", fontSize: 14, fontWeight: 700, color: "#b91c1c" }}>Contact</Link>
              </li>
            </ul>
          </nav>
          <button
            onClick={() => router.push("/login")}
            className="bg-red-700 hover:bg-red-800 text-white rounded-lg border-none cursor-pointer active:scale-95 transition-all duration-200"
            style={{ padding: "10px 22px", fontSize: 13, fontWeight: 700, letterSpacing: "0.03em" }}
          >Sign In</button>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section style={{ paddingTop: 130, paddingBottom: 60, background: "linear-gradient(180deg, #fdf2f2 0%, #fafafa 100%)", textAlign: "center" }}>
        <div className={CONTAINER} style={{ ...MAX_W, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(185, 28, 28, 0.08)", color: "#b91c1c", padding: "6px 16px", borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 20 }}>
            Get In Touch
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, color: "#111827", lineHeight: 1.15, marginBottom: 18, letterSpacing: "-0.03em" }}>
            Contact Our Support Team
          </h1>
          <p style={{ fontSize: 16, color: "#4b5563", marginBottom: 10, lineHeight: 1.6, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
            Have questions about our service, dispatching, or want to partner with us? Our customer happiness and dispatch operations team are available 24/7.
          </p>
        </div>
      </section>

      {/* ===== CONTACT MAIN CONTENT ===== */}
      <main style={{ flexGrow: 1, paddingBottom: 80 }}>
        <div className={CONTAINER} style={{ ...MAX_W, margin: "0 auto" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 48, alignItems: "start" }} className="flex flex-col md:grid">
            
            {/* LEFT COLUMN: CONTACT DETAILS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", letterSpacing: "-0.01em", marginBottom: 8 }}>Contact Information</h2>
              
              {/* Emergency Hotline */}
              <div style={{ background: "#fff", border: "1px solid #f3f4f6", borderRadius: 18, padding: 24, display: "flex", gap: 18, boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fef2f2", color: "#b91c1c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>call</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>24/7 Dispatch Hotline</h3>
                  <a href="tel:18005556324" style={{ fontSize: 18, fontWeight: 800, color: "#b91c1c", textDecoration: "none" }}>1-800-555-MECH</a>
                  <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>For immediate roadside assistance and real-time dispatcher matching only.</p>
                </div>
              </div>

              {/* Email Support */}
              <div style={{ background: "#fff", border: "1px solid #f3f4f6", borderRadius: 18, padding: 24, display: "flex", gap: 18, boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#eff6ff", color: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>mail</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>General Support Email</h3>
                  <a href="mailto:support@mechmate.com" style={{ fontSize: 15, fontWeight: 600, color: "#111827", textDecoration: "none" }} className="hover:text-red-700 transition-colors">support@mechmate.com</a>
                  <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>For account queries, partnership requests, feedback, or mechanic registration support.</p>
                </div>
              </div>

              {/* Head Office */}
              <div style={{ background: "#fff", border: "1px solid #f3f4f6", borderRadius: 18, padding: 24, display: "flex", gap: 18, boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0fdf4", color: "#15803d", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>location_on</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Corporate Headquarters</h3>
                  <p style={{ fontSize: 14, color: "#4b5563", fontWeight: 500 }}>100 Tech Venture Way, Suite 400</p>
                  <p style={{ fontSize: 14, color: "#4b5563", fontWeight: 500 }}>San Francisco, CA 94107</p>
                  <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Mon-Fri, 9:00 AM to 6:00 PM PST (Appointments required).</p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: INTERACTIVE FORM */}
            <div style={{ background: "#fff", border: "1px solid #f3f4f6", borderRadius: 24, padding: "36px 32px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
              {submitted ? (
                // SUCCESS SCREEN
                <div style={{ textAlign: "center", padding: "40px 10px" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#d1fae5", color: "#065f46", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 36 }}>done_all</span>
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: "#111827", marginBottom: 12 }}>Message Sent Successfully!</h3>
                  <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.6, marginBottom: 28, maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>
                    Thank you for contacting us. A support representative will review your message and reply via email within 2-4 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-red-700 hover:bg-red-800 text-white rounded-lg border-none cursor-pointer font-bold active:scale-95 transition-all duration-200"
                    style={{ padding: "12px 24px", fontSize: 13 }}
                  >Send Another Message</button>
                </div>
              ) : (
                // FORM PANEL
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", letterSpacing: "-0.01em", marginBottom: 4 }}>Send Us a Message</h2>
                    <p style={{ fontSize: 13, color: "#6b7280" }}>Fill in the details below and we will get back to you shortly.</p>
                  </div>

                  {errorMsg && (
                    <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                      {errorMsg}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 16 }} className="flex-col sm:flex-row">
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        style={{ width: "100%", background: "#f9fafb", border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", transition: "border 0.2s" }}
                        className="focus:border-red-600 focus:ring-1 focus:ring-red-600"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        style={{ width: "100%", background: "#f9fafb", border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", transition: "border 0.2s" }}
                        className="focus:border-red-600 focus:ring-1 focus:ring-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                      style={{ width: "100%", background: "#f9fafb", border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", transition: "border 0.2s" }}
                      className="focus:border-red-600 focus:ring-1 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Your Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Type your questions or comments here..."
                      style={{ width: "100%", background: "#f9fafb", border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", transition: "border 0.2s", resize: "vertical" }}
                      className="focus:border-red-600 focus:ring-1 focus:ring-red-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-700 hover:bg-red-800 text-white rounded-lg border-none cursor-pointer font-bold active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-8"
                    style={{ padding: "14px 28px", fontSize: 13, letterSpacing: "0.5px", textTransform: "uppercase" }}
                  >
                    {loading ? (
                      <>
                        <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                        Sending...
                      </>
                    ) : "Send Message"}
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* ===== FAQ SECTION ===== */}
          <div style={{ marginTop: 90, borderTop: "1px solid #e5e7eb", paddingTop: 60 }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#b91c1c", marginBottom: 8 }}>Got Questions?</p>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: "#111827", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
            </div>
            
            <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
              {FAQs.map((faq, index) => {
                const isOpen = openFAQIndex === index;
                return (
                  <div
                    key={index}
                    style={{ background: "#fff", border: "1px solid #f3f4f6", borderRadius: 14, overflow: "hidden", transition: "all 0.2s" }}
                    className="hover:border-gray-300"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        padding: "20px 24px",
                        textAlign: "left",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        outline: "none"
                      }}
                    >
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{faq.question}</span>
                      <span
                        className="material-symbols-outlined text-gray-500"
                        style={{
                          fontSize: 20,
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                      >
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: "0 24px 20px 24px", fontSize: 14, color: "#4b5563", lineHeight: 1.6, borderTop: "1px solid #f9fafb" }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== CALL TO ACTION ===== */}
          <div style={{ marginTop: 80, background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)", borderRadius: 24, padding: "60px 40px", textAlign: "center", color: "#fff", boxShadow: "0 15px 35px rgba(185,28,28,0.25)" }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16, letterSpacing: "-0.02em" }}>Stranded and need immediate help?</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", marginBottom: 36, maxWidth: 500, marginLeft: "auto", marginRight: "auto", lineHeight: 1.65 }}>
              Don&apos;t wait to fill out a support ticket. Match with a certified technician right away to resolve your roadside issue.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="bg-white text-red-700 hover:bg-red-50 rounded-lg border-none cursor-pointer font-extrabold active:scale-95 transition-all duration-200"
                style={{ padding: "16px 36px", fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", boxShadow: "0 5px 15px rgba(0,0,0,0.15)" }}
                onClick={() => router.push("/login?role=user")}
              >Request Assistance Now</button>
            </div>
          </div>

        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: "#1a1a1a", paddingTop: 56, paddingBottom: 24 }}>
        <div className={CONTAINER} style={{ ...MAX_W, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr", gap: 40, marginBottom: 40 }} className="flex flex-col md:grid">
            <div>
              <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.04em", color: "#b91c1c", display: "block", marginBottom: 14 }}>MECH-MATE</span>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: "#6b7280", maxWidth: 220 }}>Revolutionizing roadside assistance through high-precision technology and elite technician networks.</p>
            </div>
            {[
              { title: "Services", items: ["Towing", "Engine Repair", "Tire Change", "Fuel Delivery"] },
              { title: "Company",  items: ["About Us", "Careers", "Contact", "Privacy"] },
            ].map(({ title, items }) => (
              <div key={title}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16 }}>{title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {items.map((s) => (
                    <li key={s} style={{ fontSize: 13, color: "#6b7280", marginBottom: 10, cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
                    >{s}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Stay Updated</h4>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="email" placeholder="Enter email" style={{ flex: 1, minWidth: 0, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#fff", outline: "none" }} />
                <button style={{ background: "#b91c1c", border: "none", borderRadius: 8, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", color: "#fff" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
                </button>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            © 2024 MECH-MATE Mobile Workshop Assistance System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
