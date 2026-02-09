import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FetchEventsResult {
  success: boolean;
  events_added: number;
  events_skipped: number;
}

// Cache which cities have been fetched this session to avoid re-fetching
const fetchedCities = new Set<string>();

export const useFetchEvents = () => {
  const [fetching, setFetching] = useState(false);
  const [lastResult, setLastResult] = useState<FetchEventsResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchEventsForCity = useCallback(async (
    city: string,
    country: string,
    cityId?: string,
    force = false,
  ): Promise<FetchEventsResult | null> => {
    const cacheKey = `${city}:${country}`.toLowerCase();
    
    // Skip if already fetched this session (unless forced)
    if (!force && fetchedCities.has(cacheKey)) {
      return null;
    }

    // Check if we already have recent events for this city (less than 24h old)
    if (!force) {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from('events')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo)
        .ilike('address', `%${city}%`);

      if (count && count > 0) {
        fetchedCities.add(cacheKey);
        return null; // Already have fresh data
      }
    }

    setFetching(true);

    try {
      abortRef.current = new AbortController();

      const { data, error } = await supabase.functions.invoke('fetch-events', {
        body: { city, country, city_id: cityId },
      });

      if (error) throw error;

      const result: FetchEventsResult = {
        success: data?.success ?? false,
        events_added: data?.events_added ?? 0,
        events_skipped: data?.events_skipped ?? 0,
      };

      fetchedCities.add(cacheKey);
      setLastResult(result);
      return result;
    } catch (err) {
      console.error('Error fetching events:', err);
      return { success: false, events_added: 0, events_skipped: 0 };
    } finally {
      setFetching(false);
    }
  }, []);

  return { fetchEventsForCity, fetching, lastResult };
};
