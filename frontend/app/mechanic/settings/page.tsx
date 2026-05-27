"use client";
import React, { useState } from "react";
import MechanicLayout from "../../../src/components/MechanicLayout";
import { useAuthStore } from "../../../src/store/authStore";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, loading, logout } = useAuthStore();
  const router = useRouter();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  
  if (loading || !user) {
    return (
      <MechanicLayout activeTab="Settings">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
          <span style={{ width: 36, height: 36, border: "3px solid #e5e7eb", borderTopColor: "#b91c1c", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </MechanicLayout>
    );
  }

  const s: Record<string, React.CSSProperties> = {
    card: { background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: 24, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" },
    title: { fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 20 },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #f3f4f6" },
    toggle: { width: 44, height: 24, borderRadius: 12, position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 },
  };

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <div style={{ ...s.toggle, background: checked ? "#16a34a" : "#d1d5db" }} onClick={onChange}>
      <div style={{ position: "absolute", top: 3, left: checked ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </div>
  );

  return (
    <MechanicLayout activeTab="Settings">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 14, color: "#6b7280" }}>Manage your account preferences and security.</p>
      </div>

      <div style={s.card}>
        <p style={s.title}>Notifications</p>
        <div style={s.row}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Push Notifications</p>
            <p style={{ fontSize: 13, color: "#6b7280" }}>Get alerted for new service requests instantly.</p>
          </div>
          <Toggle checked={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
        </div>
        <div style={s.row}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>SMS Alerts</p>
            <p style={{ fontSize: 13, color: "#6b7280" }}>Receive text messages when a user accepts your quote.</p>
          </div>
          <Toggle checked={smsAlerts} onChange={() => setSmsAlerts(!smsAlerts)} />
        </div>
        <div style={{ ...s.row, borderBottom: "none" }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Email Weekly Report</p>
            <p style={{ fontSize: 13, color: "#6b7280" }}>Get a summary of your earnings every Sunday.</p>
          </div>
          <Toggle checked={emailUpdates} onChange={() => setEmailUpdates(!emailUpdates)} />
        </div>
      </div>

      <div style={s.card}>
        <p style={s.title}>Account Actions</p>
        <div style={s.row}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Change Password</p>
            <p style={{ fontSize: 13, color: "#6b7280" }}>Update your password to keep your account secure.</p>
          </div>
          <button style={{ background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>UPDATE</button>
        </div>
        <div style={{ ...s.row, borderBottom: "none" }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#b91c1c" }}>Log Out</p>
            <p style={{ fontSize: 13, color: "#6b7280" }}>End your current session securely.</p>
          </div>
          <button 
            onClick={() => { logout(); router.push("/"); }}
            style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            LOG OUT
          </button>
        </div>
      </div>
    </MechanicLayout>
  );
}
