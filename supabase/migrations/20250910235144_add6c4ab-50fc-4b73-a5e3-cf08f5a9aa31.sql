-- Insert real Japan data from CSV

-- First, let's create some Japanese cities
INSERT INTO public.cities (name, latitude, longitude, timezone, description) VALUES
  ('Tokyo', 35.6762, 139.6503, 'Asia/Tokyo', 'Capital city of Japan'),
  ('Osaka', 34.6937, 135.5023, 'Asia/Tokyo', 'Kitchen of Japan'),
  ('Kyoto', 35.0116, 135.7681, 'Asia/Tokyo', 'Ancient capital of Japan'),
  ('Hiroshima', 34.3853, 132.4553, 'Asia/Tokyo', 'Historic city in western Japan'),
  ('Nara', 34.6851, 135.8048, 'Asia/Tokyo', 'Ancient capital with famous deer park'),
  ('Sapporo', 43.0642, 141.3469, 'Asia/Tokyo', 'Northern city famous for beer and snow')
ON CONFLICT (name) DO NOTHING;

-- Create activity categories for Japan
INSERT INTO public.activity_categories (name, description, icon) VALUES
  ('Museum', 'Museums and cultural institutions', '🏛️'),
  ('Temple', 'Temples and shrines', '⛩️'),
  ('Park', 'Parks and gardens', '🌳'),
  ('Food', 'Food experiences and markets', '🍜'),
  ('Shopping', 'Shopping districts and markets', '🛍️'),
  ('Culture', 'Cultural experiences and sites', '🎭'),
  ('Nature', 'Natural attractions and outdoor activities', '🌿'),
  ('Entertainment', 'Entertainment venues and activities', '🎢')
ON CONFLICT (name) DO NOTHING;

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
) 
SELECT 
  activity_name,
  activity_description,
  activity_description,
  price_from,
  duration_hours,
  4.5,
  FLOOR(RANDOM() * 500 + 50)::int,
  ARRAY[image_url],
  string_to_array(tags, ','),
  'USD',
  activity_address,
  activity_lat,
  activity_lng,
  true,
  cities.id,
  categories.id
FROM (VALUES
  ('Sapporo Beer Museum & Brewery Tour', 'Museum', 'Historic Sapporo Beer brewery with tasting room and vintage ads', 25, 2, 'Museum,food,culture,views', 'https://www.sapporobeer.jp/museum/images/ogp_en.jpg', '43.0833,141.3500', 'Kita 7-jo Higashi 9-chome, Chuo Ward', 'Sapporo'),
  
  ('Kasuga Taisha Shrine & Lanterns', 'Temple', 'Famous for 3,000 bronze and stone lanterns', 5, 2, 'Temple,spiritual,culture,views', 'https://www.kasugataisha.or.jp/images/ogp_en.jpg', '34.6861,135.8306', '7-31 Kamikitacho, Nara City', 'Nara'),
  
  ('Narahaku - Nara National Museum & Buddhist Art', 'Museum', 'Specializes in Buddhist sculpture and religious art', 8, 2, 'Museum,art,culture,history,walking', 'https://www.narahaku.com/images/ogp_en.jpg', '34.6892,135.8311', 'Naramachi District & Machiya Houses', 'Nara'),
  
  ('Hiroshima Peace Memorial Park & Atomic Bomb Dome', 'Culture', 'Powerful memorial to peace and WWII atomic bombing', 0, 3, 'HistoricalSite,history,culture,peaceful,views', 'https://hpmmuseum.jp/images/ogp_en.jpg', '34.3958,132.4564', '1-10 Oronocho,Naka Ward', 'Hiroshima'),
  
  ('Hiroshima Castle & Reconstruction', 'Culture', 'Rebuilt castlewithmuseummonWWIIandsamurai history', 5, 2, 'HistoricalSite,history,culture,views', 'https://www.hiroshimacastle.jp/images/ogp_en.jpg', '34.3980,132.4600', '23-1 Motomachi, Naka Ward', 'Hiroshima'),
  
  ('Shukkeien Garden & Teahouses', 'Park', 'Beautiful garden with ponds and pavilions', 3, 2, 'Park,nature,peaceful,views', 'https://www.shukkeien.or.jp/images/ogp_en.jpg', '34.3952,132.4644', '2-11KaminoboriCho', 'Hiroshima'),
  
  ('Fushimi Inari Shrine', 'Temple', 'Famous temple with thousands of vermillion torii gates', 0, 3, 'Temple,spiritual,culture,views', 'https://inari.jp/images/ogp_en.jpg', '34.9671,135.7792', 'Fushimi-ku, Kyoto', 'Kyoto'),
  
  ('Kinkaku-ji (Golden Pavilion)', 'Temple', 'Zen Buddhist temple covered in gold leaf - reflects on mirror pond', 5, 1, 'Temple,spiritual,culture,views', 'https://www.shokoku-ji.jp/kinkakuji/images/ogp_en.jpg', '35.0397,135.7292', '1Kinkakuji-cho, Kita Ward', 'Kyoto'),
  
  ('Arashiyama Bamboo Grove & Tenryu-ji', 'Nature', 'Lush bamboo path and UNESCO World Heritage Zen temple', 5, 2, 'Nature,nature,peaceful,views', 'https://www.tenryu-ji.com/images/ogp_en.jpg', '35.0096,135.6744', 'Sagatenryuji Susukinobaba-cho, Ukyo-ku', 'Kyoto'),
  
  ('Gion District & Geisha Culture', 'Culture', 'Traditional geisha downtown with ochaya teahouses', 0, 2, 'Neighborhood,culture,history,walking', 'https://discoverkansai.com/images/gion_night.jpg', '35.0031,135.7782', 'Gion, Higashiyama Ward', 'Kyoto'),
  
  ('Senso-ji Temple & Nakamise Shopping Arcade', 'Temple', 'Tokyo''s oldest temple with market street leading to shrine gate', 0, 2, 'Temple,spiritual,culture,shopping,local', 'https://www.senso-ji.jp/images/ogp_en.jpg', '35.7147,139.7966', '2-3-1 Asakusa, Taito City', 'Tokyo'),
  
  ('Imperial Palace & East Gardens', 'Culture', 'Historic site of the Emperor''s residence surrounded by moats and gardens', 0, 2, 'HistoricalSite,history,culture,peaceful,views', 'https://www.kunaicho.go.jp/e-about/emperorsresidence.html', '35.6852,139.7528', '1-1 Chiyoda, Chiyoda City', 'Tokyo'),
  
  ('Tsukiji Outer Market&Sushi Breakfast', 'Food', 'Fresh sushi, knives, and seafood stalls — best at dawn', 15, 2, 'Market,food,culture,local', 'https://tsukiji-market.com/images/outer-market.jpg', '35.6658,139.7733', '5-chome Nipponbashi, Chuo City', 'Tokyo'),
  
  ('Harajuku & Takeshita Street', 'Shopping', 'Epicenter of youth fashion, crepes, and quirky trends', 0, 2, 'Market,shopping,culture,food', 'https://harajuku-info.com/wp-content/uploads/takeshita-street.jpg', '35.6700,139.7036', 'Takeshita St, Shibuya City', 'Tokyo'),
  
  ('Osaka Castle & Park', 'Culture', '16th-century fortress with museum and panoramic city views', 8, 2, 'HistoricalSite,history,culture,views', 'https://www.osakacastle.net/images/ogp_en.jpg', '34.6876,135.5246', '1-1 Osakajo, Chuo-ku', 'Osaka'),
  
  ('Dotonbori & Glico Man', 'Entertainment', 'Vibrant street with neon lights, street food, and giant signs', 0, 2, 'Neighborhood,nightlife,food,views', 'https://osaka-info.jp/en/uploads/dotonbori-glico-sign.jpg', '34.6685,135.5031', 'Dotonbori, Chuo Ward', 'Osaka')
) AS t(activity_name, category_name, activity_description, price_from, duration_hours, tags, image_url, coords, activity_address, city_name)
CROSS JOIN LATERAL (SELECT string_to_array(coords, ',')::numeric[] AS coord_array) AS coord_split
CROSS JOIN LATERAL (SELECT coord_array[1] AS activity_lat, coord_array[2] AS activity_lng) AS coord_parsed
LEFT JOIN public.cities ON cities.name = city_name
LEFT JOIN public.activity_categories categories ON categories.name = category_name;