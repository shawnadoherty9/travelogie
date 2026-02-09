import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// ─── Shared Types ───────────────────────────────────────────────────────────

export interface CityInfo {
  id: string
  name: string
  country_name: string
  lat: number
  lng: number
}

export interface NormalizedEvent {
  name: string
  description?: string | null
  short_description?: string | null
  start_date: string       // YYYY-MM-DD
  end_date?: string | null
  start_time?: string | null
  end_time?: string | null
  address?: string | null
  venue_name?: string | null
  latitude?: number | null
  longitude?: number | null
  price_from?: number | null
  price_to?: number | null
  currency?: string
  image_urls?: string[] | null
  tags?: string[]
  ticket_url?: string | null
  event_type?: string | null
  capacity?: number | null
  source: string            // e.g. 'foursquare', 'eventbrite', 'firecrawl'
}

export interface EventSourceAdapter {
  name: string
  enabled: boolean
  /** Fetch events for a city. Return normalized events. */
  fetchEvents(city: CityInfo): Promise<NormalizedEvent[]>
}

// ─── Category Mapping ───────────────────────────────────────────────────────

const CATEGORY_MAP: Record<string, string> = {
  'music': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'concert': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'band': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'jazz': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'rock': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'classical': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'dj': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'live music': 'a1b2c3d4-1111-4444-aaaa-111111111111',
  'theater': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'theatre': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'opera': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'ballet': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'comedy': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'dance': 'a1b2c3d4-2222-4444-aaaa-222222222222',
  'art': 'a1b2c3d4-3333-4444-aaaa-333333333333',
  'gallery': 'a1b2c3d4-3333-4444-aaaa-333333333333',
  'exhibition': 'a1b2c3d4-3333-4444-aaaa-333333333333',
  'museum': '460f6a43-2b5f-4bc1-9228-bda9e21c57e3',
  'hiking': 'a1b2c3d4-4444-4444-aaaa-444444444444',
  'nature': 'a1b2c3d4-4444-4444-aaaa-444444444444',
  'outdoor': 'a1b2c3d4-4444-4444-aaaa-444444444444',
  'surfing': 'a1b2c3d4-5555-4444-aaaa-555555555555',
  'diving': 'a1b2c3d4-5555-4444-aaaa-555555555555',
  'sailing': 'a1b2c3d4-5555-4444-aaaa-555555555555',
  'sports': 'a1b2c3d4-6666-4444-aaaa-666666666666',
  'marathon': 'a1b2c3d4-6666-4444-aaaa-666666666666',
  'yoga': 'a1b2c3d4-6666-4444-aaaa-666666666666',
  'cultural': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93',
  'heritage': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93',
  'festival': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93',
  'food': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c',
  'culinary': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c',
  'cooking': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c',
  'market': 'e9de555e-fbe2-42c3-b45c-0cf3268e79c9',
  'adventure': 'bf083496-0cac-4a2a-b046-62c4f33970c3',
}

const DEFAULT_CATEGORY_ID = '94790d50-0212-4657-87aa-ebc503b26860'

export function matchCategory(text: string): string {
  const lower = text.toLowerCase()
  for (const [keyword, categoryId] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(keyword)) return categoryId
  }
  return DEFAULT_CATEGORY_ID
}

export function extractTags(text: string): string[] {
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

// ─── Geocoding ──────────────────────────────────────────────────────────────

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

// ─── Source: Foursquare ─────────────────────────────────────────────────────

function createFoursquareSource(): EventSourceAdapter {
  const apiKey = Deno.env.get('FOURSQUARE_API_KEY')?.trim()

  const FSQ_SEARCHES = [
    { label: 'arts & entertainment', cat: '10000', dbCat: '77729156-c09e-47b2-baa1-1d588e9dc97c' },
    { label: 'museums', cat: '10027', dbCat: '460f6a43-2b5f-4bc1-9228-bda9e21c57e3' },
    { label: 'music venues', cat: '10032', dbCat: 'a1b2c3d4-1111-4444-aaaa-111111111111' },
    { label: 'performing arts', cat: '10024', dbCat: 'a1b2c3d4-2222-4444-aaaa-222222222222' },
    { label: 'food & dining', cat: '13000', dbCat: '00bcffa8-1df9-4dd1-ac05-c77fdf46991c' },
    { label: 'parks & nature', cat: '16032,16000', dbCat: 'a1b2c3d4-4444-4444-aaaa-444444444444' },
    { label: 'sports', cat: '18000', dbCat: 'a1b2c3d4-6666-4444-aaaa-666666666666' },
    { label: 'temples & heritage', cat: '12099,16020', dbCat: 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93' },
  ]

  return {
    name: 'foursquare',
    enabled: !!apiKey,

    async fetchEvents(city: CityInfo): Promise<NormalizedEvent[]> {
      if (!apiKey || !city.lat || !city.lng) return []
      const ll = `${city.lat},${city.lng}`
      const events: NormalizedEvent[] = []

      const isServiceKey = apiKey.startsWith('fsq3')
      const baseUrl = isServiceKey ? 'https://places-api.foursquare.com' : 'https://api.foursquare.com/v3'
      const headers: Record<string, string> = {
        Authorization: isServiceKey ? `Bearer ${apiKey}` : apiKey,
        Accept: 'application/json',
      }
      if (isServiceKey) headers['X-Places-Api-Version'] = '2025-06-17'

      for (const search of FSQ_SEARCHES) {
        try {
          const params = new URLSearchParams({
            ll,
            categories: search.cat,
            limit: '30',
            radius: '15000',
            fields: 'fsq_id,name,geocodes,location,categories,description,rating,photos,hours,price,website',
          })

          const res = await fetch(`${baseUrl}/places/search?${params}`, { headers })
          if (!res.ok) {
            console.error(`[foursquare] ${search.label} failed: ${res.status}`)
            continue
          }

          const data = await res.json()
          const places = data.results || []
          console.log(`[foursquare] ${search.label}: ${places.length} results`)

          for (const place of places) {
            const lat = place.geocodes?.main?.latitude
            const lng = place.geocodes?.main?.longitude
            if (!lat || !lng) continue

            const catName = place.categories?.[0]?.name || 'Place'
            const imageUrls = place.photos?.map((p: any) => `${p.prefix}original${p.suffix}`) || []
            const today = new Date().toISOString().split('T')[0]

            events.push({
              name: place.name,
              description: place.description || `${place.name} - ${catName}`,
              short_description: place.location?.formatted_address,
              start_date: today,
              end_date: today,
              address: place.location?.formatted_address,
              venue_name: place.name,
              latitude: lat,
              longitude: lng,
              price_from: null,
              price_to: null,
              currency: 'USD',
              image_urls: imageUrls.length > 0 ? imageUrls : null,
              tags: [catName, 'foursquare', search.label],
              ticket_url: place.website || null,
              event_type: search.label,
              source: 'foursquare',
            })
          }

          await new Promise(r => setTimeout(r, 300))
        } catch (err) {
          console.error(`[foursquare] Error in ${search.label}:`, err)
        }
      }

      return events
    },
  }
}

// ─── Source: Eventbrite (via Firecrawl scraping) ─────────────────────────────

function createEventbriteSource(): EventSourceAdapter {
  const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY')?.trim()

  return {
    name: 'eventbrite',
    enabled: !!firecrawlKey,

    async fetchEvents(city: CityInfo): Promise<NormalizedEvent[]> {
      if (!firecrawlKey) return []
      console.log(`[eventbrite] Scraping events for ${city.name}`)

      return scrapeEventPlatform(
        firecrawlKey,
        `site:eventbrite.com events in ${city.name} ${city.country_name} 2025 2026`,
        city,
        'eventbrite',
      )
    },
  }
}

// ─── Source: Luma (via Firecrawl scraping) ───────────────────────────────────

function createLumaSource(): EventSourceAdapter {
  const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY')?.trim()

  return {
    name: 'luma',
    enabled: !!firecrawlKey,

    async fetchEvents(city: CityInfo): Promise<NormalizedEvent[]> {
      if (!firecrawlKey) return []
      console.log(`[luma] Scraping events for ${city.name}`)

      return scrapeEventPlatform(
        firecrawlKey,
        `site:lu.ma events in ${city.name} ${city.country_name} 2025 2026`,
        city,
        'luma',
      )
    },
  }
}

// ─── Source: Partiful (via Firecrawl scraping) ──────────────────────────────

function createPartifulSource(): EventSourceAdapter {
  const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY')?.trim()

  return {
    name: 'partiful',
    enabled: !!firecrawlKey,

    async fetchEvents(city: CityInfo): Promise<NormalizedEvent[]> {
      if (!firecrawlKey) return []
      console.log(`[partiful] Scraping events for ${city.name}`)

      return scrapeEventPlatform(
        firecrawlKey,
        `site:partiful.com events in ${city.name} ${city.country_name} 2025 2026`,
        city,
        'partiful',
      )
    },
  }
}

// ─── Source: Ticketmaster (via Firecrawl scraping) ──────────────────────────

function createTicketmasterSource(): EventSourceAdapter {
  const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY')?.trim()

  return {
    name: 'ticketmaster',
    enabled: !!firecrawlKey,

    async fetchEvents(city: CityInfo): Promise<NormalizedEvent[]> {
      if (!firecrawlKey) return []
      console.log(`[ticketmaster] Scraping events for ${city.name}`)

      return scrapeEventPlatform(
        firecrawlKey,
        `site:ticketmaster.com events in ${city.name} ${city.country_name} 2025 2026`,
        city,
        'ticketmaster',
      )
    },
  }
}

// ─── Source: Firecrawl General Scraping (catch-all) ─────────────────────────

function createFirecrawlGeneralSource(): EventSourceAdapter {
  const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY')?.trim()

  const SCRAPE_QUERIES = [
    { label: 'music & concerts', query: 'live music concerts gigs festivals' },
    { label: 'theater & performing arts', query: 'theater theatre dance opera comedy shows' },
    { label: 'art exhibitions', query: 'art gallery exhibition studio open house' },
    { label: 'outdoor & nature', query: 'hiking nature trek trail outdoor adventure' },
    { label: 'cultural events', query: 'cultural festival heritage ceremony traditional events' },
    { label: 'food & culinary', query: 'food festival cooking class wine tasting culinary tour' },
  ]

  return {
    name: 'firecrawl',
    enabled: !!firecrawlKey,

    async fetchEvents(city: CityInfo): Promise<NormalizedEvent[]> {
      if (!firecrawlKey) return []
      const events: NormalizedEvent[] = []

      for (const q of SCRAPE_QUERIES) {
        console.log(`[firecrawl] Searching: ${q.label} in ${city.name}`)
        const results = await scrapeEventPlatform(
          firecrawlKey,
          `${q.query} in ${city.name} ${city.country_name} 2025 2026`,
          city,
          'firecrawl',
        )
        events.push(...results)
        await new Promise(r => setTimeout(r, 1000))
      }

      return events
    },
  }
}

// ─── Shared Firecrawl scraping logic ────────────────────────────────────────

async function scrapeEventPlatform(
  apiKey: string,
  searchQuery: string,
  city: CityInfo,
  sourceName: string,
): Promise<NormalizedEvent[]> {
  const events: NormalizedEvent[] = []

  try {
    const searchRes = await fetch('https://api.firecrawl.dev/v1/search', {
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

    if (!searchRes.ok) {
      console.error(`[${sourceName}] Search failed: ${searchRes.status}`)
      return []
    }

    const searchData = await searchRes.json()
    const results = searchData.data || searchData.results || []
    if (!Array.isArray(results) || results.length === 0) return []

    console.log(`[${sourceName}] Got ${results.length} search results`)

    for (const result of results.slice(0, 3)) {
      const url = result.url
      if (!url) continue

      try {
        const scrapeRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
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
              prompt: `Extract all upcoming events. For each: name, dates (YYYY-MM-DD), times (HH:MM), venue, address, pricing, ticket URL, event type. Only events in/near ${city.name}, ${city.country_name}.`,
            },
            onlyMainContent: true,
            waitFor: 3000,
          }),
        })

        if (!scrapeRes.ok) continue

        const scrapeData = await scrapeRes.json()
        const jsonData = scrapeData.data?.extract || scrapeData.extract || scrapeData.data?.json || scrapeData.json

        if (jsonData?.events && Array.isArray(jsonData.events)) {
          for (const evt of jsonData.events) {
            if (!evt.name || !evt.start_date) continue
            const dateMatch = evt.start_date.match(/^(\d{4})-(\d{2})-(\d{2})/)
            if (!dateMatch) continue

            events.push({
              name: evt.name.trim(),
              description: evt.description?.trim() || null,
              short_description: evt.description?.substring(0, 150)?.trim() || null,
              start_date: dateMatch[0],
              end_date: evt.end_date?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || dateMatch[0],
              start_time: evt.start_time || null,
              end_time: evt.end_time || null,
              venue_name: evt.venue_name || null,
              address: evt.address || `${city.name}, ${city.country_name}`,
              latitude: null,
              longitude: null,
              price_from: typeof evt.price_from === 'number' ? evt.price_from : null,
              price_to: typeof evt.price_to === 'number' ? evt.price_to : null,
              currency: evt.currency || 'USD',
              image_urls: evt.image_url ? [evt.image_url] : null,
              tags: [...extractTags(`${evt.name} ${evt.description || ''}`), sourceName],
              ticket_url: evt.ticket_url || url,
              event_type: evt.event_type || null,
              source: sourceName,
            })
          }
        }
      } catch (err) {
        console.error(`[${sourceName}] Scrape error for ${url}:`, err)
      }
    }
  } catch (err) {
    console.error(`[${sourceName}] Fatal error:`, err)
  }

  return events
}

// ─── Source Registry ────────────────────────────────────────────────────────
// To add a new source: create a factory function and add it here.

function getEnabledSources(requestedSources?: string[]): EventSourceAdapter[] {
  const allSources: EventSourceAdapter[] = [
    createFoursquareSource(),
    createEventbriteSource(),
    createLumaSource(),
    createPartifulSource(),
    createTicketmasterSource(),
    createFirecrawlGeneralSource(),
  ]

  let sources = allSources.filter(s => s.enabled)

  // If specific sources requested, filter to just those
  if (requestedSources && requestedSources.length > 0) {
    sources = sources.filter(s => requestedSources.includes(s.name))
  }

  return sources
}

// ─── Main Handler ───────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const body = await req.json().catch(() => ({}))
    const {
      city,
      country,
      city_id,
      sources: requestedSources, // optionally filter: ["eventbrite", "luma"]
    } = body as {
      city?: string
      country?: string
      city_id?: string
      sources?: string[]
    }

    // ─── Resolve cities ───
    let citiesToFetch: CityInfo[] = []

    if (city && country) {
      const { data: cityData } = await supabase
        .from('cities')
        .select('id, latitude, longitude')
        .ilike('name', city)
        .limit(1)

      const cityRow = cityData?.[0]
      const info: CityInfo = {
        id: city_id || cityRow?.id || '',
        name: city,
        country_name: country,
        lat: cityRow?.latitude || 0,
        lng: cityRow?.longitude || 0,
      }

      if (!info.lat) {
        const geo = await geocodeAddress(`${city}, ${country}`)
        if (geo) { info.lat = geo.lat; info.lng = geo.lon }
      }

      citiesToFetch = [info]
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

    // ─── Get enabled sources ───
    const sources = getEnabledSources(requestedSources)
    console.log(`Enabled sources: ${sources.map(s => s.name).join(', ')}`)

    if (sources.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No event sources configured. Add API keys for Foursquare and/or Firecrawl.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // ─── Fetch from all sources for each city ───
    const summary: Record<string, { added: number; skipped: number; errors: number }> = {}
    let totalAdded = 0

    for (const cityInfo of citiesToFetch) {
      console.log(`\n═══ Processing ${cityInfo.name}, ${cityInfo.country_name} ═══`)

      for (const source of sources) {
        console.log(`  ── Source: ${source.name} ──`)
        if (!summary[source.name]) {
          summary[source.name] = { added: 0, skipped: 0, errors: 0 }
        }

        try {
          const events = await source.fetchEvents(cityInfo)
          console.log(`  [${source.name}] Got ${events.length} normalized events`)

          for (const evt of events) {
            // Dedup by name + date
            const { data: existing } = await supabase
              .from('events')
              .select('id')
              .eq('name', evt.name)
              .eq('start_date', evt.start_date)
              .limit(1)

            if (existing && existing.length > 0) {
              summary[source.name].skipped++
              continue
            }

            // Also check activities for Foursquare dedup
            if (source.name !== 'foursquare') {
              const { data: existingActivity } = await supabase
                .from('activities')
                .select('id')
                .ilike('name', `%${evt.name}%`)
                .limit(1)

              if (existingActivity && existingActivity.length > 0) {
                summary[source.name].skipped++
                continue
              }
            }

            // Geocode if needed
            let lat = evt.latitude
            let lon = evt.longitude
            if (!lat || !lon) {
              const geo = await geocodeAddress(evt.address || `${cityInfo.name}, ${cityInfo.country_name}`)
              if (geo) { lat = geo.lat; lon = geo.lon }
            }

            const categoryId = matchCategory(
              `${evt.name} ${evt.description || ''} ${evt.event_type || ''}`
            )

            // Insert into events table (Foursquare also goes as events now for consistency)
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
              tags: [...(evt.tags || []), evt.source],
              ticket_url: evt.ticket_url,
              event_type: evt.event_type,
              category_id: categoryId,
              city_id: cityInfo.id || null,
              is_active: true,
            })

            if (insertError) {
              console.error(`[${source.name}] Insert error for "${evt.name}":`, insertError.message)
              summary[source.name].errors++
            } else {
              summary[source.name].added++
              totalAdded++
            }
          }
        } catch (err) {
          console.error(`[${source.name}] Source error:`, err)
          summary[source.name].errors++
        }

        // Rate limit between sources
        await new Promise(r => setTimeout(r, 500))
      }

      // Rate limit between cities
      if (citiesToFetch.length > 1) {
        await new Promise(r => setTimeout(r, 1500))
      }
    }

    const result = {
      success: true,
      sources_used: sources.map(s => s.name),
      by_source: summary,
      cities_processed: citiesToFetch.length,
      events_added: totalAdded,
    }

    console.log(`\n═══ DONE ═══`, JSON.stringify(result, null, 2))

    return new Response(JSON.stringify(result), {
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
