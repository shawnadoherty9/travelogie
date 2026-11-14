import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Video, X } from 'lucide-react';
import { readVideoDuration, validateVideoDuration, validateVideoFile } from '@/utils/videoValidation';

interface Props {
  id: string;
  label: string;
  hint?: string;
  file: File | null;
  onChange: (file: File | null) => void;
}

export const VideoUpload = ({ id, label, hint, file, onChange }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const err = validateVideoFile(f) ?? validateVideoDuration(await readVideoDuration(f));
    setError(err);
    if (!err) onChange(f);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {preview ? (
        <div className="relative max-w-sm">
          <video src={preview} controls className="w-full rounded-lg bg-muted" />
          <Button type="button" size="icon" variant="secondary" className="absolute top-2 right-2 h-7 w-7" onClick={() => onChange(null)} aria-label="Remove video">
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <>
          <input id={id} type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" onChange={handle} />
          <Label htmlFor={id}>
            <Button type="button" variant="outline" asChild>
              <span className="cursor-pointer"><Video className="w-4 h-4 mr-2" />Add video</span>
            </Button>
          </Label>
        </>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
