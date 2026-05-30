"use client";

import React from "react";
import AdminLayout from "../../../src/components/AdminLayout";

export default function AdminSettingsPage() {
  return (
    <AdminLayout activeTab="Settings">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>System Settings</h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Configure platform preferences and admin accounts.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>
        {/* Sidebar for settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ padding: "12px 16px", backgroundColor: "#fff", borderRadius: 8, fontWeight: 700, color: "#b91c1c", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", cursor: "pointer" }}>General</div>
          <div style={{ padding: "12px 16px", color: "#4b5563", fontWeight: 600, cursor: "pointer" }}>Security</div>
          <div style={{ padding: "12px 16px", color: "#4b5563", fontWeight: 600, cursor: "pointer" }}>Notifications</div>
          <div style={{ padding: "12px 16px", color: "#4b5563", fontWeight: 600, cursor: "pointer" }}>Billing & Plans</div>
        </div>

        {/* Content area */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 32, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 24px 0" }}>Platform Information</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Platform Name</label>
              <input type="text" defaultValue="Mech-Mate" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, outline: "none" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Support Email</label>
              <input type="email" defaultValue="support@mechmate.com" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, outline: "none" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Standard Commission Rate (%)</label>
              <input type="number" defaultValue={15} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, outline: "none" }} />
            </div>

            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 24, marginTop: 12 }}>
              <button style={{ backgroundColor: "#111827", color: "#fff", padding: "12px 24px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
