import { VideoPlayer } from '@/components/video/VideoPlayer';
import type { TourOperator } from '@/hooks/useTourOperators';

export const GuideIntroVideos = ({ operators }: { operators: TourOperator[] }) => {
  const withVideo = operators.filter((o) => o.intro_video_url);
  if (withVideo.length === 0) return null;
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Meet Your Local Guides</h2>
        <p className="text-center text-muted-foreground mb-8">Hear from the locals who will show you their home.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {withVideo.map((o) => (
            <div key={o.id} className="space-y-2">
              <VideoPlayer path={o.intro_video_url as string} />
              <p className="font-semibold">{o.business_name}</p>
              {o.cities_covered?.length ? <p className="text-sm text-muted-foreground">{o.cities_covered.join(', ')}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
