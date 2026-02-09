import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Ticket, Loader2 } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  short_description: string | null;
  start_date: string;
  end_date: string;
  venue_name: string | null;
  address: string | null;
  event_type: string | null;
  price_from: number | null;
  price_to: number | null;
  currency: string;
  ticket_url: string | null;
  image_urls: string[] | null;
  tags: string[] | null;
}

interface LiveEventsSectionProps {
  city?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  limit?: number;
  title?: string;
}

export const LiveEventsSection = ({
  city,
  latitude,
  longitude,
  radiusKm = 100,
  limit = 6,
  title = 'Upcoming Events',
}: LiveEventsSectionProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('events')
          .select('id, name, short_description, start_date, end_date, venue_name, address, event_type, price_from, price_to, currency, ticket_url, image_urls, tags')
          .eq('is_active', true)
          .gte('end_date', new Date().toISOString().split('T')[0])
          .order('start_date', { ascending: true })
          .limit(limit);

        if (city) {
          query = query.ilike('address', `%${city}%`);
        }

        const { data, error } = await query;
        if (error) throw error;

        let filtered = data || [];

        // Client-side distance filter if lat/lng provided
        if (latitude && longitude && filtered.length > 0) {
          filtered = filtered.filter((evt: any) => {
            if (!evt.latitude || !evt.longitude) return true;
            const R = 6371;
            const dLat = ((evt.latitude - latitude) * Math.PI) / 180;
            const dLon = ((evt.longitude - longitude) * Math.PI) / 180;
            const a =
              Math.sin(dLat / 2) ** 2 +
              Math.cos((latitude * Math.PI) / 180) *
                Math.cos((evt.latitude * Math.PI) / 180) *
                Math.sin(dLon / 2) ** 2;
            const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return d <= radiusKm;
          });
        }

        setEvents(filtered);
      } catch (err) {
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [city, latitude, longitude, radiusKm, limit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (events.length === 0) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getEventTypeColor = (type: string | null) => {
    if (!type) return 'bg-muted text-muted-foreground';
    const lower = type.toLowerCase();
    if (lower.includes('festival') || lower.includes('cultural')) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    if (lower.includes('concert') || lower.includes('music')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    if (lower.includes('food') || lower.includes('culinary')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    if (lower.includes('exhibition') || lower.includes('art')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (lower.includes('sport')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-muted-foreground mt-1">
              {city ? `Live events in ${city}` : 'Events happening around you'}
            </p>
          </div>
          <Badge variant="outline" className="gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card
              key={event.id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {event.image_urls?.[0] && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={event.image_urls[0]}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-base line-clamp-2">{event.name}</h3>
                  {event.event_type && (
                    <Badge className={`shrink-0 text-xs ${getEventTypeColor(event.event_type)}`}>
                      {event.event_type}
                    </Badge>
                  )}
                </div>

                {event.short_description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {event.short_description}
                  </p>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>
                      {formatDate(event.start_date)}
                      {event.end_date !== event.start_date && ` – ${formatDate(event.end_date)}`}
                    </span>
                  </div>

                  {(event.venue_name || event.address) && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="line-clamp-1">{event.venue_name || event.address}</span>
                    </div>
                  )}

                  {event.price_from != null && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Ticket className="w-4 h-4 shrink-0" />
                      <span>
                        {event.price_from === 0
                          ? 'Free'
                          : `${event.currency} ${event.price_from}${event.price_to ? ` – ${event.price_to}` : ''}`}
                      </span>
                    </div>
                  )}
                </div>

                {event.ticket_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => window.open(event.ticket_url!, '_blank')}
                  >
                    Get Tickets
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
