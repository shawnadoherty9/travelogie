import { supabase } from '@/integrations/supabase/client';
import { VIDEO_BUCKET } from './videoValidation';

/** Uploads to {userId}/{folder}/... and returns the relative path. */
export async function uploadVideo(userId: string, folder: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
  const path = `${userId}/${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(VIDEO_BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}
