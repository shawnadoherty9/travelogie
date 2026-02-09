import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Detect key type and use correct base URL + auth headers
function getFoursquareConfig(apiKey: string) {
  const isServiceKey = apiKey.startsWith('fsq3');
  console.log(`Key is service key: ${isServiceKey}, building headers...`);
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };
  if (isServiceKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
    headers['X-Places-Api-Version'] = '2025-06-17';
  } else {
    headers['Authorization'] = apiKey;
  }
  return {
    baseUrl: isServiceKey
      ? 'https://places-api.foursquare.com'
      : 'https://api.foursquare.com/v3',
    headers,
  };
}

interface FoursquarePlace {
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
  tips?: Array<{ text: string; created_at: string }>;
  hours?: { display?: string };
  price?: number;
  website?: string;
  tel?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const FOURSQUARE_API_KEY = Deno.env.get('FOURSQUARE_API_KEY');
    if (!FOURSQUARE_API_KEY) {
      throw new Error('FOURSQUARE_API_KEY is not configured');
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase configuration missing');
    }

    const { baseUrl, headers: fsqHeaders } = getFoursquareConfig(FOURSQUARE_API_KEY);
    console.log(`Using Foursquare base URL: ${baseUrl}, key prefix: ${FOURSQUARE_API_KEY.substring(0, 8)}..., key length: ${FOURSQUARE_API_KEY.length}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { action, ...params } = await req.json();
    console.log(`Foursquare API action: ${action}`, params);

    switch (action) {
      case 'search': {
        const { query, ll, radius = 5000, categories, limit = 20 } = params;
        const searchParams = new URLSearchParams();
        if (query) searchParams.set('query', query);
        if (ll) searchParams.set('ll', ll);
        if (radius) searchParams.set('radius', String(radius));
        if (categories) searchParams.set('categories', categories);
        searchParams.set('limit', String(limit));
        searchParams.set('fields', 'fsq_id,name,geocodes,location,categories,description,rating,photos,hours,price,website,tel');

        const response = await fetch(`${baseUrl}/places/search?${searchParams}`, { headers: fsqHeaders });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error('Foursquare search error:', response.status, errorBody);
          throw new Error(`Foursquare API error: ${response.status} - ${errorBody}`);
        }

        const data = await response.json();
        console.log(`Found ${data.results?.length || 0} places`);

        return new Response(JSON.stringify({
          success: true,
          places: data.results || [],
          context: data.context,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'getDetails': {
        const { fsq_id } = params;
        if (!fsq_id) throw new Error('fsq_id is required');

        const [placeRes, tipsRes, photosRes] = await Promise.all([
          fetch(`${baseUrl}/places/${fsq_id}?fields=fsq_id,name,geocodes,location,categories,description,rating,hours,price,website,tel,stats`, { headers: fsqHeaders }),
          fetch(`${baseUrl}/places/${fsq_id}/tips?limit=10`, { headers: fsqHeaders }),
          fetch(`${baseUrl}/places/${fsq_id}/photos?limit=5`, { headers: fsqHeaders }),
        ]);

        const place = await placeRes.json();
        const tips = await tipsRes.json();
        const photos = await photosRes.json();

        return new Response(JSON.stringify({
          success: true,
          place,
          tips: tips || [],
          photos: photos || [],
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'import': {
        const { ll, radius = 10000, categories, cityId } = params;
        if (!ll) throw new Error('ll (latitude,longitude) is required');

        const searchParams = new URLSearchParams();
        searchParams.set('ll', ll);
        searchParams.set('radius', String(radius));
        if (categories) searchParams.set('categories', categories);
        searchParams.set('limit', '50');
        searchParams.set('fields', 'fsq_id,name,geocodes,location,categories,description,rating,photos,hours,price,website');

        const response = await fetch(`${baseUrl}/places/search?${searchParams}`, { headers: fsqHeaders });

        if (!response.ok) {
          throw new Error(`Foursquare API error: ${response.status}`);
        }

        const data = await response.json();
        const places: FoursquarePlace[] = data.results || [];
        console.log(`Importing ${places.length} places from Foursquare`);

        // Map Foursquare categories to our activity categories
        const categoryMapping: Record<string, string> = {
          '13000': 'Food & Dining',           // Food
          '13003': 'Food & Dining',           // Restaurant
          '16000': 'Landmarks & Outdoors',    // Landmarks and Outdoors
          '10000': 'Arts & Entertainment',    // Arts and Entertainment
          '18000': 'Sports & Recreation',     // Sports and Recreation
          '19000': 'Travel & Transportation', // Travel and Transportation
          '12000': 'Dining & Nightlife',      // Dining and Nightlife
        };

        // Get or create category IDs
        const { data: existingCategories } = await supabase
          .from('activity_categories')
          .select('id, name');

        const categoryIdMap = new Map(
          (existingCategories || []).map(c => [c.name, c.id])
        );

        let imported = 0;
        let skipped = 0;

        for (const place of places) {
          try {
            const lat = place.geocodes?.main?.latitude;
            const lng = place.geocodes?.main?.longitude;
            
            if (!lat || !lng) {
              skipped++;
              continue;
            }

            // Check for duplicates by name and location proximity
            const { data: existing } = await supabase
              .from('activities')
              .select('id')
              .ilike('name', place.name)
              .gte('latitude', lat - 0.001)
              .lte('latitude', lat + 0.001)
              .gte('longitude', lng - 0.001)
              .lte('longitude', lng + 0.001)
              .limit(1);

            if (existing && existing.length > 0) {
              skipped++;
              continue;
            }

            // Determine category
            const fsqCategory = place.categories?.[0];
            const categoryPrefix = fsqCategory?.id?.toString().slice(0, 5) || '';
            const categoryName = categoryMapping[categoryPrefix] || 'General';
            let categoryId = categoryIdMap.get(categoryName);

            if (!categoryId && categoryName !== 'General') {
              const { data: newCat } = await supabase
                .from('activity_categories')
                .insert({ name: categoryName, icon: fsqCategory?.icon?.prefix })
                .select('id')
                .single();
              if (newCat) {
                categoryId = newCat.id;
                categoryIdMap.set(categoryName, categoryId);
              }
            }

            // Build photo URLs
            const imageUrls = place.photos?.map(p => `${p.prefix}original${p.suffix}`) || [];

            // Insert activity
            const { error: insertError } = await supabase.from('activities').insert({
              name: place.name,
              description: place.description || `${place.name} - ${fsqCategory?.name || 'Place'}`,
              short_description: place.location?.formatted_address,
              latitude: lat,
              longitude: lng,
              address: place.location?.formatted_address,
              rating: place.rating ? place.rating / 2 : null, // Foursquare uses 0-10, convert to 0-5
              image_urls: imageUrls.length > 0 ? imageUrls : null,
              category_id: categoryId,
              city_id: cityId || null,
              external_booking_url: place.website,
              operating_hours: place.hours?.display ? { display: place.hours.display } : null,
              tags: fsqCategory ? [fsqCategory.name] : [],
              is_active: true,
            });

            if (insertError) {
              console.error('Insert error:', insertError);
              skipped++;
            } else {
              imported++;
            }
          } catch (err) {
            console.error('Error processing place:', err);
            skipped++;
          }
        }

        console.log(`Import complete: ${imported} imported, ${skipped} skipped`);

        return new Response(JSON.stringify({
          success: true,
          imported,
          skipped,
          total: places.length,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'categories': {
        const response = await fetch(`${baseUrl}/places/categories`, { headers: fsqHeaders });
        const data = await response.json();

        return new Response(JSON.stringify({
          success: true,
          categories: data.categories || [],
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Foursquare function error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
