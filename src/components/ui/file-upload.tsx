import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, User, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface FileUploadProps {
  onUpload: (url: string) => void;
  currentImageUrl?: string;
  bucket: 'avatars' | 'media';
  maxSize?: number; // in MB
  accept?: string;
  className?: string;
  variant?: 'avatar' | 'media';
}

export const FileUpload = ({ 
  onUpload, 
  currentImageUrl, 
  bucket, 
  maxSize = 5, 
  accept = 'image/*',
  className = '',
  variant = 'avatar'
}: FileUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!user) {
      toast.error('You must be logged in to upload files');
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL for avatars, signed URL for media
      let publicUrl;
      if (bucket === 'avatars') {
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);
        publicUrl = urlData.publicUrl;
      } else {
        const { data: urlData, error: urlError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(filePath, 3600); // 1 hour expiry
        if (urlError) throw urlError;
        publicUrl = urlData.signedUrl;
      }

      onUpload(publicUrl);
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removeImage = () => {
    onUpload('');
  };

  if (variant === 'avatar') {
    return (
      <div className={`flex flex-col items-center space-y-4 ${className}`}>
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={currentImageUrl} />
            <AvatarFallback>
              <User className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>
          {currentImageUrl && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
              onClick={removeImage}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        <div className="flex flex-col items-center space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </Button>
          <p className="text-xs text-muted-foreground">
            Max {maxSize}MB • JPG, PNG, GIF
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive ? 'border-primary bg-primary/10' : 'border-border'
      } ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {currentImageUrl ? (
        <div className="space-y-4">
          <img 
            src={currentImageUrl} 
            alt="Uploaded file" 
            className="max-w-full max-h-48 mx-auto rounded"
          />
          <div className="flex justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={removeImage}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            Choose File
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Max {maxSize}MB • {accept.replace('image/', '').toUpperCase()}
          </p>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};