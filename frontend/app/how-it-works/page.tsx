"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CONTAINER = "mx-auto w-full px-6" as const;
const MAX_W = { maxWidth: 1100 } as const;

export default function HowItWorks() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"user" | "mechanic">("user");

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
                <Link href="/how-it-works" style={{ textDecoration: "none", fontSize: 14, fontWeight: 700, color: "#b91c1c" }}>How it works</Link>
              </li>
              <li>
                <Link href="/contact" style={{ textDecoration: "none", fontSize: 14, fontWeight: 500, color: "#374151" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#b91c1c")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
                >Contact</Link>
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
            The Ecosystem
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, color: "#111827", lineHeight: 1.15, marginBottom: 18, letterSpacing: "-0.03em" }}>
            How <span style={{ color: "#b91c1c" }}>MECH-MATE</span> Works
          </h1>
          <p style={{ fontSize: 16, color: "#4b5563", marginBottom: 40, lineHeight: 1.6, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
            Get matched with top-tier roadside mechanics in minutes, or offer your repair skills to nearby motorists. Explore our step-by-step operational workflows.
          </p>

          {/* ===== TOGGLE SELECTOR ===== */}
          <div style={{ display: "inline-flex", background: "#f3f4f6", padding: 6, borderRadius: 100, boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" }}>
            <button
              onClick={() => setActiveTab("user")}
              style={{
                background: activeTab === "user" ? "#fff" : "transparent",
                color: activeTab === "user" ? "#b91c1c" : "#6b7280",
                border: "none",
                borderRadius: 100,
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: activeTab === "user" ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
              For Vehicle Owners
            </button>
            <button
              onClick={() => setActiveTab("mechanic")}
              style={{
                background: activeTab === "mechanic" ? "#fff" : "transparent",
                color: activeTab === "mechanic" ? "#b91c1c" : "#6b7280",
                border: "none",
                borderRadius: 100,
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: activeTab === "mechanic" ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>engineering</span>
              For Service Mechanics
            </button>
          </div>
        </div>
      </section>

      {/* ===== WORKFLOW DISPLAY ===== */}
      <main style={{ flexGrow: 1, paddingBottom: 80 }}>
        <div className={CONTAINER} style={{ ...MAX_W, margin: "0 auto" }}>
          
          {/* STEPPER CARDS GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginTop: 20 }}>
            {activeTab === "user" ? (
              // VEHICLE OWNER STEPS
              [
                {
                  step: "01",
                  icon: "share_location",
                  title: "Request Help",
                  desc: "Specify your vehicle type (e.g. sedan, SUV), brand, and issue. Pin your exact roadside location on the interactive system map.",
                  badgeBg: "#fef2f2",
                  badgeFg: "#b91c1c"
                },
                {
                  step: "02",
                  icon: "quick_reference_all",
                  title: "Instant Match",
                  desc: "Our matching algorithm alerts the closest certified mechanics. The first responsive mechanic accepts your request immediately.",
                  badgeBg: "#eff6ff",
                  badgeFg: "#1e40af"
                },
                {
                  step: "03",
                  icon: "navigation",
                  title: "Track Live",
                  desc: "Watch the mechanic approach in real-time. Communicate via secure call/text features directly inside our app.",
                  badgeBg: "#fff7ed",
                  badgeFg: "#c2410c"
                },
                {
                  step: "04",
                  icon: "verified",
                  title: "On-site Fix & Pay",
                  desc: "The mechanic performs the repair. Approve the final status, pay securely on the platform, and rate your specialist.",
                  badgeBg: "#f0fdf4",
                  badgeFg: "#15803d"
                }
              ].map(({ step, icon, title, desc, badgeBg, badgeFg }) => (
                <div
                  key={step}
                  style={{
                    background: "#fff",
                    border: "1px solid #f3f4f6",
                    borderRadius: 20,
                    padding: 32,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div style={{ position: "absolute", top: 16, right: 24, fontSize: 32, fontWeight: 900, color: "rgba(0,0,0,0.04)" }}>
                    {step}
                  </div>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: badgeBg, color: badgeFg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 26 }}>{icon}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 12 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))
            ) : (
              // SERVICE MECHANIC STEPS
              [
                {
                  step: "01",
                  icon: "sensors",
                  title: "Go Active",
                  desc: "Log into the mechanic portal, toggle your status to online, and let our system track your location for nearby dispatches.",
                  badgeBg: "#f5f3ff",
                  badgeFg: "#6d28d9"
                },
                {
                  step: "02",
                  icon: "notifications_active",
                  title: "Receive Broadcasts",
                  desc: "Get instant alerts for nearby roadside breakdowns. Review car models, customer's reported faults, and estimated payouts.",
                  badgeBg: "#ecfeff",
                  badgeFg: "#0e7490"
                },
                {
                  step: "03",
                  icon: "build",
                  title: "Navigate & Repair",
                  desc: "Use high-precision maps to reach the motorist's location. Diagnose the issue and carry out repairs in your mobile workspace.",
                  badgeBg: "#fff7ed",
                  badgeFg: "#c2410c"
                },
                {
                  step: "04",
                  icon: "currency_exchange",
                  title: "Instant Payout",
                  desc: "Mark the assistance request as completed. Funds are transferred to your wallet instantly. Build credibility with reviews.",
                  badgeBg: "#f0fdf4",
                  badgeFg: "#15803d"
                }
              ].map(({ step, icon, title, desc, badgeBg, badgeFg }) => (
                <div
                  key={step}
                  style={{
                    background: "#fff",
                    border: "1px solid #f3f4f6",
                    borderRadius: 20,
                    padding: 32,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div style={{ position: "absolute", top: 16, right: 24, fontSize: 32, fontWeight: 900, color: "rgba(0,0,0,0.04)" }}>
                    {step}
                  </div>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: badgeBg, color: badgeFg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 26 }}>{icon}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 12 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))
            )}
          </div>

          {/* ===== DEMONSTRATION SECTION ===== */}
          <div style={{ marginTop: 80, background: "#fff", border: "1px solid #f3f4f6", borderRadius: 24, padding: "48px 32px", boxShadow: "0 10px 30px rgba(0,0,0,0.02)", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center" }} className="flex flex-col md:grid">
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#b91c1c", marginBottom: 12 }}>System Dispatch Demo</p>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: "#111827", letterSpacing: "-0.02em", marginBottom: 20, lineHeight: 1.25 }}>
                Real-Time GPS Tracking & Intelligent Matchmaking
              </h2>
              <p style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.6, marginBottom: 20 }}>
                Mech-Mate uses high-precision geographic telemetry to minimize wait times. When a user requests help, our backend calculates the routing distance and matches them with mechanics who have specified compatibility for that exact brand of vehicle.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
                {[
                  { icon: "check_circle", text: "Interactive Live Route tracking with GPS coordinates" },
                  { icon: "check_circle", text: "Compatibility filters for specific vehicle makes & types" },
                  { icon: "check_circle", text: "Encrypted communications to maintain motorist security" }
                ].map(({ icon, text }) => (
                  <li key={text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 500, color: "#374151" }}>
                    <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: 20 }}>{icon}</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Visual Telemetry Mockup */}
            <div style={{ background: "#111827", borderRadius: 20, padding: 24, color: "#fff", position: "relative", minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 20px 40px rgba(185,28,28,0.15)" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.5px", color: "#9ca3af" }}>DISPATCH SERVICE ACTIVE</span>
                </div>
                <span style={{ fontSize: 11, background: "rgba(185,28,28,0.25)", color: "#f87171", padding: "2px 8px", borderRadius: 100, fontWeight: 700 }}>LIVE MAP</span>
              </div>

              {/* Map Mock Graphics */}
              <div style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", margin: "16px 0" }}>
                {/* Background Grid Lines */}
                <div style={{ position: "absolute", inset: 0, opacity: 0.15, backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                
                {/* Route Path (SVG representation) */}
                <svg style={{ position: "absolute", width: "100%", height: "100%" }}>
                  <path d="M 40,160 Q 140,80 260,110" fill="none" stroke="#b91c1c" strokeWidth="3" strokeDasharray="6,4" />
                </svg>

                {/* Motorist Pin */}
                <div style={{ position: "absolute", left: 30, top: 140, textAlign: "center" }}>
                  <div style={{ background: "#3b82f6", color: "#fff", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px #3b82f6" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person</span>
                  </div>
                  <span style={{ fontSize: 10, display: "block", marginTop: 4, fontWeight: 700, color: "#9ca3af" }}>Motorist</span>
                </div>

                {/* Mechanic Pin */}
                <div style={{ position: "absolute", right: 30, top: 90, textAlign: "center" }}>
                  <div style={{ background: "#b91c1c", color: "#fff", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px #b91c1c" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>engineering</span>
                  </div>
                  <span style={{ fontSize: 10, display: "block", marginTop: 4, fontWeight: 700, color: "#9ca3af" }}>Mechanic</span>
                </div>

                {/* Matching Tag in center */}
                <div style={{ background: "rgba(0,0,0,0.85)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 12px", zIndex: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="material-symbols-outlined text-red-500 animate-pulse" style={{ fontSize: 16 }}>navigation</span>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>ETA: 8 mins</span>
                </div>
              </div>

              {/* Status Box */}
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ display: "block", fontSize: 10, color: "#6b7280", fontWeight: 700, textTransform: "uppercase" }}>Assigned Mechanic</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Robert Chen (Toyota Expert)</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>call</span>
                  </button>
                  <button style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===== TRUST BADGES ===== */}
          <div style={{ marginTop: 80, borderTop: "1px solid #e5e7eb", paddingTop: 60, textAlign: "center" }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#111827", marginBottom: 40, letterSpacing: "-0.01em" }}>Built on Trust and Efficiency</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }} className="flex flex-col md:grid">
              {[
                { icon: "security", title: "Strict Verification", desc: "Every service mechanic is manually vetted, license-checked, and background-approved by our operations team before receiving dispatches." },
                { icon: "monetization_on", title: "Upfront Costing", desc: "No haggling, no unexpected price tags. Read transparency quotes direct on your screen prior to confirming dispatch orders." },
                { icon: "support_agent", title: "24/7 Live Monitoring", desc: "Our telemetry monitors all coordinates during breakdowns, with active human dispatch support standing by to step in." }
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ textAlign: "center" }}>
                  <div style={{ display: "inline-flex", background: "rgba(185,28,28,0.06)", color: "#b91c1c", width: 56, height: 56, borderRadius: "50%", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 26 }}>{icon}</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, maxWidth: 280, marginLeft: "auto", marginRight: "auto" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== CALL TO ACTION ===== */}
          <div style={{ marginTop: 80, background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)", borderRadius: 24, padding: "60px 40px", textAlign: "center", color: "#fff", boxShadow: "0 15px 35px rgba(185,28,28,0.25)" }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16, letterSpacing: "-0.02em" }}>Ready to experience Mech-Mate?</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", marginBottom: 36, maxWidth: 500, marginLeft: "auto", marginRight: "auto", lineHeight: 1.65 }}>
              Choose your role below to get started. Motorists can request roadside repairs instantly, and technicians can set up their profiles and go live.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="bg-white text-red-700 hover:bg-red-50 rounded-lg border-none cursor-pointer font-extrabold active:scale-95 transition-all duration-200"
                style={{ padding: "16px 36px", fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", boxShadow: "0 5px 15px rgba(0,0,0,0.15)" }}
                onClick={() => router.push("/login?role=user")}
              >I Need Assistance</button>
              <button
                className="bg-transparent text-white border-2 border-white rounded-lg cursor-pointer font-extrabold active:scale-95 hover:bg-white/10 transition-all duration-200"
                style={{ padding: "14px 34px", fontSize: 13, letterSpacing: "1px", textTransform: "uppercase" }}
                onClick={() => router.push("/login?role=mechanic")}
              >Join as a Mechanic</button>
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
