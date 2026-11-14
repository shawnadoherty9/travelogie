import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VIDEO_BUCKET } from '@/utils/videoValidation';

export const VideoPlayer = ({ path, className }: { path: string; className?: string }) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    supabase.storage.from(VIDEO_BUCKET).createSignedUrl(path, 60 * 60 * 24).then(({ data }) => {
      if (active) setUrl(data?.signedUrl ?? null);
    });
    return () => { active = false; };
  }, [path]);
  if (!url) return <div className={`aspect-video rounded-lg bg-muted ${className ?? ''}`} />;
  return <video src={url} controls preload="metadata" playsInline className={`w-full aspect-video rounded-lg bg-muted object-cover ${className ?? ''}`} />;
};
