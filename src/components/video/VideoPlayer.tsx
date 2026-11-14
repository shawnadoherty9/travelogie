import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VIDEO_BUCKET } from '@/utils/videoValidation';

/** Mobile-friendly player: loads only when near the screen, plays inline, pauses when scrolled away. */
export const VideoPlayer = ({ path, className }: { path: string; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
      else videoRef.current?.pause();
    }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let active = true;
    supabase.storage.from(VIDEO_BUCKET).createSignedUrl(path, 60 * 60 * 24).then(({ data }) => {
      if (active) setUrl(data?.signedUrl ?? null);
    });
    return () => { active = false; };
  }, [path, visible]);

  return (
    <div ref={ref} className={`w-full aspect-video rounded-lg bg-muted overflow-hidden ${className ?? ''}`}>
      {url && (
        <video
          ref={videoRef}
          src={`${url}#t=0.1`}
          controls
          playsInline
          preload="metadata"
          controlsList="nodownload"
          // iOS Safari: these attributes keep playback inline
          webkit-playsinline="true"
          className="w-full h-full object-contain bg-foreground"
        />
      )}
    </div>
  );
};
