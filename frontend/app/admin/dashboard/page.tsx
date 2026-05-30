"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../src/components/AdminLayout";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/admin/dashboard-stats"); // Backend on 4000
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          console.error("Failed to fetch dashboard stats", json);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout activeTab="Dashboard">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <h2 style={{ color: "#b91c1c" }}>Loading Dashboard...</h2>
        </div>
      </AdminLayout>
    );
  }

  // Fallbacks if data fails to load
  const kpis = data?.kpis || { totalUsers: 0, totalMechanics: 0, activeRequests: 0, completedServices: 0 };
  
  // Default request volume skeleton
  const defaultVolume = [
    { day: "Sun", count: 0 }, { day: "Mon", count: 0 }, { day: "Tue", count: 0 },
    { day: "Wed", count: 0 }, { day: "Thu", count: 0 }, { day: "Fri", count: 0 }, { day: "Sat", count: 0 }
  ];
  const requestVolume = data?.requestVolume || defaultVolume;
  const maxVolume = Math.max(...requestVolume.map((v: any) => v.count), 1); 

  const serviceDistribution = data?.serviceDistribution || [];
  const pendingApprovals = data?.pendingApprovals || [];

  return (
    <AdminLayout activeTab="Dashboard">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>System Overview</h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Real-time performance metrics and management panel.</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        {/* Card 1 */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", borderLeft: "4px solid #b91c1c" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <span className="material-symbols-outlined" style={{ color: "#b91c1c", fontSize: 24 }}>group</span>
            <span style={{ backgroundColor: "#ffedd5", color: "#c2410c", fontSize: 12, fontWeight: 700, padding: "4px 8px", borderRadius: 6 }}>Live</span>
          </div>
          <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, margin: "0 0 4px 0" }}>Total Users</p>
          <h3 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: 0 }}>{kpis.totalUsers}</h3>
        </div>

        {/* Card 2 */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", borderLeft: "4px solid #b45309" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <span className="material-symbols-outlined" style={{ color: "#b45309", fontSize: 24 }}>build</span>
            <span style={{ backgroundColor: "#fce7f3", color: "#be185d", fontSize: 12, fontWeight: 700, padding: "4px 8px", borderRadius: 6 }}>Live</span>
          </div>
          <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, margin: "0 0 4px 0" }}>Total Mechanics</p>
          <h3 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: 0 }}>{kpis.totalMechanics}</h3>
        </div>

        {/* Card 3 */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", borderLeft: "4px solid #ef4444" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <span className="material-symbols-outlined" style={{ color: "#ef4444", fontSize: 24 }}>bolt</span>
            <span style={{ backgroundColor: "#ffedd5", color: "#c2410c", fontSize: 12, fontWeight: 700, padding: "4px 8px", borderRadius: 6 }}>Urgent</span>
          </div>
          <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, margin: "0 0 4px 0" }}>Active Requests</p>
          <h3 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: 0 }}>{kpis.activeRequests}</h3>
        </div>

        {/* Card 4 */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", borderLeft: "4px solid #6b7280" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <span className="material-symbols-outlined" style={{ color: "#6b7280", fontSize: 24 }}>verified</span>
            <span style={{ backgroundColor: "#f3f4f6", color: "#4b5563", fontSize: 12, fontWeight: 700, padding: "4px 8px", borderRadius: 6 }}>Total</span>
          </div>
          <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, margin: "0 0 4px 0" }}>Completed Services</p>
          <h3 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: 0 }}>{kpis.completedServices}</h3>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Bar Chart */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>Request Volume</h3>
            <select style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #e5e7eb", fontSize: 12, fontWeight: 600, color: "#4b5563", outline: "none", backgroundColor: "#fff" }}>
              <option>Last 7 Days</option>
            </select>
          </div>
          
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 160, padding: "0 10px" }}>
            {requestVolume.map((bar: any, i: number) => {
              const heightPercentage = Math.max((bar.count / maxVolume) * 100, 5); 
              const actualHeight = bar.count > 0 ? heightPercentage : 0;
              const isActive = bar.count === maxVolume && maxVolume > 0;
              
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: 40 }}>
                  <div style={{ width: "100%", height: `${actualHeight}%`, backgroundColor: isActive ? "#dc2626" : "#e5e7eb", borderRadius: "6px 6px 0 0", transition: "height 0.3s ease" }} title={`Count: ${bar.count}`}></div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af" }}>{bar.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribution */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 32px 0" }}>Service Distribution</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {serviceDistribution.length > 0 ? serviceDistribution.map((item: any, i: number) => {
              const colors = ["#b91c1c", "#b45309", "#9ca3af", "#4b5563"];
              const color = colors[i % colors.length];
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, fontWeight: 700, color: "#374151" }}>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "120px" }} title={item.label}>{item.label}</span>
                    <span>{item.percent}%</span>
                  </div>
                  <div style={{ width: "100%", height: 6, backgroundColor: "#f3f4f6", borderRadius: 3 }}>
                    <div style={{ width: `${item.percent}%`, height: "100%", backgroundColor: color, borderRadius: 3 }}></div>
                  </div>
                </div>
              );
            }) : (
              <div style={{ fontSize: 13, color: "#6b7280", textAlign: "center", padding: "20px 0" }}>No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>Pending Technician Approvals</h3>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb", backgroundColor: "#fff", fontSize: 13, fontWeight: 600, color: "#4b5563", cursor: "pointer" }}>Export CSV</button>
            <button style={{ padding: "8px 16px", borderRadius: 8, border: "none", backgroundColor: "#b91c1c", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>View All</button>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", borderTop: "1px solid #e5e7eb" }}>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Mechanic</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Experience</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Specialization</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Submitted</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Status</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingApprovals.length > 0 ? pendingApprovals.map((row: any, i: number) => (
              <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: row.bg || "#6b7280", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                      {row.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{row.name}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{row.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563", fontWeight: 500 }}>{row.experience}</td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563", fontWeight: 500 }}>{row.specialization}</td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563", fontWeight: 500 }}>{new Date(row.submitted).toLocaleDateString()}</td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ backgroundColor: "#ffedd5", color: "#c2410c", fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 4, letterSpacing: 0.5 }}>{row.status}</span>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button style={{ background: "none", border: "none", color: "#b91c1c", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
                    </button>
                    <button style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>cancel</span>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "#6b7280", fontSize: 14 }}>
                  No pending technician approvals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FAB */}
      <button style={{
        position: "fixed",
        bottom: 40,
        right: 40,
        width: 56,
        height: 56,
        borderRadius: "50%",
        backgroundColor: "#b91c1c",
        color: "#fff",
        border: "none",
        boxShadow: "0 10px 15px -3px rgba(185, 28, 28, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 10,
        transition: "transform 0.2s"
      }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
        <span className="material-symbols-outlined" style={{ fontSize: 28 }}>add</span>
      </button>
    </AdminLayout>
  );
}
