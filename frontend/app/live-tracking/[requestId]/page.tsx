"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getSocket } from "../../../src/services/socket";

// Prevent server-side rendering of Leaflet which depends on the window object
const MapComponent = dynamic(() => import("../../../src/components/MapComponent"), { ssr: false });

export default function LiveTrackingPage() {
  const { requestId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role") || "user"; // "user" or "mechanic"

  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [mechanicLocation, setMechanicLocation] = useState<{ lat: number, lng: number } | null>(null);

  // 1. Listen for incoming location updates from the other person
  useEffect(() => {
    const socket = getSocket();

    socket.on("location_update", (data: any) => {
      if (data.requestId === requestId) {
        if (data.role === "user") setUserLocation(data.location);
        if (data.role === "mechanic") setMechanicLocation(data.location);
      }
    });

    socket.on("mechanic_arrived", (data: any) => {
      if (data.requestId === requestId && role === "user") {
        router.push(`/service-progress/${requestId}`);
      }
    });

    return () => {
      socket.off("location_update");
      socket.off("mechanic_arrived");
    };
  }, [requestId]);

  // 2. Continuously watch OUR location and broadcast it
  useEffect(() => {
    let watchId: number;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };

          if (role === "user") setUserLocation(loc);
          if (role === "mechanic") setMechanicLocation(loc);

          const socket = getSocket();
          socket.emit("location_update", {
            requestId,
            role,
            location: loc
          });
        },
        (error) => {
          console.warn("Geolocation warning:", error.message);
          // Set a fallback location so the map still renders during development
          const fallbackLoc = { lat: 10.8505, lng: 76.2711 };
          if (role === "user") setUserLocation(fallbackLoc);
          if (role === "mechanic") setMechanicLocation(fallbackLoc);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [requestId, role]);

  // ==========================================
  // MECHANIC VIEW UI
  // ==========================================
  if (role === "mechanic") {
    return (
      <div className="h-[100dvh] w-full flex flex-col bg-[#f5f6f8] font-sans overflow-hidden">
        {/* MAP AREA */}
        <div className="relative h-[35vh] md:h-[40vh] z-0 bg-[#e5e5e5] grayscale contrast-125 brightness-95 shrink-0">
          <MapComponent userLocation={userLocation} mechanicLocation={mechanicLocation} role={role} />

          {/* Floating Pill on Map */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm shadow-md rounded-xl p-3 flex items-center justify-between z-[400] grayscale-0 filter-none max-w-lg mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden shrink-0 border border-neutral-100">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80" alt="Marcus" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-neutral-900 leading-tight">Marcus Thorne</h3>
                <p className="text-[11px] font-bold text-neutral-500 mt-0.5">+7.0 km away</p>
              </div>
            </div>
            <button className="w-10 h-10 bg-[#ffb067] hover:bg-orange-400 rounded-xl flex items-center justify-center text-white shadow-sm transition-colors shrink-0">
              <span className="material-symbols-outlined text-[18px]">call</span>
            </button>
          </div>
        </div>

        {/* BOTTOM SHEET / CONTENT AREA */}
        <div className="flex-1 flex flex-col px-5 pt-5 pb-6 overflow-y-auto w-full max-w-lg mx-auto">

          {/* Service Type Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#ffecec] text-[#b91c1c] px-3 py-1.5 rounded-[10px] w-fit mb-5">
            <span className="material-symbols-outlined text-[14px]">build</span>
            <span className="text-[11px] font-bold">Mechanical Repair</span>
          </div>

          {/* VEHICLE INFORMATION CARD */}
          <div className="bg-white rounded-[16px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100 mb-4">
            <p className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-[0.1em] mb-4">Vehicle Information</p>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#f8f9fa] rounded-[14px] flex items-center justify-center text-[#b91c1c] border border-neutral-100 shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">directions_car</span>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-[9px] font-bold text-neutral-400 mb-0.5">Model</p>
                  <p className="text-[12px] font-bold text-neutral-800">2021 BMW X5</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-neutral-400 mb-0.5">Color</p>
                  <p className="text-[12px] font-bold text-neutral-800">Black</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[9px] font-bold text-neutral-400 mb-1">Plate number</p>
                  <div className="inline-block border border-neutral-200 rounded text-[12px] font-bold text-neutral-800 px-2.5 py-1 bg-[#fcfcfc] tracking-[0.1em]">
                    QA0-4429
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ISSUE DESCRIPTION CARD */}
          <div className="bg-white rounded-[16px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100 mb-6">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="material-symbols-outlined text-[16px] text-[#b91c1c]">warning</span>
              <p className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-[0.1em]">Issue Description</p>
            </div>
            <div className="bg-[#f8f9fa] rounded-xl p-3.5 border border-neutral-100/50">
              <p className="text-[12px] font-medium text-neutral-600 italic leading-relaxed">
                "Smoke coming from under the hood. Engine stalled and won't restart on the shoulder."
              </p>
            </div>
          </div>

          {/* Spacer */}
          <div className="mt-auto"></div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 mt-2">
            <button
              onClick={() => {
                const socket = getSocket();
                socket.emit("mechanic_arrived", { requestId });
                router.push(`/mechanic/billing/${requestId}`);
              }}
              className="w-full bg-[#059669] hover:bg-green-700 text-white py-3.5 rounded-[12px] font-bold text-[12px] tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(5,150,105,0.2)]">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              MARK AS ARRIVED
            </button>
            <button className="w-full bg-[#a31621] hover:bg-red-800 text-white py-3.5 rounded-[12px] font-bold text-[12px] tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(163,22,33,0.2)]">
              <span className="material-symbols-outlined text-[18px]">navigation</span>
              START NAVIGATION
            </button>
            <button className="w-full bg-white border border-[#a31621] text-[#a31621] hover:bg-red-50 py-3.5 rounded-[12px] font-bold text-[12px] tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
              CONTACT CUSTOMER
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // USER VIEW UI
  // ==========================================
  return (
    <div className="h-[100dvh] w-full flex flex-col bg-neutral-100 font-sans overflow-hidden">

      {/* Top Header - Solid White */}
      <div className="w-full bg-white px-6 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] z-[400] flex justify-between items-center relative border-b border-neutral-100">
        <h1 className="text-[20px] font-black text-[#9e162a] tracking-tight m-0">MECH-MATE</h1>
      </div>

      {/* MAP AREA */}
      <div className="relative flex-1 z-0 bg-[#e5e5e5] grayscale contrast-125 brightness-95">
        <MapComponent
          userLocation={userLocation}
          mechanicLocation={mechanicLocation}
          role={role}
        />

        {/* Undo grayscale for the ETA Overlay Badge so it remains red */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm shadow-md rounded-[14px] pr-5 pl-2 py-2 flex items-center gap-3 z-[400] border border-neutral-100 grayscale-0 filter-none">
          <div className="w-9 h-9 bg-[#cf3434] rounded-full flex items-center justify-center text-white shadow-inner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22L12 18L22 22L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-[8px] font-extrabold text-neutral-500 uppercase tracking-[0.15em] mb-0.5">Estimated Arrival</p>
            <p className="text-[17px] font-black text-[#cf3434] leading-none">8 mins</p>
          </div>
        </div>
      </div>

      {/* BOTTOM SHEET - White Card Overlapping Map */}
      <div className="bg-[#fdfdfd] rounded-t-[28px] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-[500] relative -mt-8 flex flex-col px-6 pt-4 pb-24 w-full overflow-y-auto max-h-[60vh]">

        {/* Drag Handle */}
        <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-6"></div>

        {/* Profile Details */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-[56px] h-[56px] rounded-xl overflow-hidden shadow-sm shrink-0 bg-neutral-100">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80" alt="Marcus" className="w-full h-full object-cover" />
            <div className="absolute -bottom-1 right-0 bg-[#f4a261] text-neutral-900 text-[10px] font-bold px-1.5 py-0.5 rounded border border-white flex items-center gap-0.5 z-10 shadow-sm">
              <span className="text-[10px]">★</span> 4.8
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-[19px] font-bold text-neutral-900 leading-tight">Marcus Thorne</h2>
            <div className="flex items-center gap-1.5 text-neutral-500 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <p className="text-[12px] font-medium">Senior Recovery Specialist</p>
            </div>
          </div>
        </div>

        {/* Vehicle Assigned Box */}
        <div className="bg-[#f8f9fa] border border-neutral-200 rounded-[14px] p-3.5 flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-[#b91c1c] border border-neutral-100 shrink-0">
            <span className="material-symbols-outlined text-[20px]">directions_car</span>
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wide">Assigned Vehicle</p>
            <p className="text-[13px] font-bold text-neutral-800 mt-0.5">White Ford F-150</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wide">Plate</p>
            <p className="text-[13px] font-bold text-neutral-800 mt-0.5">KL09Q1116</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button className="flex-1 bg-[#a31621] hover:bg-red-800 text-white py-3.5 rounded-[12px] font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">call</span>
            CALL
          </button>
          <button className="flex-1 bg-white border border-[#a31621] text-[#a31621] hover:bg-red-50 py-3.5 rounded-[12px] font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 transition-all">
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            MESSAGE
          </button>
        </div>

        {/* Bottom Status / Actions */}
        <div className="flex flex-col items-center gap-4 mt-2">
          <button
            onClick={() => router.push('/vehicle-type')}
            className="text-[12px] font-medium text-neutral-600 hover:text-[#b91c1c] transition-colors">
            Cancel Request
          </button>

          <div className="inline-flex items-center gap-2 bg-[#fff4e6] text-[#e65c00] px-4 py-1.5 rounded-full text-[10px] font-medium mx-auto border border-[#ffecd1]">
            <span className="w-2 h-2 rounded-full bg-[#ff7b00] animate-pulse"></span>
            Live updates enabled
          </div>
        </div>

      </div>



    </div>
  );
}
