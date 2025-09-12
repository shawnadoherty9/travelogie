-- Create travel_suggestions table
CREATE TABLE public.travel_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT DEFAULT 'Anonymous',
  tags TEXT[],
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  photo_url TEXT,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.travel_suggestions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (anyone can view and add suggestions)
CREATE POLICY "Anyone can view travel suggestions" 
ON public.travel_suggestions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can add travel suggestions" 
ON public.travel_suggestions 
FOR INSERT 
WITH CHECK (true);

-- Create upvotes tracking table
CREATE TABLE public.travel_suggestion_upvotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  suggestion_id UUID NOT NULL REFERENCES public.travel_suggestions(id) ON DELETE CASCADE,
  user_ip TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(suggestion_id, user_ip)
);

-- Enable RLS on upvotes table
ALTER TABLE public.travel_suggestion_upvotes ENABLE ROW LEVEL SECURITY;

-- Create policies for upvotes
CREATE POLICY "Anyone can view upvotes" 
ON public.travel_suggestion_upvotes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can add upvotes" 
ON public.travel_suggestion_upvotes 
FOR INSERT 
WITH CHECK (true);

-- Create storage bucket for travel suggestion photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('travel-photos', 'travel-photos', true);

-- Create storage policies for travel photos
CREATE POLICY "Anyone can view travel photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'travel-photos');

CREATE POLICY "Anyone can upload travel photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'travel-photos');

-- Create function to increment upvotes
CREATE OR REPLACE FUNCTION public.increment_suggestion_upvotes(
  suggestion_id UUID,
  user_ip TEXT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  result JSON;
  new_count INTEGER;
BEGIN
  -- Try to insert the upvote (will fail if user already upvoted)
  INSERT INTO public.travel_suggestion_upvotes (suggestion_id, user_ip)
  VALUES (suggestion_id, user_ip)
  ON CONFLICT (suggestion_id, user_ip) DO NOTHING;
  
  -- Count total upvotes for this suggestion
  SELECT COUNT(*) INTO new_count
  FROM public.travel_suggestion_upvotes
  WHERE travel_suggestion_upvotes.suggestion_id = increment_suggestion_upvotes.suggestion_id;
  
  -- Update the suggestion with new count
  UPDATE public.travel_suggestions
  SET upvotes = new_count
  WHERE id = suggestion_id;
  
  result := json_build_object('upvotes', new_count);
  RETURN result;
END;
$$;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_travel_suggestions_updated_at
BEFORE UPDATE ON public.travel_suggestions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();