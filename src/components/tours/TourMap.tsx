import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  type: 'activity' | 'attraction' | 'experience';
  category: string;
}

interface TourMapProps {
  markers: MapMarker[];
  center: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

export const TourMap: React.FC<TourMapProps> = ({
  markers,
  center,
  zoom = 13,
  className = "h-64 w-full rounded-lg"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Custom icons for different types
  const getCustomIcon = (type: string, category: string) => {
    const iconColor = {
      'activity': '#e74c3c',
      'attraction': '#3498db', 
      'experience': '#9b59b6'
    }[type] || '#95a5a6';

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${iconColor}; 
          width: 24px; 
          height: 24px; 
          border-radius: 50%; 
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">
          ${type === 'activity' ? 'A' : type === 'attraction' ? 'T' : 'E'}
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);

    // Add OpenStreetMap tiles with custom styling
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center.lat, center.lng, zoom]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    const newMarkers = markers.map(markerData => {
      const marker = L.marker(
        [markerData.position.lat, markerData.position.lng],
        { icon: getCustomIcon(markerData.type, markerData.category) }
      );

      marker.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #333;">
            ${markerData.title}
          </h4>
          <div style="display: inline-block; background-color: #f0f0f0; padding: 4px 8px; border-radius: 12px; font-size: 12px; color: #666;">
            ${markerData.category} • ${markerData.type}
          </div>
        </div>
      `);

      marker.addTo(mapInstanceRef.current!);
      return marker;
    });

    markersRef.current = newMarkers;

    // Fit map to show all markers if multiple markers exist
    if (markers.length > 1) {
      const group = L.featureGroup(newMarkers);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [markers]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg border border-border" />
      
      {/* Legend */}
      <div className="mt-2 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#e74c3c] border border-white"></div>
          <span>Activities</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#3498db] border border-white"></div>
          <span>Attractions</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#9b59b6] border border-white"></div>
          <span>Experiences</span>
        </div>
      </div>
    </div>
  );
};