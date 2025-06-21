'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

// Fix pour les icônes Leaflet dans Next.js
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

export default function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Fix les icônes Leaflet
    fixLeafletIcon();

    // Position par défaut (Casablanca, Maroc)
    const defaultLat = latitude || 33.5731;
    const defaultLng = longitude || -7.5898;

    // Créer la carte
    const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 10);
    mapInstanceRef.current = map;

    // Ajouter la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Créer le marqueur
    const marker = L.marker([defaultLat, defaultLng], {
      draggable: true
    }).addTo(map);
    markerRef.current = marker;

    // Gérer le déplacement du marqueur
    marker.on('dragend', (event) => {
      const position = event.target.getLatLng();
      onLocationChange(position.lat, position.lng);
    });

    // Gérer le clic sur la carte
    map.on('click', (event) => {
      const { lat, lng } = event.latlng;
      marker.setLatLng([lat, lng]);
      onLocationChange(lat, lng);
    });

    setIsMapReady(true);

    // Nettoyer la carte lors du démontage
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Mettre à jour le marqueur si les coordonnées changent
  useEffect(() => {
    if (isMapReady && markerRef.current && latitude && longitude) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapInstanceRef.current?.setView([latitude, longitude], 15);
    }
  }, [latitude, longitude, isMapReady]);

  return (
    <div className="w-full">
      <div className="mb-3">
        <p className="text-sm text-gray-600">
          🗺️ Cliquez sur la carte pour placer le marqueur ou déplacez-le directement
        </p>
      </div>
      <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-300">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  );
} 