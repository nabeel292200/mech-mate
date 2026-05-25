"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../src/services/api.service";

interface BrandData {
  _id: string;
  name: string;
  category: string;
  logoUrl: string;
}

const getBrandLogo = (brandName: string) => {
  const name = brandName.toLowerCase();
  const logos: Record<string, string> = {
    // Cars
    "toyota": "https://img.icons8.com/color/96/toyota.png",
    "honda": "https://img.icons8.com/color/96/honda.png",
    "nissan": "https://img.icons8.com/color/96/nissan.png",
    "suzuki": "https://img.icons8.com/color/96/suzuki.png",
    "mazda": "https://img.icons8.com/color/96/mazda.png",
    "mitsubishi": "https://img.icons8.com/color/96/mitsubishi.png",
    "hyundai": "https://img.icons8.com/color/96/hyundai.png",
    "kia": "https://img.icons8.com/color/96/kia-motors.png",
    "bmw": "https://img.icons8.com/color/96/bmw.png",
    "bmw motorrad": "https://img.icons8.com/color/96/bmw.png",
    "mercedes-benz": "https://img.icons8.com/color/96/mercedes-benz.png",
    "audi": "https://img.icons8.com/color/96/audi.png",
    "volkswagen": "https://img.icons8.com/color/96/volkswagen.png",
    "porsche": "https://img.icons8.com/color/96/porsche.png",
    "ferrari": "https://img.icons8.com/color/96/ferrari.png",
    "lamborghini": "https://img.icons8.com/color/96/lamborghini.png",
    "volvo": "https://img.icons8.com/color/96/volvo.png",
    "jaguar": "https://img.icons8.com/color/96/jaguar.png",
    "land rover": "https://img.icons8.com/color/96/land-rover.png",
    "ford": "https://img.icons8.com/color/96/ford.png",
    "chevrolet": "https://img.icons8.com/color/96/chevrolet.png",
    "tesla": "https://img.icons8.com/color/96/tesla.png",
    "jeep": "https://img.icons8.com/color/96/jeep.png",
    "dodge": "https://img.icons8.com/color/96/dodge.png",
    "gmc": "https://img.icons8.com/color/96/gmc.png",
    "cadillac": "https://img.icons8.com/color/96/cadillac.png",
    "chrysler": "https://img.icons8.com/color/96/chrysler.png",
    "subaru": "https://img.icons8.com/color/96/subaru.png",
    "lexus": "https://img.icons8.com/color/96/lexus.png",
    "infiniti": "https://img.icons8.com/color/96/infiniti.png",
    "acura": "https://img.icons8.com/color/96/acura.png",
    "bentley": "https://img.icons8.com/color/96/bentley.png",
    "rolls-royce": "https://img.icons8.com/color/96/rolls-royce.png",
    "aston martin": "https://img.icons8.com/color/96/aston-martin.png",
    "bugatti": "https://img.icons8.com/color/96/bugatti.png",
    "maserati": "https://img.icons8.com/color/96/maserati.png",
    "renault": "https://img.icons8.com/color/96/renault.png",
    "peugeot": "https://img.icons8.com/color/96/peugeot.png",
    "citroen": "https://img.icons8.com/color/96/citroen.png",
    "tata": "https://img.icons8.com/color/96/tata.png",
    "mahindra": "https://img.icons8.com/color/96/mahindra.png",
    "maruti suzuki": "https://img.icons8.com/color/96/suzuki.png",

    // Bikes
    "hero": "https://www.google.com/s2/favicons?domain=heromotocorp.com&sz=128",
    "bajaj": "https://www.google.com/s2/favicons?domain=bajajauto.com&sz=128",
    "tvs": "https://www.google.com/s2/favicons?domain=tvsmotor.com&sz=128",
    "royal enfield": "https://www.google.com/s2/favicons?domain=royalenfield.com&sz=128",
    "yamaha": "https://www.google.com/s2/favicons?domain=yamaha-motor.com&sz=128",
    "kawasaki": "https://www.google.com/s2/favicons?domain=kawasaki.com&sz=128",
    "ktm": "https://www.google.com/s2/favicons?domain=ktm.com&sz=128",
    "ducati": "https://www.google.com/s2/favicons?domain=ducati.com&sz=128",
    "harley-davidson": "https://www.google.com/s2/favicons?domain=harley-davidson.com&sz=128",
    "triumph": "https://www.google.com/s2/favicons?domain=triumphmotorcycles.com&sz=128",
    "aprilia": "https://www.google.com/s2/favicons?domain=aprilia.com&sz=128",
    "benelli": "https://www.google.com/s2/favicons?domain=benelli.com&sz=128",
    "husqvarna": "https://www.google.com/s2/favicons?domain=husqvarna-motorcycles.com&sz=128",
    "mv agusta": "https://www.google.com/s2/favicons?domain=mvagusta.com&sz=128",
    "indian": "https://www.google.com/s2/favicons?domain=indianmotorcycle.com&sz=128",
    "indian motorcycle": "https://www.google.com/s2/favicons?domain=indianmotorcycle.com&sz=128",
    "cfmoto": "https://www.google.com/s2/favicons?domain=cfmoto.com&sz=128",
    "moto guzzi": "https://www.google.com/s2/favicons?domain=motoguzzi.com&sz=128",

    // Trucks / Buses
    "ashok leyland": "https://www.google.com/s2/favicons?domain=ashokleyland.com&sz=128",
    "eicher": "https://www.google.com/s2/favicons?domain=eichermotors.com&sz=128",
    "scania": "https://www.google.com/s2/favicons?domain=scania.com&sz=128",
    "man": "https://www.google.com/s2/favicons?domain=man.eu&sz=128",
    "daf": "https://www.google.com/s2/favicons?domain=daf.com&sz=128",
    "kenworth": "https://www.google.com/s2/favicons?domain=kenworth.com&sz=128",
    "peterbilt": "https://www.google.com/s2/favicons?domain=peterbilt.com&sz=128",
    "freightliner": "https://www.google.com/s2/favicons?domain=freightliner.com&sz=128",
    "mack": "https://www.google.com/s2/favicons?domain=macktrucks.com&sz=128",
    "isuzu": "https://www.google.com/s2/favicons?domain=isuzu.com&sz=128",
    "hino": "https://www.google.com/s2/favicons?domain=hino.com&sz=128",
    "fuso": "https://www.google.com/s2/favicons?domain=mitsubishi-fuso.com&sz=128"
  };

  if (logos[name]) return logos[name];
  for (const key of Object.keys(logos)) {
    if (name.includes(key) || key.includes(name)) {
      return logos[key];
    }
  }
  return null;
};

function BrandLogo({ brandName, defaultInitials, isSelected, imgFailed, setImgFailed }: { brandName: string; defaultInitials: string; isSelected: boolean; imgFailed: boolean; setImgFailed: React.Dispatch<React.SetStateAction<boolean>> }) {
  const logoUrl = getBrandLogo(brandName);

  if (logoUrl && !imgFailed) {
    return (
      <img
        src={logoUrl}
        alt={`${brandName} logo`}
        onError={() => setImgFailed(true)}
        style={{
          width: "70%",
          height: "70%",
          objectFit: "contain",
          filter: isSelected ? "brightness(0) invert(1)" : "none"
        }}
      />
    );
  }

  return <>{defaultInitials}</>;
}

function VehicleBrandContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleType = searchParams.get("type") || "car";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [dbBrands, setDbBrands] = useState<BrandData[]>([]);
  const [loading, setLoading] = useState(true);

  // Keep track of which image loads failed so we fallback instantly
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Fetch brands from database
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get<{ success: boolean; data: { brands: BrandData[] } }>(`brands?category=${vehicleType}`);
        if (response.success && response.data.brands) {
          setDbBrands(response.data.brands);
        }
      } catch (error) {
        console.error("Failed to fetch vehicle brands from DB:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, [vehicleType]);

  const filteredBrands = dbBrands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBrandSelect = (brandName: string) => {
    setSelectedBrand(brandName);
    // Move to next step or dashboard
    setTimeout(() => {
      router.push(`/dashboard?vehicle=${vehicleType}&brand=${brandName}`);
    }, 300);
  };

  const s: Record<string, React.CSSProperties> = {
    root: { minHeight: "100vh", background: "#f8f9fa", fontFamily: "'Inter', 'Geist Sans', Arial, sans-serif", paddingBottom: 80 },
    header: { padding: "0 24px", height: 60, display: "flex", alignItems: "center", background: "#fff", borderBottom: "1px solid #f3f4f6", position: "sticky", top: 0, zIndex: 10 },
    logo: { fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", color: "#b91c1c", textDecoration: "none" },
    main: { maxWidth: 1000, margin: "0 auto", padding: "40px 24px" },
    title: { fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 8, letterSpacing: "-0.02em" },
    subtitle: { fontSize: 15, color: "#6b7280", marginBottom: 32 },
    searchContainer: { position: "relative", marginBottom: 40 },
    searchInput: { width: "100%", padding: "16px 20px 16px 48px", fontSize: 15, border: "1.5px solid #e5e7eb", borderRadius: 12, outline: "none", color: "#111827", background: "#fff", transition: "border-color 0.2s", boxSizing: "border-box" },
    searchIcon: { position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 22 },
    grid: { display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 40 },
    card: { background: "#fff", border: "1.5px solid #f3f4f6", borderRadius: 16, width: 160, height: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" },
    cardSelected: { borderColor: "#b91c1c", background: "#fef2f2", boxShadow: "0 4px 16px rgba(185,28,28,0.12)", transform: "translateY(-2px)" },
    logoCircle: { width: 56, height: 56, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: "#4b5563", fontSize: 20, fontWeight: 800, transition: "all 0.2s" },
    logoCircleSelected: { background: "#b91c1c", color: "#fff" },
    brandName: { fontSize: 14, fontWeight: 700, color: "#111827" },
    banner: { background: "#dc2626", borderRadius: 16, padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, boxShadow: "0 10px 24px rgba(220,38,38,0.2)" },
    bannerText: { flex: 1, minWidth: 280 },
    bannerTitle: { fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 6 },
    bannerSub: { fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.5 },
    bannerBtn: { background: "#fff", color: "#b91c1c", border: "none", borderRadius: 100, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s", whiteSpace: "nowrap" },
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

      {/* Main Content */}
      <main style={s.main}>
        <h1 style={s.title}>Identify Your Vehicle</h1>
        <p style={s.subtitle}>Select your car brand to receive specialized roadside assistance.</p>

        {/* Search Bar */}
        <div style={s.searchContainer}>
          <span className="material-symbols-outlined" style={s.searchIcon}>search</span>
          <input
            type="text"
            placeholder="Search car brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={s.searchInput}
            onFocus={(e) => (e.target.style.borderColor = "#b91c1c")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </div>

        {/* Brand Grid */}
        <div style={s.grid}>
          {loading ? (
            <p style={{ color: "#6b7280", fontStyle: "italic", padding: "20px 0" }}>Loading brands from database...</p>
          ) : filteredBrands.length === 0 ? (
            <p style={{ color: "#6b7280", padding: "20px 0" }}>No matching brands found.</p>
          ) : (
            filteredBrands.map((brand) => {
              const isSelected = selectedBrand === brand.name;
              const hasLogoImage = getBrandLogo(brand.name) && !failedImages[brand.name];
              return (
                <div
                  key={brand._id}
                  onClick={() => handleBrandSelect(brand.name)}
                  style={{ ...s.card, ...(isSelected ? s.cardSelected : {}) }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.06)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.03)";
                    }
                  }}
                >
                  <div style={{ 
                    ...s.logoCircle, 
                    ...(isSelected ? s.logoCircleSelected : {}),
                    ...(isSelected && hasLogoImage ? { background: "#fee2e2", color: "#b91c1c" } : {})
                  }}>
                    <BrandLogo 
                      brandName={brand.name} 
                      defaultInitials={brand.logoUrl} 
                      isSelected={isSelected} 
                      imgFailed={!!failedImages[brand.name]}
                      setImgFailed={(val) => setFailedImages(prev => ({ ...prev, [brand.name]: typeof val === 'function' ? val(!!prev[brand.name]) : val }))}
                    />
                  </div>
                  <span style={s.brandName}>{brand.name}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Red Banner */}
        <div style={s.banner}>
          <div style={s.bannerText}>
            <p style={s.bannerTitle}>Can't find your brand?</p>
            <p style={s.bannerSub}>Don't worry, our mechanics are trained for all vehicle types.</p>
          </div>
          <button
            style={s.bannerBtn}
            onClick={() => router.push(`/dashboard?vehicle=${vehicleType}&brand=other`)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
          >
            Other Vehicle Type <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
          </button>
        </div>
      </main>

    </div>
  );
}

export default function VehicleBrandPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7280", fontStyle: "italic" }}>Loading...</p>
      </div>
    }>
      <VehicleBrandContent />
    </Suspense>
  );
}
