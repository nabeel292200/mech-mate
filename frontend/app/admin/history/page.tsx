"use client";

import React from "react";
import AdminLayout from "../../../src/components/AdminLayout";

export default function AdminHistoryPage() {
  // Placeholder data for history
  const historyData = [
    { id: "SR-9012", date: "2024-05-28", user: "John Doe", mechanic: "Mike Smith", status: "Completed", amount: "$120.00" },
    { id: "SR-9013", date: "2024-05-27", user: "Sarah Connor", mechanic: "Alex Johnson", status: "Completed", amount: "$85.00" },
    { id: "SR-9014", date: "2024-05-26", user: "Bruce Wayne", mechanic: "Clark Kent", status: "Cancelled", amount: "$0.00" },
  ];

  return (
    <AdminLayout activeTab="History">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>Service History</h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>View all past service requests and their resolutions.</p>
      </div>

      <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <input type="text" placeholder="Search by ID or Name..." style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, width: 250, outline: "none" }} />
            <select style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, color: "#4b5563", outline: "none", backgroundColor: "#fff" }}>
              <option>All Statuses</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
          <button style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb", backgroundColor: "#fff", fontSize: 13, fontWeight: 600, color: "#4b5563", cursor: "pointer" }}>Export CSV</button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", borderTop: "1px solid #e5e7eb" }}>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Request ID</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Date</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>User</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Mechanic</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Status</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 700, color: "#111827" }}>{row.id}</td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563" }}>{row.date}</td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563", fontWeight: 600 }}>{row.user}</td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563" }}>{row.mechanic}</td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ backgroundColor: row.status === "Completed" ? "#dcfce7" : "#fee2e2", color: row.status === "Completed" ? "#16a34a" : "#dc2626", fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 4 }}>{row.status}</span>
                </td>
                <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 600, color: "#111827" }}>{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
