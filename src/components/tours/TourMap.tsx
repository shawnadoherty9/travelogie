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
    console.log('Adding markers to map:', markers);
    const newMarkers = markers.map(markerData => {
      console.log('Creating marker for:', markerData.title, 'at', markerData.position);
      
      const marker = L.marker(
        [markerData.position.lat, markerData.position.lng],
        { icon: getCustomIcon(markerData.type, markerData.category) }
      );

      // Calculate distance from city center if available
      const distanceFromCenter = mapInstanceRef.current ? 
        mapInstanceRef.current.distance(
          [markerData.position.lat, markerData.position.lng],
          mapInstanceRef.current.getCenter()
        ) / 1000 : 0; // Convert to km

      marker.bindPopup(`
        <div style="text-align: center; padding: 12px; min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #333; font-size: 14px;">
            ${markerData.title}
          </h4>
          <div style="display: inline-block; background-color: #f0f0f0; padding: 4px 8px; border-radius: 12px; font-size: 12px; color: #666; margin-bottom: 8px;">
            ${markerData.category} • ${markerData.type}
          </div>
          <div style="font-size: 11px; color: #888;">
            📍 ${markerData.position.lat.toFixed(4)}, ${markerData.position.lng.toFixed(4)}
            ${distanceFromCenter > 0 ? `<br>📏 ${distanceFromCenter.toFixed(1)} km from center` : ''}
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
    } else if (markers.length === 1) {
      // Center on single marker
      const marker = markers[0];
      mapInstanceRef.current.setView([marker.position.lat, marker.position.lng], 15);
    }
  }, [markers]);

  // Group markers by category
  const markersByCategory = markers.reduce((acc, marker) => {
    if (!acc[marker.category]) {
      acc[marker.category] = [];
    }
    acc[marker.category].push(marker);
    return acc;
  }, {} as Record<string, typeof markers>);

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

  return (
    <div className={`${className} flex gap-4`}>
      <div className="flex-1">
        <div ref={mapRef} className="w-full h-full rounded-lg border border-border" />
      </div>
      
      {/* Side Legend */}
      <div className="w-64 bg-card border border-border rounded-lg p-4 overflow-y-auto">
        <h3 className="font-semibold text-lg mb-4 text-foreground">Your Selected Locations</h3>
        
        {Object.entries(markersByCategory).map(([category, categoryMarkers]) => (
          <div key={category} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                style={{ backgroundColor: categoryColors[category] || '#6B7280' }}
              ></div>
              <span className="font-medium text-sm capitalize text-foreground">
                {category} ({categoryMarkers.length})
              </span>
            </div>
            
            <div className="ml-6 space-y-1">
              {categoryMarkers.map((marker) => (
                <div key={marker.id} className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="text-lg">
                    {marker.type === 'activity' ? '🎯' : marker.type === 'attraction' ? '📍' : '✨'}
                  </span>
                  <span className="truncate">{marker.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {markers.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            <div className="mb-2">🗺️</div>
            <p>Select activities to see them on the map</p>
          </div>
        )}
        
        {/* Category Legend */}
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="font-medium text-sm mb-3 text-foreground">Category Colors</h4>
          <div className="space-y-2">
            {Object.entries(categoryColors).map(([category, color]) => (
              <div key={category} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full border border-white shadow-sm" 
                  style={{ backgroundColor: color }}
                ></div>
                <span className="capitalize text-muted-foreground">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};