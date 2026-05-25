"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../src/store/authStore";
import { getSocket } from "../../../src/services/socket";

const NAV = [
  { icon: "dashboard", label: "Dashboard", active: true },
  { icon: "assignment", label: "Active Requests", active: false },
  { icon: "task_alt", label: "Completed Jobs", active: false },
  { icon: "payments", label: "Earnings", active: false },
  { icon: "person", label: "Profile", active: false },
];

const REQUESTS = [
  {
    id: 1, priority: "URGENT", name: "Marcus Thorne", km: "0.8",
    car: "2021 BMW X5 • Black",
    problem: `"Smoke coming from under the hood. Engine stalling and won't restart on the shoulder."`,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=70",
  },
  {
    id: 2, priority: "STANDARD", name: "Sarah Jenkins", km: "2.4",
    car: "2019 Toyota RAV4 • Silver",
    problem: `"Flat rear-right tire. Spare is in the trunk but I don't have a working jack."`,
    img: "https://images.unsplash.com/photo-1609743522471-83c84ce23e32?w=400&auto=format&fit=crop&q=70",
  },
  {
    id: 3, priority: "URGENT", name: "David Wilson", km: "3.7",
    car: "2022 Honda Civic • Red",
    problem: `"Battery seems dead. Clicking sound when trying to start. Need a jump or replacement."`,
    img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&auto=format&fit=crop&q=70",
  },
];

export default function MechanicHome() {
  const router = useRouter();
  const { user, loading, logout } = useAuthStore();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [accepted, setAccepted] = useState<string[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const socket = getSocket();
    
    if (user && user.role === "mechanic" && user.mechanic) {
      const mechanicId = typeof user.mechanic === "string" ? user.mechanic : (user.mechanic._id || user.mechanic.id);
      if (mechanicId) {
        socket.emit("register_mechanic", { mechanicId });
      }
    }
    
    socket.on("new_request", (req: any) => {
      // Map DB request to UI request format
      const mappedReq = {
        id: req._id,
        priority: "URGENT",
        name: "New Customer",
        km: "2.5",
        car: req.brandName,
        problem: req.problemDetails,
        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=70",
      };
      setRequests((prev) => [...prev, mappedReq]);
    });

    socket.on("request_accepted", (updatedReq: any) => {
      if (user && updatedReq.mechanicId === user._id) {
        router.push(`/live-tracking/${updatedReq._id}?role=mechanic`);
      }
    });

    return () => {
      socket.off("new_request");
      socket.off("request_accepted");
    };
  }, [user, router]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login?role=mechanic");
      } else if (user.role !== "mechanic") {
        router.push("/login?role=mechanic");
      } else if (!user.isProfileComplete) {
        router.push("/mechanic/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !user.isProfileComplete) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f5f6fa" }}>
        <span style={{ width: 36, height: 36, border: "3px solid #e5e7eb", borderTopColor: "#b91c1c", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style jsx global>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const visible = requests.filter((r) => !dismissed.includes(r.id));

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter','Geist Sans',Arial,sans-serif", background: "#f5f6fa", overflow: "hidden" }}>

      {/* ===== SIDEBAR ===== */}
      <aside style={{ width: 220, background: "#fff", borderRight: "1px solid #f0f0f0", display: "flex", flexDirection: "column", flexShrink: 0, height: "100vh", position: "sticky", top: 0 }}>
        <div style={{ padding: "22px 20px 18px" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, color: "#b91c1c", letterSpacing: "-0.04em", textDecoration: "none" }}>MECH-MATE</a>
        </div>
        <nav style={{ flex: 1, padding: "4px 12px" }}>
          {NAV.map(({ icon, label, active }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 10, marginBottom: 2, background: active ? "#b91c1c" : "transparent", cursor: "pointer", transition: "background 0.15s" }}
              onClick={() => {
                if (label === "Profile") {
                  router.push("/mechanic/dashboard");
                }
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: active ? "#fff" : "#6b7280" }}>{icon}</span>
              <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? "#fff" : "#374151" }}>{label}</span>
            </div>
          ))}
        </nav>
        {/* Bottom nav items */}
        <div style={{ padding: "12px 12px 20px", borderTop: "1px solid #f3f4f6" }}>
          {[{ icon: "settings", label: "Settings" }, { icon: "logout", label: "Logout" }].map(({ icon, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 2 }}
              onClick={() => {
                if (label === "Logout") {
                  logout();
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
            <p style={{ fontSize: 12, color: "#9ca3af" }}>{user?.mechanic?.experience ? `${user.mechanic.experience} Years Exp.` : "Certified Mechanic"}</p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f3f4f6", overflow: "hidden", border: "2px solid #e5e7eb" }}>
            <img src="https://i.pravatar.cc/80?img=12" alt={user?.name || "avatar"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </header>

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 28px 40px" }}>

          {/* Heading */}
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 4 }}>Available Requests</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>Immediate roadside assistance calls in your current zone.</p>

          {/* Request Cards */}
          {visible.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 56, display: "block", marginBottom: 12 }}>inbox</span>
              <p style={{ fontSize: 16, fontWeight: 600 }}>No pending requests in your zone</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18, marginBottom: 36 }}>
              {visible.map((req) => {
                const isUrgent = req.priority === "URGENT";
                const isAccepted = accepted.includes(req.id);
                return (
                  <div key={req.id} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: isAccepted ? "2px solid #16a34a" : "2px solid transparent", transition: "border 0.2s" }}>
                    {/* Image */}
                    <div style={{ position: "relative", height: 140 }}>
                      <img src={req.img} alt={req.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <span style={{ position: "absolute", top: 10, left: 10, background: isUrgent ? "#b91c1c" : "#374151", color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 100, letterSpacing: "0.5px" }}>
                        {req.priority}
                      </span>
                      {isAccepted && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(22,163,74,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#16a34a" }}>check_circle</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div style={{ padding: "16px 16px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <p style={{ fontSize: 17, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>{req.name}</p>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <span style={{ fontSize: 22, fontWeight: 900, color: "#b91c1c", lineHeight: 1 }}>{req.km}</span>
                          <p style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.3 }}>km<br />Away</p>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#9ca3af" }}>directions_car</span>
                        <span style={{ fontSize: 12, color: "#6b7280" }}>{req.car}</span>
                      </div>

                      {/* Problem */}
                      <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#b91c1c", letterSpacing: "0.5px", marginBottom: 4 }}>PROBLEM SUMMARY</p>
                        <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.55 }}>{req.problem}</p>
                      </div>

                      {/* Buttons */}
                      {isAccepted ? (
                        <div
                          onClick={() => router.push(`/live-tracking/${req.id}?role=mechanic`)}
                          style={{ textAlign: "center", padding: "10px 0", fontSize: 13, fontWeight: 700, color: "#16a34a", cursor: "pointer", border: "1.5px dashed #16a34a", borderRadius: 8, background: "#f0fdf4" }}>
                          ✓ Request Accepted (Click to Track)
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => {
                            setAccepted((p) => [...p, req.id]);
                            const socket = getSocket();
                            socket.emit("accept_request", { requestId: req.id, mechanicId: user?._id });
                          }}
                            style={{ flex: 1, background: "#b91c1c", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "background 0.15s" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#991b1b"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#b91c1c"; }}
                          >ACCEPT</button>
                          <button onClick={() => setDismissed((p) => [...p, req.id])}
                            style={{ flex: 1, background: "#fff", color: "#374151", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "11px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
                          >REJECT</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Shift Overview */}
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 16 }}>Shift Overview</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { icon: "timer", value: "4h 22m", label: "ACTIVE SHIFT", color: "#f97316" },
              { icon: "attach_money", value: "$284.50", label: "TODAY'S EARNINGS", color: "#16a34a" },
              { icon: "task_alt", value: "6", label: "JOBS COMPLETED", color: "#2563eb" },
            ].map(({ icon, value, label, color }) => (
              <div key={label} style={{ background: "#fff", borderRadius: 14, padding: "22px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 28, color, display: "block", marginBottom: 10 }}>{icon}</span>
                <p style={{ fontSize: 28, fontWeight: 900, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "1px", marginTop: 6 }}>{label}</p>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* FAB */}
      <button style={{ position: "fixed", bottom: 28, right: 28, width: 52, height: 52, borderRadius: "50%", background: "#b91c1c", color: "#fff", border: "none", boxShadow: "0 4px 20px rgba(185,28,28,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, transition: "transform 0.15s" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 26 }}>add</span>
      </button>
    </div>
  );
}
