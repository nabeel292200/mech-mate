"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../../src/store/authStore";

const BRANDS = ["Toyota", "Honda", "Ford", "Suzuki", "Hyundai", "BMW", "Mercedes", "Tata"];
const VEHICLE_TYPES = [
  { id: "bike",  label: "Bike",  icon: "two_wheeler" },
  { id: "car",   label: "Car",   icon: "directions_car" },
  { id: "truck", label: "Truck", icon: "local_shipping" },
  { id: "bus",   label: "Bus",   icon: "directions_bus" },
];

export default function MechanicDashboard() {
  const { user, updateProfile } = useAuthStore();

  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [address, setAddress] = useState("");
  const [skills, setSkills] = useState<string[]>(["car"]);
  const [brands, setBrands] = useState(["Toyota", "Honda", "Ford"]);
  const [newBrand, setNewBrand] = useState("");
  const [showBrandInput, setShowBrandInput] = useState(false);
  const [liveLocation, setLiveLocation] = useState(true);
  const [workStatus, setWorkStatus] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  // Sync state with global auth context user profile
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      if (user.mechanic) {
        setExperience(user.mechanic.experience ? String(user.mechanic.experience) : "");
        setAddress(user.mechanic.workshopAddress || "");
        setSkills(user.mechanic.vehicleSkills || []);
        setBrands(user.mechanic.brandExpertise || []);
        setLiveLocation(user.mechanic.liveLocation !== false);
        setWorkStatus(user.mechanic.isAvailable !== false);
      }
    }
  }, [user]);

  const toggleSkill = (id: string) =>
    setSkills((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);

  const addBrand = () => {
    const b = newBrand.trim();
    if (b && !brands.includes(b)) setBrands((p) => [...p, b]);
    setNewBrand(""); setShowBrandInput(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      await updateProfile({
        name,
        phone,
        experience: Number(experience),
        workshopAddress: address,
        vehicleSkills: skills,
        brandExpertise: brands,
        liveLocation,
        isAvailable: workStatus,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const s: Record<string, React.CSSProperties> = {
    root: { minHeight: "100vh", background: "#f5f5f5", fontFamily: "'Inter','Geist Sans',Arial,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 80 },
    header: { width: "100%", maxWidth: 540, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#fff", borderBottom: "1px solid #f0f0f0", position: "sticky" as const, top: 0, zIndex: 40 },
    logo: { fontSize: 20, fontWeight: 900, color: "#b91c1c", letterSpacing: "-0.04em", textDecoration: "none" },
    avatar: { width: 38, height: 38, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer", border: "2px solid #e5e7eb" },
    page: { width: "100%", maxWidth: 540, padding: "0 0 16px" },
    progress: { background: "#fff", padding: "18px 20px 14px", marginBottom: 12 },
    bar: { height: 4, background: "#e5e7eb", borderRadius: 4, marginTop: 10, marginBottom: 8, overflow: "hidden" },
    barFill: { height: "100%", width: "66%", background: "#b91c1c", borderRadius: 4 },
    card: { background: "#fff", marginBottom: 12, padding: "20px 20px 16px" },
    sectionTitle: { fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#b91c1c", textTransform: "uppercase" as const, marginBottom: 16 },
    uploadCircle: { width: 80, height: 80, borderRadius: "50%", background: "#f3f4f6", border: "2px dashed #d1d5db", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", cursor: "pointer", margin: "0 auto 8px", overflow: "hidden", position: "relative" as const },
    label: { fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6, display: "block" },
    input: { width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "11px 14px", fontSize: 14, color: "#111827", outline: "none", background: "#fff", boxSizing: "border-box" as const },
    row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    skillGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
    skillCard: { border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "all 0.15s" },
    tagRow: { display: "flex", flexWrap: "wrap" as const, gap: 8 },
    tag: { background: "#b91c1c", color: "#fff", borderRadius: 100, padding: "5px 12px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 },
    addTag: { background: "#f3f4f6", color: "#374151", borderRadius: 100, padding: "5px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "1.5px dashed #d1d5db", display: "flex", alignItems: "center", gap: 4 },
    toggleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f3f4f6" },
    toggle: { width: 44, height: 24, borderRadius: 12, position: "relative" as const, cursor: "pointer", transition: "background 0.2s", flexShrink: 0 },
    saveBtn: { width: "100%", background: "#b91c1c", color: "#fff", border: "none", borderRadius: 10, padding: "16px 0", fontSize: 15, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" as const, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" },
    bottomNav: { position: "fixed" as const, bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #f0f0f0", height: 64, display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 50 },
    navItem: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 3, cursor: "pointer", flex: 1 },
  };

  return (
    <div style={s.root}>
      {/* Header */}
      <header style={s.header}>
        <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#374151", cursor: "pointer" }}>menu</span>
        <a href="/" style={s.logo}>ASSIST</a>
        <div style={s.avatar} onClick={() => fileRef.current?.click()}>
          {avatar
            ? <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#9ca3af" }}>person</span>}
        </div>
      </header>

      <div style={s.page}>
        {/* Progress */}
        <div style={s.progress}>
          <p style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Complete Your Mechanic Profile</p>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>Help us get you on the road and helping customers.</p>
          <div style={s.bar}><div style={s.barFill} /></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#b91c1c", fontWeight: 600 }}>
            <span>Step 2 of 3</span><span>66% Complete</span>
          </div>
        </div>

        {/* Personal Details */}
        <div style={s.card}>
          <p style={s.sectionTitle}>Personal Details</p>

          {/* Avatar upload */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={s.uploadCircle} onClick={() => fileRef.current?.click()}>
              {avatar
                ? <img src={avatar} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <>
                    <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#9ca3af" }}>photo_camera</span>
                    <div style={{ position: "absolute", bottom: 2, right: 2, background: "#b91c1c", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#fff" }}>add</span>
                    </div>
                  </>}
            </div>
            <p style={{ fontSize: 12, color: "#6b7280" }}>Upload professional avatar</p>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
          </div>

          <label style={s.label}>Full Name</label>
          <input style={{ ...s.input, marginBottom: 14 }} placeholder="e.g. Alex Smith" value={name} onChange={(e) => setName(e.target.value)} />

          <div style={{ ...s.row2, marginBottom: 14 }}>
            <div>
              <label style={s.label}>Phone Number</label>
              <input style={s.input} placeholder="+91 XXXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label style={s.label}>Experience (years)</label>
              <input style={s.input} placeholder="5" type="number" value={experience} onChange={(e) => setExperience(e.target.value)} />
            </div>
          </div>

          <label style={s.label}>Workshop Address</label>
          <div style={{ position: "relative" }}>
            <input style={{ ...s.input, paddingRight: 40 }} placeholder="Enter street address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <span className="material-symbols-outlined" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 20, color: "#9ca3af" }}>location_on</span>
          </div>
        </div>

        {/* Vehicle Skills */}
        <div style={s.card}>
          <p style={s.sectionTitle}>Vehicle Skills</p>
          <div style={s.skillGrid}>
            {VEHICLE_TYPES.map(({ id, label, icon }) => {
              const active = skills.includes(id);
              return (
                <div
                  key={id}
                  style={{ ...s.skillCard, borderColor: active ? "#b91c1c" : "#e5e7eb", background: active ? "#fff5f5" : "#fff" }}
                  onClick={() => toggleSkill(id)}
                >
                  <div style={{ width: 20, height: 20, border: `2px solid ${active ? "#b91c1c" : "#d1d5db"}`, borderRadius: 4, background: active ? "#b91c1c" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {active && <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#fff" }}>check</span>}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{label}</p>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: active ? "#b91c1c" : "#9ca3af" }}>{icon}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brand Expertise */}
        <div style={s.card}>
          <p style={s.sectionTitle}>Brand Expertise</p>
          <div style={s.tagRow}>
            {brands.map((b) => (
              <span key={b} style={s.tag}>
                {b}
                <span style={{ cursor: "pointer", fontWeight: 400, opacity: 0.8 }} onClick={() => setBrands((p) => p.filter((x) => x !== b))}>×</span>
              </span>
            ))}
            {showBrandInput ? (
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  autoFocus
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addBrand()}
                  style={{ ...s.input, width: 110, padding: "4px 10px", fontSize: 13 }}
                  placeholder="Brand name"
                />
                <button onClick={addBrand} style={{ background: "#b91c1c", color: "#fff", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 13 }}>Add</button>
              </div>
            ) : (
              <span style={s.addTag} onClick={() => setShowBrandInput(true)}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>+</span> Add Brand
              </span>
            )}
          </div>
        </div>

        {/* Settings */}
        <div style={s.card}>
          {[
            { label: "Live Location", sub: "Trackable by nearby users", val: liveLocation, set: setLiveLocation },
            { label: "Work Status", sub: "Currently Online", val: workStatus, set: setWorkStatus },
          ].map(({ label, sub, val, set }) => (
            <div key={label} style={s.toggleRow}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: val ? "#b91c1c" : "#9ca3af" }}>
                  {label === "Live Location" ? "location_on" : "work"}
                </span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{label}</p>
                  <p style={{ fontSize: 12, color: "#9ca3af" }}>{sub}</p>
                </div>
              </div>
              <div
                style={{ ...s.toggle, background: val ? "#b91c1c" : "#d1d5db" }}
                onClick={() => set((v: boolean) => !v)}
              >
                <div style={{ position: "absolute", top: 3, left: val ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ padding: "0 20px 10px", color: "#b91c1c", fontSize: 13, fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Save Button */}
        <div style={{ padding: "4px 20px" }}>
          <button
            disabled={loading}
            style={{ ...s.saveBtn, background: saved ? "#15803d" : "#b91c1c", opacity: loading ? 0.7 : 1 }}
            onClick={handleSave}
          >
            {loading ? (
              <span className="w-5 h-5 border-[2.5px] border-white/40 border-t-white rounded-full animate-spin-btn inline-block" />
            ) : saved ? (
              "PROFILE SAVED!"
            ) : (
              "SAVE PROFILE"
            )}
            {!loading && <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{saved ? "check_circle" : "verified"}</span>}
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav style={s.bottomNav}>
        {[
          { icon: "home", label: "Home", active: false },
          { icon: "receipt_long", label: "Requests", active: false },
          { icon: "map", label: "Live Map", active: false },
          { icon: "person", label: "Profile", active: true },
        ].map(({ icon, label, active }) => (
          <div key={label} style={s.navItem}>
            <div style={{ width: active ? 48 : 32, height: active ? 48 : 32, borderRadius: "50%", background: active ? "#b91c1c" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: active ? "#fff" : "#9ca3af", fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
            </div>
            <span style={{ fontSize: 10, color: active ? "#b91c1c" : "#9ca3af", fontWeight: active ? 700 : 500 }}>{label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}
