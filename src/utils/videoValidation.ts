export const VIDEO_BUCKET = 'tour-videos';
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
export const MAX_VIDEO_SECONDS = 120;
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

const EXT_TYPES: Record<string, string> = { mp4: 'video/mp4', m4v: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm' };

/** iPhones sometimes hand over videos with an empty type; fall back to the file extension. */
export function resolveVideoType(file: { type: string; name?: string }): string {
  if (file.type) return file.type;
  const ext = file.name?.split('.').pop()?.toLowerCase() ?? '';
  return EXT_TYPES[ext] ?? '';
}

export function validateVideoFile(file: { type: string; size: number; name?: string }): string | null {
  if (!ALLOWED_VIDEO_TYPES.includes(resolveVideoType(file))) return 'Please choose an MP4, MOV or WebM video.';
  if (file.size > MAX_VIDEO_BYTES) return 'This video is larger than 50 MB. Please choose a shorter or smaller file.';
  return null;
}

export function validateVideoDuration(seconds: number): string | null {
  if (!Number.isFinite(seconds)) return null;
  if (seconds > MAX_VIDEO_SECONDS + 1) return 'Videos can be up to 2 minutes long.';
  return null;
}

export function readVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement('video');
    const timer = setTimeout(() => { URL.revokeObjectURL(url); resolve(NaN); }, 8000);
    v.muted = true;
    v.playsInline = true;
    v.preload = 'metadata';
    v.onloadedmetadata = () => { clearTimeout(timer); URL.revokeObjectURL(url); resolve(v.duration); };
    v.onerror = () => { clearTimeout(timer); URL.revokeObjectURL(url); resolve(NaN); };
    v.src = url;
  });
}
