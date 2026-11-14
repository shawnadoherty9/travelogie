export const VIDEO_BUCKET = 'tour-videos';
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
export const MAX_VIDEO_SECONDS = 120;
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

export function validateVideoFile(file: { type: string; size: number }): string | null {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) return 'Please choose an MP4, MOV or WebM video.';
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
    v.preload = 'metadata';
    v.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(v.duration); };
    v.onerror = () => { URL.revokeObjectURL(url); resolve(NaN); };
    v.src = url;
  });
}
