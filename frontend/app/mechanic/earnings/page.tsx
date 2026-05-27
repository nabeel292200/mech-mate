"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../src/store/authStore";
import MechanicLayout from "../../../src/components/MechanicLayout";
import { api } from "../../../src/services/api.service";

export default function EarningsPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [data, setData] = useState<{ totalEarnings: number; thisWeekEarnings: number; totalJobs: number; recentTransactions: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      if (user.role !== "mechanic") {
        router.push("/login?role=mechanic");
        return;
      }
      fetchEarnings();
    }
  }, [user, loading, router]);

  const fetchEarnings = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.get("mechanic/earnings");
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch earnings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <MechanicLayout activeTab="Earnings">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
          <span style={{ width: 36, height: 36, border: "3px solid #e5e7eb", borderTopColor: "#b91c1c", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <style jsx global>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </MechanicLayout>
    );
  }

  return (
    <MechanicLayout activeTab="Earnings">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 4 }}>Financial Overview</h1>
          <p style={{ fontSize: 14, color: "#6b7280" }}>Track your real-time earnings and payout history.</p>
        </div>
        <button style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "background 0.15s", display: "flex", alignItems: "center", gap: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>account_balance</span>
          WITHDRAW FUNDS
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        <div style={{ background: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)", borderRadius: 16, padding: "24px", color: "#fff", boxShadow: "0 4px 14px rgba(185,28,28,0.2)" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.5px", marginBottom: 8 }}>TOTAL LIFETIME EARNINGS</p>
          <p style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.02em" }}>${data?.totalEarnings?.toFixed(2) || "0.00"}</p>
        </div>
        
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid #f3f4f6", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.5px", marginBottom: 8 }}>EARNINGS THIS WEEK</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>${data?.thisWeekEarnings?.toFixed(2) || "0.00"}</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid #f3f4f6", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.5px", marginBottom: 8 }}>TOTAL JOBS COMPLETED</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>{data?.totalJobs || 0}</p>
        </div>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 16 }}>Recent Transactions</h2>
      
      {!data?.recentTransactions || data.recentTransactions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", background: "#fff", borderRadius: 16, border: "1px dashed #d1d5db" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 40, display: "block", marginBottom: 12, color: "#9ca3af" }}>account_balance_wallet</span>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#374151" }}>No transactions yet</p>
          <p style={{ fontSize: 13, color: "#6b7280" }}>Complete your first job to see earnings here.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <tr>
                <th style={{ padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.5px" }}>TRANSACTION ID</th>
                <th style={{ padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.5px" }}>DATE</th>
                <th style={{ padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.5px" }}>VEHICLE / BRAND</th>
                <th style={{ padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.5px", textAlign: "right" }}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTransactions.map((tx: any, idx: number) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 600, color: "#111827", fontFamily: "monospace" }}>#{tx.id.substring(18).toUpperCase()}</td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: "#4b5563" }}>{new Date(tx.date).toLocaleDateString()}</td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: "#4b5563" }}>{tx.brandName}</td>
                  <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 800, color: "#16a34a", textAlign: "right" }}>+${tx.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MechanicLayout>
  );
}
