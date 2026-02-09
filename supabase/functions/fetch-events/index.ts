import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// Category mapping from keywords to DB category IDs
const CATEGORY_MAP: Record<string, string> = {
  'music': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'concert': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'band': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'jazz': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'rock': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'classical': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'dj': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'live music': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'singer': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'orchestra': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'hip hop': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'electronic': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'indie': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'theater': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'theatre': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'opera': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'ballet': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'performing': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'play': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'comedy': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'standup': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'dance': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'cabaret': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'art': 'a1b2c3d4-3333-4444-aaaa-333333333333',
  'gallery': 'a1b2c3d4-3333-4444-aaaa-333333333333',
  'exhibition': 'a1b2c3d4-3333-4444-aaaa-333333333333',
  'studio': 'a1b2c3d4-3333-4444-aaaa-333333333333',
  'sculpture': 'a1b2c3d4-3333-4444-aaaa-333333333333',
  'painting': 'a1b2c3d4-3333-4444-aaaa-333333333333',
  'photography': 'a1b2c3d4-3333-4444-aaaa-333333333333',
  'museum': '460f6a43-2b5f-4bc1-9228-bda9e21c57e3',
  'hiking': 'a1b2c3d4-4444-4444-aaaa-444444444444',
  'nature': 'a1b2c3d4-4444-4444-aaaa-444444444444',
  'trek': 'a1b2c3d4-4444-4444-aaaa-444444444444',
  'trail': 'a1b2c3d4-4444-4444-aaaa-444444444444',
  'camping': 'a1b2c3d4-4444-4444-aaaa-444444444444',
  'wildlife': 'a1b2c3d4-4444-4444-aaaa-444444444444',
  'bird': 'a1b2c3d4-4444-4444-aaaa-444444444444',
  'national park': 'a1b2c3d4-4444-4444-aaaa-444444444444',
  'surfing': 'a1b2c3d4-5555-4444-aaaa-555555555555',
  'surf': 'a1b2c3d4-5555-4444-aaaa-555555555555',
  'sailing': 'a1b2c3d4-5555-4444-aaaa-555555555555',
  'diving': 'a1b2c3d4-5555-4444-aaaa-555555555555',
  'snorkel': 'a1b2c3d4-5555-4444-aaaa-555555555555',
  'kayak': 'a1b2c3d4-5555-4444-aaaa-555555555555',
  'boat': 'a1b2c3d4-5555-4444-aaaa-555555555555',
  'yacht': 'a1b2c3d4-5555-4444-aaaa-555555555555',
  'paddle': 'a1b2c3d4-5555-4444-aaaa-555555555555',
  'sports': 'a1b2c3d4-6666-4444-aaaa-666666666666',
  'marathon': 'a1b2c3d4-6666-4444-aaaa-666666666666',
  'football': 'a1b2c3d4-6666-4444-aaaa-666666666666',
  'soccer': 'a1b2c3d4-6666-4444-aaaa-666666666666',
  'basketball': 'a1b2c3d4-6666-4444-aaaa-666666666666',
  'tennis': 'a1b2c3d4-6666-4444-aaaa-666666666666',
  'cycling': 'a1b2c3d4-6666-4444-aaaa-666666666666',
  'boxing': 'a1b2c3d4-6666-4444-aaaa-666666666666',
  'muay thai': 'a1b2c3d4-6666-4444-aaaa-666666666666',
  'yoga': 'a1b2c3d4-6666-4444-aaaa-666666666666',
  'fitness': 'a1b2c3d4-6666-4444-aaaa-666666666666',
  'cultural': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93',
  'heritage': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93',
  'history': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93',
  'tradition': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93',
  'festival': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93',
  'ceremony': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93',
  'temple': 'dcc605a6-d411-4323-b618-fd7e5ee531a2',
  'food': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c',
  'culinary': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c',
  'cooking': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c',
  'tasting': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c',
  'wine': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c',
  'dining': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c',
  'market': 'e9de555e-fbe2-42c3-b45c-0cf3268e79c9',
  'adventure': 'bf083496-0cac-4a2a-b046-62c4f33970c3',
  'outdoor': 'bf083496-0cac-4a2a-b046-62c4f33970c3',
}

const DEFAULT_CATEGORY_ID = '94790d50-0212-4657-87aa-ebc503b26860' // "Culture"

// Foursquare category IDs → our DB category IDs
const FSQ_CATEGORY_TO_DB: Record<string, string> = {
  '10000': '77729156-c09e-47b2-baa1-1d588e9dc97c', // Arts & Entertainment → Entertainment
  '10027': '460f6a43-2b5f-4bc1-9228-bda9e21c57e3', // Museums → Museum
  '10032': 'a1b2c3d4-1111-4444-aaaa-111111111111', // Music Venue → Music & Concerts
  '10024': 'a1b2c3d4-2222-4444-aaaa-222222222222', // Performing Arts → Theater
  '10004': 'a1b2c3d4-3333-4444-aaaa-333333333333', // Art Gallery → Art Galleries
  '13000': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c', // Food → Food & Dining
  '13003': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c', // Restaurant → Food & Dining
  '16000': 'a1b2c3d4-4444-4444-aaaa-444444444444', // Landmarks → Outdoor & Nature
  '16032': '3583f59e-bc41-4ce6-affb-e94eb44159a1', // Parks → Park
  '16003': 'a1b2c3d4-5555-4444-aaaa-555555555555', // Beaches → Water Sports
  '18000': 'a1b2c3d4-6666-4444-aaaa-666666666666', // Sports → Sports & Fitness
  '12099': 'dcc605a6-d411-4323-b618-fd7e5ee531a2', // Temple → Temple
  '16020': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93', // Historical → Cultural Heritage
  '12000': '77729156-c09e-47b2-baa1-1d588e9dc97c', // Nightlife → Entertainment
  '19000': 'ed1a5d62-b2c4-4f90-a5bd-46a989d810f0', // Travel → Transportation
}

// Foursquare search queries per category for Phase 1
const FSQ_CATEGORY_SEARCHES = [
  { label: 'arts & entertainment', fsqCategory: '10000', dbCategoryId: '77729156-c09e-47b2-baa1-1d588e9dc97c' },
  { label: 'museums', fsqCategory: '10027', dbCategoryId: '460f6a43-2b5f-4bc1-9228-bda9e21c57e3' },
  { label: 'music venues', fsqCategory: '10032', dbCategoryId: 'a1b2c3d4-1111-4444-aaaa-111111111111' },
  { label: 'performing arts', fsqCategory: '10024', dbCategoryId: 'a1b2c3d4-2222-4444-aaaa-222222222222' },
  { label: 'art galleries', fsqCategory: '10004', dbCategoryId: 'a1b2c3d4-3333-4444-aaaa-333333333333' },
  { label: 'parks & nature', fsqCategory: '16032,16000', dbCategoryId: 'a1b2c3d4-4444-4444-aaaa-444444444444' },
  { label: 'sports & recreation', fsqCategory: '18000', dbCategoryId: 'a1b2c3d4-6666-4444-aaaa-666666666666' },
  { label: 'food & dining', fsqCategory: '13000', dbCategoryId: '00bcffa8-1df9-4dd1-ac05-c77fdf46991c' },
  { label: 'temples & heritage', fsqCategory: '12099,16020', dbCategoryId: 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93' },
]

// Firecrawl scrape queries — only used for categories with low Foursquare coverage
const SCRAPE_CATEGORY_SEARCHES = [
  { label: 'music & concerts', query: 'live music concerts gigs festivals', dbCategoryId: 'a1b2c3d4-1111-4444-aaaa-111111111111' },
  { label: 'theater & performing arts', query: 'theater theatre dance opera comedy shows', dbCategoryId: 'a1b2c3d4-2222-4444-aaaa-222222222222' },
  { label: 'art galleries & studios', query: 'art gallery exhibition studio open house', dbCategoryId: 'a1b2c3d4-3333-4444-aaaa-333333333333' },
  { label: 'outdoor & nature', query: 'hiking nature trek trail outdoor adventure', dbCategoryId: 'a1b2c3d4-4444-4444-aaaa-444444444444' },
  { label: 'water sports', query: 'surfing sailing diving kayak boat tours', dbCategoryId: 'a1b2c3d4-5555-4444-aaaa-555555555555' },
  { label: 'sports & fitness', query: 'sports marathon cycling boxing muay thai yoga', dbCategoryId: 'a1b2c3d4-6666-4444-aaaa-666666666666' },
  { label: 'cultural events', query: 'cultural festival heritage ceremony traditional events', dbCategoryId: 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93' },
  { label: 'food & culinary', query: 'food festival cooking class wine tasting culinary tour', dbCategoryId: '00bcffa8-1df9-4dd1-ac05-c77fdf46991c' },
]

// Minimum results from Foursquare before we skip scraping for that category
const MIN_FSQ_RESULTS_THRESHOLD = 3

interface ScrapedEvent {
  name: string
  description?: string
  short_description?: string
  start_date: string
  end_date?: string
  start_time?: string
  end_time?: string
  address?: string
  venue_name?: string
  latitude?: number
  longitude?: number
  price_from?: number
  price_to?: number
  currency?: string
  image_urls?: string[]
  tags?: string[]
  ticket_url?: string
  event_type?: string
  capacity?: number
}

function matchCategory(text: string): string {
  const lower = text.toLowerCase()
  for (const [keyword, categoryId] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(keyword)) {
      return categoryId
    }
  }
  return DEFAULT_CATEGORY_ID
}

function extractTags(text: string): string[] {
  const tagKeywords = [
    'cultural', 'heritage', 'music', 'concert', 'food', 'culinary',
    'art', 'dance', 'theater', 'outdoor', 'adventure', 'festival',
    'workshop', 'exhibition', 'market', 'traditional', 'modern',
    'family', 'nightlife', 'spiritual', 'wellness', 'nature',
    'hiking', 'surfing', 'sailing', 'diving', 'sports', 'yoga',
    'gallery', 'studio', 'jazz', 'rock', 'classical', 'comedy',
    'opera', 'ballet', 'photography', 'sculpture',
  ]
  const lower = text.toLowerCase()
  return tagKeywords.filter(k => lower.includes(k))
}

// ─── Phase 1: Foursquare API ────────────────────────────────────────────────

async function fetchFoursquarePlaces(
  apiKey: string,
  ll: string,
  fsqCategories: string,
  limit = 30,
): Promise<any[]> {
  const params = new URLSearchParams({
    ll,
    categories: fsqCategories,
    limit: String(limit),
    radius: '15000',
    fields: 'fsq_id,name,geocodes,location,categories,description,rating,photos,hours,price,website',
  })

  // Auto-detect key format: fsq3* = service key (new endpoint), otherwise legacy
  const isServiceKey = apiKey.startsWith('fsq3')
  const baseUrl = isServiceKey ? 'https://places-api.foursquare.com' : 'https://api.foursquare.com/v3'
  const headers: Record<string, string> = {
    Authorization: isServiceKey ? `Bearer ${apiKey}` : apiKey,
    Accept: 'application/json',
  }
  if (isServiceKey) headers['X-Places-Api-Version'] = '2025-06-17'

  const res = await fetch(`${baseUrl}/places/search?${params}`, { headers })

  if (!res.ok) {
    console.error(`Foursquare search failed [${res.status}]`)
    return []
  }

  const data = await res.json()
  return data.results || []
}

async function importFoursquareAsActivities(
  supabase: any,
  places: any[],
  dbCategoryId: string,
  cityId: string | null,
): Promise<{ added: number; skipped: number }> {
  let added = 0
  let skipped = 0

  for (const place of places) {
    const lat = place.geocodes?.main?.latitude
    const lng = place.geocodes?.main?.longitude
    if (!lat || !lng) { skipped++; continue }

    // Dedup by name + proximity
    const { data: existing } = await supabase
      .from('activities')
      .select('id')
      .ilike('name', place.name)
      .gte('latitude', lat - 0.001)
      .lte('latitude', lat + 0.001)
      .gte('longitude', lng - 0.001)
      .lte('longitude', lng + 0.001)
      .limit(1)

    if (existing && existing.length > 0) { skipped++; continue }

    const imageUrls = place.photos?.map((p: any) => `${p.prefix}original${p.suffix}`) || []
    const fsqCatName = place.categories?.[0]?.name || 'Place'

    const { error } = await supabase.from('activities').insert({
      name: place.name,
      description: place.description || `${place.name} - ${fsqCatName}`,
      short_description: place.location?.formatted_address,
      latitude: lat,
      longitude: lng,
      address: place.location?.formatted_address,
      rating: place.rating ? place.rating / 2 : null,
      image_urls: imageUrls.length > 0 ? imageUrls : null,
      category_id: dbCategoryId,
      city_id: cityId,
      external_booking_url: place.website || null,
      operating_hours: place.hours?.display ? { display: place.hours.display } : null,
      tags: [fsqCatName, 'foursquare'],
      is_active: true,
    })

    if (error) { console.error('FSQ insert error:', error.message); skipped++ }
    else { added++ }
  }

  return { added, skipped }
}

// ─── Phase 2: Firecrawl scraping (only for gaps) ────────────────────────────

async function scrapeEventsForCategory(
  apiKey: string,
  city: string,
  country: string,
  categoryQuery: string,
): Promise<ScrapedEvent[]> {
  const searchQuery = `${categoryQuery} in ${city} ${country} 2025 2026`
  console.log(`  [Firecrawl] Searching: ${searchQuery}`)

  const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: searchQuery,
      limit: 5,
      scrapeOptions: { formats: ['markdown'] },
    }),
  })

  if (!searchResponse.ok) {
    console.error(`Firecrawl search failed [${searchResponse.status}]`)
    return []
  }

  const searchData = await searchResponse.json()
  const results = searchData.data || searchData.results || []
  if (!Array.isArray(results) || results.length === 0) return []

  console.log(`  [Firecrawl] Got ${results.length} results`)

  const events: ScrapedEvent[] = []

  for (const result of results.slice(0, 3)) {
    const url = result.url
    if (!url) continue

    try {
      const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          formats: ['extract'],
          extract: {
            schema: {
              type: 'object',
              properties: {
                events: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      description: { type: 'string' },
                      start_date: { type: 'string', description: 'ISO date YYYY-MM-DD' },
                      end_date: { type: 'string', description: 'ISO date YYYY-MM-DD' },
                      start_time: { type: 'string', description: 'HH:MM format' },
                      end_time: { type: 'string', description: 'HH:MM format' },
                      venue_name: { type: 'string' },
                      address: { type: 'string' },
                      price_from: { type: 'number' },
                      price_to: { type: 'number' },
                      currency: { type: 'string' },
                      ticket_url: { type: 'string' },
                      event_type: { type: 'string' },
                      image_url: { type: 'string' },
                    },
                    required: ['name', 'start_date'],
                  },
                },
              },
              required: ['events'],
            },
            prompt: `Extract all upcoming events from this page. For each event, provide name, dates (YYYY-MM-DD), times (HH:MM), venue, address, pricing, ticket URL, and event type. Only include events in or near ${city}, ${country}. Focus on: ${categoryQuery}.`,
          },
          onlyMainContent: true,
          waitFor: 3000,
        }),
      })

      if (!scrapeResponse.ok) continue

      const scrapeData = await scrapeResponse.json()
      const jsonData = scrapeData.data?.extract || scrapeData.extract || scrapeData.data?.json || scrapeData.json

      if (jsonData?.events && Array.isArray(jsonData.events)) {
        for (const evt of jsonData.events) {
          if (!evt.name || !evt.start_date) continue
          const dateMatch = evt.start_date.match(/^(\d{4})-(\d{2})-(\d{2})/)
          if (!dateMatch) continue
          const [, , month, day] = dateMatch
          if (parseInt(month) < 1 || parseInt(month) > 12 || parseInt(day) < 1 || parseInt(day) > 31) continue

          events.push({
            name: evt.name.trim(),
            description: evt.description?.trim() || null,
            short_description: evt.description?.substring(0, 150)?.trim() || null,
            start_date: dateMatch[0],
            end_date: evt.end_date?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || dateMatch[0],
            start_time: evt.start_time || null,
            end_time: evt.end_time || null,
            venue_name: evt.venue_name || null,
            address: evt.address || `${city}, ${country}`,
            price_from: typeof evt.price_from === 'number' ? evt.price_from : null,
            price_to: typeof evt.price_to === 'number' ? evt.price_to : null,
            currency: evt.currency || 'USD',
            image_urls: evt.image_url ? [evt.image_url] : null,
            ticket_url: evt.ticket_url || null,
            event_type: evt.event_type || null,
            tags: extractTags(`${evt.name} ${evt.description || ''} ${evt.event_type || ''}`),
          })
        }
      }
    } catch (err) {
      console.error(`Error scraping ${url}:`, err)
    }
  }

  return events
}

// Geocode an address using Nominatim
async function geocodeAddress(address: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Travelogie/1.0 (travelogie.io)' },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
    }
  } catch (err) {
    console.error('Geocoding error:', err)
  }
  return null
}

// ─── Main handler ───────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const foursquareKey = Deno.env.get('FOURSQUARE_API_KEY')
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY')
    
    if (!foursquareKey && !firecrawlKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'No API keys configured (need FOURSQUARE_API_KEY and/or FIRECRAWL_API_KEY)' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const body = await req.json().catch(() => ({}))
    const { city, country, city_id } = body as { city?: string; country?: string; city_id?: string }

    // Resolve cities to process
    let citiesToFetch: Array<{ id: string; name: string; country_name: string; lat: number; lng: number }> = []

    if (city && country) {
      // Look up city coordinates from DB
      const { data: cityData } = await supabase
        .from('cities')
        .select('id, latitude, longitude')
        .ilike('name', city)
        .limit(1)

      const cityRow = cityData?.[0]
      citiesToFetch = [{
        id: city_id || cityRow?.id || '',
        name: city,
        country_name: country,
        lat: cityRow?.latitude || 0,
        lng: cityRow?.longitude || 0,
      }]

      // If no coordinates found, geocode the city
      if (!citiesToFetch[0].lat) {
        const geo = await geocodeAddress(`${city}, ${country}`)
        if (geo) {
          citiesToFetch[0].lat = geo.lat
          citiesToFetch[0].lng = geo.lon
        }
      }
    } else {
      const { data: citiesData } = await supabase
        .from('cities')
        .select('id, name, country_id, latitude, longitude')
        .limit(20)

      if (citiesData && citiesData.length > 0) {
        const countryIds = [...new Set(citiesData.map(c => c.country_id).filter(Boolean))]
        const { data: countriesData } = await supabase
          .from('countries')
          .select('id, name')
          .in('id', countryIds)

        const countryMap = new Map(countriesData?.map(c => [c.id, c.name]) || [])

        citiesToFetch = citiesData.map(c => ({
          id: c.id,
          name: c.name,
          country_name: countryMap.get(c.country_id || '') || '',
          lat: Number(c.latitude),
          lng: Number(c.longitude),
        }))
      }
    }

    if (citiesToFetch.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No cities to fetch events for', events_added: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    let totalFsqAdded = 0
    let totalFsqSkipped = 0
    let totalScrapedAdded = 0
    let totalScrapedSkipped = 0
    const categoriesSkippedScraping: string[] = []

    for (const cityInfo of citiesToFetch) {
      console.log(`\n═══ Processing ${cityInfo.name}, ${cityInfo.country_name} ═══`)

      // Track how many Foursquare results per category
      const fsqCountsByCategory: Record<string, number> = {}

      // ─── PHASE 1: Foursquare first ───────────────────────────────────
      if (foursquareKey && cityInfo.lat && cityInfo.lng) {
        const ll = `${cityInfo.lat},${cityInfo.lng}`
        console.log(`\n  ── Phase 1: Foursquare (${ll}) ──`)

        for (const catSearch of FSQ_CATEGORY_SEARCHES) {
          console.log(`  [FSQ] Fetching: ${catSearch.label}`)

          const places = await fetchFoursquarePlaces(
            foursquareKey,
            ll,
            catSearch.fsqCategory,
            30,
          )

          console.log(`  [FSQ] Found ${places.length} places for ${catSearch.label}`)
          fsqCountsByCategory[catSearch.dbCategoryId] = places.length

          if (places.length > 0) {
            const result = await importFoursquareAsActivities(
              supabase,
              places,
              catSearch.dbCategoryId,
              cityInfo.id || null,
            )
            totalFsqAdded += result.added
            totalFsqSkipped += result.skipped
            console.log(`  [FSQ] Imported ${result.added}, skipped ${result.skipped}`)
          }

          // Rate limit between Foursquare requests
          await new Promise(r => setTimeout(r, 300))
        }
      }

      // ─── PHASE 2: Scrape only gaps ────────────────────────────────────
      if (firecrawlKey) {
        console.log(`\n  ── Phase 2: Firecrawl (filling gaps) ──`)

        for (const catSearch of SCRAPE_CATEGORY_SEARCHES) {
          const fsqCount = fsqCountsByCategory[catSearch.dbCategoryId] || 0

          if (fsqCount >= MIN_FSQ_RESULTS_THRESHOLD) {
            console.log(`  [SKIP] "${catSearch.label}" — already have ${fsqCount} Foursquare results`)
            categoriesSkippedScraping.push(catSearch.label)
            continue
          }

          console.log(`  [SCRAPE] "${catSearch.label}" — only ${fsqCount} Foursquare results, scraping for more`)

          const scrapedEvents = await scrapeEventsForCategory(
            firecrawlKey,
            cityInfo.name,
            cityInfo.country_name,
            catSearch.query,
          )

          for (const evt of scrapedEvents) {
            // Dedup against existing events
            const { data: existing } = await supabase
              .from('events')
              .select('id')
              .eq('name', evt.name)
              .eq('start_date', evt.start_date)
              .limit(1)

            if (existing && existing.length > 0) {
              totalScrapedSkipped++
              continue
            }

            // Also dedup against activities (don't scrape what Foursquare already added)
            const { data: existingActivity } = await supabase
              .from('activities')
              .select('id')
              .ilike('name', `%${evt.name}%`)
              .limit(1)

            if (existingActivity && existingActivity.length > 0) {
              totalScrapedSkipped++
              continue
            }

            let lat = evt.latitude || null
            let lon = evt.longitude || null
            if (!lat || !lon) {
              const geo = await geocodeAddress(evt.address || `${cityInfo.name}, ${cityInfo.country_name}`)
              if (geo) { lat = geo.lat; lon = geo.lon }
            }

            const categoryId = matchCategory(
              `${evt.name} ${evt.description || ''} ${evt.event_type || ''}`
            )

            const { error: insertError } = await supabase.from('events').insert({
              name: evt.name,
              description: evt.description,
              short_description: evt.short_description,
              start_date: evt.start_date,
              end_date: evt.end_date || evt.start_date,
              start_time: evt.start_time,
              end_time: evt.end_time,
              venue_name: evt.venue_name,
              address: evt.address,
              latitude: lat,
              longitude: lon,
              price_from: evt.price_from,
              price_to: evt.price_to,
              currency: evt.currency || 'USD',
              image_urls: evt.image_urls,
              tags: [...(evt.tags || []), 'scraped'],
              ticket_url: evt.ticket_url,
              event_type: evt.event_type,
              category_id: categoryId,
              city_id: cityInfo.id || null,
              is_active: true,
            })

            if (insertError) {
              console.error(`Insert error for "${evt.name}":`, insertError.message)
            } else {
              totalScrapedAdded++
            }
          }

          // Rate limit between scrape categories
          await new Promise(r => setTimeout(r, 1000))
        }
      }

      // Rate limit between cities
      if (citiesToFetch.length > 1) {
        await new Promise(r => setTimeout(r, 1500))
      }
    }

    const summary = {
      success: true,
      foursquare: { activities_added: totalFsqAdded, activities_skipped: totalFsqSkipped },
      scraped: { events_added: totalScrapedAdded, events_skipped: totalScrapedSkipped },
      categories_skipped_scraping: categoriesSkippedScraping,
      cities_processed: citiesToFetch.length,
      // Backwards compat
      events_added: totalFsqAdded + totalScrapedAdded,
    }

    console.log(`\n═══ DONE ═══`, JSON.stringify(summary, null, 2))

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('fetch-events error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
