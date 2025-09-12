import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './InteractiveTravelMap.css';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Plus, Heart, MessageCircle, Star, X } from "lucide-react";
import { toast } from "sonner";

interface TravelSuggestion {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  author: string;
  image?: string;
  rating: number;
  likes: number;
  comments: number;
  tags: string[];
  date: string;
}

const InteractiveTravelMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [tokenError, setTokenError] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string>('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<TravelSuggestion | null>(null);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState({
    title: '',
    description: '',
    author: '',
    tags: ''
  });
  const [tempMarker, setTempMarker] = useState<mapboxgl.Marker | null>(null);

  // Sample travel suggestions data
  const [travelSuggestions, setTravelSuggestions] = useState<TravelSuggestion[]>([
    {
      id: '1',
      latitude: 35.6762,
      longitude: 139.6503,
      title: 'Hidden Shrine in Shibuya',
      description: 'A peaceful shrine tucked away behind the busy streets. Perfect for meditation and experiencing traditional Japan.',
      author: 'Yuki T.',
      rating: 4.8,
      likes: 156,
      comments: 23,
      tags: ['Spiritual', 'Hidden Gem', 'Culture'],
      date: '2 days ago'
    },
    {
      id: '2',
      latitude: 41.3851,
      longitude: 2.1734,
      title: 'Secret Rooftop Garden',
      description: 'Amazing views of Sagrada Familia from this hidden rooftop garden. Local artists sell their work here on weekends.',
      author: 'Carlos M.',
      rating: 4.9,
      likes: 203,
      comments: 31,
      tags: ['Views', 'Art', 'Local'],
      date: '1 week ago'
    },
    {
      id: '3',
      latitude: 25.2048,
      longitude: 82.9454,
      title: 'Dawn Yoga by the Ganges',
      description: 'Join locals for sunrise yoga sessions by the holy river. Life-changing spiritual experience.',
      author: 'Priya S.',
      rating: 5.0,
      likes: 289,
      comments: 45,
      tags: ['Spiritual', 'Wellness', 'Local'],
      date: '3 days ago'
    }
  ]);

  useEffect(() => {
    // Fetch Mapbox token
    const fetchMapboxToken = async () => {
      try {
        const response = await fetch('/api/get-mapbox-token');
        const data = await response.json();
        if (data.token) {
          setMapboxToken(data.token);
          setTokenError(false);
        } else {
          console.error('Failed to fetch Mapbox token:', data.error);
          setTokenError(true);
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
        setTokenError(true);
      }
    };

    fetchMapboxToken();
  }, []);

  useEffect(() => {
    const activeToken = mapboxToken || userToken;
    if (!mapContainer.current || !activeToken) return;

    // Initialize map
    mapboxgl.accessToken = activeToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      projection: 'globe',
      zoom: 1.5,
      center: [30, 15],
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
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });
    });

    // Rotation animation settings
    const secondsPerRevolution = 240;
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
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('moveend', () => {
      spinGlobe();
    });

    // Add click handler for adding new pins
    map.current.on('click', (e) => {
      if (isAddingPin && map.current) {
        // Remove previous temp marker
        if (tempMarker) {
          tempMarker.remove();
        }

        // Add temporary marker
        const marker = new mapboxgl.Marker({
          color: '#FF6B6B',
          scale: 1.2
        })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map.current);

        setTempMarker(marker);
      }
    });

    // Start the globe spinning
    spinGlobe();

    // Add existing suggestion markers
    travelSuggestions.forEach((suggestion) => {
      addSuggestionMarker(suggestion);
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, userToken, travelSuggestions, isAddingPin]);

  const addSuggestionMarker = (suggestion: TravelSuggestion) => {
    if (!map.current) return;

    // Create custom marker element
    const el = document.createElement('div');
    el.className = 'suggestion-marker';
    el.innerHTML = `
      <div class="w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg cursor-pointer transform transition-transform hover:scale-110 flex items-center justify-center">
        <div class="w-4 h-4 bg-white rounded-full animate-pulse"></div>
      </div>
    `;

    const marker = new mapboxgl.Marker(el)
      .setLngLat([suggestion.longitude, suggestion.latitude])
      .addTo(map.current);

    // Add click handler to open postcard
    el.addEventListener('click', () => {
      setSelectedSuggestion(suggestion);
    });
  };

  const handleAddSuggestion = () => {
    if (!tempMarker || !newSuggestion.title || !newSuggestion.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const lngLat = tempMarker.getLngLat();
    const suggestion: TravelSuggestion = {
      id: Date.now().toString(),
      latitude: lngLat.lat,
      longitude: lngLat.lng,
      title: newSuggestion.title,
      description: newSuggestion.description,
      author: newSuggestion.author || 'Anonymous',
      rating: 0,
      likes: 0,
      comments: 0,
      tags: newSuggestion.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      date: 'Just now'
    };

    setTravelSuggestions([...travelSuggestions, suggestion]);
    
    // Reset form
    setNewSuggestion({ title: '', description: '', author: '', tags: '' });
    setIsAddingPin(false);
    tempMarker.remove();
    setTempMarker(null);
    
    toast.success('Travel suggestion added successfully!');
  };

  const cancelAddPin = () => {
    setIsAddingPin(false);
    if (tempMarker) {
      tempMarker.remove();
      setTempMarker(null);
    }
    setNewSuggestion({ title: '', description: '', author: '', tags: '' });
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background via-background/80 to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Discover & Share Travel Gems
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our interactive 3D globe to discover hidden travel gems shared by fellow adventurers.
            Click anywhere to add your own travel suggestions!
          </p>
        </div>

        <div className="relative">
          {/* Token input for fallback */}
          {tokenError && !userToken && (
            <Card className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Mapbox Token Required</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    To display the interactive map, please add your Mapbox public token to Supabase Edge Function secrets, 
                    or enter it below temporarily.
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Get your token at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter your Mapbox public token (pk.xxxxx)"
                    value={userToken}
                    onChange={(e) => setUserToken(e.target.value)}
                    className="text-xs"
                  />
                  <Button 
                    onClick={() => setUserToken(userToken)}
                    disabled={!userToken.startsWith('pk.')}
                    size="sm"
                  >
                    Use Token
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <Card className="overflow-hidden shadow-2xl">
            <div className="relative h-[600px] w-full">
              {(!mapboxToken && !userToken) ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                  <div className="text-center space-y-3">
                    <MapPin className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Mapbox token required to display interactive map</p>
                  </div>
                </div>
              ) : (
                <div ref={mapContainer} className="absolute inset-0" />
              )}
              
              {/* Controls */}
              {(mapboxToken || userToken) && (
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <Button
                    onClick={() => setIsAddingPin(!isAddingPin)}
                    variant={isAddingPin ? "secondary" : "default"}
                    size="sm"
                    className="shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {isAddingPin ? 'Cancel' : 'Add Pin'}
                  </Button>
                  
                  {isAddingPin && (
                    <Card className="p-3 bg-background/95 backdrop-blur-sm">
                      <p className="text-sm text-muted-foreground">
                        Click anywhere on the map to add your travel suggestion
                      </p>
                    </Card>
                  )}
                </div>
              )}

              {/* Legend */}
              {(mapboxToken || userToken) && (
                <div className="absolute bottom-4 left-4 z-10">
                  <Card className="p-3 bg-background/95 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span>Travel Suggestions ({travelSuggestions.length})</span>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Add Suggestion Dialog */}
        {tempMarker && (
          <Dialog open={isAddingPin && tempMarker !== null} onOpenChange={() => cancelAddPin()}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share Your Travel Suggestion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Title *</label>
                  <Input
                    placeholder="e.g., Hidden Temple in Old Town"
                    value={newSuggestion.title}
                    onChange={(e) => setNewSuggestion({...newSuggestion, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Description *</label>
                  <Textarea
                    placeholder="Describe what makes this place special..."
                    value={newSuggestion.description}
                    onChange={(e) => setNewSuggestion({...newSuggestion, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Your Name</label>
                  <Input
                    placeholder="Anonymous"
                    value={newSuggestion.author}
                    onChange={(e) => setNewSuggestion({...newSuggestion, author: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tags (comma-separated)</label>
                  <Input
                    placeholder="e.g., Culture, Hidden Gem, Food"
                    value={newSuggestion.tags}
                    onChange={(e) => setNewSuggestion({...newSuggestion, tags: e.target.value})}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddSuggestion} className="flex-1">
                    Add Suggestion
                  </Button>
                  <Button onClick={cancelAddPin} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Postcard Modal */}
        {selectedSuggestion && (
          <Dialog open={!!selectedSuggestion} onOpenChange={() => setSelectedSuggestion(null)}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
              <div className="postcard-container relative bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900">
                {/* Postcard Header */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40"></div>
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSuggestion(null)}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm opacity-90">Travel Suggestion</span>
                    </div>
                    <h3 className="text-xl font-bold">{selectedSuggestion.title}</h3>
                  </div>
                </div>

                {/* Postcard Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedSuggestion.rating || 'New'}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{selectedSuggestion.date}</span>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {selectedSuggestion.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedSuggestion.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {selectedSuggestion.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {selectedSuggestion.comments}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-primary">
                      by {selectedSuggestion.author}
                    </span>
                  </div>
                </div>

                {/* Postcard stamp effect */}
                <div className="absolute top-2 right-2 w-12 h-12 border-2 border-dashed border-primary/30 rounded flex items-center justify-center text-xs text-primary/60 bg-white/50">
                  STAMP
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

    </section>
  );
};

export default InteractiveTravelMap;