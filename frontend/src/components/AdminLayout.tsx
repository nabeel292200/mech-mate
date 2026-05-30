"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children, activeTab }: { children: React.ReactNode, activeTab: string }) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/admin/login");
  };

  const menuItems = [
    { label: "Dashboard", icon: "grid_view", route: "/admin/dashboard" },
    { label: "History", icon: "history", route: "/admin/history" },
    { label: "Payments", icon: "payments", route: "/admin/payments" },
    { label: "Settings", icon: "settings", route: "/admin/settings" },
    { label: "Help Center", icon: "help", route: "/admin/help-center" },
    { label: "Analytics", icon: "analytics", route: "/admin/analytics" },
  ];

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* SIDEBAR */}
      <aside style={{
        width: 260,
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0
      }}>
        {/* Brand */}
        <div style={{ padding: "24px", borderBottom: "1px solid transparent" }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#b91c1c", margin: 0, letterSpacing: "-0.05em", display: 'flex', alignItems: 'center', gap: 8 }}>
            MECH-MATE
          </h1>
        </div>
        
        {/* User Profile */}
        <div style={{ padding: "10px 20px 24px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Admin" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>System Admin</h2>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 6px 0" }}>Administrator</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "#ef4444", padding: "4px 10px", borderRadius: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#ffffff" }}></span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>Online</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "10px 0" }}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <div 
                key={item.label}
                onClick={() => router.push(item.route)}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 12, 
                  padding: "14px 24px", 
                  backgroundColor: isActive ? "#fca5a5" : "transparent", 
                  color: isActive ? "#7f1d1d" : "#4b5563", 
                  fontWeight: isActive ? 700 : 600, 
                  fontSize: 14, 
                  cursor: "pointer", 
                  borderRight: isActive ? "4px solid #b91c1c" : "4px solid transparent",
                  transition: "background-color 0.2s" 
                }} 
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = "#f3f4f6"; }} 
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
                {item.label}
              </div>
            );
          })}

          <div onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", color: "#b91c1c", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background-color 0.2s", marginTop: 20 }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fef2f2"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
            Logout
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto", position: "relative" }}>
        {/* Top Nav */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 24, marginBottom: 40, fontSize: 14, fontWeight: 700 }}>
          <span style={{ color: "#b91c1c", cursor: "pointer" }}>{activeTab}</span>
          <span style={{ color: "#6b7280", cursor: "pointer" }}>Profile</span>
          <span style={{ color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>notifications</span>
            Alerts
          </span>
        </div>

        {children}
      </main>
    </div>
  );
}
