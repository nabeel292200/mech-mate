"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSocket } from "../../../src/services/socket";

export default function ServiceProgressPage() {
  const { requestId } = useParams();
  const router = useRouter();
  const [requestData, setRequestData] = useState<any>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const { api } = require("../../../src/services/api.service");
        const res = await api.get(`requests/${requestId}`);
        if (res.success) {
          setRequestData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch request data:", err);
      }
    };
    if (requestId) fetchRequest();
  }, [requestId]);

  useEffect(() => {
    const socket = getSocket();
    socket.on("invoice_received", (data: any) => {
      if (data.requestId === requestId) {
        router.push(`/payment/${requestId}`);
      }
    });
    return () => { socket.off("invoice_received"); };
  }, [requestId, router]);

  const mechanicName = requestData?.mechanicUser?.name || "Assigning Mechanic...";
  const mechanicAvatar = requestData?.mechanicUser?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
  const rating = requestData?.mechanicId?.rating || "4.9";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .loading-pulse {
            animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        @keyframes pulse-ring {
            0% { transform: scale(.33); opacity: 1; }
            80%, 100% { transform: scale(1); opacity: 0; }
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}} />
      <div className="bg-[#f8f9fa] text-[#191c1d] font-sans antialiased min-h-screen flex flex-col">
        
        {/* TopAppBar Component */}
        <header className="w-full top-0 sticky shadow-sm bg-[#f8f9fa] z-50">
          <div className="flex justify-between items-center px-[20px] h-16 w-full">
            <button className="material-symbols-outlined text-[#b7102a] hover:bg-[#e7e8e9] transition-colors p-2 rounded-full active:scale-95 duration-150" data-icon="menu">menu</button>
            <h1 className="text-[24px] leading-[32px] font-bold text-[#b7102a]">Emergency Assistance</h1>
            <button className="material-symbols-outlined text-[#b7102a] hover:bg-[#e7e8e9] transition-colors p-2 rounded-full active:scale-95 duration-150" data-icon="support_agent">support_agent</button>
          </div>
        </header>

        {/* Main Canvas */}
        <main className="flex-grow flex flex-col items-center px-[20px] pt-[32px] pb-32 max-w-[1200px] mx-auto w-full">
          
          {/* Central Hero Section: Repair in Progress */}
          <section className="w-full flex flex-col items-center text-center mb-[48px]">
            <div className="relative w-48 h-48 flex items-center justify-center mb-[32px]">
              <div className="absolute inset-0 bg-[#db313f]/20 rounded-full loading-pulse"></div>
              <div className="absolute inset-4 bg-[#db313f]/40 rounded-full loading-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="z-10 bg-[#b7102a] w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <span className="material-symbols-outlined text-white text-[48px]" data-icon="build">build</span>
              </div>
            </div>
            <h2 className="text-[28px] leading-[34px] font-bold text-[#191c1d] mb-[4px]">Service in Progress</h2>
            <p className="text-[18px] leading-[28px] text-[#5b403f]">Mechanic is working on your vehicle...</p>
          </section>

          {/* Mechanic Profile Card */}
          <section className="w-full bg-white rounded-2xl p-[20px] shadow-[0px_4px_20px_rgba(0,0,0,0.05)] mb-[32px] border-l-4 border-[#ffab69]">
            <div className="flex items-center gap-[12px]">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#e7e8e9]">
                <img alt={mechanicName} className="w-full h-full object-cover" src={mechanicAvatar} />
              </div>
              <div className="flex-grow">
                <h3 className="text-[14px] leading-[20px] font-bold text-[#191c1d]">{mechanicName}</h3>
                <p className="text-[12px] leading-[16px] font-medium text-[#5b403f] flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 
                  {rating} Expert Mechanic • Verified Professional
                </p>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-[#edeeef] flex items-center justify-center text-[#b7102a] active:scale-90 transition-transform">
                  <span className="material-symbols-outlined" data-icon="call">call</span>
                </button>
                <button className="w-10 h-10 rounded-full bg-[#edeeef] flex items-center justify-center text-[#b7102a] active:scale-90 transition-transform">
                  <span className="material-symbols-outlined" data-icon="chat">chat</span>
                </button>
              </div>
            </div>
          </section>

          {/* Live Progress Timeline */}
          <section className="w-full mb-[48px]">
            <div className="space-y-0">
              {/* Step 1: Completed */}
              <div className="flex gap-4 min-h-[64px]">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-[#b7102a] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[16px]" data-icon="check">check</span>
                  </div>
                  <div className="w-0.5 h-full bg-[#b7102a]"></div>
                </div>
                <div className="pb-6">
                  <p className="text-[14px] leading-[20px] font-bold text-[#191c1d]">Mechanic Arrived</p>
                  <p className="text-[12px] leading-[16px] text-[#5b403f]">Completed at 10:24 AM</p>
                </div>
              </div>

              {/* Step 2: Active */}
              <div className="flex gap-4 min-h-[64px]">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-[#db313f] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#fffbff] animate-pulse"></div>
                  </div>
                  <div className="w-0.5 h-full bg-[#e1e3e4]"></div>
                </div>
                <div className="pb-6">
                  <p className="text-[14px] leading-[20px] text-[#b7102a] font-bold">Service in Progress</p>
                  <p className="text-[12px] leading-[16px] text-[#5b403f]">Ongoing diagnostics and repair</p>
                </div>
              </div>

              {/* Step 3: Pending */}
              <div className="flex gap-4 min-h-[64px]">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-[#e7e8e9] flex items-center justify-center"></div>
                </div>
                <div>
                  <p className="text-[14px] leading-[20px] font-bold text-[#5b403f]">Invoice Pending</p>
                  <p className="text-[12px] leading-[16px] text-[#5b403f]">Waiting for service completion</p>
                </div>
              </div>
            </div>
          </section>

          {/* Notification Banner */}
          <div className="w-full bg-[#f3f4f5] rounded-xl p-[12px] flex items-start gap-[12px] border border-[#e4bebc]/30">
            <span className="material-symbols-outlined text-[#b7102a] mt-1" data-icon="info">info</span>
            <p className="text-[16px] leading-[24px] text-[#5b403f]">
              Please remain nearby your vehicle. We will notify you instantly with a detailed summary once {mechanicName} has finalized the repairs and generated your invoice.
            </p>
          </div>
        </main>

      </div>
    </>
  );
}
