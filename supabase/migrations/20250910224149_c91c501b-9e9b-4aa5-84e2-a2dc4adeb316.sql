-- Update RLS policies to require authentication for user-specific operations
-- The warnings are because the policies allow access to anonymous users
-- But for a travel booking platform, some data should be publicly readable

-- Update tour-related policies to require authentication for user operations
DROP POLICY "Users can manage their own tours" ON public.personalized_tours;
DROP POLICY "Users can view tour itinerary for their tours" ON public.tour_itinerary;
DROP POLICY "Users can manage their own tour bookings" ON public.tour_bookings;
DROP POLICY "Tour operators can manage their own profile" ON public.tour_operators;
DROP POLICY "Tour operators can manage their own availability" ON public.tour_operator_availability;

-- Create new policies that require authentication
CREATE POLICY "Authenticated users can manage their own tours" ON public.personalized_tours 
FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view tour itinerary for their tours" ON public.tour_itinerary 
FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.personalized_tours WHERE id = tour_id AND user_id = auth.uid())
);

CREATE POLICY "Authenticated users can manage their own tour bookings" ON public.tour_bookings 
FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated tour operators can manage their own profile" ON public.tour_operators 
FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated tour operators can manage their own availability" ON public.tour_operator_availability 
FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.tour_operators WHERE id = operator_id AND user_id = auth.uid())
);

-- Insert sample data for your initial cities and countries
INSERT INTO public.countries (name, country_code, currency, timezone) VALUES
('Thailand', 'TH', 'THB', 'Asia/Bangkok'),
('Indonesia', 'ID', 'IDR', 'Asia/Jakarta'),
('India', 'IN', 'INR', 'Asia/Kolkata'),
('United States', 'US', 'USD', 'America/New_York'),
('Japan', 'JP', 'JPY', 'Asia/Tokyo'),
('Cambodia', 'KH', 'KHR', 'Asia/Phnom_Penh');

-- Insert sample cities for your target locations
INSERT INTO public.cities (country_id, name, latitude, longitude, timezone, description, best_time_to_visit) VALUES
((SELECT id FROM public.countries WHERE country_code = 'TH'), 'Bangkok', 13.7563, 100.5018, 'Asia/Bangkok', 'Vibrant capital city with temples, markets, and street food', 'November to February'),
((SELECT id FROM public.countries WHERE country_code = 'TH'), 'Chiang Mai', 18.7883, 98.9853, 'Asia/Bangkok', 'Cultural hub in northern Thailand with temples and night markets', 'November to February'),
((SELECT id FROM public.countries WHERE country_code = 'ID'), 'Bali', -8.4095, 115.1889, 'Asia/Makassar', 'Island paradise with beaches, temples, and rice terraces', 'April to October'),
((SELECT id FROM public.countries WHERE country_code = 'IN'), 'Mumbai', 19.0760, 72.8777, 'Asia/Kolkata', 'Bollywood capital and financial center of India', 'October to February'),
((SELECT id FROM public.countries WHERE country_code = 'IN'), 'Varanasi', 25.3176, 82.9739, 'Asia/Kolkata', 'Sacred city on the Ganges river', 'October to March'),
((SELECT id FROM public.countries WHERE country_code = 'US'), 'New York', 40.7128, -74.0060, 'America/New_York', 'The city that never sleeps', 'April to June, September to November'),
((SELECT id FROM public.countries WHERE country_code = 'US'), 'Boston', 42.3601, -71.0589, 'America/New_York', 'Historic city with rich American heritage', 'April to October'),
((SELECT id FROM public.countries WHERE country_code = 'JP'), 'Tokyo', 35.6762, 139.6503, 'Asia/Tokyo', 'Modern metropolis blending tradition and technology', 'March to May, September to November'),
((SELECT id FROM public.countries WHERE country_code = 'JP'), 'Kyoto', 35.0116, 135.7681, 'Asia/Tokyo', 'Ancient capital with temples and traditional culture', 'March to May, September to November'),
((SELECT id FROM public.countries WHERE country_code = 'KH'), 'Siem Reap', 13.3671, 103.8448, 'Asia/Phnom_Penh', 'Gateway to Angkor Wat temple complex', 'November to March');

-- Insert sample activity categories
INSERT INTO public.activity_categories (name, icon, description) VALUES
('Cultural Heritage', 'Building', 'Temples, museums, historical sites'),
('Food & Dining', 'UtensilsCrossed', 'Street food tours, cooking classes, restaurants'),
('Adventure Sports', 'Mountain', 'Hiking, diving, extreme sports'),
('Nature & Wildlife', 'Trees', 'National parks, wildlife sanctuaries, nature walks'),
('Art & Crafts', 'Palette', 'Art galleries, craft workshops, cultural performances'),
('Spiritual & Wellness', 'Heart', 'Meditation, yoga, spiritual experiences'),
('Markets & Shopping', 'ShoppingBag', 'Local markets, shopping districts, souvenirs'),
('Transportation', 'Car', 'Unique transport experiences, scenic routes'),
('Entertainment', 'Music', 'Shows, festivals, nightlife'),
('Learning Experiences', 'BookOpen', 'Language classes, skill workshops, cultural education');

-- Insert sample interest tags
INSERT INTO public.interest_tags (name, category, icon) VALUES
('Photography', 'hobby', 'Camera'),
('History', 'culture', 'BookOpen'),
('Food', 'lifestyle', 'UtensilsCrossed'),
('Adventure', 'activity', 'Mountain'),
('Art', 'culture', 'Palette'),
('Nature', 'environment', 'Trees'),
('Architecture', 'culture', 'Building'),
('Music', 'entertainment', 'Music'),
('Spirituality', 'wellness', 'Heart'),
('Markets', 'shopping', 'ShoppingBag'),
('Festivals', 'entertainment', 'Calendar'),
('Wildlife', 'nature', 'Binoculars'),
('Beaches', 'nature', 'Waves'),
('Temples', 'culture', 'Church'),
('Street Food', 'food', 'Coffee');