"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../src/components/AdminLayout";
import { api } from "../../../src/services/api.service";

export default function AdminPaymentsPage() {
  const [data, setData] = useState<{
    totalRevenue: number;
    pendingPayouts: number;
    platformFees: number;
    recentTransactions: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const fetchPaymentsData = async () => {
    try {
      const res = await api.get<{ success: boolean; data: any }>("admin/payments");
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch payments data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab="Payments">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <h2 style={{ color: "#b91c1c" }}>Loading Payments...</h2>
        </div>
      </AdminLayout>
    );
  }

  const { totalRevenue = 0, pendingPayouts = 0, platformFees = 0, recentTransactions = [] } = data || {};

  return (
    <AdminLayout activeTab="Payments">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>Financial Overview</h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Track revenue, payouts, and subscription plans.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32 }}>
        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, margin: "0 0 8px 0" }}>Total Revenue (All Time)</p>
          <h3 style={{ fontSize: 32, fontWeight: 800, color: "#111827", margin: 0 }}>${totalRevenue.toFixed(2)}</h3>
        </div>

        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, margin: "0 0 8px 0" }}>Pending Payouts</p>
          <h3 style={{ fontSize: 32, fontWeight: 800, color: "#111827", margin: 0 }}>${pendingPayouts.toFixed(2)}</h3>
          <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, margin: "8px 0 0 0" }}>Owed to mechanics</p>
        </div>

        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, margin: "0 0 8px 0" }}>Platform Fees</p>
          <h3 style={{ fontSize: 32, fontWeight: 800, color: "#111827", margin: 0 }}>${platformFees.toFixed(2)}</h3>
          <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, margin: "8px 0 0 0" }}>15% standard commission</p>
        </div>
      </div>

      <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 24px 0" }}>Recent Transactions</h3>
        
        {recentTransactions.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", borderTop: "1px solid #e5e7eb" }}>
                <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Transaction ID</th>
                <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Date</th>
                <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Mechanic</th>
                <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Amount</th>
                <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx: any, i: number) => (
                <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 700, color: "#111827" }}>{tx.id}</td>
                  <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563" }}>{tx.date}</td>
                  <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563", fontWeight: 600 }}>{tx.mechanic}</td>
                  <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 600, color: "#111827" }}>{tx.amount}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ 
                      backgroundColor: tx.paymentStatus === "Completed" ? "#dcfce7" : "#ffedd5", 
                      color: tx.paymentStatus === "Completed" ? "#16a34a" : "#c2410c", 
                      fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 4 
                    }}>
                      {tx.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 16 }}>receipt_long</span>
            <p style={{ fontSize: 14, color: "#6b7280" }}>No transactions to display yet.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
