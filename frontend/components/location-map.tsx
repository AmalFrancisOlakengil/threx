'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Colored Icons using SVGs
const createColoredIcon = (color: string) => L.divIcon({
  html: `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 0C5.596 0 0 5.596 0 12.5C0 21.875 12.5 41 12.5 41S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0Z" fill="${color}" stroke="white" stroke-width="1"/></svg>`,
  className: "",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const redIcon = createColoredIcon("#ef4444"); // Shop color
const greenIcon = createColoredIcon("#22c55e"); // Blindspot color

interface AnalysisData {
  shops: Record<string, number>;
  blindspots: Array<{ lat: number; lng: number; score: number }>;
}

export function LocationMap({ 
  data, 
  focusedLocation 
}: { 
  data: AnalysisData, 
  focusedLocation?: { lat: number; lng: number } | null 
}) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  // Focus effect
  useEffect(() => {
    if (mapRef.current && focusedLocation) {
      mapRef.current.flyTo([focusedLocation.lat, focusedLocation.lng], 15, {
        duration: 1.5
      });
    }
  }, [focusedLocation]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Initialize Map if not exists
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView([13.0827, 80.2707], 11); // Default TN center

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);

      markerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }

    // 2. Clear existing markers
    if (markerGroupRef.current) {
      markerGroupRef.current.clearLayers();
    }

    const bounds = L.latLngBounds([]);

    // 3. Process Shops (Red)
    Object.entries(data.shops).forEach(([latStr, lng]) => {
      const lat = parseFloat(latStr);
      const marker = L.marker([lat, lng], { icon: redIcon })
        .bindPopup(`<b>Existing Shop</b><br/>Lat: ${lat}<br/>Lon: ${lng}`);
      markerGroupRef.current?.addLayer(marker);
      bounds.extend([lat, lng]);
    });

    // 4. Process Ranked Blindspots (Green)
    if (Array.isArray(data.blindspots)) {
      data.blindspots.forEach((spot) => {
        const marker = L.marker([spot.lat, spot.lng], { icon: greenIcon })
          .bindPopup(`<b>Recommended Zone</b><br/>Opportunity Score: ${(spot.score * 1000).toFixed(1)}<br/>Lat: ${spot.lat}<br/>Lon: ${spot.lng}`);
        markerGroupRef.current?.addLayer(marker);
        bounds.extend([spot.lat, spot.lng]);
      });
    }

    // 5. Auto-fit map to show all markers
    if (bounds.isValid() && mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [data]);

  return <div ref={containerRef} className="w-full h-full" />;
}