"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../src/store/authStore";
import MechanicLayout from "../../../src/components/MechanicLayout";
import { api } from "../../../src/services/api.service";

export default function CompletedJobsPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && user) {
      if (user.role !== "mechanic") {
        router.push("/login?role=mechanic");
        return;
      }
      fetchCompletedJobs();
    }
  }, [user, loading, router]);

  const fetchCompletedJobs = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.get("mechanic/requests/completed");
      if (res.success) {
        setJobs(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch completed jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.brandName?.toLowerCase().includes(search.toLowerCase()) || 
    job.userId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading || isLoading) {
    return (
      <MechanicLayout activeTab="Completed Jobs">
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
    <MechanicLayout activeTab="Completed Jobs">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 4 }}>Completed Jobs</h1>
          <p style={{ fontSize: 14, color: "#6b7280" }}>Review your historical service requests and billed amounts.</p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", width: 300, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <span className="material-symbols-outlined" style={{ color: "#9ca3af", fontSize: 18, marginRight: 8 }}>search</span>
          <input 
            type="text" 
            placeholder="Search customer or car brand..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", width: "100%", fontSize: 13, background: "transparent" }}
          />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", background: "#fff", borderRadius: 16, border: "1px dashed #d1d5db" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, display: "block", marginBottom: 16, color: "#9ca3af" }}>receipt_long</span>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 4 }}>No completed jobs found.</p>
          <p style={{ fontSize: 13, color: "#6b7280" }}>{search ? "Try a different search term." : "Jobs you complete will appear here along with their earnings."}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredJobs.map((job) => (
            <div key={job._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f3f4f6", transition: "all 0.2s cursor: pointer" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#f3f4f6"; (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#16a34a" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>verified</span>
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "#111827", marginBottom: 2 }}>{job.userId?.name || "Customer"}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <p style={{ fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>directions_car</span>
                      {job.brandName}
                    </p>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#d1d5db" }} />
                    <p style={{ fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_today</span>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#16a34a" }}>${job.totalAmount?.toFixed(2) || "0.00"}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.5px" }}>EARNED</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </MechanicLayout>
  );
}
