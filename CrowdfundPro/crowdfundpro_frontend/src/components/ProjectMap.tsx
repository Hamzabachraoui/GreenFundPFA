'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ProjectMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address?: string;
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

export default function ProjectMap({ latitude, longitude, title, address }: ProjectMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Fix les icônes Leaflet
    fixLeafletIcon();

    // Créer la carte
    const map = L.map(mapRef.current).setView([latitude, longitude], 15);
    mapInstanceRef.current = map;

    // Ajouter la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Ajouter le marqueur
    const marker = L.marker([latitude, longitude]).addTo(map);
    
    // Créer le popup avec les informations
    const popupContent = `
      <div style="min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${title}</h3>
        ${address ? `<p style="margin: 0; color: #6b7280; font-size: 14px;">📍 ${address}</p>` : ''}
        <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">GPS: ${latitude}, ${longitude}</p>
      </div>
    `;
    
    marker.bindPopup(popupContent);

    // Nettoyer la carte lors du démontage
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, title, address]);

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
} 