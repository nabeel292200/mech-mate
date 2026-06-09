"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../src/store/authStore";
import MechanicLayout from "../../../src/components/MechanicLayout";
import { api } from "../../../src/services/api.service";

export default function ActiveRequestsPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      if (user.role !== "mechanic") {
        router.push("/login?role=mechanic");
        return;
      }
      fetchActiveRequests();
    }
  }, [user, loading, router]);

  const fetchActiveRequests = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.get("mechanic/requests/active");
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch active requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <MechanicLayout activeTab="Active Requests">
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
    <MechanicLayout activeTab="Active Requests">
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 4 }}>Active Requests</h1>
      <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>Requests you have accepted and are currently handling.</p>

      {requests.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", background: "#fff", borderRadius: 16, border: "1px dashed #d1d5db" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, display: "block", marginBottom: 16, color: "#9ca3af" }}>check_circle_outline</span>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 4 }}>You're all caught up!</p>
          <p style={{ fontSize: 13, color: "#6b7280" }}>No active service requests right now. Check your Dashboard for new calls.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {requests.map((req) => (
            <div key={req._id} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <span style={{ display: "inline-block", background: "#fef2f2", color: "#b91c1c", fontSize: 10, fontWeight: 800, padding: "4px 8px", borderRadius: 6, letterSpacing: "0.5px", marginBottom: 8 }}>ACCEPTED</span>
                    <p style={{ fontSize: 18, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>{req.userId?.name || "Customer"}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{req.userId?.phone || "No phone provided"}</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#9ca3af" }}>directions_car</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{req.brandName}</span>
                </div>

                <div style={{ background: "#f9fafb", borderRadius: 8, padding: "12px", marginBottom: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.5px", marginBottom: 4 }}>PROBLEM DESCRIPTION</p>
                  <p style={{ fontSize: 13, color: "#111827", lineHeight: 1.5 }}>{req.problemDetails}</p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      localStorage.setItem("activeRequestId", req._id);
                      localStorage.setItem("activeRole", "mechanic");
                      router.push(`/live-tracking`);
                    }}
                    style={{ flex: 1, background: "#111827", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#374151"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#111827"; }}
                  >
                    TRACK & ASSIST
                  </button>
                  <button
                    onClick={() => router.push(`/mechanic/billing/${req._id}`)}
                    style={{ flex: 1, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#dcfce7"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#f0fdf4"; }}
                  >
                    COMPLETE JOB
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MechanicLayout>
  );
}
