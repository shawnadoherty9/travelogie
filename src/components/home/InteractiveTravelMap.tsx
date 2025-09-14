import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './InteractiveTravelMap.css';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Plus, Heart, Star, X, Upload, ThumbsUp, Calendar, Globe, Search, Compass, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import heroImage from "@/assets/hero-travel.jpg";

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TravelSuggestion {
  id: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  latitude: number;
  longitude: number;
  photo_url?: string;
  upvotes: number;
  created_at: string;
}

const InteractiveTravelMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<TravelSuggestion | null>(null);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState({
    title: '',
    description: '',
    author: '',
    tags: ''
  });
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tempMarker, setTempMarker] = useState<L.Marker | null>(null);
  const [suggestionMarkers, setSuggestionMarkers] = useState<L.Marker[]>([]);
  const [travelSuggestions, setTravelSuggestions] = useState<TravelSuggestion[]>([]);

  // Load travel suggestions from database
  useEffect(() => {
    loadTravelSuggestions();
  }, []);

  const loadTravelSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading travel suggestions:', error);
        return;
      }

      setTravelSuggestions(data || []);
    } catch (error) {
      console.error('Error loading travel suggestions:', error);
    }
  };

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

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [isAddingPin]);

  // Add suggestion markers when suggestions change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    suggestionMarkers.forEach(marker => {
      map.current?.removeLayer(marker);
    });
    setSuggestionMarkers([]);

    // Add new markers
    const newMarkers: L.Marker[] = [];
    travelSuggestions.forEach((suggestion) => {
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
      }).addTo(map.current!);

      // Add click handler to open postcard
      marker.on('click', () => {
        setSelectedSuggestion(suggestion);
      });

      newMarkers.push(marker);
    });

    setSuggestionMarkers(newMarkers);
  }, [travelSuggestions]);

  const handlePhotoUpload = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('travel-photos')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('travel-photos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  };

  const handleAddSuggestion = async () => {
    if (!tempMarker || !newSuggestion.title || !newSuggestion.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);

    try {
      let photoUrl = null;
      
      // Upload photo if provided
      if (uploadedPhoto) {
        photoUrl = await handlePhotoUpload(uploadedPhoto);
        if (!photoUrl) {
          toast.error('Error uploading photo. Please try again.');
          setUploading(false);
          return;
        }
      }

      const latlng = tempMarker.getLatLng();

      // Insert suggestion into database
      const { data, error } = await supabase
        .from('travel_suggestions')
        .insert({
          title: newSuggestion.title,
          description: newSuggestion.description,
          author: newSuggestion.author || 'Anonymous',
          tags: newSuggestion.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          latitude: latlng.lat,
          longitude: latlng.lng,
          photo_url: photoUrl,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding suggestion:', error);
        toast.error('Error adding suggestion. Please try again.');
        setUploading(false);
        return;
      }

      // Add to local state
      setTravelSuggestions([data, ...travelSuggestions]);
      
      // Reset form
      setNewSuggestion({ title: '', description: '', author: '', tags: '' });
      setUploadedPhoto(null);
      setIsAddingPin(false);
      if (map.current && tempMarker) {
        map.current.removeLayer(tempMarker);
      }
      setTempMarker(null);
      
      toast.success('Travel suggestion added successfully!');
    } catch (error) {
      console.error('Error adding suggestion:', error);
      toast.error('Error adding suggestion. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const cancelAddPin = () => {
    setIsAddingPin(false);
    if (tempMarker && map.current) {
      map.current.removeLayer(tempMarker);
      setTempMarker(null);
    }
    setNewSuggestion({ title: '', description: '', author: '', tags: '' });
    setUploadedPhoto(null);
  };

  const handleUpvote = async (suggestionId: string) => {
    try {
      const userIp = 'user-' + Date.now(); // In a real app, you'd get the actual IP
      
      const { data, error } = await supabase.rpc('increment_suggestion_upvotes', {
        suggestion_id: suggestionId,
        user_ip: userIp
      });

      if (error) {
        console.error('Error upvoting:', error);
        return;
      }

      // Type assertion for the RPC response
      const result = data as { upvotes: number };

      // Update local state
      setTravelSuggestions(suggestions => 
        suggestions.map(s => 
          s.id === suggestionId 
            ? { ...s, upvotes: result.upvotes }
            : s
        )
      );

      toast.success('Thanks for your upvote!');
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  return (
    <section className="relative min-h-screen">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Cultural travel experiences around the world" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-200/40 via-amber-300/60 to-orange-200/80" />
      </div>

      {/* Full Background Map */}
      <div className="absolute inset-0 z-10">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-20 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Discover & Share Travel Gems */}
          <Card className="p-6 bg-background/95 backdrop-blur-sm border-travel-ocean/20 travel-shadow text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Discover & Share Travel Gems
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our interactive world map to discover hidden travel gems shared by fellow adventurers.
              Click anywhere to add your own travel suggestions!
            </p>
            <div className="mt-4">
              <Button 
                variant="default" 
                size="lg" 
                className="animate-pulse bg-blue-600 hover:bg-blue-700 text-white"
              >
                <MapPin className="w-6 h-6" />
                Add Your Pin
              </Button>
            </div>
          </Card>

          {/* Controls */}
          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant="wanderlust"
              size="lg"
              className="bg-background/90 backdrop-blur-sm shadow-lg"
            >
              <Globe className="w-6 h-6" />
              Start Your Journey
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
          <div className="flex justify-center">
            <Card className="p-3 bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Travel Suggestions ({travelSuggestions.length})</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

        {/* Add Suggestion Dialog */}
        {tempMarker && (
          <Dialog open={isAddingPin && tempMarker !== null} onOpenChange={() => cancelAddPin()}>
            <DialogContent className="sm:max-w-md z-[6001] bg-background border shadow-lg">
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
                <div>
                  <label className="text-sm font-medium mb-1 block">Photo (optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {uploadedPhoto ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{uploadedPhoto.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setUploadedPhoto(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-600">Click to upload a photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setUploadedPhoto(file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleAddSuggestion} 
                    className="flex-1"
                    disabled={uploading}
                  >
                    {uploading ? 'Adding...' : 'Add Suggestion'}
                  </Button>
                  <Button onClick={cancelAddPin} variant="outline" disabled={uploading}>
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
            setIsEnlarged(false);
          }}>
            <DialogContent className={`${isEnlarged ? 'max-w-4xl' : 'max-w-md'} z-[6001] transition-all duration-300 p-0 bg-gradient-to-br from-blue-50 to-indigo-100 border-8 border-white shadow-2xl rounded-lg relative before:absolute before:inset-0 before:border-2 before:border-amber-200/30 before:rounded-lg before:pointer-events-none after:absolute after:-inset-1 after:border after:border-amber-100/20 after:rounded-xl after:pointer-events-none`}>
              <DialogHeader className="sr-only">
                <DialogTitle>Travel Suggestion Postcard</DialogTitle>
              </DialogHeader>
              
              <div className="relative overflow-hidden rounded-lg">
                {/* Postcard Header with geometric pattern */}
                <div className={`${selectedSuggestion.photo_url ? 'h-48' : 'h-32'} bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 relative overflow-hidden`}>
                  {selectedSuggestion.photo_url && (
                    <img 
                      src={selectedSuggestion.photo_url} 
                      alt={selectedSuggestion.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      onClick={() => setIsEnlarged(!isEnlarged)}
                      variant="secondary"
                      size="sm"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    >
                      {isEnlarged ? 'Minimize' : 'Enlarge'}
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedSuggestion(null);
                        setIsEnlarged(false);
                      }}
                      variant="secondary"
                      size="sm"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Geometric art elements */}
                  {!selectedSuggestion.photo_url && (
                    <div className="absolute inset-0">
                      <div className="absolute top-2 left-4 w-16 h-16 border-2 border-white/30 rotate-45"></div>
                      <div className="absolute bottom-2 right-8 w-12 h-12 bg-white/20 rounded-full"></div>
                      <div className="absolute top-8 right-16 w-8 h-8 bg-white/25 transform rotate-12"></div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-6">
                    <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                      {selectedSuggestion.title}
                    </h2>
                  </div>
                </div>
                
                {/* Postcard Content */}
                <div className="p-6 bg-white">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-12 h-12 border-2 border-gray-200">
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                        {selectedSuggestion.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{selectedSuggestion.author}</p>
                      <p className="text-sm text-gray-500">Travel Explorer</p>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        {selectedSuggestion.latitude.toFixed(4)}, {selectedSuggestion.longitude.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {selectedSuggestion.description}
                  </p>
                  
                  {selectedSuggestion.tags && selectedSuggestion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedSuggestion.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(selectedSuggestion.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:bg-blue-50"
                        onClick={() => handleUpvote(selectedSuggestion.id)}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {selectedSuggestion.upvotes || 0}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        Love
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
    </section>
  );
};

export default InteractiveTravelMap;