"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/src/services/socket";
import { useAuthStore } from "@/src/store/authStore";

const BRANDS = ["Toyota", "Honda", "BMW", "Audi", "Ford", "Chevrolet", "Bajaj", "Hero", "Yamaha", "KTM", "Royal Enfield", "Ducati", "Aprilia", "BYD"];

const SPECIALIST_SKILLS = [
  "General Mechanic",
  "Tire Repair Expert",
  "Battery & Electrical Specialist",
  "Engine Expert",
  "Oil & Maintenance",
  "Fuel Delivery",
  "Tow Service",
];

export default function RequestServicePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [brand, setBrand] = useState("");
  const [specialistSkill, setSpecialistSkill] = useState("");
  const [problem, setProblem] = useState("");
  const [status, setStatus] = useState<"idle" | "locating" | "waiting" | "accepted">("idle");
  const [error, setError] = useState("");
  const [notifiedCount, setNotifiedCount] = useState(0);

  useEffect(() => {
    const socket = getSocket();

    // Listen for events
    socket.on("request_created", (data: { request: any, mechanicsNotified: number }) => {
      setStatus("waiting");
      setNotifiedCount(data.mechanicsNotified);
    });

    socket.on("request_accepted", (data: any) => {
      setStatus("accepted");
      setTimeout(() => {
        localStorage.setItem("activeRequestId", data._id);
        localStorage.setItem("activeRole", "user");
        router.push(`/live-tracking`);
      }, 1500);
    });

    socket.on("request_error", (data: any) => {
      setError(data.message);
      setStatus("idle");
    });

    return () => {
      socket.off("request_created");
      socket.off("request_accepted");
      socket.off("request_error");
    };
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !specialistSkill || !problem) {
      setError("Please select a brand, required skill, and describe the problem.");
      return;
    }

    setError("");
    setStatus("locating");

    if (!user) {
      setError("Please log in to request assistance.");
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
            brandName: brand,
            specialistSkill,
            problemDetails: problem,
            userLocation,
          });
        },
        (err) => {
          setError("Location access denied. We need your GPS to find mechanics.");
          setStatus("idle");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Request Assistance</h1>

        {status === "idle" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your brand...</option>
                {BRANDS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Required Specialist Skill</label>
              <select
                value={specialistSkill}
                onChange={(e) => setSpecialistSkill(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select the type of expert...</option>
                {SPECIALIST_SKILLS.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Problem Details</label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                rows={4}
                placeholder="e.g. Engine won't start, flat tire..."
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Find Expert Mechanic
            </button>
          </form>
        )}

        {status === "locating" && (
          <div className="text-center py-10 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-600">Getting your GPS location...</p>
          </div>
        )}

        {status === "waiting" && (
          <div className="text-center py-10 space-y-4">
            <div className="relative flex justify-center items-center mx-auto w-20 h-20">
              <div className="absolute animate-ping w-full h-full bg-blue-400 rounded-full opacity-50"></div>
              <div className="relative w-10 h-10 bg-blue-600 rounded-full"></div>
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Broadcasting Request</h2>
            <p className="text-slate-600">Alerted {notifiedCount} {specialistSkill} expert(s) nearby...</p>
          </div>
        )}

        {status === "accepted" && (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
            <h2 className="text-xl font-semibold text-green-700">Mechanic on the way!</h2>
            <p className="text-slate-600">Connecting to live GPS map...</p>
          </div>
        )}
      </div>
    </div>
  );
}
