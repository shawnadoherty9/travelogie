import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FoursquarePlace {
  fsq_id: string;
  name: string;
  geocodes?: {
    main?: { latitude: number; longitude: number };
  };
  location?: {
    formatted_address?: string;
    locality?: string;
    country?: string;
  };
  categories?: Array<{ id: number; name: string; icon?: { prefix: string; suffix: string } }>;
  description?: string;
  rating?: number;
  photos?: Array<{ prefix: string; suffix: string }>;
  hours?: { display?: string };
  price?: number;
  website?: string;
  tel?: string;
}

export interface FoursquareSearchParams {
  query?: string;
  ll?: string; // "lat,lng"
  radius?: number; // meters
  categories?: string; // comma-separated category IDs
  limit?: number;
}

export const useFoursquare = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [places, setPlaces] = useState<FoursquarePlace[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const searchPlaces = useCallback(async (params: FoursquareSearchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('foursquare-places', {
        body: { action: 'search', ...params },
      });

      if (fnError) throw fnError;
      if (!data.success) throw new Error(data.error);

      setPlaces(data.places || []);
      return data.places || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      toast({
        title: 'Search Error',
        description: message,
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getPlaceDetails = useCallback(async (fsq_id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('foursquare-places', {
        body: { action: 'getDetails', fsq_id },
      });

      if (fnError) throw fnError;
      if (!data.success) throw new Error(data.error);

      return {
        place: data.place,
        tips: data.tips || [],
        photos: data.photos || [],
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get details';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const importPlaces = useCallback(async (params: { ll: string; radius?: number; categories?: string; cityId?: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('foursquare-places', {
        body: { action: 'import', ...params },
      });

      if (fnError) throw fnError;
      if (!data.success) throw new Error(data.error);

      toast({
        title: 'Import Complete',
        description: `Imported ${data.imported} places (${data.skipped} skipped)`,
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Import failed';
      setError(message);
      toast({
        title: 'Import Error',
        description: message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getCategories = useCallback(async () => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke('foursquare-places', {
        body: { action: 'categories' },
      });

      if (fnError) throw fnError;
      return data.categories || [];
    } catch (err) {
      console.error('Failed to get categories:', err);
      return [];
    }
  }, []);

  const clearResults = useCallback(() => {
    setPlaces([]);
    setError(null);
  }, []);

  return {
    isLoading,
    places,
    error,
    searchPlaces,
    getPlaceDetails,
    importPlaces,
    getCategories,
    clearResults,
  };
};

// Common Foursquare category IDs for filtering
export const FOURSQUARE_CATEGORIES = {
  FOOD: '13000',
  RESTAURANTS: '13003',
  LANDMARKS: '16000',
  ARTS_ENTERTAINMENT: '10000',
  SPORTS_RECREATION: '18000',
  TRAVEL: '19000',
  NIGHTLIFE: '12000',
  MUSEUMS: '10027',
  PARKS: '16032',
  BEACHES: '16003',
  TEMPLES: '12099',
  HISTORICAL: '16020',
};
