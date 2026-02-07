import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type LocationSourceType = 'activities' | 'events' | 'tour_operators' | 'user_suggestions' | 'osm_places';

export interface ExploreLocation {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  latitude: number;
  longitude: number;
  source_type: LocationSourceType;
  category_id: string | null;
  category_name: string | null;
  tags: string[] | null;
  price_from: number | null;
  price_to: number | null;
  currency: string;
  rating: number | null;
  review_count: number | null;
  image_urls: string[] | null;
  address: string | null;
  // Event-specific fields
  start_date?: string;
  end_date?: string;
  // Tour operator specific
  business_name?: string;
  specialties?: string[];
  languages_spoken?: string[];
}

export interface ExploreFilters {
  sourceTypes: LocationSourceType[];
  categoryIds: string[];
  interestTagIds: string[];
  searchQuery: string;
  nearLocation?: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
  boundingBox?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

interface InterestTag {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
}

export const useExploreLocations = () => {
  const [locations, setLocations] = useState<ExploreLocation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [interestTags, setInterestTags] = useState<InterestTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const [filters, setFilters] = useState<ExploreFilters>({
    sourceTypes: ['activities', 'events', 'tour_operators', 'user_suggestions', 'osm_places'],
    categoryIds: [],
    interestTagIds: [],
    searchQuery: '',
  });

  // Load categories and interest tags on mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          supabase.from('activity_categories').select('*').order('name'),
          supabase.from('interest_tags').select('*').order('category', { ascending: true }).order('name')
        ]);

        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (tagsRes.data) setInterestTags(tagsRes.data);
      } catch (err) {
        console.error('Error loading metadata:', err);
      }
    };

    loadMetadata();
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user's current location
  const getUserLocation = useCallback((): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(location);
          resolve(location);
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  }, []);

  // Fetch locations based on filters
  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const allLocations: ExploreLocation[] = [];

      // Fetch activities
      if (filters.sourceTypes.includes('activities')) {
        let query = supabase
          .from('activities')
          .select(`
            id, name, description, short_description, latitude, longitude,
            category_id, tags, price_from, price_to, currency, rating, review_count,
            image_urls, address
          `)
          .eq('is_active', true)
          .not('latitude', 'is', null)
          .not('longitude', 'is', null);

        if (filters.categoryIds.length > 0) {
          query = query.in('category_id', filters.categoryIds);
        }

        if (filters.searchQuery) {
          query = query.or(`name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
        }

        const { data, error: activitiesError } = await query;
        
        if (activitiesError) throw activitiesError;
        
        if (data) {
          // Get category names
          const categoryMap = new Map(categories.map(c => [c.id, c.name]));
          
          allLocations.push(...data.map(item => ({
            ...item,
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
            source_type: 'activities' as LocationSourceType,
            category_name: item.category_id ? categoryMap.get(item.category_id) || null : null,
          })));
        }
      }

      // Fetch events
      if (filters.sourceTypes.includes('events')) {
        let query = supabase
          .from('events')
          .select(`
            id, name, description, short_description, latitude, longitude,
            category_id, tags, price_from, price_to, currency,
            image_urls, address, start_date, end_date
          `)
          .eq('is_active', true)
          .not('latitude', 'is', null)
          .not('longitude', 'is', null)
          .gte('end_date', new Date().toISOString().split('T')[0]);

        if (filters.categoryIds.length > 0) {
          query = query.in('category_id', filters.categoryIds);
        }

        if (filters.searchQuery) {
          query = query.or(`name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
        }

        const { data, error: eventsError } = await query;
        
        if (eventsError) throw eventsError;
        
        if (data) {
          const categoryMap = new Map(categories.map(c => [c.id, c.name]));
          
          allLocations.push(...data.map(item => ({
            ...item,
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
            source_type: 'events' as LocationSourceType,
            category_name: item.category_id ? categoryMap.get(item.category_id) || null : null,
            rating: null,
            review_count: null,
          })));
        }
      }

      // Fetch tour operators using the RPC function
      if (filters.sourceTypes.includes('tour_operators')) {
        const { data, error: operatorsError } = await supabase.rpc('get_public_tour_operators');
        
        if (operatorsError) throw operatorsError;
        
        if (data) {
          // Tour operators don't have lat/lng in the table, but they have cities_covered
          // For now, we'll skip them in the map view unless we add coordinates
          // This is a placeholder for future enhancement
        }
      }

      // Fetch user suggestions
      if (filters.sourceTypes.includes('user_suggestions')) {
        let query = supabase
          .from('travel_suggestions')
          .select('*')
          .not('latitude', 'is', null)
          .not('longitude', 'is', null);

        if (filters.searchQuery) {
          query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
        }

        const { data, error: suggestionsError } = await query;
        
        if (suggestionsError) throw suggestionsError;
        
        if (data) {
          allLocations.push(...data.map(item => ({
            id: item.id,
            name: item.title,
            description: item.description,
            short_description: null,
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
            source_type: 'user_suggestions' as LocationSourceType,
            category_id: null,
            category_name: 'User Suggestion',
            tags: item.tags,
            price_from: null,
            price_to: null,
            currency: 'USD',
            rating: null,
            review_count: item.upvotes,
            image_urls: item.photo_url ? [item.photo_url] : null,
            address: null,
          })));
        }
      }

      // Fetch OpenStreetMap places - only when zoomed in enough (max 5 degrees)
      if (filters.sourceTypes.includes('osm_places') && filters.boundingBox) {
        const { north, south, east, west } = filters.boundingBox;
        const latSpan = Math.abs(north - south);
        const lngSpan = Math.abs(east - west);
        
        // Only fetch if bounding box is within the 5 degree limit
        if (latSpan <= 5 && lngSpan <= 5) {
          try {
            const osmUrl = new URL('https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/overpass-places');
            osmUrl.searchParams.set('north', north.toString());
            osmUrl.searchParams.set('south', south.toString());
            osmUrl.searchParams.set('east', east.toString());
            osmUrl.searchParams.set('west', west.toString());
            osmUrl.searchParams.set('limit', '50');
            
            const osmResponse = await fetch(osmUrl.toString());
            if (osmResponse.ok) {
              const osmData = await osmResponse.json();
              if (osmData.places && Array.isArray(osmData.places)) {
                allLocations.push(...osmData.places.map((place: any) => ({
                  id: place.id,
                  name: place.name,
                  description: place.description,
                  short_description: place.category ? `${place.category.charAt(0).toUpperCase() + place.category.slice(1)} site` : null,
                  latitude: place.latitude,
                  longitude: place.longitude,
                  source_type: 'osm_places' as LocationSourceType,
                  category_id: null,
                  category_name: place.category ? place.category.charAt(0).toUpperCase() + place.category.slice(1) : 'Cultural',
                  tags: place.tags || [],
                  price_from: null,
                  price_to: null,
                  currency: 'USD',
                  rating: null,
                  review_count: null,
                  image_urls: place.image_url ? [place.image_url] : null,
                  address: place.address,
                })));
              }
            }
          } catch (osmError) {
            console.error('Error fetching OSM places:', osmError);
            // Don't fail the whole request if OSM fails
          }
        } else {
          console.log('Skipping OSM fetch - zoom in to see heritage sites (current span:', latSpan.toFixed(1), 'x', lngSpan.toFixed(1), 'degrees)');
        }
      }

      // Apply location-based filtering
      let filteredLocations = allLocations;

      if (filters.nearLocation) {
        const { latitude, longitude, radiusKm } = filters.nearLocation;
        filteredLocations = allLocations.filter(loc => {
          const distance = calculateDistance(latitude, longitude, loc.latitude, loc.longitude);
          return distance <= radiusKm;
        });
      }

      if (filters.boundingBox) {
        const { north, south, east, west } = filters.boundingBox;
        filteredLocations = filteredLocations.filter(loc => 
          loc.latitude <= north && 
          loc.latitude >= south && 
          loc.longitude <= east && 
          loc.longitude >= west
        );
      }

      // Apply interest tag filtering (match against tags array)
      if (filters.interestTagIds.length > 0) {
        const selectedTagNames = interestTags
          .filter(t => filters.interestTagIds.includes(t.id))
          .map(t => t.name.toLowerCase());
        
        filteredLocations = filteredLocations.filter(loc => {
          if (!loc.tags) return false;
          const locTags = loc.tags.map(t => t.toLowerCase());
          return selectedTagNames.some(tagName => 
            locTags.some(locTag => locTag.includes(tagName) || tagName.includes(locTag))
          );
        });
      }

      setLocations(filteredLocations);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  }, [filters, categories, interestTags]);

  // Fetch locations when filters change
  useEffect(() => {
    if (categories.length > 0) {
      fetchLocations();
    }
  }, [fetchLocations, categories.length]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<ExploreFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Set "Near Me" mode
  const setNearMeMode = useCallback(async (radiusKm: number = 50) => {
    try {
      const location = await getUserLocation();
      updateFilters({
        nearLocation: {
          latitude: location.latitude,
          longitude: location.longitude,
          radiusKm
        },
        boundingBox: undefined
      });
      return location;
    } catch (err) {
      throw err;
    }
  }, [getUserLocation, updateFilters]);

  // Set "Explore" mode (clear location filter)
  const setExploreMode = useCallback(() => {
    updateFilters({
      nearLocation: undefined,
      boundingBox: undefined
    });
  }, [updateFilters]);

  // Set bounding box from map viewport
  const setBoundingBox = useCallback((bounds: { north: number; south: number; east: number; west: number }) => {
    updateFilters({
      boundingBox: bounds,
      nearLocation: undefined
    });
  }, [updateFilters]);

  return {
    locations,
    categories,
    interestTags,
    loading,
    error,
    filters,
    userLocation,
    updateFilters,
    setNearMeMode,
    setExploreMode,
    setBoundingBox,
    getUserLocation,
    refetch: fetchLocations,
  };
};
