"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../../src/store/authStore";
import { api } from "../../../src/services/api.service";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as "admin" | "mechanic") ?? "mechanic";
  const { login, register, isAuthenticated, user } = useAuthStore();

  const [role, setRole] = useState<"admin" | "mechanic">(initialRole);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "mechanic") {
        if (!user.isProfileComplete) {
          router.push("/mechanic/dashboard");
        } else {
          router.push("/mechanic/home");
        }
      }
    }
  }, [isAuthenticated, user, router]);

  const [mode, setMode] = useState<"login" | "register" | "forgot" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (mode === "forgot") {
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        setError("Please enter a valid email address");
        triggerShake();
        return;
      }
    } else if (mode === "reset") {
      if (resetCode.length !== 4) {
        setError("Please enter a valid 4-digit code");
        triggerShake();
        return;
      }
      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters");
        triggerShake();
        return;
      }
    } else {
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        setError("Please enter a valid email address");
        triggerShake();
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        triggerShake();
        return;
      }
    }

    setError("");
    setLoading(true);

    try {
      if (mode === "forgot") {
        const res = await api.post<{success: boolean; message: string}>("auth/forgot-password", { emailOrPhone: email });
        if (res.success) {
          setMode("reset");
          setError("");
        }
        setLoading(false);
        return;
      }

      if (mode === "reset") {
        const res = await api.post<{success: boolean; message: string}>("auth/reset-password", { emailOrPhone: email, resetCode, newPassword });
        if (res.success) {
          setMode("login");
          setPassword("");
          setError("Password reset successfully. Please log in.");
        }
        setLoading(false);
        return;
      }

      let authData;
      if (mode === "login") {
        authData = await login(email, password);
      } else {
        // Register: admin/mechanic don't have phone, so pass empty string
        authData = await register("", email, password, role);
      }

      // Role mismatch guard
      if (role === "mechanic" && authData.role !== "mechanic") {
        setError("This account is not registered as a mechanic. Please switch to Admin tab.");
        triggerShake();
        return;
      }
      if (role === "admin" && authData.role !== "admin") {
        setError("This account is not registered as an admin. Please switch to Mechanic tab.");
        triggerShake();
        return;
      }

      // Routing logic based on authenticated role
      if (authData.role === "admin") {
        router.push("/admin/dashboard");
      } else if (authData.role === "mechanic") {
        if (!authData.isProfileComplete) {
          router.push("/mechanic/dashboard");
        } else {
          router.push("/mechanic/home");
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify credentials.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Geist Sans', Arial, sans-serif" }} className="flex min-h-screen">
      {/* ===== LEFT PANEL ===== */}
      <div className="relative hidden md:block" style={{ flex: "1.2", minWidth: 0 }}>
        <a href="/" className="absolute top-7 left-8 z-10 text-[22px] font-black tracking-tight text-red-700 no-underline">
          MECH-MATE
        </a>
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop&q=80"
          alt="Mechanic working"
          className="w-full h-full object-cover object-center block"
          style={{ position: "absolute", inset: 0 }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.50) 100%)" }} />
        <div className="absolute z-10" style={{ bottom: 36, left: 32, right: 32, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 26, flexShrink: 0 }}>🔧</span>
          <div>
            <p className="text-[15px] font-bold text-white" style={{ marginBottom: 3 }}>
              {role === "mechanic" ? "Join Our Network" : "Admin Portal"}
            </p>
            <p className="text-[13px] leading-snug" style={{ color: "rgba(255,255,255,0.8)" }}>
              {role === "mechanic" ? "Connect with drivers who need your skills" : "Manage mechanics and system operations"}
            </p>
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="flex items-center justify-center py-12 px-8 bg-[#f2f2f2]" style={{ flex: 1, minWidth: 0 }}>
        <div className="w-full" style={{ maxWidth: 420 }}>
          {/* Card Wrapper */}
          <div
            className={`bg-white rounded-2xl shadow-md border border-gray-100 mb-4 ${shake ? "animate-shake" : ""}`}
            style={{ padding: "32px 28px" }}
          >
            {/* Role Tabs */}
            <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 12, padding: 4, marginBottom: 16 }}>
              <button
                type="button"
                onClick={() => { setRole("mechanic"); setError(""); }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontSize: 14,
                  fontWeight: "bold",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: role === "mechanic" ? "#fff" : "transparent",
                  color: role === "mechanic" ? "#111827" : "#9ca3af",
                  boxShadow: role === "mechanic" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                }}
              >
                Mechanic
              </button>
              <button
                type="button"
                onClick={() => { setRole("admin"); setError(""); }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontSize: 14,
                  fontWeight: "bold",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: role === "admin" ? "#fff" : "transparent",
                  color: role === "admin" ? "#111827" : "#9ca3af",
                  boxShadow: role === "admin" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                }}
              >
                Admin
              </button>
            </div>

            {/* Login / Register Toggle */}
            {(mode === "login" || mode === "register") && (
              <div style={{ display: "flex", marginBottom: 24, gap: 16 }}>
                <span
                  onClick={() => { setMode("login"); setError(""); }}
                  style={{
                    fontSize: 14,
                    fontWeight: mode === "login" ? "bold" : "500",
                    color: mode === "login" ? "#b91c1c" : "#6b7280",
                    cursor: "pointer",
                    borderBottom: mode === "login" ? "2px solid #b91c1c" : "2px solid transparent",
                    paddingBottom: 4
                  }}
                >
                  Sign In
                </span>
                <span
                  onClick={() => { setMode("register"); setError(""); }}
                  style={{
                    fontSize: 14,
                    fontWeight: mode === "register" ? "bold" : "500",
                    color: mode === "register" ? "#b91c1c" : "#6b7280",
                    cursor: "pointer",
                    borderBottom: mode === "register" ? "2px solid #b91c1c" : "2px solid transparent",
                    paddingBottom: 4
                  }}
                >
                  Register
                </span>
              </div>
            )}

            <h1 className="text-[22px] font-extrabold text-gray-900 tracking-tight mb-1.5">
              {mode === "login" ? `Welcome Back, ${role === "admin" ? "Admin" : "Mechanic"}` : mode === "register" ? `Create ${role === "admin" ? "Admin" : "Mechanic"} Account` : mode === "forgot" ? "Reset Password" : "Enter Reset Code"}
            </h1>
            <p className="text-[14px] text-gray-400 leading-relaxed mb-6">
              {mode === "login" || mode === "register" ? (
                role === "mechanic"
                  ? `Authenticate as a MECH-MATE Mechanic.`
                  : `Authenticate to access the Admin Console.`
              ) : mode === "forgot" ? (
                "Enter your registered email address to receive a reset code."
              ) : (
                "Enter the 4-digit reset code and a new password."
              )}
            </p>

            <form onSubmit={handleSubmit}>
              {/* Login Email Input */}
              {mode !== "reset" && (
                <div className="mb-4">
                  <label className="block text-[12px] font-semibold text-gray-500 mb-2 tracking-wide">
                    Email Address
                  </label>
                  <div className="flex rounded-xl overflow-hidden" style={{ border: "1.5px solid #e5e7eb" }}>
                    <input
                      className="flex-1 outline-none text-[16px] font-medium text-gray-900 bg-white placeholder-gray-300"
                      style={{ padding: "13px 16px", border: "none", minWidth: 0 }}
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => { 
                        setEmail(e.target.value);
                        setError(""); 
                      }}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Reset Code Input */}
              {mode === "reset" && (
                <div className="mb-4">
                  <label className="block text-[12px] font-semibold text-gray-500 mb-2 tracking-wide">
                    4-Digit Reset Code
                  </label>
                  <div className="rounded-xl overflow-hidden" style={{ border: "1.5px solid #e5e7eb" }}>
                    <input
                      className="w-full outline-none text-[16px] font-medium text-gray-900 bg-white placeholder-gray-300"
                      style={{ padding: "13px 16px", border: "none", boxSizing: "border-box", letterSpacing: 2 }}
                      type="text"
                      maxLength={4}
                      placeholder="e.g. 1234"
                      value={resetCode}
                      onChange={(e) => { setResetCode(e.target.value.replace(/\D/g, "")); setError(""); }}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password Input */}
              {(mode === "login" || mode === "register" || mode === "reset") && (
                <div className="mb-5">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <label className="block text-[12px] font-semibold text-gray-500 mb-2 tracking-wide">
                      {mode === "reset" ? "New Password" : "Password"}
                    </label>
                    {mode === "login" && (
                      <span 
                        onClick={() => { setMode("forgot"); setError(""); }}
                        style={{ fontSize: 12, fontWeight: 600, color: "#b91c1c", cursor: "pointer" }}
                      >
                        Forgot Password?
                      </span>
                    )}
                  </div>
                  <div className="rounded-xl overflow-hidden" style={{ border: "1.5px solid #e5e7eb" }}>
                    <input
                      className="w-full outline-none text-[16px] font-medium text-gray-900 bg-white placeholder-gray-300"
                      style={{ padding: "13px 16px", border: "none", boxSizing: "border-box" }}
                      type="password"
                      placeholder="Enter password (min 6 chars)"
                      value={mode === "reset" ? newPassword : password}
                      onChange={(e) => { 
                        if (mode === "reset") setNewPassword(e.target.value); 
                        else setPassword(e.target.value); 
                        setError(""); 
                      }}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 text-red-600 rounded-xl p-3 text-[13px] font-medium mb-4">
                  ⚠️ {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white rounded-xl font-extrabold tracking-[1.5px] uppercase border-none cursor-pointer transition-all duration-200 hover:-translate-y-px active:scale-[0.98] flex items-center justify-center"
                style={{ padding: "15px 0", fontSize: 14 }}
              >
                {loading ? (
                  <span className="w-5 h-5 border-[2.5px] border-white/40 border-t-white rounded-full animate-spin-btn inline-block" />
                ) : mode === "login" ? (
                  "SIGN IN"
                ) : mode === "register" ? (
                  "CREATE ACCOUNT"
                ) : mode === "forgot" ? (
                  "SEND RESET CODE"
                ) : (
                  "RESET PASSWORD"
                )}
              </button>

              {/* Back to Login */}
              {(mode === "forgot" || mode === "reset") && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <button 
                    type="button" 
                    onClick={() => { setMode("login"); setError(""); }}
                    style={{ background: "none", border: "none", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span> Back to Login
                  </button>
                </div>
              )}
            </form>
          </div>

          <div style={{ marginTop: 24, borderTop: "1px solid #f3f4f6", paddingTop: 16, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
              Looking for Customer Login?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                style={{ color: "#b91c1c", fontWeight: 700, textDecoration: "none", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}>
                Go to <br /> Customer Portal
              </button>
            </p>
          </div>

          {/* Policy footer */}
          <p className="text-center text-[12px] text-gray-400 leading-relaxed px-2 mt-4">
            By continuing, you agree to our{" "}
            <a href="#" className="text-red-700 underline font-medium">Terms of Service</a>
            {" "}and <a href="#" className="text-red-700 underline font-medium">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#f2f2f2]">
        <span className="w-9 h-9 border-[3px] border-gray-200 border-t-red-700 rounded-full animate-spin-btn inline-block" />
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
}
