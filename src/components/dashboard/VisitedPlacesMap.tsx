import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, Search } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface VisitedPlace {
  id: string;
  place_name: string;
  country: string;
  coordinates: [number, number];
  visit_date: string;
  notes?: string;
}

interface VisitedPlacesMapProps {
  visitedPlaces: VisitedPlace[];
}

// Mock visited places for demonstration
const mockVisitedPlaces: VisitedPlace[] = [
  {
    id: '1',
    place_name: 'Tokyo',
    country: 'Japan',
    coordinates: [139.6917, 35.6895],
    visit_date: '2023-04-15',
    notes: 'Amazing cherry blossoms and incredible street food!'
  },
  {
    id: '2',
    place_name: 'Barcelona',
    country: 'Spain', 
    coordinates: [-2.1734, 41.3851],
    visit_date: '2023-07-22',
    notes: 'Gaudí architecture blew my mind. Perfect paella by the beach.'
  },
  {
    id: '3',
    place_name: 'Bali',
    country: 'Indonesia',
    coordinates: [115.0920, -8.4095],
    visit_date: '2023-11-08',
    notes: 'Sunset at Tanah Lot temple was magical. Great surfing!'
  },
  {
    id: '4',
    place_name: 'Paris',
    country: 'France',
    coordinates: [2.3522, 48.8566],
    visit_date: '2022-09-14',
    notes: 'Louvre was incredible. Best croissants of my life!'
  },
  {
    id: '5',
    place_name: 'Marrakech',
    country: 'Morocco',
    coordinates: [-7.9811, 31.6295],
    visit_date: '2023-01-30',
    notes: 'The souks were so vibrant. Learned to make tagine!'
  },
  {
    id: '6',
    place_name: 'Istanbul',
    country: 'Turkey',
    coordinates: [28.9784, 41.0082],
    visit_date: '2022-12-05',
    notes: 'Where Europe meets Asia. Hagia Sophia was breathtaking.'
  },
  {
    id: '7',
    place_name: 'Varanasi',
    country: 'India',
    coordinates: [83.0047, 25.3176],
    visit_date: '2023-02-18',
    notes: 'Spiritual experience by the Ganges. Amazing morning boat ride.'
  },
  {
    id: '8',
    place_name: 'Reykjavik',
    country: 'Iceland',
    coordinates: [-21.8174, 64.1466],
    visit_date: '2023-09-12',
    notes: 'Northern lights were spectacular! Blue Lagoon was so relaxing.'
  }
];

export const VisitedPlacesMap: React.FC<VisitedPlacesMapProps> = ({ visitedPlaces }) => {
  const { user } = useAuth();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [newPlace, setNewPlace] = useState({
    place_name: '',
    country: '',
    visit_date: '',
    notes: ''
  });

  // Use mock data for demonstration
  const displayPlaces = mockVisitedPlaces;

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

    const token = await fetchMapboxToken();
    if (!token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      zoom: 2,
      center: [0, 20],
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setIsMapLoaded(true);
      addPlaceMarkers();
    });
  };

  const addPlaceMarkers = () => {
    if (!map.current) return;

    displayPlaces.forEach((place, index) => {
      if (place.coordinates && place.coordinates[0] !== 0 && place.coordinates[1] !== 0) {
        const markerEl = document.createElement('div');
        markerEl.className = 'visited-place-marker';
        markerEl.style.cssText = `
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8));
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          color: white;
          animation: bounce 2s infinite;
        `;
        markerEl.textContent = (index + 1).toString();

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-4 max-w-xs">
            <h3 class="font-semibold text-lg mb-2">${place.place_name}</h3>
            <p class="text-sm text-gray-600 mb-2 flex items-center gap-1">
              <span>📍</span> ${place.country}
            </p>
            <p class="text-xs text-gray-500 mb-3 flex items-center gap-1">
              <span>📅</span> ${new Date(place.visit_date).toLocaleDateString()}
            </p>
            ${place.notes ? `<p class="text-sm italic text-gray-700 bg-gray-50 p-2 rounded">"${place.notes}"</p>` : ''}
          </div>
        `);

        new mapboxgl.Marker(markerEl)
          .setLngLat(place.coordinates)
          .setPopup(popup)
          .addTo(map.current!);
      }
    });

    // Fit map to show all markers
    if (displayPlaces.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      displayPlaces.forEach(place => {
        if (place.coordinates && place.coordinates[0] !== 0 && place.coordinates[1] !== 0) {
          bounds.extend(place.coordinates);
        }
      });
      if (!bounds.isEmpty()) {
        map.current?.fitBounds(bounds, { padding: 50 });
      }
    }
  };

  const handleAddPlace = async () => {
    if (!user || !newPlace.place_name || !newPlace.country) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Simple geocoding - in a real app, you'd use Mapbox Geocoding API
      const { data, error } = await supabase
        .from('visited_places')
        .insert([{
          user_id: user.id,
          place_name: newPlace.place_name,
          country: newPlace.country,
          visit_date: newPlace.visit_date || new Date().toISOString().split('T')[0],
          notes: newPlace.notes,
          coordinates: null // Would need geocoding service
        }]);

      if (error) throw error;

      toast.success('Place added successfully!');
      setNewPlace({ place_name: '', country: '', visit_date: '', notes: '' });
      setShowAddPlace(false);
      
      // Refresh the page to show new place
      window.location.reload();
    } catch (error) {
      console.error('Error adding place:', error);
      toast.error('Failed to add place');
    }
  };

  useEffect(() => {
    initializeMap();
    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    if (isMapLoaded && map.current) {
      // Clear existing markers
      const markers = document.querySelectorAll('.visited-place-marker');
      markers.forEach(marker => marker.remove());
      
      // Add new markers
      addPlaceMarkers();
    }
  }, [displayPlaces, isMapLoaded]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Places I've Visited
            </CardTitle>
            <Button onClick={() => setShowAddPlace(!showAddPlace)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Place
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddPlace && (
            <div className="mb-6 p-4 border rounded-lg space-y-4">
              <h3 className="font-semibold">Add a new place</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Place name"
                  value={newPlace.place_name}
                  onChange={(e) => setNewPlace(prev => ({ ...prev, place_name: e.target.value }))}
                />
                <Input
                  placeholder="Country"
                  value={newPlace.country}
                  onChange={(e) => setNewPlace(prev => ({ ...prev, country: e.target.value }))}
                />
                <Input
                  type="date"
                  placeholder="Visit date"
                  value={newPlace.visit_date}
                  onChange={(e) => setNewPlace(prev => ({ ...prev, visit_date: e.target.value }))}
                />
                <Input
                  placeholder="Notes (optional)"
                  value={newPlace.notes}
                  onChange={(e) => setNewPlace(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddPlace}>Add Place</Button>
                <Button variant="outline" onClick={() => setShowAddPlace(false)}>Cancel</Button>
              </div>
            </div>
          )}
          
          <div ref={mapContainer} className="w-full h-[500px] rounded-lg" />
          
          {displayPlaces.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No places visited yet</p>
                <p className="text-sm text-muted-foreground">Add your first destination!</p>
              </div>
            </div>
          )}
          
          <style>{`
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-10px); }
              60% { transform: translateY(-5px); }
            }
          `}</style>
        </CardContent>
      </Card>
    </div>
  );
};