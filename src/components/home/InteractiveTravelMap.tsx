import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './InteractiveTravelMap.css';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Plus, Heart, MessageCircle, Star, X } from "lucide-react";
import { toast } from "sonner";

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  avatar?: string;
}

interface TravelSuggestion {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  author: string;
  image: string;
  rating: number;
  likes: number;
  comments: Comment[];
  tags: string[];
  date: string;
}

const InteractiveTravelMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<TravelSuggestion | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState({
    title: '',
    description: '',
    author: '',
    tags: ''
  });
  const [tempMarker, setTempMarker] = useState<L.Marker | null>(null);
  const [suggestionMarkers, setSuggestionMarkers] = useState<L.Marker[]>([]);

  // Sample travel suggestions data
  const [travelSuggestions, setTravelSuggestions] = useState<TravelSuggestion[]>([
    {
      id: '1',
      latitude: 35.6762,
      longitude: 139.6503,
      title: 'Hidden Shrine in Shibuya',
      description: 'A peaceful shrine tucked away behind the busy streets. Perfect for meditation and experiencing traditional Japan.',
      author: 'Yuki T.',
      image: '/lovable-uploads/25f8f091-7b7d-4b9a-aa2c-bffc8e9b3b68.png',
      rating: 4.8,
      likes: 156,
      comments: [
        { id: '1', author: 'Sarah K.', text: 'Amazing place! So peaceful despite being in the middle of Tokyo.', date: '1 day ago' },
        { id: '2', author: 'Mike L.', text: 'Found this thanks to your suggestion. The traditional architecture is stunning!', date: '2 hours ago' },
        { id: '3', author: 'Emma R.', text: 'Perfect spot for morning meditation. Thank you for sharing!', date: '30 minutes ago' }
      ],
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
      image: '/lovable-uploads/4f14a223-57a1-4a7d-bf9a-6bc3e17c25b9.png',
      rating: 4.9,
      likes: 203,
      comments: [
        { id: '4', author: 'Julia P.', text: 'The sunset views from here are incredible! Got some amazing photos.', date: '3 hours ago' },
        { id: '5', author: 'David S.', text: 'Met some amazing local artists here. Bought a beautiful painting of the city.', date: '1 day ago' }
      ],
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
      image: '/assets/varanasi-temples.jpg',
      rating: 5.0,
      likes: 289,
      comments: [
        { id: '6', author: 'Alex M.', text: 'Most spiritual experience of my life. The energy here at sunrise is indescribable.', date: '2 days ago' },
        { id: '7', author: 'Lisa W.', text: 'The yoga instructor was amazing and so welcoming to visitors. Highly recommend!', date: '4 hours ago' },
        { id: '8', author: 'Tom B.', text: 'Changed my perspective on travel. This is what authentic cultural exchange looks like.', date: '1 hour ago' }
      ],
      tags: ['Spiritual', 'Wellness', 'Local'],
      date: '3 days ago'
    }
  ]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with OpenStreetMap
    map.current = L.map(mapContainer.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
      worldCopyJump: true
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add click handler for adding new pins
    map.current.on('click', (e) => {
      if (isAddingPin && map.current) {
        // Remove previous temp marker
        if (tempMarker) {
          map.current.removeLayer(tempMarker);
        }

        // Create custom marker icon
        const customIcon = L.divIcon({
          className: 'custom-temp-marker',
          html: `<div style="background-color: #FF6B6B; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        // Add temporary marker
        const marker = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: customIcon
        }).addTo(map.current);

        setTempMarker(marker);
      }
    });

    // Add existing suggestion markers
    travelSuggestions.forEach((suggestion) => {
      addSuggestionMarker(suggestion);
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [isAddingPin, travelSuggestions]);

  const addSuggestionMarker = (suggestion: TravelSuggestion) => {
    if (!map.current) return;

    // Create custom marker icon
    const customIcon = L.divIcon({
      className: 'custom-suggestion-marker',
      html: `<div style="background-color: hsl(var(--primary)); width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); cursor: pointer; display: flex; align-items: center; justify-content: center;">
        <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%; animation: pulse 2s infinite;"></div>
      </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker([suggestion.latitude, suggestion.longitude], {
      icon: customIcon
    }).addTo(map.current);

    // Add click handler to open postcard
    marker.on('click', () => {
      setSelectedSuggestion(suggestion);
    });

    setSuggestionMarkers(prev => [...prev, marker]);
  };

  const handleAddSuggestion = () => {
    if (!tempMarker || !newSuggestion.title || !newSuggestion.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const latlng = tempMarker.getLatLng();
    const suggestion: TravelSuggestion = {
      id: Date.now().toString(),
      latitude: latlng.lat,
      longitude: latlng.lng,
      title: newSuggestion.title,
      description: newSuggestion.description,
      author: newSuggestion.author || 'Anonymous',
      image: '/assets/hero-travel.jpg', // Default image
      rating: 0,
      likes: 0,
      comments: [],
      tags: newSuggestion.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      date: 'Just now'
    };

    setTravelSuggestions([...travelSuggestions, suggestion]);
    
    // Reset form
    setNewSuggestion({ title: '', description: '', author: '', tags: '' });
    setIsAddingPin(false);
    if (map.current && tempMarker) {
      map.current.removeLayer(tempMarker);
    }
    setTempMarker(null);
    
    toast.success('Travel suggestion added successfully!');
  };

  const cancelAddPin = () => {
    setIsAddingPin(false);
    if (tempMarker && map.current) {
      map.current.removeLayer(tempMarker);
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
            Explore our interactive world map to discover hidden travel gems shared by fellow adventurers.
            Click anywhere to add your own travel suggestions!
          </p>
        </div>

        <div className="relative">
          <Card className="overflow-hidden shadow-2xl">
            <div className="relative h-[600px] w-full">
              <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
              
              {/* Controls */}
              <div className="absolute top-4 left-4 z-[1000] flex gap-2">
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

              {/* Legend */}
              <div className="absolute bottom-4 left-4 z-[1000]">
                <Card className="p-3 bg-background/95 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Travel Suggestions ({travelSuggestions.length})</span>
                  </div>
                </Card>
              </div>
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

        {/* Modern Postcard Modal */}
        {selectedSuggestion && (
          <Dialog open={!!selectedSuggestion} onOpenChange={() => {
            setSelectedSuggestion(null);
            setIsFlipped(false);
            setIsEnlarged(false);
          }}>
            <DialogContent className={`p-0 overflow-hidden transition-all duration-500 ${
              isEnlarged ? 'sm:max-w-2xl' : 'sm:max-w-sm'
            }`}>
              <DialogHeader className="sr-only">
                <DialogTitle>Travel Postcard</DialogTitle>
              </DialogHeader>
              <div 
                className={`postcard-container relative w-full transition-all duration-500 ${
                  isEnlarged ? 'h-[600px]' : 'h-[350px]'
                }`} 
                style={{ perspective: '1000px' }}
              >
                <div 
                  className={`postcard absolute inset-0 w-full h-full transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* Front of postcard - Modern Art Style */}
                  <div 
                    className="postcard-front absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl border"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="relative w-full h-full bg-gradient-to-br from-primary/10 via-background to-secondary/10">
                      {/* Modern geometric background */}
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-accent/20 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
                      </div>

                      {/* Header with close and enlarge buttons */}
                      <div className="absolute top-3 right-3 flex gap-2 z-10">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEnlarged(!isEnlarged)}
                          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                        >
                          {isEnlarged ? '⤓' : '⤢'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedSuggestion(null);
                            setIsFlipped(false);
                            setIsEnlarged(false);
                          }}
                          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Main content area */}
                      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                        {/* City name with modern typography */}
                        <div className="text-center">
                          <h2 className={`font-bold text-foreground tracking-wider uppercase ${
                            isEnlarged ? 'text-4xl mb-2' : 'text-2xl mb-1'
                          }`}>
                            {selectedSuggestion.title.split(' ').slice(-2).join(' ')}
                          </h2>
                          <div className="h-1 w-16 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
                        </div>

                        {/* Minimalist illustration placeholder */}
                        <div className={`mx-auto ${isEnlarged ? 'w-48 h-32' : 'w-32 h-20'} relative`}>
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-secondary/30 rounded-lg transform rotate-2"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/40 to-primary/40 rounded-lg transform -rotate-1"></div>
                          <div className="absolute inset-2 bg-background/90 rounded-lg flex items-center justify-center">
                            <MapPin className={`text-primary ${isEnlarged ? 'w-12 h-12' : 'w-8 h-8'}`} />
                          </div>
                        </div>

                        {/* Bottom info */}
                        <div className="text-center space-y-2">
                          <p className={`text-muted-foreground ${isEnlarged ? 'text-sm' : 'text-xs'}`}>
                            {selectedSuggestion.description.substring(0, isEnlarged ? 100 : 60)}...
                          </p>
                          <div className="flex items-center justify-center gap-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-muted-foreground">{selectedSuggestion.rating || 'New'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3 text-red-400" />
                              <span className="text-xs text-muted-foreground">{selectedSuggestion.likes}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground/70">by {selectedSuggestion.author}</p>
                        </div>
                      </div>

                      {/* Bottom action bar */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <Button
                          onClick={() => setIsFlipped(true)}
                          variant="outline"
                          size="sm"
                          className="bg-background/80 backdrop-blur-sm"
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Comments ({selectedSuggestion.comments.length})
                        </Button>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute top-4 left-4 w-8 h-8 border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Back of postcard - Comments */}
                  <div 
                    className="postcard-back absolute inset-0 w-full h-full bg-gradient-to-br from-muted/50 to-background rounded-2xl shadow-2xl border"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div className="p-6 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-foreground">Traveler Stories</h3>
                        <Button
                          onClick={() => setIsFlipped(false)}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Description */}
                      <div className="mb-4 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                        <p className="text-sm text-muted-foreground italic">
                          "{selectedSuggestion.description}"
                        </p>
                      </div>

                      {/* Comments */}
                      <div className="flex-1 overflow-y-auto space-y-3">
                        {selectedSuggestion.comments.map((comment) => (
                          <div key={comment.id} className="bg-background/60 rounded-lg p-3 border border-border/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm text-foreground">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">{comment.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{comment.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Tags and stats */}
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {selectedSuggestion.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-red-400" />
                            {selectedSuggestion.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {selectedSuggestion.comments.length}
                          </div>
                          <div className="text-xs opacity-70">
                            {selectedSuggestion.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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