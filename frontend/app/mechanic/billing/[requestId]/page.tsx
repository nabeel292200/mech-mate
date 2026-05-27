"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "../../../../src/services/api.service";
import { getSocket } from "../../../../src/services/socket";

export default function MechanicBillingPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params?.requestId as string;

  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Start with one empty item instead of fake data
  const [items, setItems] = useState([
    { id: 1, type: "Custom", description: "", price: "" }
  ]);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res: any = await api.get(`mechanic/requests/${requestId}`);
        if (res.success) {
          setRequestData(res.data);
          
          if (res.data.problemDetails) {
            setItems([
              { id: 1, type: "Custom", description: `Repair: ${res.data.problemDetails.substring(0, 40)}`, price: "" }
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch request for billing:", err);
      } finally {
        setLoading(false);
      }
    };
    if (requestId) fetchRequest();
  }, [requestId]);

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const total = subtotal.toFixed(2);

  const addItem = () => {
    setItems([...items, { id: Date.now(), type: "Custom", description: "", price: "" }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: string, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSendInvoice = async () => {
    if (subtotal <= 0) {
      alert("Please add at least one item with a valid price.");
      return;
    }
    
    setSending(true);
    
    try {
      await api.put(`mechanic/requests/${requestId}/invoice`, { 
        totalAmount: subtotal,
        invoiceItems: items
      });
      
      const socket = getSocket();
      socket.emit("send_invoice", { requestId });
      
      router.push(`/mechanic/payment-waiting/${requestId}`);
    } catch (err) {
      console.error("Failed to send invoice:", err);
      alert("Failed to send invoice.");
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] flex flex-col items-center justify-center pb-32">
        <span className="w-12 h-12 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin"></span>
        <p className="mt-4 text-neutral-500 font-medium text-sm tracking-wide">Loading request details...</p>
      </div>
    );
  }

  const customerName = requestData?.userId?.name || "Unknown Customer";
  const customerAvatar = requestData?.userId?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
  const vehicleBrand = requestData?.brandName || "Unknown Vehicle";

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-sans text-neutral-800 pb-32 pt-8 md:pt-12">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-11 h-11 bg-white border border-neutral-100 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:shadow-md transition-all duration-300"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <h1 className="text-[28px] font-bold text-neutral-900 tracking-tight leading-tight">Create Invoice</h1>
              <p className="text-[13px] font-medium text-neutral-400 mt-0.5">Order ID #{requestId.slice(-6).toUpperCase()} • Draft</p>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          {/* LEFT SIDE: INVOICE FORM */}
          <div className="flex flex-col gap-8">

            {/* Customer Details Card */}
            <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-neutral-50 relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[16px] font-bold text-neutral-900">Customer Details</h2>
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center">
                {/* Avatar & Name */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden shadow-sm shrink-0 bg-neutral-100">
                    <img src={customerAvatar} alt={customerName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[12px] text-neutral-400 font-medium uppercase tracking-widest mb-1">Billed To</p>
                    <p className="text-[18px] font-bold text-neutral-900">{customerName}</p>
                  </div>
                </div>

                <div className="hidden md:block w-px h-12 bg-neutral-100"></div>

                {/* Vehicle Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">directions_car</span>
                  </div>
                  <div>
                    <p className="text-[12px] text-neutral-400 font-medium uppercase tracking-widest mb-1">Vehicle Serviced</p>
                    <p className="text-[16px] font-bold text-neutral-900">{vehicleBrand}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Summary Card */}
            <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-neutral-50 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-neutral-50 text-neutral-900 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                </div>
                <h2 className="text-[18px] font-bold text-neutral-900">Service Items</h2>
              </div>

              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[1fr_140px_48px] gap-4 items-center group">

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] text-neutral-500 font-medium ml-1">Description</label>
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full bg-[#f9fafb] border border-transparent rounded-[16px] px-5 h-[56px] text-[15px] font-medium text-neutral-800 outline-none focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-50 transition-all placeholder:text-neutral-300"
                        placeholder="e.g., Tire Replacement"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] text-neutral-500 font-medium ml-1">Price</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">$</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                          className="w-full bg-[#f9fafb] border border-transparent rounded-[16px] pl-8 pr-4 h-[56px] text-[15px] font-medium text-neutral-800 outline-none focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-50 transition-all placeholder:text-neutral-300"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="flex items-end justify-center h-full pt-6">
                      <button onClick={() => removeItem(item.id)} className="w-12 h-12 text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-full flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100">
                        <span className="material-symbols-outlined text-[22px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}

                <button onClick={addItem} className="mt-4 w-full h-[60px] border-2 border-dashed border-neutral-200 hover:border-red-300 text-neutral-500 hover:text-red-600 bg-[#fdfdfd] hover:bg-red-50/50 rounded-[16px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all duration-300">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  Add New Item
                </button>
              </div>
            </div>

            {/* Service Photos Section */}
            <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-neutral-50 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[16px] font-bold text-neutral-900">Service Photos</h2>
                <span className="text-[13px] text-neutral-400 font-medium">Optional</span>
              </div>

              <div className="flex flex-wrap gap-4">
                <button className="w-[120px] h-[120px] rounded-[18px] border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-neutral-400 hover:text-red-600 hover:border-red-300 hover:bg-red-50/50 transition-all">
                  <span className="material-symbols-outlined mb-2 text-[28px]">add_photo_alternate</span>
                  <span className="text-[11px] font-bold tracking-wide uppercase">Upload</span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: SUMMARY & ACTIONS */}
          <div className="flex flex-col gap-6">

            {/* Total Payable Card */}
            <div className="bg-gradient-to-br from-[#dc2626] to-[#991b1b] rounded-[32px] p-8 text-white shadow-[0_16px_40px_rgba(220,38,38,0.25)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <p className="text-[13px] font-semibold text-red-100 uppercase tracking-widest">Total Payable</p>
                  <span className="material-symbols-outlined text-white/50 text-[28px]">verified_user</span>
                </div>

                <div className="mb-8">
                  <h1 className="text-[56px] font-extrabold tracking-tighter leading-none">${total}</h1>
                </div>

                <div className="border-t border-red-400/30 pt-6 mt-auto">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[14px] text-red-100 font-medium">Subtotal</p>
                    <p className="text-[15px] font-semibold">${total}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[14px] text-red-100 font-medium">Tax (0%)</p>
                    <p className="text-[15px] font-semibold">$0.00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mt-2">
              <button
                onClick={handleSendInvoice}
                disabled={sending || subtotal <= 0}
                className="h-[60px] w-full bg-[#ef4444] disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-[0_8px_20px_rgba(239,68,68,0.25)] hover:bg-[#dc2626] text-white rounded-full font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(239,68,68,0.25)] hover:shadow-[0_12px_24px_rgba(220,38,38,0.3)] hover:-translate-y-1 transition-all duration-300">
                {sending ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <span className="material-symbols-outlined text-[20px]">send</span>}
                {sending ? "Sending..." : "Send Invoice"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
