import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, ExternalLink, Star, Clock, DollarSign, ZoomIn, Navigation2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useExploreLocations, ExploreLocation, LocationSourceType } from '@/hooks/useExploreLocations';
import { useFetchEvents } from '@/hooks/useFetchEvents';
import { ExploreMapFilters } from './ExploreMapFilters';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Color scheme for different source types
const SOURCE_COLORS: Record<LocationSourceType, string> = {
  activities: '#3B82F6',      // Blue
  events: '#22C55E',          // Green
  tour_operators: '#F97316',  // Orange
  user_suggestions: '#EF4444', // Red
  osm_places: '#8B5CF6',      // Purple (temples, monuments, heritage)
};

const SOURCE_ICONS: Record<LocationSourceType, string> = {
  activities: '🎯',
  events: '📅',
  tour_operators: '👤',
  user_suggestions: '💡',
  osm_places: '🏛️',
};

interface ExploreMapProps {
  className?: string;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

const QUICK_CITIES = [
  { name: 'Tokyo', lat: 35.6895, lng: 139.6917, country: 'Japan' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France' },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, country: 'India' },
  { name: 'Barcelona', lat: 41.3874, lng: 2.1686, country: 'Spain' },
  { name: 'Bangkok', lat: 13.7563, lng: 100.5018, country: 'Thailand' },
  { name: 'Istanbul', lat: 41.0082, lng: 28.9784, country: 'Turkey' },
  { name: 'Marrakech', lat: 31.6295, lng: -7.9811, country: 'Morocco' },
  { name: 'Rome', lat: 41.9028, lng: 12.4964, country: 'Italy' },
  { name: 'Kyoto', lat: 35.0116, lng: 135.7681, country: 'Japan' },
  { name: 'Varanasi', lat: 25.3176, lng: 83.0068, country: 'India' },
  { name: 'Seville', lat: 37.3891, lng: -5.9845, country: 'Spain' },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, country: 'Egypt' },
];

export const ExploreMap: React.FC<ExploreMapProps> = ({
  className = 'h-[600px]',
  defaultCenter = { lat: 20, lng: 0 },
  defaultZoom = 2,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const userMarker = useRef<L.Marker | null>(null);
  const isFittingBounds = useRef(false);
  const hasInitialFit = useRef(false);
  
  const [selectedLocation, setSelectedLocation] = useState<ExploreLocation | null>(null);
  const [isNearMeMode, setIsNearMeMode] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [needsZoomForHeritage, setNeedsZoomForHeritage] = useState(true);

  const { fetchEventsForCity, fetching: fetchingEvents } = useFetchEvents();
  const {
    locations,
    categories,
    interestTags,
    loading,
    filters,
    userLocation,
    updateFilters,
    setNearMeMode,
    setExploreMode,
    setBoundingBox,
    refetch,
  } = useExploreLocations();

  // Create custom marker icon
  const createMarkerIcon = (sourceType: LocationSourceType) => {
    const color = SOURCE_COLORS[sourceType];
    const icon = SOURCE_ICONS[sourceType];
    
    return L.divIcon({
      className: 'custom-explore-marker',
      html: `
        <div style="
          background: ${color};
          width: 32px; 
          height: 32px; 
          border-radius: 50%; 
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.2s;
        ">
          ${icon}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  };

  // Create user location marker
  const createUserMarkerIcon = () => {
    return L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
          width: 24px; 
          height: 24px; 
          border-radius: 50%; 
          border: 4px solid white;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3), 0 4px 12px rgba(0,0,0,0.3);
          animation: pulse 2s infinite;
        "></div>
        <style>
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3), 0 4px 12px rgba(0,0,0,0.3); }
            50% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.1), 0 4px 12px rgba(0,0,0,0.3); }
          }
        </style>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current, {
      center: [defaultCenter.lat, defaultCenter.lng],
      zoom: defaultZoom,
      zoomControl: true,
      worldCopyJump: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      maxZoom: 19,
    }).addTo(map.current);

    markersLayer.current = L.layerGroup().addTo(map.current);

    // Update bounding box on map move (debounced)
    let moveTimeout: NodeJS.Timeout;
    map.current.on('moveend', () => {
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        if (map.current && !isFittingBounds.current) {
          const bounds = map.current.getBounds();
          const latSpan = Math.abs(bounds.getNorth() - bounds.getSouth());
          const lngSpan = Math.abs(bounds.getEast() - bounds.getWest());
          setNeedsZoomForHeritage(latSpan > 5 || lngSpan > 5);
          setBoundingBox({
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          });
        }
      }, 500);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!map.current || !markersLayer.current) return;

    markersLayer.current.clearLayers();

    locations.forEach((location) => {
      const marker = L.marker(
        [location.latitude, location.longitude],
        { icon: createMarkerIcon(location.source_type) }
      );

      marker.on('click', () => {
        setSelectedLocation(location);
      });

      // Add tooltip on hover
      marker.bindTooltip(location.name, {
        direction: 'top',
        offset: [0, -16],
      });

      marker.addTo(markersLayer.current!);
    });

    // Fit bounds to show all markers only once on initial load
    if (locations.length > 0 && !isNearMeMode && !hasInitialFit.current && map.current.getZoom() < 4) {
      hasInitialFit.current = true;
      const group = L.featureGroup(
        locations.map(loc => L.marker([loc.latitude, loc.longitude]))
      );
      isFittingBounds.current = true;
      map.current.fitBounds(group.getBounds().pad(0.1));
      setTimeout(() => { isFittingBounds.current = false; }, 1500);
    }
  }, [locations, isNearMeMode]);

  // Update user location marker
  useEffect(() => {
    if (!map.current) return;

    if (userLocation) {
      if (userMarker.current) {
        userMarker.current.setLatLng([userLocation.latitude, userLocation.longitude]);
      } else {
        userMarker.current = L.marker(
          [userLocation.latitude, userLocation.longitude],
          { icon: createUserMarkerIcon(), zIndexOffset: 1000 }
        ).addTo(map.current);
        
        userMarker.current.bindTooltip('Your location', {
          direction: 'top',
          permanent: false,
        });
      }
    } else if (userMarker.current) {
      userMarker.current.remove();
      userMarker.current = null;
    }
  }, [userLocation]);

  // Handle Near Me mode
  const handleNearMeClick = useCallback(async () => {
    setGettingLocation(true);
    try {
      const location = await setNearMeMode(50);
      setIsNearMeMode(true);
      
      if (map.current) {
        map.current.setView([location.latitude, location.longitude], 12);
      }
      
      toast.success('Showing locations near you');
    } catch (error) {
      console.error('Geolocation error:', error);
      toast.error('Could not get your location. Please enable location access.');
    } finally {
      setGettingLocation(false);
    }
  }, [setNearMeMode]);

  // Handle Explore mode
  const handleExploreClick = useCallback(() => {
    setIsNearMeMode(false);
    setExploreMode();
    toast.info('Explore mode: Browse anywhere on the map');
  }, [setExploreMode]);

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-4 h-full">
        {/* Filters Sidebar */}
        <div className="w-80 shrink-0">
          <ExploreMapFilters
            filters={filters}
            categories={categories}
            interestTags={interestTags}
            onFiltersChange={updateFilters}
            onNearMeClick={handleNearMeClick}
            onExploreClick={handleExploreClick}
            isNearMeMode={isNearMeMode}
            userLocation={userLocation}
            locationCount={locations.length}
            loading={loading || gettingLocation}
          />
        </div>

        {/* Map Container */}
        <div className="flex-1 relative rounded-lg overflow-hidden border border-border">
          <div ref={mapContainer} className="w-full h-full" />

          {/* Go to City dropdown */}
          <div className="absolute top-4 right-4 z-20">
            <Select onValueChange={async (value) => {
              const city = QUICK_CITIES.find(c => c.name === value);
              if (city && map.current) {
                map.current.setView([city.lat, city.lng], 12, { animate: true });
                
                // Always update bounding box to sync map markers with new viewport
                const updateMapBounds = () => {
                  const bounds = map.current?.getBounds();
                  if (bounds) {
                    setBoundingBox({
                      north: bounds.getNorth(),
                      south: bounds.getSouth(),
                      east: bounds.getEast(),
                      west: bounds.getWest(),
                    });
                  }
                };
                
                // Sync map immediately for the new viewport
                setTimeout(updateMapBounds, 500);
                
                // Trigger on-demand event fetching for this city
                const result = await fetchEventsForCity(city.name, city.country || '');
                if (result && result.events_added > 0) {
                  toast.success(`Found ${result.events_added} new events in ${city.name}`);
                  // Refetch to pick up newly scraped events
                  refetch();
                }
              }
            }}>
              <SelectTrigger className="w-[180px] bg-card border-border shadow-lg">
                <Navigation2 className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Go to City" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border shadow-xl z-50">
                {QUICK_CITIES.map(city => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Loading overlay */}
          {(loading || gettingLocation) && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg shadow-lg">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{gettingLocation ? 'Getting your location...' : 'Loading...'}</span>
              </div>
            </div>
          )}

          {/* Zoom hint for heritage sites */}
          {needsZoomForHeritage && !isNearMeMode && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-card/95 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg text-sm text-muted-foreground">
              <ZoomIn className="w-4 h-4 text-[#8B5CF6]" />
              <span>Zoom in to discover <span className="font-medium text-[#8B5CF6]">🏛️ Heritage Sites</span></span>
            </div>
          )}

          {/* Map Legend */}
          <Card className="absolute bottom-4 left-4 p-3 bg-card/95 backdrop-blur-sm z-10">
            <div className="text-xs font-medium mb-2">Legend</div>
            <div className="space-y-1">
              {(Object.entries(SOURCE_COLORS) as [LocationSourceType, string][]).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full border-2 border-white shadow-sm" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="capitalize">{type.replace('_', ' ')}</span>
                </div>
              ))}
              {userLocation && (
                <div className="flex items-center gap-2 text-xs pt-1 border-t border-border mt-1">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white shadow-sm" />
                  <span>Your location</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Location Detail Sheet */}
      <Sheet open={!!selectedLocation} onOpenChange={() => setSelectedLocation(null)}>
        <SheetContent className="sm:max-w-md">
          {selectedLocation && (
            <>
              <SheetHeader>
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: SOURCE_COLORS[selectedLocation.source_type] }}
                  >
                    {SOURCE_ICONS[selectedLocation.source_type]}
                  </div>
                  <div>
                    <SheetTitle className="text-left">{selectedLocation.name}</SheetTitle>
                    <Badge variant="secondary" className="mt-1">
                      {selectedLocation.source_type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {/* Image */}
                {selectedLocation.image_urls && selectedLocation.image_urls[0] && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={selectedLocation.image_urls[0]} 
                      alt={selectedLocation.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {/* Description */}
                {(selectedLocation.short_description || selectedLocation.description) && (
                  <p className="text-muted-foreground">
                    {selectedLocation.short_description || selectedLocation.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-3">
                  {selectedLocation.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{selectedLocation.rating}</span>
                      {selectedLocation.review_count && (
                        <span className="text-muted-foreground">
                          ({selectedLocation.review_count} reviews)
                        </span>
                      )}
                    </div>
                  )}
                  
                  {selectedLocation.price_from && (
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        {selectedLocation.currency} {selectedLocation.price_from}
                        {selectedLocation.price_to && ` - ${selectedLocation.price_to}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {selectedLocation.tags && selectedLocation.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedLocation.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Category */}
                {selectedLocation.category_name && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Category: </span>
                    <span>{selectedLocation.category_name}</span>
                  </div>
                )}

                {/* Address */}
                {selectedLocation.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{selectedLocation.address}</span>
                  </div>
                )}

                {/* Event Dates */}
                {selectedLocation.start_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(selectedLocation.start_date).toLocaleDateString()}
                      {selectedLocation.end_date && selectedLocation.end_date !== selectedLocation.start_date && (
                        <> - {new Date(selectedLocation.end_date).toLocaleDateString()}</>
                      )}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">
                    Book Now
                  </Button>
                  <Button variant="outline" size="icon">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
