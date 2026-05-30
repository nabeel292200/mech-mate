"use client";

import React from "react";
import AdminLayout from "../../../src/components/AdminLayout";

export default function AdminHelpCenterPage() {
  return (
    <AdminLayout activeTab="Help Center">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>Help Center</h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Manage support tickets and resolve user issues.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>Active Tickets</h3>
            <span style={{ backgroundColor: "#fee2e2", color: "#dc2626", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>3 Unread</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[1, 2, 3].map(item => (
              <div key={item} style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, cursor: "pointer", transition: "border-color 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = "#b91c1c"} onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Payment Issue</span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>2 hrs ago</span>
                </div>
                <p style={{ fontSize: 13, color: "#4b5563", margin: "0 0 12px 0", lineHeight: 1.4 }}>Mechanic reported an issue receiving their payout for service request #SR-1294.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: "#374151", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>M</div>
                  <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Mike Smith (Mechanic)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: "#f3f4f6", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, border: "1px dashed #d1d5db" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#9ca3af", marginBottom: 16 }}>forum</span>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#374151", margin: "0 0 8px 0" }}>Select a ticket</h3>
          <p style={{ fontSize: 14, color: "#6b7280", textAlign: "center", maxWidth: 250 }}>Click on a ticket from the list to view details and respond.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
