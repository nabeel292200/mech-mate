"use client";
import React, { useRef, useState } from "react";
import { useAuthStore } from "../store/authStore";

interface AvatarUploadProps {
  currentAvatar?: string;
  onSuccess?: (url: string) => void;
}

export default function AvatarUpload({ currentAvatar, onSuccess }: AvatarUploadProps) {
  const { checkSession } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview instantly
    setPreview(URL.createObjectURL(file));
    setError("");
    setSuccess(false);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const token = typeof window !== "undefined" ? localStorage.getItem("assist_token") : null;
      const res = await fetch(`${API_BASE}/upload/avatar`, {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        onSuccess?.(data.data.avatarUrl);
        // Refresh auth store so navbar avatar updates instantly
        await checkSession();
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (err: any) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar preview circle */}
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        className="relative w-24 h-24 rounded-full cursor-pointer group overflow-hidden border-2 border-dashed border-neutral-300 bg-neutral-100 flex items-center justify-center"
      >
        {preview ? (
          <img src={preview} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="material-symbols-outlined text-3xl text-neutral-400">person</span>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
          {uploading ? (
            <span className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
          )}
        </div>
        {/* Success badge */}
        {success && !uploading && (
          <div className="absolute bottom-0 right-0 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
            <span className="material-symbols-outlined text-white text-[14px]">check</span>
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className="text-xs font-bold text-[#b91c1c] hover:text-[#991b1b] transition-colors disabled:opacity-50"
      >
        {uploading ? "Uploading..." : success ? "Photo Saved ✓" : "Upload Photo"}
      </button>

      {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
