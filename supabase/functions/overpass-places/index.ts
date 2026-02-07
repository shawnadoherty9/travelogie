import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// OpenStreetMap cultural/historical POI types for Travelogie
const OSM_PLACE_TYPES = {
  religious: [
    'amenity=place_of_worship',
    'building=temple',
    'building=mosque',
    'building=church',
    'building=synagogue',
    'building=shrine',
    'building=monastery',
  ],
  historical: [
    'historic=monument',
    'historic=memorial',
    'historic=castle',
    'historic=ruins',
    'historic=archaeological_site',
    'historic=heritage',
    'historic=fort',
    'historic=palace',
    'historic=battlefield',
    'historic=tomb',
  ],
  cultural: [
    'tourism=museum',
    'tourism=gallery',
    'tourism=attraction',
    'amenity=arts_centre',
    'amenity=theatre',
    'leisure=garden',
    'tourism=theme_park',
  ],
  natural: [
    'natural=peak',
    'natural=waterfall',
    'natural=hot_spring',
    'natural=beach',
    'natural=cave_entrance',
    'tourism=viewpoint',
  ],
};

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OSMPlace {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  osm_type: string;
  category: string;
  tags: string[];
  address: string | null;
  image_url: string | null;
  wikipedia_url: string | null;
}

// Build Overpass QL query for a bounding box
function buildOverpassQuery(
  south: number,
  west: number,
  north: number,
  east: number,
  categories: string[] = ['religious', 'historical', 'cultural', 'natural'],
  limit: number = 100
): string {
  const bbox = `${south},${west},${north},${east}`;
  
  const conditions: string[] = [];
  
  for (const category of categories) {
    const types = OSM_PLACE_TYPES[category as keyof typeof OSM_PLACE_TYPES] || [];
    for (const type of types) {
      const [key, value] = type.split('=');
      conditions.push(`node["${key}"="${value}"]["name"](${bbox});`);
      conditions.push(`way["${key}"="${value}"]["name"](${bbox});`);
    }
  }
  
  const query = `
    [out:json][timeout:30];
    (
      ${conditions.join('\n      ')}
    );
    out center ${limit};
  `;
  
  return query;
}

// Parse OSM element into our place format
function parseOSMElement(element: OverpassElement, category: string): OSMPlace | null {
  const lat = element.lat || element.center?.lat;
  const lon = element.lon || element.center?.lon;
  
  if (!lat || !lon || !element.tags?.name) {
    return null;
  }
  
  const tags = element.tags;
  const osmTags: string[] = [];
  
  // Extract relevant tags for filtering
  if (tags.religion) osmTags.push(tags.religion);
  if (tags.denomination) osmTags.push(tags.denomination);
  if (tags.historic) osmTags.push(tags.historic);
  if (tags.tourism) osmTags.push(tags.tourism);
  if (tags.amenity) osmTags.push(tags.amenity);
  if (tags.natural) osmTags.push(tags.natural);
  if (tags.heritage) osmTags.push('heritage');
  
  // Build address
  const addressParts: string[] = [];
  if (tags['addr:street']) addressParts.push(tags['addr:street']);
  if (tags['addr:city']) addressParts.push(tags['addr:city']);
  if (tags['addr:country']) addressParts.push(tags['addr:country']);
  
  // Get Wikimedia image if available
  let imageUrl: string | null = null;
  if (tags.image) {
    imageUrl = tags.image;
  } else if (tags['wikimedia_commons']) {
    // Convert commons file to URL
    const file = tags['wikimedia_commons'].replace('File:', '');
    imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=400`;
  }
  
  // Get Wikipedia URL
  let wikipediaUrl: string | null = null;
  if (tags.wikipedia) {
    const [lang, title] = tags.wikipedia.split(':');
    wikipediaUrl = `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`;
  }
  
  // Build description
  let description = tags.description || null;
  if (!description && tags['description:en']) {
    description = tags['description:en'];
  }
  
  return {
    id: `osm_${element.type}_${element.id}`,
    name: tags.name,
    description,
    latitude: lat,
    longitude: lon,
    osm_type: element.type,
    category,
    tags: osmTags,
    address: addressParts.length > 0 ? addressParts.join(', ') : null,
    image_url: imageUrl,
    wikipedia_url: wikipediaUrl,
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { searchParams } = new URL(req.url);
    
    // Parse parameters
    const south = parseFloat(searchParams.get('south') || '0');
    const west = parseFloat(searchParams.get('west') || '0');
    const north = parseFloat(searchParams.get('north') || '0');
    const east = parseFloat(searchParams.get('east') || '0');
    const categoriesParam = searchParams.get('categories');
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    
    // Validate bounding box
    if (north <= south || east <= west) {
      return new Response(
        JSON.stringify({ error: 'Invalid bounding box' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Limit bounding box size to prevent abuse (max ~500km x 500km)
    const latDiff = north - south;
    const lonDiff = east - west;
    if (latDiff > 5 || lonDiff > 5) {
      return new Response(
        JSON.stringify({ error: 'Bounding box too large. Max 5 degrees.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const categories = categoriesParam 
      ? categoriesParam.split(',').filter(c => c in OSM_PLACE_TYPES)
      : ['religious', 'historical', 'cultural', 'natural'];
    
    console.log(`[overpass-places] Fetching POIs in bbox: ${south},${west},${north},${east}`);
    console.log(`[overpass-places] Categories: ${categories.join(', ')}, Limit: ${limit}`);
    
    // Build and execute Overpass query
    const query = buildOverpassQuery(south, west, north, east, categories, limit);
    
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const response = await fetch(overpassUrl, {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[overpass-places] Overpass API error: ${response.status}`, errorText);
      return new Response(
        JSON.stringify({ error: 'Overpass API request failed' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const data = await response.json();
    const elements: OverpassElement[] = data.elements || [];
    
    console.log(`[overpass-places] Received ${elements.length} elements from Overpass`);
    
    // Parse elements into places, categorizing based on tags
    const places: OSMPlace[] = [];
    const seenIds = new Set<string>();
    
    for (const element of elements) {
      // Determine category from tags
      let category = 'cultural';
      const tags = element.tags || {};
      
      if (tags.building && ['temple', 'mosque', 'church', 'synagogue', 'shrine', 'monastery'].includes(tags.building)) {
        category = 'religious';
      } else if (tags.amenity === 'place_of_worship') {
        category = 'religious';
      } else if (tags.historic) {
        category = 'historical';
      } else if (tags.natural || tags.tourism === 'viewpoint') {
        category = 'natural';
      }
      
      const place = parseOSMElement(element, category);
      if (place && !seenIds.has(place.id)) {
        seenIds.add(place.id);
        places.push(place);
      }
    }
    
    console.log(`[overpass-places] Returning ${places.length} unique places`);
    
    return new Response(
      JSON.stringify({
        places,
        count: places.length,
        source: 'openstreetmap',
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        } 
      }
    );
    
  } catch (error) {
    console.error('[overpass-places] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});