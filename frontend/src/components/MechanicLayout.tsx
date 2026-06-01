"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

const NAV = [
  { icon: "dashboard", label: "Dashboard", href: "/mechanic/home" },
  { icon: "assignment", label: "Active Requests", href: "/mechanic/active-requests" },
  { icon: "task_alt", label: "Completed Jobs", href: "/mechanic/completed-jobs" },
  { icon: "payments", label: "Earnings", href: "/mechanic/earnings" },
  { icon: "person", label: "Profile", href: "/mechanic/dashboard" },
];

interface MechanicLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export default function MechanicLayout({ children, activeTab }: MechanicLayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  if (user?.approvalStatus === "pending") {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: "#fff", padding: "40px 32px", borderRadius: 16, textAlign: "center", maxWidth: 420, width: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 64, color: "#f59e0b", marginBottom: 16 }}>hourglass_empty</span>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>Pending Approval</h2>
          <p style={{ fontSize: 15, color: "#4b5563", marginBottom: 32, lineHeight: 1.6 }}>
            Your profile has been submitted and is currently under review by our admin team. You will be notified once it is approved. Please wait.
          </p>
          <button onClick={logout} style={{ background: "#111827", color: "#fff", border: "none", padding: "14px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#1f2937"} onMouseLeave={(e) => e.currentTarget.style.background = "#111827"}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span> Logout
          </button>
        </div>
      </div>
    );
  }

  if (user?.approvalStatus === "rejected") {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: "#fff", padding: "40px 32px", borderRadius: 16, textAlign: "center", maxWidth: 420, width: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 64, color: "#ef4444", marginBottom: 16 }}>cancel</span>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>Application Rejected</h2>
          <p style={{ fontSize: 15, color: "#4b5563", marginBottom: 32, lineHeight: 1.6 }}>
            Unfortunately, your application to join Mech-Mate has been rejected by the admin team. Please contact support for more information.
          </p>
          <button onClick={logout} style={{ background: "#111827", color: "#fff", border: "none", padding: "14px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#1f2937"} onMouseLeave={(e) => e.currentTarget.style.background = "#111827"}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span> Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter','Geist Sans',Arial,sans-serif", background: "#f5f6fa", overflow: "hidden" }}>
      
      {/* ===== SIDEBAR ===== */}
      <aside style={{ width: 220, background: "#fff", borderRight: "1px solid #f0f0f0", display: "flex", flexDirection: "column", flexShrink: 0, height: "100vh", position: "sticky", top: 0 }}>
        <div style={{ padding: "22px 20px 18px" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, color: "#b91c1c", letterSpacing: "-0.04em", textDecoration: "none" }}>MECH-MATE</a>
        </div>
        <nav style={{ flex: 1, padding: "4px 12px" }}>
          {NAV.map(({ icon, label, href }) => {
            const active = activeTab === label;
            return (
              <div key={label} 
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 10, marginBottom: 2, background: active ? "#b91c1c" : "transparent", cursor: "pointer", transition: "background 0.15s" }}
                onClick={() => router.push(href)}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: active ? "#fff" : "#6b7280" }}>{icon}</span>
                <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? "#fff" : "#374151" }}>{label}</span>
              </div>
            );
          })}
        </nav>
        {/* Bottom nav items */}
        <div style={{ padding: "12px 12px 20px", borderTop: "1px solid #f3f4f6" }}>
          {[{ icon: "settings", label: "Settings", href: "/mechanic/settings" }, { icon: "logout", label: "Logout", href: "#" }].map(({ icon, label, href }) => (
            <div key={label} 
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 2 }}
              onClick={() => {
                if (label === "Logout") {
                  logout();
                } else {
                  router.push(href);
                }
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#6b7280" }}>{icon}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>{label}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {/* Top bar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{user?.name || "Alex Smith"}</p>
            <p style={{ fontSize: 12, color: "#9ca3af" }}>
              {user?.mechanic?.experience ? `${user.mechanic.experience} Years Exp.` : "Certified Mechanic"}
            </p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f3f4f6", overflow: "hidden", border: "2px solid #e5e7eb" }}>
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "M")}&background=b91c1c&color=fff&size=80`}
              alt={user?.name || "avatar"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </header>

        {/* Scrollable content passed as children */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 28px 40px" }}>
          {children}
        </main>

      </div>
    </div>
  );
}
