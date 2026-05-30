"use client";

import React from "react";
import AdminLayout from "../../../src/components/AdminLayout";

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout activeTab="Analytics">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>Analytics & Insights</h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Deep dive into user growth, engagement, and platform health.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 24px 0" }}>User Growth</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 200, paddingBottom: 24, borderBottom: "1px solid #e5e7eb" }}>
            {[40, 55, 45, 70, 65, 80, 95].map((height, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: "100%", height: `${height}%`, backgroundColor: i === 6 ? "#b91c1c" : "#fca5a5", borderRadius: "4px 4px 0 0" }}></div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Jan</span>
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Jul</span>
          </div>
        </div>

        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 24px 0" }}>Avg. Resolution Time</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
            <div style={{ textAlign: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#16a34a", marginBottom: 16 }}>timer</span>
              <h2 style={{ fontSize: 48, fontWeight: 800, color: "#111827", margin: 0 }}>45<span style={{ fontSize: 24, color: "#6b7280" }}>m</span></h2>
              <p style={{ fontSize: 14, color: "#6b7280", margin: "8px 0 0 0" }}>-12% from last month</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
