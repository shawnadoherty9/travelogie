import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Globe, Navigation } from "lucide-react";

const InteractiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sample cultural experience locations
  const experiences = [
    { name: "Traditional Fishing with Locals", coordinates: [115.1889, -8.3405], location: "Gili Islands, Indonesia" },
    { name: "Calligraphy Workshop", coordinates: [139.6917, 35.6895], location: "Tokyo, Japan" },
    { name: "Flamenco Dance Experience", coordinates: [-5.9845, 37.3891], location: "Seville, Spain" },
    { name: "Cooking with Nonna", coordinates: [12.4964, 41.9028], location: "Rome, Italy" },
    { name: "Berber Desert Trek", coordinates: [-4.4250, 31.6295], location: "Marrakech, Morocco" },
    { name: "Tea Ceremony Master", coordinates: [135.7681, 35.0116], location: "Kyoto, Japan" },
  ];

  const fetchMapboxToken = async () => {
    try {
      const response = await fetch('/api/get-mapbox-token');
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Failed to fetch MapBox token:', error);
      return null;
    }
  };

  const initializeMap = async () => {
    if (!mapContainer.current) return;

    setIsLoading(true);
    const token = await fetchMapboxToken();
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      projection: 'globe',
      zoom: 2,
      center: [30, 20],
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(220, 230, 250)',
        'high-color': 'rgb(150, 180, 220)',
        'horizon-blend': 0.4,
      });

      // Add experience markers
      experiences.forEach((experience, index) => {
        // Create custom marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'custom-marker';
        markerEl.style.cssText = `
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8));
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        `;
        
        const icon = document.createElement('div');
        icon.innerHTML = '🌍';
        icon.style.fontSize = '16px';
        markerEl.appendChild(icon);

        // Create popup
        const popup = new mapboxgl.Popup({ 
          offset: 25,
          className: 'custom-popup'
        }).setHTML(`
          <div class="p-3">
            <h3 class="font-semibold text-lg mb-1">${experience.name}</h3>
            <p class="text-sm text-muted-foreground mb-2">${experience.location}</p>
            <button class="bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90 transition-colors">
              Learn More
            </button>
          </div>
        `);

        // Add marker to map
        new mapboxgl.Marker(markerEl)
          .setLngLat(experience.coordinates as [number, number])
          .setPopup(popup)
          .addTo(map.current!);
      });

      setIsMapLoaded(true);
      setIsLoading(false);
    });

    // Rotation animation
    const secondsPerRevolution = 300;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
      if (!map.current) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    // Event listeners for interaction
    map.current.on('mousedown', () => { userInteracting = true; });
    map.current.on('dragstart', () => { userInteracting = true; });
    map.current.on('mouseup', () => { userInteracting = false; spinGlobe(); });
    map.current.on('touchend', () => { userInteracting = false; spinGlobe(); });
    map.current.on('moveend', () => { spinGlobe(); });

    // Start spinning
    spinGlobe();
  };

  useEffect(() => {
    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Discover Cultural Experiences Worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              Loading interactive map...
            </p>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="w-full h-[600px] flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="text-center">
                  <Globe className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
                  <p className="text-muted-foreground">Initializing interactive globe...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Discover Cultural Experiences Worldwide
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Connect with locals and explore authentic traditions around the globe
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Interactive Navigation
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              3D Globe View
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Cultural Hotspots
            </div>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div 
              ref={mapContainer} 
              className="w-full h-[600px] relative"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--secondary) / 0.1))' }}
            />
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              🎣
            </div>
            <h3 className="font-semibold mb-2">Authentic Experiences</h3>
            <p className="text-sm text-muted-foreground">Fish with locals in Indonesian waters</p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              🖌️
            </div>
            <h3 className="font-semibold mb-2">Cultural Learning</h3>
            <p className="text-sm text-muted-foreground">Master calligraphy with traditional scribes</p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              🌍
            </div>
            <h3 className="font-semibold mb-2">Global Community</h3>
            <p className="text-sm text-muted-foreground">Connect with locals worldwide</p>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .custom-marker {
          animation: pulse 2s infinite;
        }
        .custom-popup .mapboxgl-popup-content {
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .custom-popup .mapboxgl-popup-tip {
          border-top-color: hsl(var(--background));
        }
      `}</style>
    </section>
  );
};

export default InteractiveMap;