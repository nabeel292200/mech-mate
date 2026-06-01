"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icons for Next.js (must be done once)
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

const createUserIcon = () => new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const createMechIcon = () => new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function MapUpdater({ userLoc, mechLoc }: { userLoc: any, mechLoc: any }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (userLoc && mechLoc) {
      const bounds = L.latLngBounds([userLoc.lat, userLoc.lng], [mechLoc.lat, mechLoc.lng]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    } else if (userLoc) {
      map.setView([userLoc.lat, userLoc.lng], 15);
    } else if (mechLoc) {
      map.setView([mechLoc.lat, mechLoc.lng], 15);
    }
  }, [userLoc, mechLoc, map]);
  return null;
}

interface MapProps {
  userLocation: { lat: number, lng: number } | null;
  mechanicLocation: { lat: number, lng: number } | null;
  role: "user" | "mechanic" | string;
}

export default function MapComponent({ userLocation, mechanicLocation, role }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Default map center to Kochi, Kerala
  const center = userLocation || mechanicLocation || { lat: 9.9312, lng: 76.2673 };

  if (!isMounted) {
    return (
      <div style={{ height: '100%', width: '100%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#6b7280', fontSize: 14 }}>Loading map...</span>
      </div>
    );
  }

  const userIcon = createUserIcon();
  const mechIcon = createMechIcon();

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        minZoom={7}
        style={{ height: '100%', width: '100%' }}
      >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapUpdater userLoc={userLocation} mechLoc={mechanicLocation} />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={role === "user" ? userIcon : mechIcon}>
          <Popup>{role === "user" ? "You (User)" : "User Location"}</Popup>
        </Marker>
      )}

      {mechanicLocation && (
        <Marker position={[mechanicLocation.lat, mechanicLocation.lng]} icon={role === "mechanic" ? userIcon : mechIcon}>
          <Popup>{role === "mechanic" ? "You (Mechanic)" : "Mechanic Location"}</Popup>
        </Marker>
      )}
      </MapContainer>
    </div>
  );
}
