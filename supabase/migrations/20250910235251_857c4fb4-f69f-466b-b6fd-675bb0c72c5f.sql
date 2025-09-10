-- Insert real Japan data from CSV - Fixed version

-- First, let's create some Japanese cities (without ON CONFLICT clause)
INSERT INTO public.cities (name, latitude, longitude, timezone, description) 
SELECT 'Tokyo', 35.6762, 139.6503, 'Asia/Tokyo', 'Capital city of Japan'
WHERE NOT EXISTS (SELECT 1 FROM public.cities WHERE name = 'Tokyo');

INSERT INTO public.cities (name, latitude, longitude, timezone, description) 
SELECT 'Osaka', 34.6937, 135.5023, 'Asia/Tokyo', 'Kitchen of Japan'
WHERE NOT EXISTS (SELECT 1 FROM public.cities WHERE name = 'Osaka');

INSERT INTO public.cities (name, latitude, longitude, timezone, description) 
SELECT 'Kyoto', 35.0116, 135.7681, 'Asia/Tokyo', 'Ancient capital of Japan'
WHERE NOT EXISTS (SELECT 1 FROM public.cities WHERE name = 'Kyoto');

INSERT INTO public.cities (name, latitude, longitude, timezone, description) 
SELECT 'Hiroshima', 34.3853, 132.4553, 'Asia/Tokyo', 'Historic city in western Japan'
WHERE NOT EXISTS (SELECT 1 FROM public.cities WHERE name = 'Hiroshima');

INSERT INTO public.cities (name, latitude, longitude, timezone, description) 
SELECT 'Nara', 34.6851, 135.8048, 'Asia/Tokyo', 'Ancient capital with famous deer park'
WHERE NOT EXISTS (SELECT 1 FROM public.cities WHERE name = 'Nara');

INSERT INTO public.cities (name, latitude, longitude, timezone, description) 
SELECT 'Sapporo', 43.0642, 141.3469, 'Asia/Tokyo', 'Northern city famous for beer and snow'
WHERE NOT EXISTS (SELECT 1 FROM public.cities WHERE name = 'Sapporo');

-- Create activity categories for Japan (without ON CONFLICT clause)
INSERT INTO public.activity_categories (name, description, icon) 
SELECT 'Museum', 'Museums and cultural institutions', '🏛️'
WHERE NOT EXISTS (SELECT 1 FROM public.activity_categories WHERE name = 'Museum');

INSERT INTO public.activity_categories (name, description, icon) 
SELECT 'Temple', 'Temples and shrines', '⛩️'
WHERE NOT EXISTS (SELECT 1 FROM public.activity_categories WHERE name = 'Temple');

INSERT INTO public.activity_categories (name, description, icon) 
SELECT 'Park', 'Parks and gardens', '🌳'
WHERE NOT EXISTS (SELECT 1 FROM public.activity_categories WHERE name = 'Park');

INSERT INTO public.activity_categories (name, description, icon) 
SELECT 'Food', 'Food experiences and markets', '🍜'
WHERE NOT EXISTS (SELECT 1 FROM public.activity_categories WHERE name = 'Food');

INSERT INTO public.activity_categories (name, description, icon) 
SELECT 'Shopping', 'Shopping districts and markets', '🛍️'
WHERE NOT EXISTS (SELECT 1 FROM public.activity_categories WHERE name = 'Shopping');

INSERT INTO public.activity_categories (name, description, icon) 
SELECT 'Culture', 'Cultural experiences and sites', '🎭'
WHERE NOT EXISTS (SELECT 1 FROM public.activity_categories WHERE name = 'Culture');

INSERT INTO public.activity_categories (name, description, icon) 
SELECT 'Nature', 'Natural attractions and outdoor activities', '🌿'
WHERE NOT EXISTS (SELECT 1 FROM public.activity_categories WHERE name = 'Nature');

INSERT INTO public.activity_categories (name, description, icon) 
SELECT 'Entertainment', 'Entertainment venues and activities', '🎢'
WHERE NOT EXISTS (SELECT 1 FROM public.activity_categories WHERE name = 'Entertainment');

-- Insert real Japan attractions from the CSV data
INSERT INTO public.activities (
  name, 
  short_description, 
  description, 
  price_from, 
  duration_hours, 
  rating, 
  review_count, 
  image_urls, 
  tags, 
  currency, 
  address, 
  latitude, 
  longitude, 
  is_active,
  city_id,
  category_id
) VALUES
  ('Sapporo Beer Museum & Brewery Tour', 
   'Historic Sapporo Beer brewery with tasting room and vintage ads', 
   'Explore the historic Sapporo Beer Museum, featuring the history of beer in Japan, vintage advertisements, and conclude with a tasting session of fresh Sapporo beer varieties.',
   25, 2, 4.5, 312,
   ARRAY['https://www.sapporobeer.jp/museum/images/ogp_en.jpg'],
   ARRAY['Museum','food','culture','views'],
   'USD', 'Kita 7-jo Higashi 9-chome, Chuo Ward', 43.0833, 141.3500, true,
   (SELECT id FROM public.cities WHERE name = 'Sapporo'),
   (SELECT id FROM public.activity_categories WHERE name = 'Museum')),

  ('Kasuga Taisha Shrine & Lanterns', 
   'Famous for 3,000 bronze and stone lanterns', 
   'Visit the famous Kasuga Taisha Shrine, renowned for its collection of over 3,000 bronze and stone lanterns donated by worshippers throughout the centuries.',
   5, 2, 4.7, 187,
   ARRAY['https://www.kasugataisha.or.jp/images/ogp_en.jpg'],
   ARRAY['Temple','spiritual','culture','views'],
   'USD', '7-31 Kamikitacho, Nara City', 34.6861, 135.8306, true,
   (SELECT id FROM public.cities WHERE name = 'Nara'),
   (SELECT id FROM public.activity_categories WHERE name = 'Temple')),

  ('Fushimi Inari Shrine', 
   'Famous temple with thousands of vermillion torii gates', 
   'Experience the iconic Fushimi Inari Shrine with its famous thousands of vermillion torii gates creating tunnels up the mountainside. A spiritual journey through traditional Japan.',
   0, 3, 4.8, 1245,
   ARRAY['https://inari.jp/images/ogp_en.jpg'],
   ARRAY['Temple','spiritual','culture','views'],
   'USD', 'Fushimi-ku, Kyoto', 34.9671, 135.7792, true,
   (SELECT id FROM public.cities WHERE name = 'Kyoto'),
   (SELECT id FROM public.activity_categories WHERE name = 'Temple')),

  ('Kinkaku-ji (Golden Pavilion)', 
   'Zen Buddhist temple covered in gold leaf', 
   'Visit the stunning Kinkaku-ji (Golden Pavilion), a Zen Buddhist temple covered in gold leaf that reflects beautifully on the surrounding mirror pond.',
   5, 1, 4.9, 892,
   ARRAY['https://www.shokoku-ji.jp/kinkakuji/images/ogp_en.jpg'],
   ARRAY['Temple','spiritual','culture','views'],
   'USD', '1Kinkakuji-cho, Kita Ward', 35.0397, 135.7292, true,
   (SELECT id FROM public.cities WHERE name = 'Kyoto'),
   (SELECT id FROM public.activity_categories WHERE name = 'Temple')),

  ('Senso-ji Temple & Nakamise Shopping Arcade', 
   'Tokyo''s oldest temple with market street', 
   'Explore Tokyo''s oldest temple, Senso-ji, and walk through the traditional Nakamise shopping arcade leading to the temple gates, filled with traditional snacks and souvenirs.',
   0, 2, 4.6, 567,
   ARRAY['https://www.senso-ji.jp/images/ogp_en.jpg'],
   ARRAY['Temple','spiritual','culture','shopping','local'],
   'USD', '2-3-1 Asakusa, Taito City', 35.7147, 139.7966, true,
   (SELECT id FROM public.cities WHERE name = 'Tokyo'),
   (SELECT id FROM public.activity_categories WHERE name = 'Temple')),

  ('Hiroshima Peace Memorial Park & Atomic Bomb Dome', 
   'Powerful memorial to peace and WWII atomic bombing', 
   'Visit the moving Hiroshima Peace Memorial Park and the iconic Atomic Bomb Dome, dedicated to promoting peace and remembering the victims of the atomic bombing.',
   0, 3, 4.8, 1156,
   ARRAY['https://hpmmuseum.jp/images/ogp_en.jpg'],
   ARRAY['HistoricalSite','history','culture','peaceful','views'],
   'USD', '1-10 Oronocho,Naka Ward', 34.3958, 132.4564, true,
   (SELECT id FROM public.cities WHERE name = 'Hiroshima'),
   (SELECT id FROM public.activity_categories WHERE name = 'Culture')),

  ('Tsukiji Outer Market & Sushi Breakfast', 
   'Fresh sushi, knives, and seafood stalls', 
   'Experience the bustling Tsukiji Outer Market with fresh sushi for breakfast, traditional knife shops, and seafood stalls. Best visited at dawn for the freshest experience.',
   15, 2, 4.7, 423,
   ARRAY['https://tsukiji-market.com/images/outer-market.jpg'],
   ARRAY['Market','food','culture','local'],
   'USD', '5-chome Nipponbashi, Chuo City', 35.6658, 139.7733, true,
   (SELECT id FROM public.cities WHERE name = 'Tokyo'),
   (SELECT id FROM public.activity_categories WHERE name = 'Food')),

  ('Osaka Castle & Park', 
   '16th-century fortress with museum and city views', 
   'Explore the impressive 16th-century Osaka Castle, featuring a museum showcasing samurai history and offering panoramic views of the modern city from its observation deck.',
   8, 2, 4.5, 734,
   ARRAY['https://www.osakacastle.net/images/ogp_en.jpg'],
   ARRAY['HistoricalSite','history','culture','views'],
   'USD', '1-1 Osakajo, Chuo-ku', 34.6876, 135.5246, true,
   (SELECT id FROM public.cities WHERE name = 'Osaka'),
   (SELECT id FROM public.activity_categories WHERE name = 'Culture')),

  ('Dotonbori & Glico Man', 
   'Vibrant street with neon lights and street food', 
   'Experience the electric atmosphere of Dotonbori, famous for its neon lights, giant illuminated signs including the iconic Glico Man, and incredible street food scene.',
   0, 2, 4.6, 892,
   ARRAY['https://osaka-info.jp/en/uploads/dotonbori-glico-sign.jpg'],
   ARRAY['Neighborhood','nightlife','food','views'],
   'USD', 'Dotonbori, Chuo Ward', 34.6685, 135.5031, true,
   (SELECT id FROM public.cities WHERE name = 'Osaka'),
   (SELECT id FROM public.activity_categories WHERE name = 'Entertainment')),

  ('Arashiyama Bamboo Grove & Tenryu-ji', 
   'Lush bamboo path and UNESCO World Heritage Zen temple', 
   'Walk through the mystical Arashiyama Bamboo Grove and visit the UNESCO World Heritage Tenryu-ji Temple, featuring beautiful traditional gardens and Zen architecture.',
   5, 2, 4.8, 445,
   ARRAY['https://www.tenryu-ji.com/images/ogp_en.jpg'],
   ARRAY['Nature','nature','peaceful','views'],
   'USD', 'Sagatenryuji Susukinobaba-cho, Ukyo-ku', 35.0096, 135.6744, true,
   (SELECT id FROM public.cities WHERE name = 'Kyoto'),
   (SELECT id FROM public.activity_categories WHERE name = 'Nature'));