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

  // Enhanced 3D-style icons for different categories
  const getCustomIcon = (type: string, category: string) => {
    const categoryColors = {
      'cultural': '#8B4513',
      'culinary': '#FF6347', 
      'spiritual': '#9370DB',
      'adventure': '#228B22',
      'entertainment': '#FF1493',
      'shopping': '#FF8C00',
      'nature': '#32CD32',
      'nightlife': '#4B0082'
    };

    const iconColor = categoryColors[category] || '#6B7280';
    const typeIcon = {
      'activity': '🎯',
      'attraction': '📍', 
      'experience': '✨'
    }[type] || '📍';

    return L.divIcon({
      className: 'custom-3d-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, ${iconColor} 0%, ${iconColor}CC 100%);
          width: 32px; 
          height: 32px; 
          border-radius: 50%; 
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 2px ${iconColor}40;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          font-weight: bold;
          position: relative;
          transform: perspective(20px) rotateX(5deg);
          transition: all 0.3s ease;
        ">
          <div style="
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(2px);
          ">
            ${typeIcon}
          </div>
        </div>
        <div style="
          position: absolute;
          top: 34px;
          left: 50%;
          transform: translateX(-50%);
          background: ${iconColor};
          color: white;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        ">
          ${category.charAt(0).toUpperCase() + category.slice(1)}
        </div>
      `,
      iconSize: [32, 50],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
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
      
      {/* Enhanced Legend with Categories */}
      <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#8B4513] border border-white shadow-sm"></div>
          <span>Cultural</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#FF6347] border border-white shadow-sm"></div>
          <span>Culinary</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#9370DB] border border-white shadow-sm"></div>
          <span>Spiritual</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#228B22] border border-white shadow-sm"></div>
          <span>Adventure</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#FF1493] border border-white shadow-sm"></div>
          <span>Entertainment</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#FF8C00] border border-white shadow-sm"></div>
          <span>Shopping</span>
        </div>
      </div>
    </div>
  );
};