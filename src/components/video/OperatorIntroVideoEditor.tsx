import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { VideoUpload } from './VideoUpload';
import { VideoPlayer } from './VideoPlayer';
import { uploadVideo } from '@/utils/videoUpload';
import { VIDEO_BUCKET } from '@/utils/videoValidation';

export const OperatorIntroVideoEditor = ({ operatorId, initialPath }: { operatorId: string; initialPath: string | null }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [path, setPath] = useState(initialPath);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async (next: string | null) => {
    const { error } = await supabase.from('tour_operators').update({ intro_video_url: next }).eq('id', operatorId);
    if (error) throw error;
    if (path && path !== next) await supabase.storage.from(VIDEO_BUCKET).remove([path]);
    setPath(next);
  };

  const upload = async () => {
    if (!user || !file) return;
    setSaving(true);
    try {
      await save(await uploadVideo(user.id, 'intro', file));
      setFile(null);
      toast({ title: 'Video saved', description: 'Travelers can now watch your intro video.' });
    } catch {
      toast({ title: 'Upload failed', description: 'Please try again.', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Your intro video</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {path && !file && (
          <div className="space-y-2 max-w-md">
            <VideoPlayer path={path} />
            <Button variant="outline" size="sm" disabled={saving} onClick={() => save(null).catch(() => undefined)}>Remove video</Button>
          </div>
        )}
        <VideoUpload id="dash-intro-video" label={path ? 'Replace video' : 'Add a video'} hint="MP4, MOV or WebM, up to 2 minutes and 50 MB." file={file} onChange={setFile} />
        {file && <Button onClick={upload} disabled={saving}>{saving ? 'Uploading…' : 'Save video'}</Button>}
      </CardContent>
    </Card>
  );
};
