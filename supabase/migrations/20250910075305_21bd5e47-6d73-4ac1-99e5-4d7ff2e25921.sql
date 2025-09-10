-- Drop the existing enum and recreate with all values
DROP TYPE IF EXISTS public.user_type CASCADE;
CREATE TYPE public.user_type AS ENUM ('traveler', 'tour_operator', 'language_teacher', 'cultural_experience', 'event_venue');

-- Add user_type column to profiles if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_type public.user_type DEFAULT 'traveler';

-- Add new fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS birthdate DATE,
ADD COLUMN IF NOT EXISTS home_city TEXT,
ADD COLUMN IF NOT EXISTS upcoming_travel TEXT,
ADD COLUMN IF NOT EXISTS travel_dream_list TEXT[],
ADD COLUMN IF NOT EXISTS geographic_availability TEXT,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
ADD COLUMN IF NOT EXISTS identification_uploaded BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS social_media_links JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS interests TEXT[],
ADD COLUMN IF NOT EXISTS custom_interests TEXT[];