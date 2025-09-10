-- Create countries table
CREATE TABLE public.countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  country_code TEXT NOT NULL UNIQUE, -- ISO 3166-1 alpha-2
  currency TEXT NOT NULL,
  timezone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create cities table
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES public.countries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  timezone TEXT NOT NULL,
  description TEXT,
  best_time_to_visit TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create activity categories table
CREATE TABLE public.activity_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.activity_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  duration_hours INTEGER,
  price_from DECIMAL(10, 2),
  price_to DECIMAL(10, 2),
  currency TEXT NOT NULL DEFAULT 'USD',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  operating_hours JSONB, -- {"monday": {"open": "09:00", "close": "17:00"}, ...}
  booking_requirements JSONB, -- {"advance_notice_hours": 24, "min_participants": 1, "max_participants": 10}
  external_booking_url TEXT,
  booking_api_endpoint TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  image_urls TEXT[],
  tags TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  seasonal_availability JSONB, -- {"months": [1,2,3,4,5,6,7,8,9,10,11,12], "notes": "Available year-round"}
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create events table for time-sensitive activities
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.activity_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  price_from DECIMAL(10, 2),
  price_to DECIMAL(10, 2),
  currency TEXT NOT NULL DEFAULT 'USD',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  venue_name TEXT,
  ticket_url TEXT,
  booking_api_endpoint TEXT,
  capacity INTEGER,
  tickets_sold INTEGER DEFAULT 0,
  image_urls TEXT[],
  tags TEXT[],
  event_type TEXT, -- festival, concert, exhibition, market, etc.
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tour_operators table (enhanced guides)
CREATE TABLE public.tour_operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  description TEXT,
  specialties TEXT[],
  languages_spoken TEXT[],
  cities_covered UUID[], -- Array of city IDs
  experience_years INTEGER,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10, 2),
  daily_rate DECIMAL(10, 2),
  currency TEXT NOT NULL DEFAULT 'USD',
  contact_phone TEXT,
  contact_email TEXT,
  website_url TEXT,
  social_media_links JSONB,
  profile_image_url TEXT,
  gallery_urls TEXT[],
  certifications TEXT[],
  insurance_verified BOOLEAN DEFAULT false,
  background_checked BOOLEAN DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tour_operator_availability table
CREATE TABLE public.tour_operator_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID REFERENCES public.tour_operators(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  max_bookings INTEGER DEFAULT 1,
  current_bookings INTEGER DEFAULT 0,
  rate_override DECIMAL(10, 2), -- Override default rate for specific dates
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(operator_id, date, start_time)
);

-- Create personalized_tours table
CREATE TABLE public.personalized_tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  city_id UUID REFERENCES public.cities(id),
  tour_name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  total_budget DECIMAL(10, 2),
  currency TEXT NOT NULL DEFAULT 'USD',
  interests TEXT[],
  preferences JSONB, -- {"transport": "walking", "pace": "relaxed", "group_size": 2}
  status TEXT NOT NULL DEFAULT 'draft', -- draft, confirmed, in_progress, completed, cancelled
  tour_operator_id UUID REFERENCES public.tour_operators(id),
  operator_daily_rate DECIMAL(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tour_itinerary table
CREATE TABLE public.tour_itinerary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID REFERENCES public.personalized_tours(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  activity_id UUID REFERENCES public.activities(id),
  event_id UUID REFERENCES public.events(id),
  custom_activity_name TEXT,
  custom_activity_description TEXT,
  scheduled_time TIME,
  estimated_duration_hours INTEGER,
  cost DECIMAL(10, 2),
  currency TEXT NOT NULL DEFAULT 'USD',
  booking_status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
  booking_reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((activity_id IS NOT NULL AND event_id IS NULL) OR (activity_id IS NULL AND event_id IS NOT NULL) OR (activity_id IS NULL AND event_id IS NULL AND custom_activity_name IS NOT NULL))
);

-- Create tour_bookings table for confirmed bookings
CREATE TABLE public.tour_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID REFERENCES public.personalized_tours(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tour_operator_id UUID REFERENCES public.tour_operators(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  operator_fee DECIMAL(10, 2),
  activities_cost DECIMAL(10, 2),
  platform_fee DECIMAL(10, 2),
  currency TEXT NOT NULL DEFAULT 'USD',
  booking_status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, in_progress, completed, cancelled, refunded
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  booking_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmation_number TEXT UNIQUE,
  special_requests TEXT,
  emergency_contact JSONB, -- {"name": "", "phone": "", "relationship": ""}
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create interest_tags table for user preferences
CREATE TABLE public.interest_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT, -- culture, adventure, food, nature, history, etc.
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_operator_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalized_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_itinerary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interest_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Allow public read access to countries" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Allow public read access to cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to activity categories" ON public.activity_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to active activities" ON public.activities FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to active events" ON public.events FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to active tour operators" ON public.tour_operators FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to tour operator availability" ON public.tour_operator_availability FOR SELECT USING (true);
CREATE POLICY "Allow public read access to interest tags" ON public.interest_tags FOR SELECT USING (true);

-- Create RLS policies for user-specific access
CREATE POLICY "Users can manage their own tours" ON public.personalized_tours FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view tour itinerary for their tours" ON public.tour_itinerary FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.personalized_tours WHERE id = tour_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage their own tour bookings" ON public.tour_bookings FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for tour operators
CREATE POLICY "Tour operators can manage their own profile" ON public.tour_operators FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Tour operators can manage their own availability" ON public.tour_operator_availability FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tour_operators WHERE id = operator_id AND user_id = auth.uid())
);

-- Create indexes for better performance
CREATE INDEX idx_activities_city_id ON public.activities(city_id);
CREATE INDEX idx_activities_category_id ON public.activities(category_id);
CREATE INDEX idx_activities_location ON public.activities(latitude, longitude);
CREATE INDEX idx_events_city_id ON public.events(city_id);
CREATE INDEX idx_events_dates ON public.events(start_date, end_date);
CREATE INDEX idx_tour_operator_availability_date ON public.tour_operator_availability(operator_id, date);
CREATE INDEX idx_personalized_tours_user_id ON public.personalized_tours(user_id);
CREATE INDEX idx_tour_bookings_user_id ON public.tour_bookings(user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON public.countries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON public.cities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tour_operators_updated_at BEFORE UPDATE ON public.tour_operators FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_personalized_tours_updated_at BEFORE UPDATE ON public.personalized_tours FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tour_bookings_updated_at BEFORE UPDATE ON public.tour_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();