"use client";

import React from "react";
import AdminLayout from "../../../src/components/AdminLayout";

export default function AdminPaymentsPage() {
  return (
    <AdminLayout activeTab="Payments">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>Financial Overview</h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Track revenue, payouts, and subscription plans.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32 }}>
        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, margin: "0 0 8px 0" }}>Total Revenue (MTD)</p>
          <h3 style={{ fontSize: 32, fontWeight: 800, color: "#111827", margin: 0 }}>$12,450.00</h3>
          <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, margin: "8px 0 0 0", display: "flex", alignItems: "center", gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>trending_up</span> +14.5% vs last month
          </p>
        </div>

        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, margin: "0 0 8px 0" }}>Pending Payouts</p>
          <h3 style={{ fontSize: 32, fontWeight: 800, color: "#111827", margin: 0 }}>$3,120.50</h3>
          <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, margin: "8px 0 0 0" }}>To 14 mechanics</p>
        </div>

        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, margin: "0 0 8px 0" }}>Platform Fees</p>
          <h3 style={{ fontSize: 32, fontWeight: 800, color: "#111827", margin: 0 }}>$1,867.50</h3>
          <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, margin: "8px 0 0 0" }}>15% standard commission</p>
        </div>
      </div>

      <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 24px 0" }}>Recent Transactions</h3>
        <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 16 }}>receipt_long</span>
          <p style={{ fontSize: 14, color: "#6b7280" }}>No transactions to display yet.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
