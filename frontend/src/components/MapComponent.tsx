"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], 
  iconAnchor: [12, 41]
});

const mechIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], 
  iconAnchor: [12, 41]
});

// KERALA BOUNDARIES
const KERALA_BOUNDS = L.latLngBounds([8.0667, 74.8523], [12.8354, 77.4144]);

function MapUpdater({ userLoc, mechLoc }: { userLoc: any, mechLoc: any }) {
  const map = useMap();
  useEffect(() => {
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
  // Default map center to Kochi, Kerala if no location is available
  const center = userLocation || mechanicLocation || { lat: 9.9312, lng: 76.2673 }; 
  
  return (
    <MapContainer 
      center={[center.lat, center.lng]} 
      zoom={13} 
      minZoom={7}
      maxBounds={KERALA_BOUNDS}
      maxBoundsViscosity={1.0}
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
  );
}
