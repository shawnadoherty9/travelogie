import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// Category mapping from keywords to DB category IDs
const CATEGORY_MAP: Record<string, string> = {
  // Cultural & Heritage
  'cultural': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93',
  'heritage': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93',
  'history': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93',
  'tradition': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93',
  'festival': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93',
  'ceremony': 'd4656eb8-d1e7-4c8e-a764-4e27fdf57f93',
  'temple': 'dcc605a6-d411-4323-b618-fd7e5ee531a2',
  'museum': '460f6a43-2b5f-4bc1-9228-bda9e21c57e3',
  // Music & Performing Arts
  'music': '77729156-c09e-47b2-baa1-1d588e9dc97c',
  'concert': '77729156-c09e-47b2-baa1-1d588e9dc97c',
  'theater': '77729156-c09e-47b2-baa1-1d588e9dc97c',
  'theatre': '77729156-c09e-47b2-baa1-1d588e9dc97c',
  'dance': '77729156-c09e-47b2-baa1-1d588e9dc97c',
  'performing': '77729156-c09e-47b2-baa1-1d588e9dc97c',
  'opera': '77729156-c09e-47b2-baa1-1d588e9dc97c',
  'art': 'd2e5321e-6271-4710-b43a-05ca0c28c08c',
  'gallery': 'd2e5321e-6271-4710-b43a-05ca0c28c08c',
  'exhibition': 'd2e5321e-6271-4710-b43a-05ca0c28c08c',
  // Food & Culinary
  'food': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c',
  'culinary': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c',
  'cooking': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c',
  'tasting': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c',
  'wine': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c',
  'dining': '00bcffa8-1df9-4dd1-ac05-c77fdf46991c',
  'market': 'e9de555e-fbe2-42c3-b45c-0cf3268e79c9',
  // Adventure & Outdoor
  'adventure': 'bf083496-0cac-4a2a-b046-62c4f33970c3',
  'outdoor': 'bf083496-0cac-4a2a-b046-62c4f33970c3',
  'hiking': 'bf083496-0cac-4a2a-b046-62c4f33970c3',
  'sports': 'bf083496-0cac-4a2a-b046-62c4f33970c3',
  'trek': 'bf083496-0cac-4a2a-b046-62c4f33970c3',
  'nature': '7771a0c3-399d-4f48-b8f1-6640ea10a4cd',
  'wildlife': '7771a0c3-399d-4f48-b8f1-6640ea10a4cd',
}

// Default category for unmatched events
const DEFAULT_CATEGORY_ID = '94790d50-0212-4657-87aa-ebc503b26860' // "Culture"

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
  ]
  const lower = text.toLowerCase()
  return tagKeywords.filter(k => lower.includes(k))
}

async function scrapeEventsWithFirecrawl(
  apiKey: string,
  city: string,
  country: string,
): Promise<ScrapedEvent[]> {
  const searchQuery = `events in ${city} ${country} 2025 2026`

  console.log(`Searching Firecrawl for: ${searchQuery}`)

  const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: searchQuery,
      limit: 10,
      scrapeOptions: { formats: ['markdown'] },
    }),
  })

  if (!searchResponse.ok) {
    const errText = await searchResponse.text()
    console.error(`Firecrawl search failed [${searchResponse.status}]: ${errText}`)
    return []
  }

  const searchData = await searchResponse.json()
  const results = searchData.data || searchData.results || []

  if (!Array.isArray(results) || results.length === 0) {
    console.log('No search results found')
    return []
  }

  console.log(`Got ${results.length} search results, extracting events...`)

  // Now scrape the top results for structured event data
  const events: ScrapedEvent[] = []

  for (const result of results.slice(0, 5)) {
    const url = result.url
    if (!url) continue

    try {
      const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
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
                      event_type: { type: 'string', description: 'e.g. concert, festival, exhibition, workshop' },
                      image_url: { type: 'string' },
                    },
                    required: ['name', 'start_date'],
                  },
                },
              },
              required: ['events'],
            },
            prompt: `Extract all upcoming events from this page. For each event, provide name, dates (YYYY-MM-DD), times (HH:MM), venue, address, pricing, ticket URL, and event type. Only include events in or near ${city}, ${country}.`,
          },
          onlyMainContent: true,
          waitFor: 3000,
        }),
      })

      if (!scrapeResponse.ok) {
        console.error(`Scrape failed for ${url}: ${scrapeResponse.status}`)
        continue
      }

      const scrapeData = await scrapeResponse.json()
      const jsonData = scrapeData.data?.extract || scrapeData.extract || scrapeData.data?.json || scrapeData.json

      if (jsonData?.events && Array.isArray(jsonData.events)) {
        for (const evt of jsonData.events) {
          if (!evt.name || !evt.start_date) continue

          // Validate date format and ensure day/month are valid (not 00)
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

  console.log(`Extracted ${events.length} events for ${city}, ${country}`)
  return events
}

// Geocode an address using Nominatim (free, no API key)
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY')
    if (!firecrawlKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'FIRECRAWL_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse request — supports city-specific or batch mode
    const body = await req.json().catch(() => ({}))
    const { city, country, city_id } = body as { city?: string; country?: string; city_id?: string }

    // If a specific city is provided, fetch events for it
    // Otherwise, fetch for all cities in the DB
    let citiesToFetch: Array<{ id: string; name: string; country_name: string }> = []

    if (city && country) {
      citiesToFetch = [{ id: city_id || '', name: city, country_name: country }]
    } else {
      // Fetch cities from DB with their countries
      const { data: citiesData } = await supabase
        .from('cities')
        .select('id, name, country_id')
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
        }))
      }
    }

    if (citiesToFetch.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No cities to fetch events for', events_added: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    let totalAdded = 0
    let totalSkipped = 0

    for (const cityInfo of citiesToFetch) {
      console.log(`\n--- Fetching events for ${cityInfo.name}, ${cityInfo.country_name} ---`)

      const scrapedEvents = await scrapeEventsWithFirecrawl(
        firecrawlKey,
        cityInfo.name,
        cityInfo.country_name,
      )

      for (const evt of scrapedEvents) {
        // Dedup: check if event with same name and start_date already exists
        const { data: existing } = await supabase
          .from('events')
          .select('id')
          .eq('name', evt.name)
          .eq('start_date', evt.start_date)
          .limit(1)

        if (existing && existing.length > 0) {
          totalSkipped++
          continue
        }

        // Geocode if no lat/lng
        let lat = evt.latitude || null
        let lon = evt.longitude || null
        if (!lat || !lon) {
          const geo = await geocodeAddress(evt.address || `${cityInfo.name}, ${cityInfo.country_name}`)
          if (geo) {
            lat = geo.lat
            lon = geo.lon
          }
        }

        // Determine category
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
          tags: evt.tags,
          ticket_url: evt.ticket_url,
          event_type: evt.event_type,
          category_id: categoryId,
          city_id: cityInfo.id || null,
          is_active: true,
        })

        if (insertError) {
          console.error(`Insert error for "${evt.name}":`, insertError.message)
        } else {
          totalAdded++
        }
      }

      // Rate limit: wait between cities to respect Nominatim policy
      if (citiesToFetch.length > 1) {
        await new Promise(r => setTimeout(r, 1500))
      }
    }

    console.log(`\nDone! Added: ${totalAdded}, Skipped (duplicates): ${totalSkipped}`)

    return new Response(
      JSON.stringify({
        success: true,
        events_added: totalAdded,
        events_skipped: totalSkipped,
        cities_processed: citiesToFetch.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error in fetch-events:', error)
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
