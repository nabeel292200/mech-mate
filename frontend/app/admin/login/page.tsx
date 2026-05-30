"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  // Login form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Admin Request Modal states
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [adminPhone, setAdminPhone] = useState("");
  const [adminReason, setAdminReason] = useState("");
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [adminSuccess, setAdminSuccess] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both ID/Email and Password.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Simulate validation / authentication response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError("Invalid administrative credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = adminPhone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) return;
    setAdminSubmitting(true);

    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setAdminSubmitting(false);
    setAdminSuccess(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 50% 50%, #fcfcfc 0%, #f3f4f6 100%)",
      fontFamily: "'Inter', 'Geist Sans', Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "relative",
      boxSizing: "border-box"
    }}>
      
      {/* Spacer or empty header for vertical alignment balance */}
      <div style={{ height: 40 }} />

      {/* ===== MAIN CONTAINER ===== */}
      <main style={{
        width: "100%",
        maxWidth: 460,
        margin: "0 auto",
        padding: "0 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        
        {/* Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="8" fill="#b91c1c" />
            <path d="M10 26V12L18 20L26 12V26" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="18" cy="20" r="2.5" fill="#fca5a5" />
          </svg>
          <span style={{ fontSize: 22, fontWeight: 950, color: "#111827", letterSpacing: "-0.05em" }}>
            MECH-MATE
          </span>
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#0f172a", marginBottom: 6, letterSpacing: "-0.03em", textAlign: "center" }}>
          Welcome Back
        </h1>
        <p style={{ fontSize: 14, color: "#475569", marginBottom: 28, textAlign: "center" }}>
          Access the AssistFlow Admin Dashboard
        </p>

        {/* Card */}
        <div style={{
          width: "100%",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          padding: "36px 32px 32px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03), 0 10px 30px rgba(0, 0, 0, 0.02)",
          boxSizing: "border-box"
        }}>
          
          <form onSubmit={handleLoginSubmit}>
            {/* Admin ID / Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 8 }}>
                Admin ID or Email
              </label>
              <div style={{ position: "relative" }}>
                <span className="material-symbols-outlined" style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 20,
                  color: "#94a3b8"
                }}>
                  person
                </span>
                <input
                  type="text"
                  required
                  placeholder="Enter your ID or email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "13px 16px 13px 44px",
                    fontSize: 14,
                    color: "#1e293b",
                    backgroundColor: "#f8fafc",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 10,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#b91c1c"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#334155", margin: 0 }}>
                  Password
                </label>
                <a href="#" style={{ fontSize: 12, fontWeight: 600, color: "#b91c1c", textDecoration: "none" }}>
                  Forgot Password?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <span className="material-symbols-outlined" style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 20,
                  color: "#94a3b8"
                }}>
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "13px 44px 13px 44px",
                    fontSize: 14,
                    color: "#1e293b",
                    backgroundColor: "#f8fafc",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 10,
                    outline: "none",
                    boxSizing: "border-box",
                    letterSpacing: showPassword ? "0" : "4px",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#b91c1c"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    color: "#94a3b8"
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
                borderRadius: 10,
                padding: "12px",
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 16
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "#b91c1c",
                color: "#ffffff",
                border: "none",
                borderRadius: 10,
                padding: "14px 0",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#991b1b"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#b91c1c"}
            >
              {loading ? "Logging in..." : "Login to Dashboard"}
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                arrow_forward
              </span>
            </button>
          </form>

          {/* Security Information Box */}
          <div style={{
            display: "flex",
            gap: 12,
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            padding: "16px",
            marginTop: 24,
            alignItems: "flex-start"
          }}>
            <span className="material-symbols-outlined" style={{
              color: "#b91c1c",
              fontSize: 18,
              marginTop: 1,
              flexShrink: 0
            }}>
              error
            </span>
            <p style={{
              fontSize: 12,
              color: "#64748b",
              lineHeight: 1.5,
              margin: 0,
              fontWeight: 500
            }}>
              Authorized access only. All activities within the AssistFlow Admin environment are logged and monitored for security purposes.
            </p>
          </div>
        </div>

        {/* Option at Bottom */}
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 24, marginBottom: 0, textAlign: "center" }}>
          Need an administrator account?{" "}
          <button
            type="button"
            onClick={() => {
              setAdminPhone("");
              setAdminReason("");
              setAdminSuccess(false);
              setShowRequestModal(true);
            }}
            style={{
              color: "#b91c1c",
              fontWeight: 700,
              border: "none",
              background: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
          >
            Request Admin Access
          </button>
        </p>
      </main>

      {/* ===== BOTTOM FOOTER ===== */}
      <footer style={{
        width: "100%",
        borderTop: "1px solid #e2e8f0",
        padding: "20px 24px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        fontSize: 12,
        color: "#64748b",
        marginTop: 40,
        boxSizing: "border-box"
      }}>
        <div style={{ fontWeight: 700, color: "#475569" }}>
          AssistFlow Admin
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <a href="#" style={{ color: "#64748b", textDecoration: "none" }}>Privacy Policy</a>
          <a href="#" style={{ color: "#64748b", textDecoration: "none" }}>Terms of Service</a>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block" }} />
            System Status
          </div>
        </div>
        <div>
          © 2024 AssistFlow Roadside. All rights reserved.
        </div>
      </footer>

      {/* ===== REQUEST ADMIN ACCESS MODAL ===== */}
      {showRequestModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 20,
            width: "90%",
            maxWidth: 440,
            padding: 32,
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
            position: "relative"
          }}>
            {/* Close */}
            <button
              onClick={() => {
                setShowRequestModal(false);
                setAdminSuccess(false);
                setAdminReason("");
              }}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "transparent",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                color: "#9ca3af"
              }}
            >
              ✕
            </button>

            {!adminSuccess ? (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8, letterSpacing: "-0.02em" }}>
                  Request Admin Access
                </h2>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, marginBottom: 24 }}>
                  Submit your request to gain administrative privileges for the MECH-MATE dashboard.
                </p>

                <form onSubmit={handleRequestSubmit}>
                  {/* Phone Input */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                      Mobile Number
                    </label>
                    <div style={{ display: "flex", borderRadius: 10, border: "1.5px solid #e5e7eb", overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", fontSize: 14, fontWeight: 600, color: "#4b5563", padding: "0 12px", borderRight: "1.5px solid #e5e7eb", flexShrink: 0, minWidth: 60 }}>
                        +91
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        placeholder="Enter 10-digit number"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        style={{ flex: 1, padding: "10px 14px", border: "none", outline: "none", fontSize: 14, letterSpacing: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Reason Textarea */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                      Reason for Request
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Branch manager account activation..."
                      value={adminReason}
                      onChange={(e) => setAdminReason(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1.5px solid #e5e7eb",
                        fontSize: 14,
                        outline: "none",
                        resize: "none",
                        fontFamily: "inherit",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      type="button"
                      onClick={() => setShowRequestModal(false)}
                      style={{
                        flex: 1,
                        padding: "12px 0",
                        borderRadius: 10,
                        border: "1.5px solid #e5e7eb",
                        background: "#fff",
                        color: "#4b5563",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={adminSubmitting}
                      style={{
                        flex: 1,
                        padding: "12px 0",
                        borderRadius: 10,
                        border: "none",
                        background: "#b91c1c",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                        opacity: adminSubmitting ? 0.7 : 1
                      }}
                    >
                      {adminSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 64, color: "#16a34a", marginBottom: 16 }}>
                  check_circle
                </span>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
                  Request Submitted!
                </h2>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 24 }}>
                  Your request for administrator access has been logged. An MECH-MATE systems admin will review it shortly.
                </p>
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setAdminSuccess(false);
                    setAdminReason("");
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 0",
                    borderRadius: 10,
                    border: "none",
                    background: "#b91c1c",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
