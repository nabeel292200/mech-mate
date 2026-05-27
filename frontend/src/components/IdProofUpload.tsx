"use client";
import React, { useRef, useState } from "react";

interface IdProofUploadProps {
  currentUrl?: string;
  onSuccess?: (url: string) => void;
}

export default function IdProofUpload({ currentUrl, onSuccess }: IdProofUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploaded, setUploaded] = useState<string | null>(currentUrl || null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError("");
    setSuccess(false);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("idProof", file);

      const token = typeof window !== "undefined" ? localStorage.getItem("assist_token") : null;
      const res = await fetch(`${API_BASE}/upload/id-proof`, {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setUploaded(data.data.idProofUrl);
        onSuccess?.(data.data.idProofUrl);
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
    <div className="w-full">
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-all ${
          success
            ? "border-green-400 bg-green-50"
            : "border-neutral-200 bg-neutral-50 hover:border-[#b91c1c] hover:bg-red-50/30"
        }`}
      >
        {uploading ? (
          <>
            <span className="w-8 h-8 border-4 border-neutral-200 border-t-[#b91c1c] rounded-full animate-spin" />
            <p className="text-sm font-bold text-neutral-500">Uploading to Cloudinary...</p>
          </>
        ) : success ? (
          <>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 text-2xl">verified</span>
            </div>
            <p className="text-sm font-black text-green-700">ID Proof Uploaded ✓</p>
            <p className="text-xs text-green-500 truncate max-w-[200px]">{fileName}</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
              className="text-xs font-bold text-neutral-400 hover:text-neutral-600 transition-colors mt-1"
            >
              Replace file
            </button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-neutral-400 text-2xl">
                {uploaded ? "verified" : "upload_file"}
              </span>
            </div>
            <p className="text-sm font-bold text-neutral-700">
              {uploaded ? "ID Proof on file — click to replace" : "Upload ID Proof"}
            </p>
            <p className="text-xs text-neutral-400">Aadhaar, License, Passport · JPG, PNG, PDF · Max 10MB</p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-xs font-bold text-red-600">
          <span className="material-symbols-outlined text-[16px]">error</span> {error}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
