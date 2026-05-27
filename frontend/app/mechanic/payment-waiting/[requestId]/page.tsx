"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSocket } from "../../../../src/services/socket";
import MechanicLayout from "../../../../src/components/MechanicLayout";

export default function PaymentWaitingPage() {
  const { requestId } = useParams();
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();
    socket.on("payment_completed", (data: { requestId: string }) => {
      if (data.requestId === requestId) {
        router.push("/mechanic/completed-jobs");
      }
    });
    return () => { socket.off("payment_completed"); };
  }, [requestId, router]);

  return (
    <MechanicLayout activeTab="Active Requests">
      <style dangerouslySetInnerHTML={{ __html: `
        .loading-pulse {
            animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        @keyframes pulse-ring {
            0% { transform: scale(.33); opacity: 1; }
            80%, 100% { transform: scale(1); opacity: 0; }
        }
      `}} />
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-3xl mx-auto text-center px-4">
        
        {/* Central Hero Section */}
        <section className="w-full flex flex-col items-center mb-12">
          <div className="relative w-48 h-48 flex items-center justify-center mb-8 mt-12">
            <div className="absolute inset-0 bg-red-100 rounded-full loading-pulse"></div>
            <div className="absolute inset-4 bg-red-200 rounded-full loading-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="z-10 bg-[#b91c1c] w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <span className="material-symbols-outlined text-white text-[48px]">payments</span>
            </div>
          </div>
          <h2 className="text-[28px] leading-[34px] font-black text-neutral-900 tracking-tight mb-2">Waiting for Payment</h2>
          <p className="text-[16px] text-neutral-500 font-medium">The invoice has been sent. Waiting for the customer to complete the transaction on their device.</p>
        </section>

        {/* Live Progress Timeline */}
        <section className="w-full max-w-md mx-auto text-left mb-12 bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="space-y-0">
            {/* Step 1: Invoice Sent */}
            <div className="flex gap-4 min-h-[64px]">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#b91c1c] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
                <div className="w-0.5 h-full bg-[#b91c1c]"></div>
              </div>
              <div className="pb-6">
                <p className="text-[14px] leading-[20px] font-bold text-neutral-900">Invoice Sent</p>
                <p className="text-[12px] leading-[16px] text-neutral-500 mt-0.5">Customer has received the bill</p>
              </div>
            </div>

            {/* Step 2: Active */}
            <div className="flex gap-4 min-h-[64px]">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#b91c1c] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                </div>
                <div className="w-0.5 h-full bg-neutral-200"></div>
              </div>
              <div className="pb-6">
                <p className="text-[14px] leading-[20px] text-[#b91c1c] font-bold">Payment Processing</p>
                <p className="text-[12px] leading-[16px] text-neutral-500 mt-0.5">Waiting for secure confirmation</p>
              </div>
            </div>

            {/* Step 3: Pending */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center"></div>
              </div>
              <div>
                <p className="text-[14px] leading-[20px] font-bold text-neutral-400">Job Complete</p>
                <p className="text-[12px] leading-[16px] text-neutral-400 mt-0.5">Will redirect automatically</p>
              </div>
            </div>
          </div>
        </section>

        {/* Manual Bypass / Refresh for Mechanics */}
        <button 
          onClick={() => router.push("/mechanic/completed-jobs")}
          className="text-sm font-bold text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Customer paid in cash? Skip to completed jobs
        </button>

      </div>
    </MechanicLayout>
  );
}
