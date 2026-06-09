"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../src/components/AdminLayout";
import { api } from "../../../src/services/api.service";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newSkill, setNewSkill] = useState({ name: "", category: "mechanical" });

  useEffect(() => {
    fetchSkills(page);
  }, [page]);

  const fetchSkills = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: any }>(`admin/skills?page=${pageNum}&limit=10`);
      if (res.success) {
        setSkills(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch skills", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name) return;
    try {
      const res = await api.post<{ success: boolean; data: any }>("admin/skills", newSkill);
      if (res.success) {
        setSkills([...skills, res.data]);
        setNewSkill({ name: "", category: "mechanical" });
      }
    } catch (error) {
      console.error("Failed to add skill", error);
      alert("Error adding skill. It might already exist in this category.");
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      const res = await api.put<{ success: boolean; data: any }>(`admin/skills/${id}`, { isActive });
      if (res.success) {
        setSkills(skills.map((s) => (s._id === id ? res.data : s)));
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      const res = await api.delete<{ success: boolean }>(`admin/skills/${id}`);
      if (res.success) {
        setSkills(skills.filter((s) => s._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete skill", error);
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab="Skills">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <h2 style={{ color: "#b91c1c" }}>Loading Skills...</h2>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="Skills">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>Skill Management</h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Manage the mechanic skills available on the platform.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>
        {/* Add Skill Form */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", alignSelf: "start" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 20px 0" }}>Add New Skill</h3>
          <form onSubmit={handleAddSkill} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Skill Name</label>
              <input 
                type="text" 
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="e.g., Tire Repair, Engine Tuning" 
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, outline: "none" }} 
                required 
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Category</label>
              <select 
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, outline: "none", backgroundColor: "#fff" }}
              >
                <option value="mechanical">Mechanical</option>
                <option value="electrical">Electrical</option>
                <option value="tire">Tire</option>
                <option value="general">General</option>
              </select>
            </div>
            <button type="submit" style={{ backgroundColor: "#111827", color: "#fff", padding: "12px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
              Add Skill
            </button>
          </form>
        </div>

        {/* Skills List */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", borderTop: "1px solid #e5e7eb" }}>
                <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Skill Name</th>
                <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Category</th>
                <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>Status</th>
                <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "#6b7280", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.length > 0 ? skills.map((skill: any) => (
                <tr key={skill._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 700, color: "#111827" }}>{skill.name}</td>
                  <td style={{ padding: "16px 20px", fontSize: 14, color: "#4b5563", textTransform: "capitalize" }}>{skill.category}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ 
                      backgroundColor: skill.isActive ? "#dcfce7" : "#f3f4f6", 
                      color: skill.isActive ? "#16a34a" : "#4b5563", 
                      fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 4, letterSpacing: 0.5 
                    }}>
                      {skill.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      {skill.isActive ? (
                        <button onClick={() => handleToggleStatus(skill._id, false)} style={{ padding: "4px 8px", background: "#4b5563", border: "none", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Disable</button>
                      ) : (
                        <button onClick={() => handleToggleStatus(skill._id, true)} style={{ padding: "4px 8px", background: "#16a34a", border: "none", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Enable</button>
                      )}
                      <button onClick={() => handleDelete(skill._id)} style={{ padding: "4px 8px", background: "#dc2626", border: "none", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Delete</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ padding: "20px", textAlign: "center", color: "#6b7280", fontSize: 14 }}>
                    No skills found. Add one on the left.
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
      </div>
    </AdminLayout>
  );
}
