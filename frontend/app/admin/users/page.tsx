"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../src/components/AdminLayout";
import { api } from "../../../src/services/api.service";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: any }>(`admin/users?page=${pageNum}&limit=10`);
      if (res.success) {
        setUsers(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, isActive: boolean) => {
    try {
      const res = await api.put<{ success: boolean; data: any }>(`admin/users/${id}/status`, { isActive });
      if (res.success) {
        setUsers(users.map((u) => {
          if (u._id === id) {
            return { ...u, isActive };
          }
          return u;
        }));
      }
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Error updating status. Please try again.");
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab="Users">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <h2 style={{ color: "#b91c1c" }}>Loading Users...</h2>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="Users">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>User Management</h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>View registered users and manage their account status.</p>
      </div>

      <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", borderTop: "1px solid #e5e7eb" }}>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>User</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Phone</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Joined</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Status</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map((row: any, i: number) => (
              <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#6b7280", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                      {row.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{row.name}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563", fontWeight: 500 }}>{row.phone}</td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563", fontWeight: 500 }}>{new Date(row.joined).toLocaleDateString()}</td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ 
                    backgroundColor: row.isActive ? "#dcfce7" : "#f3f4f6", 
                    color: row.isActive ? "#16a34a" : "#4b5563", 
                    fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 4, letterSpacing: 0.5 
                  }}>
                    {row.isActive ? "ACTIVE" : "BLOCKED"}
                  </span>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {row.isActive ? (
                      <button onClick={() => handleUpdateStatus(row._id, false)} style={{ padding: "4px 8px", background: "#4b5563", border: "none", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Block</button>
                    ) : (
                      <button onClick={() => handleUpdateStatus(row._id, true)} style={{ padding: "4px 8px", background: "#2563eb", border: "none", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Unblock</button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ padding: "20px", textAlign: "center", color: "#6b7280", fontSize: 14 }}>
                  No users found.
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
