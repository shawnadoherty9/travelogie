import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';
import { VideoPlayer } from '@/components/video/VideoPlayer';

interface TourWithVideo {
  id: string;
  title: string;
  description: string | null;
  duration_hours: number;
  price_per_hour: number;
  currency: string | null;
  max_participants: number | null;
  video_url: string | null;
}

export const LocalTourVideos = () => {
  const [tours, setTours] = useState<TourWithVideo[]>([]);

  useEffect(() => {
    supabase
      .from('services')
      .select('id,title,description,duration_hours,price_per_hour,currency,max_participants,video_url')
      .eq('service_type', 'tour')
      .eq('is_active', true)
      .not('video_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(12)
      .then(({ data }) => setTours((data as TourWithVideo[]) ?? []));
  }, []);

  if (tours.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Tours by Local Guides</h2>
        <p className="text-center text-muted-foreground mb-8">Watch a preview before you book.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((t) => (
            <Card key={t.id} className="overflow-hidden">
              <VideoPlayer path={t.video_url as string} className="rounded-none" />
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold leading-snug">{t.title}</h3>
                {t.description && <p className="text-sm text-muted-foreground line-clamp-3">{t.description}</p>}
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{t.duration_hours}h</span>
                  {t.max_participants && <span className="flex items-center gap-1"><Users className="w-4 h-4" />Up to {t.max_participants}</span>}
                  <Badge variant="secondary" className="ml-auto">
                    {t.currency ?? 'USD'} {Math.round(t.price_per_hour * t.duration_hours)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
