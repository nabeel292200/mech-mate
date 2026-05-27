"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { getSocket } from "../../src/services/socket";
import { useAuthStore } from "../../src/store/authStore";

const MapComponent = dynamic(() => import("../../src/components/MapComponent"), { ssr: false });

const SERVICES = [
  { id: "flat_tire", label: "Flat Tire", icon: "tire_repair" },
  { id: "fuel", label: "Fuel Delivery", icon: "local_gas_station" },
  { id: "mechanical", label: "Mechanical Repair", icon: "home_repair_service" },
  { id: "tow", label: "Tow Truck", icon: "rv_hookup" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const searchParams = useSearchParams();
  const brandName = searchParams.get("brand") || "Toyota";
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setUserLocation({ lat: 10.8505, lng: 76.2711 }) // Fallback location
      );
    } else {
      setUserLocation({ lat: 10.8505, lng: 76.2711 });
    }
  }, []);

  // Initialize socket listener for redirection
  useEffect(() => {
    const socket = getSocket();
    
    socket.on("request_created", (data: any) => {
      setPendingRequestId(data.request._id);
    });

    socket.on("request_accepted", (updatedReq: any) => {
      if (pendingRequestId && updatedReq._id === pendingRequestId) {
        router.push(`/live-tracking/${updatedReq._id}?role=user`);
      }
    });

    socket.on("request_rejected", (data: any) => {
      if (pendingRequestId && data.requestId === pendingRequestId) {
        setShowRejectionModal(true);
      }
    });

    return () => {
      socket.off("request_created");
      socket.off("request_accepted");
      socket.off("request_rejected");
    };
  }, [router, pendingRequestId]);

  const handleRequest = () => {
    if (!selectedService) {
      alert("Please select a service category.");
      return;
    }
    
    setLoading(true);

    if (!user) {
      alert("Please log in to request a mechanic.");
      router.push("/login?role=user");
      return;
    }
    
    const actualUserId = user._id || user.id;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const socket = getSocket();
          socket.emit("create_request", {
            userId: actualUserId,
            brandName: brandName,
            problemDetails: `${selectedService} - ${description}`,
            userLocation,
          });
        },
        (err) => {
          alert("Location access denied. Please enable GPS.");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  const s: Record<string, React.CSSProperties> = {
    root: { minHeight: "100vh", background: "#f8f9fa", fontFamily: "'Inter', 'Geist Sans', Arial, sans-serif", display: "flex", flexDirection: "column", position: "relative" },
    header: { position: "absolute", top: 0, left: 0, right: 0, padding: "0 24px", height: 60, display: "flex", alignItems: "center", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(0,0,0,0.05)", zIndex: 10 },
    logo: { fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", color: "#b91c1c", textDecoration: "none" },
    mapContainer: { height: "45vh", width: "100%", background: "#e5e7eb", position: "relative" },
    iframe: { width: "100%", height: "100%", border: "none", pointerEvents: "none", filter: "grayscale(0.3) contrast(1.1)" }, // Grayish styled map
    overlayCard: { position: "relative", marginTop: "-30px", background: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "24px", zIndex: 20, boxShadow: "0 -10px 30px rgba(0,0,0,0.08)", flex: 1 },
    dragHandle: { width: 40, height: 4, background: "#e5e7eb", borderRadius: 10, margin: "0 auto 24px" },
    title: { fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 6, letterSpacing: "-0.02em" },
    subtitle: { fontSize: 13, color: "#6b7280", marginBottom: 24 },
    sectionTitle: { fontSize: 12, fontWeight: 700, color: "#9ca3af", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 },
    serviceCard: { background: "#f9fafb", borderWidth: "1.5px", borderStyle: "solid", borderColor: "#f3f4f6", borderRadius: 12, padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" },
    serviceCardSelected: { background: "#fef2f2", borderColor: "#b91c1c" },
    iconCircle: { width: 48, height: 48, borderRadius: "50%", background: "#ffedd5", color: "#ea580c", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 },
    serviceLabel: { fontSize: 13, fontWeight: 600, color: "#111827" },
    textarea: { width: "100%", padding: "16px", fontSize: 14, borderWidth: "1.5px", borderStyle: "solid", borderColor: "#e5e7eb", borderRadius: 12, outline: "none", color: "#111827", background: "#f9fafb", minHeight: 100, resize: "none", marginBottom: 16, boxSizing: "border-box", transition: "border-color 0.2s" },
    locationRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", background: "#fef2f2", borderRadius: 8, color: "#b91c1c", marginBottom: 24, fontSize: 13, fontWeight: 600 },
    requestBtn: { width: "100%", background: "#9f1239", color: "#fff", border: "none", borderRadius: 12, padding: "18px", fontSize: 15, fontWeight: 800, letterSpacing: "0.02em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 10px 25px rgba(159,18,57,0.3)", transition: "transform 0.15s" },
    bottomNav: { position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #f0f0f0", height: 72, display: "flex", alignItems: "center", justifyContent: "center", gap: "10%", zIndex: 50 },
    navItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", color: "#6b7280" },
    navItemActive: { background: "#dc2626", color: "#fff", borderRadius: 100, padding: "8px 24px" }
  };

  return (
    <div style={s.root}>
      {/* Header */}
      <header style={s.header}>
        <a href="/" style={s.logo}>MECH-MATE</a>
      </header>

      {/* Map Area */}
      <div style={s.mapContainer} className="relative z-0">
        <MapComponent userLocation={userLocation} mechanicLocation={null} role="user" />
      </div>

      {/* Main Drawer Overlay */}
      <div style={s.overlayCard}>
        <div style={s.dragHandle} />

        <h1 style={s.title}>Emergency Service Request</h1>
        <p style={s.subtitle}>Describe your issue to find the nearest mechanic.</p>

        <div style={s.sectionTitle}>Select Service Category</div>
        <div style={s.grid}>
          {SERVICES.map((service) => {
            const isSelected = selectedService === service.id;
            return (
              <div
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                style={{ ...s.serviceCard, ...(isSelected ? s.serviceCardSelected : {}) }}
              >
                <div style={s.iconCircle}>
                  <span className="material-symbols-outlined">{service.icon}</span>
                </div>
                <span style={s.serviceLabel}>{service.label}</span>
              </div>
            );
          })}
        </div>

        <div style={s.sectionTitle}>Issue Description</div>
        <textarea
          style={s.textarea}
          placeholder="Describe your issue here (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = "#b91c1c")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />

        <div style={s.locationRow}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>my_location</span>
          Live Location
        </div>

        <button
          style={s.requestBtn}
          onClick={handleRequest}
          disabled={loading || !!pendingRequestId}
          onMouseEnter={(e) => { if(!loading && !pendingRequestId) e.currentTarget.style.transform = "translateY(-2px)" }}
          onMouseLeave={(e) => { if(!loading && !pendingRequestId) e.currentTarget.style.transform = "" }}
        >
          <span style={{ fontSize: 12, background: "rgba(255,255,255,0.2)", padding: "2px 6px", borderRadius: 4, marginRight: 4 }}>SOS</span>
          {pendingRequestId ? "WAITING FOR EXPERT..." : loading ? "LOCATING EXPERT..." : "REQUEST MECHANIC"}
        </button>
      </div>

      {/* Rejection Modal Overlay */}
      {showRejectionModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: "32px 24px", maxWidth: 340, width: "100%", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fef2f2", color: "#b91c1c", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32 }}>cancel</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 12, letterSpacing: "-0.02em" }}>Mechanic Unavailable</h2>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, marginBottom: 28 }}>
              We're sorry, but the assigned mechanic is currently unable to accept this request. Please return to the home screen.
            </p>
            <button 
              onClick={() => { setShowRejectionModal(false); router.push("/"); }} 
              style={{ width: "100%", background: "#b91c1c", color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontSize: 14, fontWeight: 800, cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#991b1b"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#b91c1c"; }}
            >
              OK, RETURN HOME
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
