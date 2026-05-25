"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const vehicles = [
  {
    id: "bike",
    label: "Bike",
    subtitle: "Motorcycles, Scooters, Bicycles",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="44" r="10" stroke="#b91c1c" strokeWidth="3" fill="none"/>
        <circle cx="50" cy="44" r="10" stroke="#b91c1c" strokeWidth="3" fill="none"/>
        <path d="M14 44 L26 20 L38 20 L50 44" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M26 20 L32 44" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M38 20 L42 14 L46 14" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    id: "car",
    label: "Car",
    subtitle: "Sedans, SUVs, Hatchbacks",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="28" width="52" height="22" rx="4" stroke="#b91c1c" strokeWidth="3" fill="none"/>
        <path d="M12 28 L18 14 H46 L52 28" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="18" cy="50" r="6" stroke="#b91c1c" strokeWidth="3" fill="none"/>
        <circle cx="46" cy="50" r="6" stroke="#b91c1c" strokeWidth="3" fill="none"/>
        <path d="M24 50 H40" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round"/>
        <path d="M12 50 H6" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round"/>
        <path d="M58 50 H52" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round"/>
        <rect x="20" y="18" width="10" height="10" rx="1" stroke="#b91c1c" strokeWidth="2" fill="none"/>
        <rect x="34" y="18" width="10" height="10" rx="1" stroke="#b91c1c" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    id: "truck",
    label: "Truck",
    subtitle: "Pickups, LCVs, Delivery Vans",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="20" width="36" height="26" rx="3" stroke="#b91c1c" strokeWidth="3" fill="none"/>
        <path d="M40 30 L52 30 L60 38 L60 46 L40 46 Z" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="16" cy="50" r="6" stroke="#b91c1c" strokeWidth="3" fill="none"/>
        <circle cx="50" cy="50" r="6" stroke="#b91c1c" strokeWidth="3" fill="none"/>
        <path d="M22 50 H44" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round"/>
        <path d="M4 46 H10" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "bus",
    label: "Bus",
    subtitle: "Coaches, Transit Buses, Mini-buses",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="10" width="48" height="36" rx="4" stroke="#b91c1c" strokeWidth="3" fill="none"/>
        <path d="M8 22 H56" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="14" y="14" width="10" height="8" rx="1.5" stroke="#b91c1c" strokeWidth="2" fill="none"/>
        <rect x="40" y="14" width="10" height="8" rx="1.5" stroke="#b91c1c" strokeWidth="2" fill="none"/>
        <path d="M8 46 L8 52" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round"/>
        <path d="M56 46 L56 52" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="18" cy="52" r="5" stroke="#b91c1c" strokeWidth="3" fill="none"/>
        <circle cx="46" cy="52" r="5" stroke="#b91c1c" strokeWidth="3" fill="none"/>
        <path d="M23 52 H41" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function VehicleTypePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    router.push(`/vehicle-brand?type=${selected}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter', 'Geist Sans', Arial, sans-serif" }}>

      {/* ===== TOP BAR ===== */}
      <header style={{ borderBottom: "1px solid #f3f4f6", padding: "0 24px", height: 56, display: "flex", alignItems: "center" }}>
        <a href="/" style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.04em", color: "#b91c1c", textDecoration: "none" }}>
          MECH-MATE
        </a>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px 60px" }}>

        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 8, letterSpacing: "-0.02em" }}>
            Select Your Vehicle Type
          </h1>
          <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.55 }}>
            Choose the vehicle needing assistance to help us dispatch the right professional.
          </p>
        </div>

        {/* Vehicle Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
          {vehicles.map(({ id, label, subtitle, icon }) => {
            const isSelected = selected === id;
            return (
              <button
                key={id}
                onClick={() => setSelected(id)}
                style={{
                  background: "#fff",
                  border: isSelected ? "2px solid #b91c1c" : "2px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 0,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.18s",
                  outline: "none",
                  overflow: "hidden",
                  boxShadow: isSelected ? "0 0 0 3px rgba(185,28,28,0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {/* Icon area */}
                <div style={{
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 130,
                  width: "100%",
                  transition: "background 0.18s",
                  backgroundColor: isSelected ? "#fef2f2" : "#f3f4f6",
                }}>
                  {icon}
                </div>

                {/* Label area */}
                <div style={{ padding: "14px 16px 16px" }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 3 }}>{label}</p>
                  <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.4 }}>{subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selected}
          style={{
            background: selected ? "#b91c1c" : "#b91c1c",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "14px 36px",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            cursor: selected ? "pointer" : "not-allowed",
            opacity: selected ? 1 : 0.6,
            transition: "opacity 0.2s, transform 0.15s",
            marginBottom: 16,
          }}
          onMouseEnter={(e) => { if (selected) (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
        >
          CONTINUE
        </button>

        {/* Help text */}
        <p style={{ fontSize: 13, color: "#9ca3af" }}>
          Not sure about your vehicle type?{" "}
          <a href="#" style={{ color: "#b91c1c", textDecoration: "underline", fontWeight: 500 }}>
            Contact Support
          </a>
        </p>
      </main>
    </div>
  );
}
