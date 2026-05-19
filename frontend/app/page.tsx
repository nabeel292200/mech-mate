"use client";

import React from "react";
import { useRouter } from "next/navigation";

const CONTAINER = "mx-auto w-full px-6" as const;
const MAX_W = { maxWidth: 1100 } as const;

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ fontFamily: "'Inter', 'Geist Sans', Arial, sans-serif", overflowX: "hidden" }}>

      {/* ===== NAVBAR ===== */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "#fff", borderBottom: "1px solid #f3f4f6", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", height: 64 }}>
        <div className={CONTAINER} style={{ ...MAX_W, height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", color: "#b91c1c", textDecoration: "none" }}>ASSIST</a>
          <nav>
            <ul style={{ display: "flex", alignItems: "center", gap: 32, listStyle: "none", margin: 0, padding: 0 }}>
              {["Home", "Services", "About", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" style={{ textDecoration: "none", fontSize: 14, fontWeight: 500, color: "#374151" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#b91c1c")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            className="bg-red-700 hover:bg-red-800 text-white rounded-lg border-none cursor-pointer active:scale-95 transition-all duration-200"
            style={{ padding: "10px 22px", fontSize: 13, fontWeight: 700, letterSpacing: "0.03em" }}
          >Sign In</button>
        </div>
      </header>

      <main style={{ paddingTop: 64 }}>

        {/* ===== HERO ===== */}
        <section style={{ position: "relative", height: 520, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <img
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0VtT3GFdpw_4XUgDiRvYxcaDfJIZhCHXBBrTUlm0aP8imd8vpRFLITk9D6S5y5n9rY6ydta0f0XbcIru94IRSL_l0LybI-5G3ZUKWebJ9L00BRiX2iPxePo079McXCDTxK8uuF2tMDl_yasC1x82MGvCeOpx1_AARCEpVLkkr5OvGoL9FKGccBalB_XiFr5ZLk2kay2z7TqSDw9_IJ5nJ8TIxSbE9R77y5CTdlT_4rFzpc88DgeWePTmlYxliJR6ehWDUUTqkFLg"
            alt="Car on road – hero background"
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.65), rgba(0,0,0,0.75))" }} />
          <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", maxWidth: 680 }}>
            <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.02em" }}>
              Mobile Workshop Assistance System
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.88)", marginBottom: 32, lineHeight: 1.6, maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
              Get instant roadside mechanic assistance anytime, anywhere. Your reliable partner in automotive distress.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="active:scale-95 transition-all duration-200"
                style={{ background: "#b91c1c", color: "#fff", border: "none", borderRadius: 8, padding: "14px 32px", fontSize: 13, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 4px 20px rgba(185,28,28,0.4)" }}
                onClick={() => router.push("/login?role=user")}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#991b1b")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#b91c1c")}
              >I Need Help</button>
              <button
                className="active:scale-95 transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "2px solid rgba(255,255,255,0.6)", borderRadius: 8, padding: "14px 32px", fontSize: 13, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", backdropFilter: "blur(8px)" }}
                onClick={() => router.push("/login?role=mechanic")}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
              >I&apos;m a Mechanic</button>
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section style={{ background: "#fff", padding: "64px 0" }}>
          <div className={CONTAINER} style={MAX_W}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#b91c1c", marginBottom: 8 }}>Our Ecosystem</p>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 40 }}>Precision Engineering for Peace of Mind</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              {[
                { icon: "distance",        bg: "#fef2f2", fg: "#b91c1c",  title: "Live Location",            desc: "Precision real-time tracking of assigned mechanics relative to your distress point." },
                { icon: "engineering",     bg: "#eff6ff", fg: "#1e40af",  title: "Mechanic Matching",        desc: "Our algorithm pairs you with the most qualified nearby specialist for your specific vehicle fault." },
                { icon: "emergency_share", bg: "#fff7ed", fg: "#c2410c",  title: "Emergency Assistance",     desc: "One-tap critical response system for high-stakes roadside scenarios needing immediate intervention." },
                { icon: "forum",           bg: "#f0fdf4", fg: "#15803d",  title: "Real-time Communication",  desc: "Encrypted voice and text channels to coordinate with your mechanic throughout the service window." },
              ].map(({ icon, bg, fg, title, desc }) => (
                <div key={title} style={{ background: "#fff", border: "1px solid #f3f4f6", borderRadius: 18, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s, transform 0.2s" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.09)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)"; }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 26 }}>{icon}</span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SERVICE CATEGORIES ===== */}
        <section style={{ background: "#f9fafb", padding: "64px 0" }}>
          <div className={CONTAINER} style={MAX_W}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#b91c1c", marginBottom: 8 }}>Rapid Response Utility</p>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 40 }}>Service Categories</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
              {[
                { icon: "tire_repair",       label: "Flat Tire",         desc: "Rapid tire replacement and repair" },
                { icon: "local_gas_station", label: "Fuel Delivery",     desc: "Emergency refueling wherever you are" },
                { icon: "build",             label: "Mechanical Repair",  desc: "Expert diagnosis and on-site fixes" },
                { icon: "car_repair",        label: "Tow Truck",         desc: "Professional recovery for all vehicle types" },
              ].map(({ icon, label, desc }) => (
                <div key={label} style={{ background: "#fff", border: "1px solid #f3f4f6", borderRadius: 18, padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", transition: "all 0.2s" }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-4px)";
                    el.style.boxShadow = "0 16px 36px rgba(0,0,0,0.1)";
                    const icon = el.querySelector(".svc-icon") as HTMLElement;
                    if (icon) { icon.style.background = "#b91c1c"; icon.style.color = "#fff"; }
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "";
                    el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.04)";
                    const icon = el.querySelector(".svc-icon") as HTMLElement;
                    if (icon) { icon.style.background = "rgba(185,28,28,0.1)"; icon.style.color = "#b91c1c"; }
                  }}
                >
                  <div className="svc-icon" style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(185,28,28,0.1)", color: "#b91c1c", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, transition: "all 0.2s" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{icon}</span>
                  </div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "#111827", marginBottom: 6 }}>{label}</h3>
                  <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA BANNER ===== */}
        <section style={{ background: "#fff", padding: "64px 0" }}>
          <div className={CONTAINER} style={MAX_W}>
            <div style={{ background: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)", borderRadius: 20, padding: "56px 40px", textAlign: "center", color: "#fff", boxShadow: "0 12px 40px rgba(185,28,28,0.3)" }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 14 }}>Stranded on the road?</h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.82)", marginBottom: 32, maxWidth: 480, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
                Don&apos;t let a breakdown ruin your day. Join thousands of users who trust ASSIST for reliable roadside repairs.
              </p>
              <button
                className="active:scale-95 transition-all duration-200"
                style={{ background: "#fff", color: "#b91c1c", border: "none", borderRadius: 100, padding: "16px 40px", fontSize: 13, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 6px 24px rgba(0,0,0,0.18)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
              >Request Help Now</button>
            </div>
          </div>
        </section>

      </main>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: "#1a1a1a", paddingTop: 56, paddingBottom: 24 }}>
        <div className={CONTAINER} style={MAX_W}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr", gap: 40, marginBottom: 40 }}>
            <div>
              <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.04em", color: "#b91c1c", display: "block", marginBottom: 14 }}>ASSIST</span>
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
            © 2024 ASSIST Mobile Workshop Assistance System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
