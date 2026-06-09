"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../src/services/api.service";
import { getSocket } from "../../src/services/socket";

export default function UserPaymentPage() {
  const router = useRouter();
  const [requestId, setRequestId] = useState<string | null>(null);

  useEffect(() => {
    const activeId = localStorage.getItem("activeRequestId");
    if (!activeId) {
      router.push("/");
    } else {
      setRequestId(activeId);
    }
  }, [router]);

  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("visa");

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res: any = await api.get(`requests/${requestId}`);
        if (res.success) {
          setRequestData(res.data);
          if (res.data.paymentStatus === "completed") {
            alert("This invoice has already been paid.");
            router.push("/");
          }
        }
      } catch (err) {
        console.error("Failed to fetch request data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (requestId) fetchRequest();
  }, [requestId, router]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const res: any = await api.post(`requests/${requestId}/pay`, { paymentMethod: selectedMethod });
      if (res.success) {
        const socket = getSocket();
        socket.emit("payment_completed", { requestId });
        alert("Payment successful! Thank you.");
        router.push("/");
      }
    } catch (err: any) {
      console.error("Payment failed:", err);
      alert(err.response?.data?.message || "Payment processing failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading || !requestId) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans text-neutral-800">
        <span className="w-10 h-10 border-4 border-neutral-200 border-t-[#b91c1c] rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!requestData) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center font-sans">
        <p className="text-neutral-500 mb-4">Request not found or unavailable.</p>
        <button onClick={() => router.push("/")} className="text-[#b91c1c] font-bold">Return Home</button>
      </div>
    );
  }

  const items = requestData.invoiceItems || [];
  const totalAmount = requestData.totalAmount || 0;

  const mechanicName = requestData.mechanicUser?.name || "Expert Mechanic";
  const mechanicAvatar = requestData.mechanicUser?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
  const rating = requestData.mechanicId?.rating || "5.0";

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-neutral-800 pb-20">
      {/* Header */}
      <div className="w-full bg-white px-8 py-5 border-b border-neutral-100/80 shadow-sm flex items-center">
        <h1 className="text-[20px] font-black text-[#b91c1c] tracking-tight">MECH-MATE</h1>
      </div>

      {/* Main Container */}
      <div className="max-w-[1000px] mx-auto px-6 mt-12">

        {/* Success Header */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="w-16 h-16 bg-[#dc2626] rounded-full flex items-center justify-center mb-5 shadow-[0_8px_20px_rgba(220,38,38,0.3)]">
            <span className="material-symbols-outlined text-white text-[32px] font-bold">check</span>
          </div>
          <h2 className="text-[28px] font-bold text-neutral-900 mb-2 tracking-tight">Service Complete</h2>
          <p className="text-[15px] text-neutral-500 font-medium">Thank you! Your feedback helps us improve.</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-8 items-start">

          {/* Left Column: Summary & Mechanic */}
          <div className="flex flex-col gap-6">

            {/* Service Summary Card */}
            <div>
              <p className="text-[12px] font-bold text-neutral-500 tracking-[0.1em] uppercase mb-3 ml-1">Service Summary</p>
              <div className="bg-white rounded-[16px] shadow-sm border border-neutral-100 p-8">

                <div className="flex flex-col gap-6">
                  {items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <p className="text-[15px] font-bold text-neutral-900">{item.description || "Service Item"}</p>
                        {/* Fake subtext for visual matching, or could use real data if we had it */}
                        <p className="text-[12px] text-neutral-500 mt-1">Labor & Diagnostics</p>
                      </div>
                      <p className="text-[16px] font-bold text-neutral-900">${Number(item.price).toFixed(2)}</p>
                    </div>
                  ))}

                  {items.length === 0 && (
                    <div className="text-neutral-500 text-sm italic">No line items specified.</div>
                  )}
                </div>

                <div className="h-px bg-neutral-100 my-6 w-full" />

                <div className="flex justify-between items-center">
                  <p className="text-[20px] font-bold text-[#b91c1c]">Total</p>
                  <p className="text-[22px] font-black text-[#b91c1c]">${totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Mechanic Details Card */}
            <div className="bg-white rounded-[16px] shadow-sm border border-neutral-100 p-4 flex items-center justify-between mt-2">
              <div className="flex items-center gap-4">
                <div className="w-[46px] h-[46px] rounded-full overflow-hidden bg-neutral-100">
                  <img src={mechanicAvatar} alt={mechanicName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-neutral-900">{mechanicName}</p>
                  <p className="text-[11px] font-medium text-neutral-500 mt-0.5">Assigned Technician</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fef3c7] text-[#b45309] rounded-full text-[12px] font-bold">
                <span className="material-symbols-outlined text-[14px]">star</span>
                {rating}
              </div>
            </div>

          </div>

          {/* Right Column: Payment Method */}
          <div>
            <p className="text-[12px] font-bold text-neutral-500 tracking-[0.1em] uppercase mb-3 ml-1">Payment Method</p>
            <div className="bg-white rounded-[16px] shadow-sm border border-neutral-100 p-6">

              <div className="flex flex-col gap-3 mb-8">

                {/* Visa Option */}
                <button
                  onClick={() => setSelectedMethod("visa")}
                  className={`w-full flex items-center justify-between p-4 rounded-[12px] border-2 transition-all text-left ${selectedMethod === "visa" ? "border-[#b91c1c] bg-[#fef2f2]" : "border-neutral-100 bg-white hover:border-neutral-200"}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`material-symbols-outlined text-[24px] ${selectedMethod === "visa" ? "text-[#b91c1c]" : "text-neutral-400"}`}>credit_card</span>
                    <div>
                      <p className={`text-[14px] font-bold ${selectedMethod === "visa" ? "text-[#b91c1c]" : "text-neutral-800"}`}>Visa ending in 4429</p>
                      <p className={`text-[12px] font-medium ${selectedMethod === "visa" ? "text-[#b91c1c]/70" : "text-neutral-400"}`}>Expires 12/26</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === "visa" ? "border-[#b91c1c]" : "border-neutral-300"}`}>
                    {selectedMethod === "visa" && <div className="w-2.5 h-2.5 bg-[#b91c1c] rounded-full" />}
                  </div>
                </button>

                {/* Apple Pay Option */}
                <button
                  onClick={() => setSelectedMethod("apple_pay")}
                  className={`w-full flex items-center justify-between p-4 rounded-[12px] border-2 transition-all text-left ${selectedMethod === "apple_pay" ? "border-[#b91c1c] bg-[#fef2f2]" : "border-neutral-100 bg-white hover:border-neutral-200"}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`material-symbols-outlined text-[24px] ${selectedMethod === "apple_pay" ? "text-[#b91c1c]" : "text-neutral-400"}`}>contactless</span>
                    <p className={`text-[14px] font-bold ${selectedMethod === "apple_pay" ? "text-[#b91c1c]" : "text-neutral-800"}`}>Apple Pay</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === "apple_pay" ? "border-[#b91c1c]" : "border-neutral-300"}`}>
                    {selectedMethod === "apple_pay" && <div className="w-2.5 h-2.5 bg-[#b91c1c] rounded-full" />}
                  </div>
                </button>

                {/* Cash Option */}
                <button
                  onClick={() => setSelectedMethod("cash")}
                  className={`w-full flex items-center justify-between p-4 rounded-[12px] border-2 transition-all text-left ${selectedMethod === "cash" ? "border-[#b91c1c] bg-[#fef2f2]" : "border-neutral-100 bg-white hover:border-neutral-200"}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`material-symbols-outlined text-[24px] ${selectedMethod === "cash" ? "text-[#b91c1c]" : "text-neutral-400"}`}>payments</span>
                    <p className={`text-[14px] font-bold ${selectedMethod === "cash" ? "text-[#b91c1c]" : "text-neutral-800"}`}>Cash</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === "cash" ? "border-[#b91c1c]" : "border-neutral-300"}`}>
                    {selectedMethod === "cash" && <div className="w-2.5 h-2.5 bg-[#b91c1c] rounded-full" />}
                  </div>
                </button>

                {/* UPI Option */}
                <button
                  onClick={() => setSelectedMethod("upi")}
                  className={`w-full flex items-center justify-between p-4 rounded-[12px] border-2 transition-all text-left ${selectedMethod === "upi" ? "border-[#b91c1c] bg-[#fef2f2]" : "border-neutral-100 bg-white hover:border-neutral-200"}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`material-symbols-outlined text-[24px] ${selectedMethod === "upi" ? "text-[#b91c1c]" : "text-neutral-400"}`}>qr_code_scanner</span>
                    <p className={`text-[14px] font-bold ${selectedMethod === "upi" ? "text-[#b91c1c]" : "text-neutral-800"}`}>UPI (GPay / PhonePe)</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === "upi" ? "border-[#b91c1c]" : "border-neutral-300"}`}>
                    {selectedMethod === "upi" && <div className="w-2.5 h-2.5 bg-[#b91c1c] rounded-full" />}
                  </div>
                </button>

              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-[12px] h-[56px] font-bold text-[15px] flex items-center justify-center gap-2 transition-all shadow-[0_6px_16px_rgba(185,28,28,0.25)] disabled:opacity-70 disabled:hover:bg-[#b91c1c]"
              >
                {processing ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    SUBMIT PAID
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-neutral-400 font-medium text-center mt-5 flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                Secure 256-bit encrypted transaction
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
