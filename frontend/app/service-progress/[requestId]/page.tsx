"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSocket } from "../../../src/services/socket";

export default function ServiceProgressPage() {
  const { requestId } = useParams();
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();
    socket.on("invoice_received", (data: any) => {
      if (data.requestId === requestId) {
        router.push(`/payment/${requestId}`);
      }
    });
    return () => { socket.off("invoice_received"); };
  }, [requestId, router]);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-white font-sans overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#f7f7f8] flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <span className="text-[16px] font-bold text-neutral-900 tracking-tight">Service Progress</span>
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#b91c1c]">
          <span className="material-symbols-outlined text-[20px]">support_agent</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 flex flex-col items-center px-5 overflow-y-auto pb-10">

        {/* Animated Wrench Hero */}
        <div className="flex flex-col items-center mt-6 mb-8">
          <div className="relative w-[180px] h-[180px] flex items-center justify-center mb-6">
            {/* Ring 1 */}
            <div
              className="absolute inset-0 rounded-full border-[2px] border-[#b91c1c]/10 animate-ping"
              style={{ animationDuration: "2.5s" }}
            />
            {/* Ring 2 */}
            <div
              className="absolute inset-[18px] rounded-full bg-red-50/70 animate-pulse"
              style={{ animationDuration: "2s" }}
            />
            {/* Ring 3 */}
            <div className="absolute inset-[36px] rounded-full bg-red-100/60" />
            {/* Center Icon */}
            <div className="absolute inset-[54px] rounded-full bg-[#b91c1c] flex items-center justify-center shadow-[0_8px_30px_rgba(185,28,28,0.30)]">
              <span className="material-symbols-outlined text-white text-[36px]">build</span>
            </div>
          </div>

          {/* Live badge */}
          <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-full px-3 py-1 mb-4">
            <span className="w-2 h-2 bg-[#b91c1c] rounded-full animate-pulse" />
            <span className="text-[11px] font-bold text-[#b91c1c] tracking-widest uppercase">Live Update</span>
          </div>

          <h2 className="text-[26px] font-extrabold text-neutral-900 tracking-tight text-center leading-tight">
            Service in Progress
          </h2>
          <p className="text-[14px] text-neutral-500 font-medium mt-2 text-center leading-snug max-w-[260px]">
            Your mechanic is actively working on your vehicle
          </p>
        </div>

        {/* Mechanic Card */}
        <div className="w-full bg-white rounded-[20px] border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-4 flex items-center gap-4 mb-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-[58px] h-[58px] rounded-full overflow-hidden border-[3px] border-white shadow-md bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80"
                alt="Marcus Thorne"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#10b981] rounded-full border-2 border-white flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[10px] font-bold">check</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-neutral-900 truncate">Marcus Thorne</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[12px] font-bold text-amber-500">★ 4.9</span>
              <span className="text-[12px] text-neutral-400 font-medium">Expert Mechanic · Verified</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors">
              <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-[#b91c1c] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(185,28,28,0.3)] hover:bg-[#991b1b] transition-colors">
              <span className="material-symbols-outlined text-[18px]">call</span>
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="w-full bg-white rounded-[20px] border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 mb-6">
          <p className="text-[11px] font-bold text-neutral-400 tracking-[0.12em] uppercase mb-6">Service Timeline</p>

          <div className="relative pl-8">
            {/* Vertical track */}
            <div className="absolute left-[9px] top-2 bottom-8 w-[2px] bg-neutral-100 rounded-full" />
            {/* Active segment */}
            <div className="absolute left-[9px] top-2 h-[60px] w-[2px] bg-gradient-to-b from-[#b91c1c] to-red-400 rounded-full" />

            {/* Step 1 — Completed */}
            <div className="flex items-start gap-4 mb-8">
              <div className="absolute left-0 w-[20px] h-[20px] bg-neutral-800 rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-white text-[12px]">check</span>
              </div>
              <div className="ml-2">
                <p className="text-[14px] font-bold text-neutral-400 line-through decoration-neutral-300">Mechanic Arrived</p>
                <p className="text-[12px] text-neutral-400 mt-0.5">Completed at 10:24 AM</p>
              </div>
            </div>

            {/* Step 2 — Active */}
            <div className="flex items-start gap-4 mb-8">
              <div className="absolute left-0 mt-0 w-[20px] h-[20px] bg-[#b91c1c] rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(185,28,28,0.4)]">
                <div className="w-[7px] h-[7px] bg-white rounded-full" />
              </div>
              {/* Pulsing ring behind active dot */}
              <div className="absolute left-[-6px] w-[32px] h-[32px] bg-[#b91c1c]/10 rounded-full animate-ping" style={{ animationDuration: "2s", marginTop: "-6px" }} />
              <div className="ml-2">
                <p className="text-[14px] font-bold text-[#b91c1c]">Service in Progress</p>
                <p className="text-[12px] text-neutral-500 mt-0.5">Diagnostics & active repair underway</p>
              </div>
            </div>

            {/* Step 3 — Pending */}
            <div className="flex items-start gap-4">
              <div className="absolute left-0 w-[20px] h-[20px] bg-white border-2 border-neutral-200 rounded-full" />
              <div className="ml-2">
                <p className="text-[14px] font-bold text-neutral-400">Invoice & Payment</p>
                <p className="text-[12px] text-neutral-400 mt-0.5">Awaiting service completion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Card */}
        <div className="w-full bg-gradient-to-r from-red-50 to-rose-50/40 rounded-[20px] border border-red-100 p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-red-100 flex items-center justify-center text-[#b91c1c] shrink-0">
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
          </div>
          <div>
            <p className="text-[13px] font-bold text-neutral-900 mb-1">Stay nearby your vehicle</p>
            <p className="text-[12px] text-neutral-500 leading-relaxed font-medium">
              You'll be automatically redirected to the payment screen the moment Marcus sends your invoice.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
