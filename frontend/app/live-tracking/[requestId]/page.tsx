"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getSocket } from "../../../src/services/socket";
import { useAuthStore } from "../../../src/store/authStore";

// Prevent server-side rendering of Leaflet which depends on the window object
const MapComponent = dynamic(() => import("../../../src/components/MapComponent"), { ssr: false });

export default function LiveTrackingPage() {
  const { requestId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role") || "user"; // "user" or "mechanic"

  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [mechanicLocation, setMechanicLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [requestData, setRequestData] = useState<any>(null);
  
  const user = useAuthStore((state) => state.user);

  // Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

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
    
    const fetchChatHistory = async () => {
      try {
        const { api } = require("../../../src/services/api.service");
        const res = await api.get(`requests/${requestId}/chat`);
        if (res.success) {
          setMessages(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    if (requestId) {
      fetchRequest();
      fetchChatHistory();
    }
  }, [requestId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  // 1. Listen for incoming socket events
  useEffect(() => {
    const socket = getSocket();

    const handleLocationUpdate = (data: any) => {
      if (data.requestId === requestId) {
        if (data.role === "user") setUserLocation(data.location);
        if (data.role === "mechanic") setMechanicLocation(data.location);
      }
    };

    const handleMechanicArrived = (data: any) => {
      if (data.requestId === requestId && role === "user") {
        router.push(`/service-progress/${requestId}`);
      }
    };

    const handleRequestRejected = (data: any) => {
      if (data.requestId === requestId && role === "user") {
        setShowRejectionModal(true);
      }
    };

    const handleReceiveMessage = (msg: any) => {
      if (msg.requestId === requestId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.emit("join_chat", { requestId });
    socket.on("location_update", handleLocationUpdate);
    socket.on("mechanic_arrived", handleMechanicArrived);
    socket.on("request_rejected", handleRequestRejected);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("location_update", handleLocationUpdate);
      socket.off("mechanic_arrived", handleMechanicArrived);
      socket.off("request_rejected", handleRequestRejected);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [requestId, role, router]);

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !requestData) return;

    let finalSenderId = user?._id || user?.id;
    if (!finalSenderId) {
      // Fallback if not logged in (e.g., testing via direct URL)
      if (role === "mechanic") {
        finalSenderId = requestData?.mechanicUser?._id;
      } else {
        finalSenderId = requestData?.userId?._id || requestData?.userId;
      }
    }

    if (!finalSenderId) return;

    const socket = getSocket();

    socket.emit("send_message", {
      requestId,
      senderId: finalSenderId,
      senderRole: role,
      text: newMessage.trim(),
    });

    setNewMessage("");
  };

  const renderChatOverlay = () => {
    if (!isChatOpen) return null;

    let currentUserId = user?._id || user?.id;
    if (!currentUserId) {
      currentUserId = role === "mechanic" ? requestData?.mechanicUser?._id : (requestData?.userId?._id || requestData?.userId);
    }

    return (
      <div className="fixed inset-0 bg-black/40 z-[1000] flex flex-col justify-end">
        <div className="bg-white rounded-t-3xl h-[75vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-white z-10">
            <h2 className="text-[18px] font-black text-neutral-900">
              {role === "mechanic" ? requestData?.userId?.name || "Customer" : requestData?.mechanicUser?.name || "Mechanic"}
            </h2>
            <button onClick={() => setIsChatOpen(false)} className="text-neutral-400 hover:text-neutral-900">
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8f9fa]">
            {messages.map((msg, idx) => {
              const isMe = msg.senderId?._id === currentUserId || msg.senderRole === role;
              return (
                <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${isMe ? "bg-[#b91c1c] text-white rounded-tr-sm" : "bg-white border border-neutral-200 text-neutral-800 rounded-tl-sm shadow-sm"}`}>
                    <p className="text-[14px] leading-relaxed break-words">{msg.text}</p>
                    <p className={`text-[9px] mt-1 text-right ${isMe ? "text-white/70" : "text-neutral-400"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-4 bg-white border-t border-neutral-100">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#f3f4f6] border-none rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#b91c1c]/20"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="w-12 h-12 bg-[#b91c1c] disabled:bg-neutral-300 text-white rounded-xl flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

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
                <img src={requestData?.userId?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt={requestData?.userId?.name || "Customer"} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-neutral-900 leading-tight">{requestData?.userId?.name || "Customer"}</h3>
                <p className="text-[11px] font-bold text-neutral-500 mt-0.5">Live Location</p>
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
                  <p className="text-[9px] font-bold text-neutral-400 mb-1">Vehicle Brand</p>
                  <div className="inline-block border border-neutral-200 rounded text-[12px] font-bold text-neutral-800 px-2.5 py-1 bg-[#fcfcfc]">
                    {requestData?.brandName || "Unknown"}
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
                "{requestData?.problemDetails || "No details provided"}"
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
            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-full bg-white border border-[#a31621] text-[#a31621] hover:bg-red-50 py-3.5 rounded-[12px] font-bold text-[12px] tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
              CONTACT CUSTOMER
            </button>
          </div>

        </div>
        {renderChatOverlay()}
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
            <img src={requestData?.mechanicUser?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt={requestData?.mechanicUser?.name || "Mechanic"} className="w-full h-full object-cover" />
            <div className="absolute -bottom-1 right-0 bg-[#f4a261] text-neutral-900 text-[10px] font-bold px-1.5 py-0.5 rounded border border-white flex items-center gap-0.5 z-10 shadow-sm">
              <span className="text-[10px]">★</span> {requestData?.mechanicId?.rating || "5.0"}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-[19px] font-bold text-neutral-900 leading-tight">{requestData?.mechanicUser?.name || "Assigning Mechanic..."}</h2>
            <div className="flex items-center gap-1.5 text-neutral-500 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <p className="text-[12px] font-medium">Expert Mechanic</p>
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
          <button 
            onClick={() => setIsChatOpen(true)}
            className="flex-1 bg-white border border-[#a31621] text-[#a31621] hover:bg-red-50 py-3.5 rounded-[12px] font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 transition-all"
          >
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

      {/* Rejection Modal Overlay */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-[340px] w-full text-center shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#b91c1c] flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-[32px]">cancel</span>
            </div>
            <h2 className="text-[22px] font-extrabold text-neutral-900 mb-3 tracking-tight">Mechanic Unavailable</h2>
            <p className="text-[14px] text-neutral-500 leading-relaxed mb-7">
              We're sorry, but the assigned mechanic is currently unable to accept this request. Please return to the home screen.
            </p>
            <button 
              onClick={() => { setShowRejectionModal(false); router.push("/"); }} 
              className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white border-none rounded-xl py-4 text-[14px] font-extrabold cursor-pointer transition-colors"
            >
              OK, RETURN HOME
            </button>
          </div>
        </div>
      )}

      {renderChatOverlay()}

    </div>
  );
}
