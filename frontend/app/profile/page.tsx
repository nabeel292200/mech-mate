"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../src/store/authStore";
import AvatarUpload from "../../src/components/AvatarUpload";

export default function UserProfilePage() {
  const router = useRouter();
  const { user, loading, logout, updateProfile } = useAuthStore();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) setName(user.name || "");
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <span className="w-9 h-9 border-4 border-neutral-200 border-t-[#b91c1c] rounded-full animate-spin" />
      </div>
    );
  }

  const handleSave = async () => {
    if (!name.trim()) { setError("Name cannot be empty"); return; }
    setSaving(true); setError("");
    try {
      await updateProfile({ name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors">
          <span className="material-symbols-outlined text-[22px] text-neutral-600">arrow_back</span>
        </button>
        <h1 className="text-xl font-black text-neutral-900 tracking-tight">My Profile</h1>
      </header>

      <main className="max-w-lg mx-auto px-6 py-8 space-y-6">
        {/* Avatar Section */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-8 shadow-sm flex flex-col items-center">
          <AvatarUpload
            currentAvatar={user.avatar || ""}
            onSuccess={() => {}}
          />
          <p className="text-xs text-neutral-400 mt-2">Max 5MB · JPG, PNG, WebP</p>
        </div>

        {/* Name & Phone Section */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-neutral-900 uppercase tracking-widest text-[#b91c1c]">Personal Info</h2>

          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1.5">Full Name</label>
            <input
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] transition-all"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1.5">Phone Number</label>
            <input
              disabled
              className="w-full border border-neutral-100 rounded-xl px-4 py-3 text-sm text-neutral-400 bg-neutral-50 cursor-not-allowed"
              value={user.phone}
            />
          </div>

          {error && <p className="text-xs font-bold text-[#b91c1c]">{error}</p>}

          <button
            disabled={saving}
            onClick={handleSave}
            className={`w-full rounded-xl py-3.5 text-sm font-black uppercase tracking-wide transition-colors ${
              saved ? "bg-green-600 text-white" : "bg-[#b91c1c] hover:bg-[#991b1b] text-white"
            } disabled:opacity-70`}
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
          <h2 className="text-sm font-black text-neutral-900 uppercase tracking-widest text-[#b91c1c] mb-4">Account</h2>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 hover:bg-red-50 hover:text-red-600 font-bold text-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-red-500">logout</span>
            Log Out
          </button>
        </div>
      </main>
    </div>
  );
}
