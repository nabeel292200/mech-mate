"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../src/components/AdminLayout";
import { api } from "../../../src/services/api.service";

export default function AdminMechanicsPage() {
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMechanic, setSelectedMechanic] = useState<any | null>(null);

  useEffect(() => {
    fetchMechanics(page);
  }, [page]);

  const fetchMechanics = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: any }>(`admin/mechanics?page=${pageNum}&limit=10`);
      if (res.success) {
        setMechanics(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch mechanics", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, updates: { approvalStatus?: string; isActive?: boolean }) => {
    try {
      const res = await api.put<{ success: boolean; data: any }>(`admin/mechanics/${id}/status`, updates);
      if (res.success) {
        // Optimistic update
        setMechanics(mechanics.map((m) => {
          if (m._id === id) {
            return { ...m, ...updates };
          }
          return m;
        }));
      }
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Error updating status. Please try again.");
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab="Mechanics">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <h2 style={{ color: "#b91c1c" }}>Loading Mechanics...</h2>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="Mechanics">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>Mechanic Control</h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>View, accept, reject, block, or unblock mechanics.</p>
      </div>

      <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", borderTop: "1px solid #e5e7eb" }}>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Mechanic</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Experience</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Specialization</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Approval</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Account Status</th>
              <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mechanics.length > 0 ? mechanics.map((row: any, i: number) => (
              <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#6b7280", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                      {row.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{row.name}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{row.phone}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563", fontWeight: 500 }}>{row.experience}</td>
                <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563", fontWeight: 500 }}>{row.specialization}</td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ 
                    backgroundColor: (row.approvalStatus || 'approved') === "approved" ? "#dcfce7" : (row.approvalStatus || 'approved') === "rejected" ? "#fee2e2" : "#ffedd5", 
                    color: (row.approvalStatus || 'approved') === "approved" ? "#16a34a" : (row.approvalStatus || 'approved') === "rejected" ? "#dc2626" : "#c2410c", 
                    fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 4, letterSpacing: 0.5 
                  }}>
                    {(row.approvalStatus || 'approved').toUpperCase()}
                  </span>
                </td>
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
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxWidth: "160px" }}>
                    <button 
                      onClick={() => setSelectedMechanic(row)} 
                      style={{ padding: "4px 8px", background: "#f3f4f6", border: "1px solid #d1d5db", color: "#374151", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}
                      title="View Details"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility</span> View
                    </button>
                    {(row.approvalStatus || 'approved') === "pending" && (
                      <>
                        <button onClick={() => handleUpdateStatus(row._id, { approvalStatus: "approved", isActive: true })} style={{ padding: "4px 8px", background: "#16a34a", border: "none", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Accept</button>
                        <button onClick={() => handleUpdateStatus(row._id, { approvalStatus: "rejected", isActive: false })} style={{ padding: "4px 8px", background: "#dc2626", border: "none", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Reject</button>
                      </>
                    )}
                    {(row.approvalStatus || 'approved') === "approved" && row.isActive && (
                      <button onClick={() => handleUpdateStatus(row._id, { isActive: false })} style={{ padding: "4px 8px", background: "#4b5563", border: "none", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Block</button>
                    )}
                    {(row.approvalStatus || 'approved') === "approved" && !row.isActive && (
                      <button onClick={() => handleUpdateStatus(row._id, { isActive: true })} style={{ padding: "4px 8px", background: "#2563eb", border: "none", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Unblock</button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "#6b7280", fontSize: 14 }}>
                  No mechanics found.
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

      {/* Mechanic Details Modal */}
      {selectedMechanic && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          padding: 24
        }}>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            width: "100%",
            maxWidth: 600,
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
          }}>
            {/* Header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#ef4444", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>
                  {selectedMechanic.initials}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>{selectedMechanic.name}</h2>
                  <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>ID: {selectedMechanic._id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMechanic(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", padding: 8, borderRadius: "50%" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>close</span>
              </button>
            </div>
            
            {/* Body */}
            <div style={{ padding: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {/* Column 1 */}
                <div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#9ca3af", letterSpacing: 1, marginBottom: 16 }}>Contact Info</h3>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: 12, color: "#6b7280" }}>Email Address</p>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111827" }}>{selectedMechanic.email || "N/A"}</p>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: 12, color: "#6b7280" }}>Phone Number</p>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111827" }}>{selectedMechanic.phone}</p>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: 12, color: "#6b7280" }}>Location</p>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111827" }}>
                      {selectedMechanic.location?.address || selectedMechanic.workshopName || "Location not provided"}
                    </p>
                  </div>
                  
                  <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#9ca3af", letterSpacing: 1, marginTop: 32, marginBottom: 16 }}>Status</h3>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: 12, color: "#6b7280" }}>Approval Status</p>
                    <span style={{ 
                      backgroundColor: (selectedMechanic.approvalStatus || 'approved') === "approved" ? "#dcfce7" : (selectedMechanic.approvalStatus || 'approved') === "rejected" ? "#fee2e2" : "#ffedd5", 
                      color: (selectedMechanic.approvalStatus || 'approved') === "approved" ? "#16a34a" : (selectedMechanic.approvalStatus || 'approved') === "rejected" ? "#dc2626" : "#c2410c", 
                      fontSize: 12, fontWeight: 700, padding: "4px 8px", borderRadius: 4, letterSpacing: 0.5 
                    }}>
                      {(selectedMechanic.approvalStatus || 'approved').toUpperCase()}
                    </span>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: 12, color: "#6b7280" }}>Account State</p>
                    <span style={{ 
                      backgroundColor: selectedMechanic.isActive ? "#dcfce7" : "#f3f4f6", 
                      color: selectedMechanic.isActive ? "#16a34a" : "#4b5563", 
                      fontSize: 12, fontWeight: 700, padding: "4px 8px", borderRadius: 4, letterSpacing: 0.5 
                    }}>
                      {selectedMechanic.isActive ? "ACTIVE" : "BLOCKED"}
                    </span>
                  </div>
                </div>
                
                {/* Column 2 */}
                <div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#9ca3af", letterSpacing: 1, marginBottom: 16 }}>Professional Details</h3>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: 12, color: "#6b7280" }}>Experience</p>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111827" }}>{selectedMechanic.experience || "Not specified"}</p>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: 12, color: "#6b7280" }}>Specialization (Skills)</p>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111827" }}>{selectedMechanic.specialization || "Not specified"}</p>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: 12, color: "#6b7280" }}>Brand Expertise</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                      {selectedMechanic.brandExpertise && selectedMechanic.brandExpertise.length > 0 ? (
                        selectedMechanic.brandExpertise.map((brand: string, i: number) => (
                          <span key={i} style={{ backgroundColor: "#f3f4f6", color: "#374151", fontSize: 12, fontWeight: 600, padding: "4px 8px", borderRadius: 4 }}>
                            {brand}
                          </span>
                        ))
                      ) : (
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111827" }}>Not specified</p>
                      )}
                    </div>
                  </div>
                  <div style={{ marginBottom: 12, marginTop: 12 }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: 12, color: "#6b7280" }}>Workshop Name</p>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111827" }}>{selectedMechanic.workshopName || "Not specified"}</p>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: 12, color: "#6b7280" }}>Performance</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#fbbf24" }}>star</span>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111827" }}>
                          {selectedMechanic.rating ? selectedMechanic.rating.toFixed(1) : "No ratings"} 
                        </p>
                      </div>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#d1d5db" }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#6b7280" }}>build</span>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111827" }}>
                          {selectedMechanic.totalJobs || 0} Jobs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Documents Section if available */}
              {selectedMechanic.documents && selectedMechanic.documents.length > 0 && (
                <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #e5e7eb" }}>
                  <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#9ca3af", letterSpacing: 1, marginBottom: 16 }}>Documents</h3>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {selectedMechanic.documents.map((doc: string, idx: number) => (
                      <a 
                        key={idx} 
                        href={doc} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", backgroundColor: "#f3f4f6", borderRadius: 8, color: "#374151", textDecoration: "none", fontSize: 14, fontWeight: 600 }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#6b7280" }}>description</span>
                        Document {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer Actions */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid #e5e7eb", backgroundColor: "#f9fafb", display: "flex", gap: 12, justifyContent: "flex-end", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
              <button 
                onClick={() => setSelectedMechanic(null)}
                style={{ padding: "10px 20px", background: "#fff", border: "1px solid #d1d5db", color: "#374151", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
