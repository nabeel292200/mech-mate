"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../src/components/AdminLayout";
import { api } from "../../../src/services/api.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminHistoryPage() {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const fetchHistory = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: any }>(`admin/history?page=${pageNum}&limit=10`);
      if (res.success) {
        setHistoryData(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Service History Report", 14, 15);
    const tableColumn = ["Request ID", "Date", "User", "Mechanic", "Status", "Amount"];
    const tableRows: any[] = [];

    historyData.forEach((row) => {
      const rowData = [
        row.id || "N/A",
        row.date || "N/A",
        row.user || "N/A",
        row.mechanic || "N/A",
        row.status || "N/A",
        row.amount || "N/A",
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save(`service_history_${new Date().getTime()}.pdf`);
  };

  if (loading && page === 1) {
    return (
      <AdminLayout activeTab="History">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <h2 style={{ color: "#b91c1c" }}>Loading History...</h2>
        </div>
      </AdminLayout>
    );
  }

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
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb", backgroundColor: "#fff", fontSize: 13, fontWeight: 600, color: "#4b5563", cursor: "pointer" }}>Export CSV</button>
            <button onClick={handleExportPDF} style={{ padding: "8px 16px", background: "#b91c1c", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>picture_as_pdf</span>
              Export PDF
            </button>
          </div>
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
            {historyData.length > 0 ? historyData.map((row: any, i: number) => (
              <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 700, color: "#111827" }}>{row.id}</td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563" }}>{row.date}</td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563", fontWeight: 600 }}>{row.user}</td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563" }}>{row.mechanic}</td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ 
                    backgroundColor: row.status === "Completed" ? "#dcfce7" : row.status === "Cancelled" ? "#fee2e2" : "#ffedd5", 
                    color: row.status === "Completed" ? "#16a34a" : row.status === "Cancelled" ? "#dc2626" : "#c2410c", 
                    fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 4 
                  }}>
                    {row.status}
                  </span>
                </td>
                <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 600, color: "#111827" }}>{row.amount}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "#6b7280", fontSize: 14 }}>
                  No history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, paddingTop: 16, borderTop: "1px solid #e5e7eb" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>
              Page {page} of {totalPages}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button 
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #d1d5db", backgroundColor: page === 1 ? "#f3f4f6" : "#fff", color: page === 1 ? "#9ca3af" : "#374151", fontSize: 13, fontWeight: 600, cursor: page === 1 ? "not-allowed" : "pointer" }}
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #d1d5db", backgroundColor: page === totalPages ? "#f3f4f6" : "#fff", color: page === totalPages ? "#9ca3af" : "#374151", fontSize: 13, fontWeight: 600, cursor: page === totalPages ? "not-allowed" : "pointer" }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
