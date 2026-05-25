"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../src/store/authStore";
import { api } from "../../../src/services/api.service";

const VEHICLE_TYPES = [
  { id: "bike",  label: "Bike",  icon: "two_wheeler" },
  { id: "car",   label: "Car",   icon: "directions_car" },
  { id: "truck", label: "Truck", icon: "local_shipping" },
  { id: "bus",   label: "Bus",   icon: "directions_bus" },
];

interface DBBrand {
  name: string;
  category: string;
}

export default function MechanicDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, updateProfile } = useAuthStore();

  const wasProfileCompleteRef = useRef<boolean | null>(null);
  if (user && wasProfileCompleteRef.current === null) {
    wasProfileCompleteRef.current = user.isProfileComplete;
  }

  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [address, setAddress] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [liveLocation, setLiveLocation] = useState(true);
  const [workStatus, setWorkStatus] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [dbBrands, setDbBrands] = useState<DBBrand[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [brandCategoryFilter, setBrandCategoryFilter] = useState("matched");

  const fileRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Redirection guard for auth status and profile completeness
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login?role=mechanic");
      } else if (user.role !== "mechanic") {
        router.push("/login?role=mechanic");
      } else if (user.isProfileComplete) {
        router.push("/mechanic/home");
      }
    }
  }, [user, authLoading, router]);

  // Sync state with global auth context user profile
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      if (user.mechanic) {
        setExperience(user.mechanic.experience ? String(user.mechanic.experience) : "");
        setAddress(user.mechanic.workshopAddress || "");
        const loadedSkills = user.mechanic.vehicleSkills || [];
        setSkills(loadedSkills);
        setBrands(user.mechanic.brandExpertise || []);
        setLiveLocation(user.mechanic.liveLocation !== false);
        setWorkStatus(user.mechanic.isAvailable !== false);
        if (loadedSkills.length > 0) {
          setBrandCategoryFilter("matched");
        } else {
          setBrandCategoryFilter("all");
        }
      }
    }
  }, [user]);

  // Fetch all brands from DB
  useEffect(() => {
    const fetchDBBrands = async () => {
      try {
        const res = await api.get<{ success: boolean; data: { brands: DBBrand[] } }>("brands");
        if (res.success && res.data.brands) {
          setDbBrands(res.data.brands);
        }
      } catch (err) {
        console.error("Failed to fetch brands in dashboard:", err);
      }
    };
    fetchDBBrands();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isInitiallyComplete = wasProfileCompleteRef.current === true;
  if (authLoading || !user || user.role !== "mechanic" || isInitiallyComplete) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f5f5f5" }}>
        <span style={{ width: 36, height: 36, border: "3px solid #e5e7eb", borderTopColor: "#b91c1c", borderRadius: "50%" }} className="animate-spin-btn" />
      </div>
    );
  }

  const toggleSkill = (id: string) => {
    setSkills((p) => {
      const next = p.includes(id) ? p.filter((s) => s !== id) : [...p, id];
      if (next.length === 0) {
        setBrandCategoryFilter("all");
      } else if (brandCategoryFilter === "all" && p.length === 0) {
        setBrandCategoryFilter("matched");
      }
      return next;
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const handleNextStep = () => {
    setError("");
    if (step === 1) {
      if (!name.trim()) { setError("Full Name is required"); return; }
      if (phone.replace(/\D/g, "").length !== 10) { setError("A valid 10-digit phone number is required"); return; }
      if (!experience.trim() || Number(experience) < 0) { setError("Experience is required and must be 0 or more years"); return; }
      if (!address.trim()) { setError("Workshop Address is required"); return; }
      setStep(2);
    } else if (step === 2) {
      if (skills.length === 0) { setError("Please select at least one vehicle skill"); return; }
      if (brands.length === 0) { setError("Please select at least one brand expertise"); return; }
      setStep(3);
    }
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
      setTimeout(() => {
        setSaved(false);
        router.push("/mechanic/home");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const filteredDBBrands = dbBrands.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (brands.includes(b.name)) return false;

    if (brandCategoryFilter === "matched") {
      if (skills.length > 0) {
        return skills.includes(b.category) || b.category === "all";
      }
      return true;
    } else if (brandCategoryFilter !== "all") {
      return b.category === brandCategoryFilter;
    }

    return true;
  });

  const s: Record<string, React.CSSProperties> = {
    root: { minHeight: "100vh", background: "#f5f5f5", fontFamily: "'Inter','Geist Sans',Arial,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 100 },
    header: { width: "100%", maxWidth: 540, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#fff", borderBottom: "1px solid #f0f0f0", position: "sticky" as const, top: 0, zIndex: 40 },
    logo: { fontSize: 20, fontWeight: 900, color: "#b91c1c", letterSpacing: "-0.04em", textDecoration: "none" },
    avatar: { width: 38, height: 38, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer", border: "2px solid #e5e7eb" },
    page: { width: "100%", maxWidth: 540, padding: "24px 16px 16px", boxSizing: "border-box" as const },
    progress: { background: "#fff", padding: "18px 20px 14px", marginBottom: 12 },
    bar: { height: 4, background: "#e5e7eb", borderRadius: 4, marginTop: 10, marginBottom: 8, overflow: "hidden" },
    barFill: { height: "100%", width: step === 1 ? "33%" : step === 2 ? "66%" : "100%", background: "#b91c1c", borderRadius: 4, transition: "width 0.3s ease" },
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
    toggleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f3f4f6" },
    toggle: { width: 44, height: 24, borderRadius: 12, position: "relative" as const, cursor: "pointer", transition: "background 0.2s", flexShrink: 0 },
    saveBtn: { width: "100%", background: "#b91c1c", color: "#fff", border: "none", borderRadius: 10, padding: "16px 0", fontSize: 15, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" as const, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" },
    bottomNav: { position: "fixed" as const, bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #f0f0f0", height: 64, display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 50 },
    navItem: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 3, cursor: "pointer", flex: 1 },
    btnRow: { display: "flex", gap: 12, width: "100%" },
    backBtn: { flex: 1, background: "#fff", color: "#374151", border: "1.5px solid #d1d5db", borderRadius: 10, padding: "16px 0", fontSize: 15, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" as const, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" },
    nextBtn: { flex: 2, background: "#b91c1c", color: "#fff", border: "none", borderRadius: 10, padding: "16px 0", fontSize: 15, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" as const, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" },
    dropdown: { background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 8, marginTop: 4, maxHeight: 180, overflowY: "auto" as const, position: "absolute" as const, width: "100%", zIndex: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
    dropdownItem: { padding: "10px 14px", fontSize: 13, cursor: "pointer", color: "#374151", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" },
    filterBtnGroup: { display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" as const },
    filterBtn: { border: "1px solid #d1d5db", background: "#fff", color: "#374151", borderRadius: 100, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", outline: "none" },
    filterBtnActive: { border: "1.5px solid #b91c1c", background: "#fff5f5", color: "#b91c1c" }
  };

  return (
    <div style={s.root}>
      <div style={s.page}>
        {/* Progress */}
        <div style={s.progress}>
          <p style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Complete Your Mechanic Profile</p>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>Help us get you on the road and helping customers.</p>
          <div style={s.bar}><div style={s.barFill} /></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#b91c1c", fontWeight: 600 }}>
            <span>Step {step} of 3</span>
            <span>{step === 1 ? "33%" : step === 2 ? "66%" : "100%"} Complete</span>
          </div>
        </div>

        {/* STEP 1: Personal & Workshop Details */}
        {step === 1 && (
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
            <input style={{ ...s.input, marginBottom: 14 }} placeholder="e.g. Alex Smith" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} />

            <div style={{ ...s.row2, marginBottom: 14 }}>
              <div>
                <label style={s.label}>Phone Number</label>
                <input style={s.input} placeholder="+91 XXXXXXXXXX" value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }} />
              </div>
              <div>
                <label style={s.label}>Experience (years)</label>
                <input style={s.input} placeholder="5" type="number" value={experience} onChange={(e) => { setExperience(e.target.value); setError(""); }} />
              </div>
            </div>

            <label style={s.label}>Workshop Address</label>
            <div style={{ position: "relative" }}>
              <input style={{ ...s.input, paddingRight: 40 }} placeholder="Enter street address" value={address} onChange={(e) => { setAddress(e.target.value); setError(""); }} />
              <span className="material-symbols-outlined" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 20, color: "#9ca3af" }}>location_on</span>
            </div>
          </div>
        )}

        {/* STEP 2: Skills & Expertise */}
        {step === 2 && (
          <>
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
                      onClick={() => { toggleSkill(id); setError(""); }}
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
              
              {/* Selected Brands Tags */}
              <div style={{ ...s.tagRow, marginBottom: 16 }}>
                {brands.map((b) => (
                  <span key={b} style={s.tag}>
                    {b}
                    <span style={{ cursor: "pointer", fontWeight: 400, opacity: 0.8 }} onClick={() => setBrands((p) => p.filter((x) => x !== b))}>×</span>
                  </span>
                ))}
                {brands.length === 0 && (
                  <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>No brands selected. Select the brands you work with.</p>
                )}
              </div>

              {/* Brand Category Filters */}
              <div style={{ marginBottom: 12 }}>
                <label style={s.label}>Filter Brands By:</label>
                <div style={s.filterBtnGroup}>
                  {skills.length > 0 && (
                    <button
                      type="button"
                      style={{
                        ...s.filterBtn,
                        ...(brandCategoryFilter === "matched" ? s.filterBtnActive : {})
                      }}
                      onClick={() => setBrandCategoryFilter("matched")}
                    >
                      Matched Skills ({skills.join(", ")})
                    </button>
                  )}
                  {[
                    { id: "all", label: "All Brands" },
                    { id: "car", label: "Cars" },
                    { id: "bike", label: "Bikes" },
                    { id: "truck", label: "Trucks" },
                    { id: "bus", label: "Buses" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      style={{
                        ...s.filterBtn,
                        ...(brandCategoryFilter === item.id ? s.filterBtnActive : {})
                      }}
                      onClick={() => setBrandCategoryFilter(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dropdown with Search */}
              <div style={{ position: "relative" }}>
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                    setError("");
                  }}
                  onFocus={() => setShowDropdown(true)}
                  style={s.input}
                  placeholder="Search and select brands..."
                />
                
                {showDropdown && (
                  <div ref={dropdownRef} style={s.dropdown}>
                    {filteredDBBrands.length === 0 ? (
                      <div style={{ padding: "12px 14px", fontSize: 13, color: "#6b7280", textAlign: "center" }}>
                        {searchQuery ? (
                          <div>
                            <p style={{ marginBottom: 8 }}>No matching brand found.</p>
                            <button
                              type="button"
                              onClick={() => {
                                const val = searchQuery.trim();
                                if (val && !brands.includes(val)) {
                                  setBrands((p) => [...p, val]);
                                  setSearchQuery("");
                                  setShowDropdown(false);
                                }
                              }}
                              style={{ background: "#b91c1c", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                            >
                              Add &quot;{searchQuery}&quot; as custom
                            </button>
                          </div>
                        ) : (
                          "All brands selected"
                        )}
                      </div>
                    ) : (
                      filteredDBBrands.map((brand) => (
                        <div
                          key={brand.name}
                          onClick={() => {
                            setBrands((p) => [...p, brand.name]);
                            setSearchQuery("");
                            setShowDropdown(false);
                          }}
                          style={s.dropdownItem}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
                        >
                          <span>{brand.name}</span>
                          <span style={{ fontSize: 11, color: "#9ca3af", textTransform: "capitalize" }}>{brand.category}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* STEP 3: Status & Visibility */}
        {step === 3 && (
          <div style={s.card}>
            <p style={s.sectionTitle}>Status & Visibility</p>
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
        )}

        {error && (
          <div style={{ padding: "0 20px 10px", color: "#b91c1c", fontSize: 13, fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Step Buttons */}
        <div style={{ padding: "4px 20px" }}>
          {step === 1 && (
            <button
              style={s.saveBtn}
              onClick={handleNextStep}
            >
              Continue to Step 2
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
            </button>
          )}

          {step === 2 && (
            <div style={s.btnRow}>
              <button
                style={s.backBtn}
                onClick={() => setStep(1)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
                Back
              </button>
              <button
                style={s.nextBtn}
                onClick={handleNextStep}
              >
                Continue to Step 3
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
              </button>
            </div>
          )}

          {step === 3 && (
            <div style={s.btnRow}>
              <button
                disabled={loading}
                style={s.backBtn}
                onClick={() => setStep(2)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
                Back
              </button>
              <button
                disabled={loading}
                style={{ ...s.saveBtn, flex: 2, background: saved ? "#15803d" : "#b91c1c", opacity: loading ? 0.7 : 1 }}
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
          )}
        </div>
      </div>
    </div>
  );
}
