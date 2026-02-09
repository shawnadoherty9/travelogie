
-- ═══ Add new countries ═══
INSERT INTO public.countries (name, country_code, timezone, currency) VALUES
  ('France', 'FR', 'Europe/Paris', 'EUR'),
  ('Spain', 'ES', 'Europe/Madrid', 'EUR'),
  ('Italy', 'IT', 'Europe/Rome', 'EUR'),
  ('United Kingdom', 'GB', 'Europe/London', 'GBP'),
  ('Germany', 'DE', 'Europe/Berlin', 'EUR'),
  ('Netherlands', 'NL', 'Europe/Amsterdam', 'EUR'),
  ('Turkey', 'TR', 'Europe/Istanbul', 'TRY'),
  ('Portugal', 'PT', 'Europe/Lisbon', 'EUR'),
  ('Czech Republic', 'CZ', 'Europe/Prague', 'CZK'),
  ('Austria', 'AT', 'Europe/Vienna', 'EUR'),
  ('Greece', 'GR', 'Europe/Athens', 'EUR'),
  ('Vietnam', 'VN', 'Asia/Ho_Chi_Minh', 'VND'),
  ('Malaysia', 'MY', 'Asia/Kuala_Lumpur', 'MYR'),
  ('Singapore', 'SG', 'Asia/Singapore', 'SGD'),
  ('Philippines', 'PH', 'Asia/Manila', 'PHP'),
  ('United Arab Emirates', 'AE', 'Asia/Dubai', 'AED'),
  ('Morocco', 'MA', 'Africa/Casablanca', 'MAD'),
  ('Egypt', 'EG', 'Africa/Cairo', 'EGP'),
  ('South Africa', 'ZA', 'Africa/Johannesburg', 'ZAR'),
  ('Kenya', 'KE', 'Africa/Nairobi', 'KES'),
  ('Mexico', 'MX', 'America/Mexico_City', 'MXN'),
  ('Argentina', 'AR', 'America/Argentina/Buenos_Aires', 'ARS'),
  ('Peru', 'PE', 'America/Lima', 'PEN'),
  ('Colombia', 'CO', 'America/Bogota', 'COP'),
  ('Brazil', 'BR', 'America/Sao_Paulo', 'BRL')
ON CONFLICT DO NOTHING;

-- ═══ Add new cities (using subqueries to get country_id) ═══

-- EUROPE
INSERT INTO public.cities (name, latitude, longitude, timezone, description, country_id) VALUES
  ('Paris', 48.8566, 2.3522, 'Europe/Paris', 'The City of Light — art, gastronomy, and timeless romance', (SELECT id FROM countries WHERE country_code = 'FR')),
  ('Nice', 43.7102, 7.2620, 'Europe/Paris', 'French Riviera gem with azure waters and Belle Époque charm', (SELECT id FROM countries WHERE country_code = 'FR')),
  ('Cannes', 43.5528, 7.0174, 'Europe/Paris', 'Glamorous coastal city famous for its film festival', (SELECT id FROM countries WHERE country_code = 'FR')),
  ('Barcelona', 41.3874, 2.1686, 'Europe/Madrid', 'Gaudí masterpieces, vibrant nightlife, and Mediterranean soul', (SELECT id FROM countries WHERE country_code = 'ES')),
  ('Madrid', 40.4168, -3.7038, 'Europe/Madrid', 'Spain''s capital — world-class museums, tapas, and flamenco', (SELECT id FROM countries WHERE country_code = 'ES')),
  ('Marbella', 36.5101, -4.8826, 'Europe/Madrid', 'Luxurious Costa del Sol resort town with old-world charm', (SELECT id FROM countries WHERE country_code = 'ES')),
  ('Rome', 41.9028, 12.4964, 'Europe/Rome', 'The Eternal City — ancient ruins, Vatican, and dolce vita', (SELECT id FROM countries WHERE country_code = 'IT')),
  ('Venice', 45.4408, 12.3155, 'Europe/Rome', 'Floating city of canals, gondolas, and Renaissance art', (SELECT id FROM countries WHERE country_code = 'IT')),
  ('Milan', 45.4642, 9.1900, 'Europe/Rome', 'Fashion capital with Leonardo''s Last Supper and cutting-edge design', (SELECT id FROM countries WHERE country_code = 'IT')),
  ('Florence', 43.7696, 11.2558, 'Europe/Rome', 'Birthplace of the Renaissance — Uffizi, Duomo, and Tuscan beauty', (SELECT id FROM countries WHERE country_code = 'IT')),
  ('Amalfi Coast', 40.6333, 14.6029, 'Europe/Rome', 'Dramatic cliffside villages along Italy''s most stunning coastline', (SELECT id FROM countries WHERE country_code = 'IT')),
  ('London', 51.5074, -0.1278, 'Europe/London', 'Historic capital blending royal tradition with multicultural energy', (SELECT id FROM countries WHERE country_code = 'GB')),
  ('Edinburgh', 55.9533, -3.1883, 'Europe/London', 'Scotland''s dramatic capital — castles, festivals, and whisky', (SELECT id FROM countries WHERE country_code = 'GB')),
  ('Berlin', 52.5200, 13.4050, 'Europe/Berlin', 'Creative powerhouse with deep history and thriving arts scene', (SELECT id FROM countries WHERE country_code = 'DE')),
  ('Amsterdam', 52.3676, 4.9041, 'Europe/Amsterdam', 'Canal-laced city of Rembrandt, tulips, and cycling culture', (SELECT id FROM countries WHERE country_code = 'NL')),
  ('Istanbul', 41.0082, 28.9784, 'Europe/Istanbul', 'Where East meets West — bazaars, mosques, and Bosphorus views', (SELECT id FROM countries WHERE country_code = 'TR')),
  ('Lisbon', 38.7223, -9.1393, 'Europe/Lisbon', 'Sun-soaked hillside city with fado music and pastel de nata', (SELECT id FROM countries WHERE country_code = 'PT')),
  ('Prague', 50.0755, 14.4378, 'Europe/Prague', 'Fairy-tale city of Gothic spires and bohemian culture', (SELECT id FROM countries WHERE country_code = 'CZ')),
  ('Vienna', 48.2082, 16.3738, 'Europe/Vienna', 'Imperial elegance, classical music, and Viennese coffee houses', (SELECT id FROM countries WHERE country_code = 'AT')),
  ('Athens', 37.9838, 23.7275, 'Europe/Athens', 'Cradle of Western civilization with the Acropolis and vibrant streets', (SELECT id FROM countries WHERE country_code = 'GR'))
ON CONFLICT DO NOTHING;

-- SOUTHEAST ASIA
INSERT INTO public.cities (name, latitude, longitude, timezone, description, country_id) VALUES
  ('Hanoi', 21.0278, 105.8342, 'Asia/Ho_Chi_Minh', 'Vietnam''s ancient capital — temples, street food, and Old Quarter charm', (SELECT id FROM countries WHERE country_code = 'VN')),
  ('Ho Chi Minh City', 10.8231, 106.6297, 'Asia/Ho_Chi_Minh', 'Dynamic southern metropolis blending French colonial and modern energy', (SELECT id FROM countries WHERE country_code = 'VN')),
  ('Kuala Lumpur', 3.1390, 101.6869, 'Asia/Kuala_Lumpur', 'Petronas Towers and a melting pot of Malay, Chinese, and Indian cultures', (SELECT id FROM countries WHERE country_code = 'MY')),
  ('Singapore', 1.3521, 103.8198, 'Asia/Singapore', 'Garden city-state with world-class dining and futuristic architecture', (SELECT id FROM countries WHERE country_code = 'SG')),
  ('Manila', 14.5995, 120.9842, 'Asia/Manila', 'Vibrant Philippine capital with rich Spanish colonial heritage', (SELECT id FROM countries WHERE country_code = 'PH')),
  ('Phuket', 7.8804, 98.3923, 'Asia/Bangkok', 'Thailand''s island paradise — beaches, temples, and Thai boxing', (SELECT id FROM countries WHERE country_code = 'TH'))
ON CONFLICT DO NOTHING;

-- Also add Osaka, Hiroshima, Sapporo, Nara (Japan) that were fetched before but may not be in cities table
INSERT INTO public.cities (name, latitude, longitude, timezone, description, country_id) VALUES
  ('Osaka', 34.6937, 135.5023, 'Asia/Tokyo', 'Japan''s kitchen — street food paradise and vibrant nightlife', (SELECT id FROM countries WHERE country_code = 'JP')),
  ('Hiroshima', 34.3853, 132.4553, 'Asia/Tokyo', 'Peace Memorial City with stunning Miyajima island nearby', (SELECT id FROM countries WHERE country_code = 'JP')),
  ('Sapporo', 43.0618, 141.3545, 'Asia/Tokyo', 'Hokkaido''s capital — snow festivals, ramen, and natural beauty', (SELECT id FROM countries WHERE country_code = 'JP')),
  ('Nara', 34.6851, 135.8048, 'Asia/Tokyo', 'Ancient capital with friendly deer and magnificent temples', (SELECT id FROM countries WHERE country_code = 'JP'))
ON CONFLICT DO NOTHING;

-- MIDDLE EAST & AFRICA
INSERT INTO public.cities (name, latitude, longitude, timezone, description, country_id) VALUES
  ('Dubai', 25.2048, 55.2708, 'Asia/Dubai', 'Futuristic desert metropolis with luxury shopping and cultural contrasts', (SELECT id FROM countries WHERE country_code = 'AE')),
  ('Marrakech', 31.6295, -7.9811, 'Africa/Casablanca', 'Red city of souks, riads, and Atlas Mountain views', (SELECT id FROM countries WHERE country_code = 'MA')),
  ('Cairo', 30.0444, 31.2357, 'Africa/Cairo', 'City of the Pharaohs — pyramids, bazaars, and Nile cruises', (SELECT id FROM countries WHERE country_code = 'EG')),
  ('Cape Town', -33.9249, 18.4241, 'Africa/Johannesburg', 'Table Mountain, vineyards, and where two oceans meet', (SELECT id FROM countries WHERE country_code = 'ZA')),
  ('Nairobi', -1.2921, 36.8219, 'Africa/Nairobi', 'Gateway to safari country with a thriving creative scene', (SELECT id FROM countries WHERE country_code = 'KE'))
ON CONFLICT DO NOTHING;

-- LATIN AMERICA
INSERT INTO public.cities (name, latitude, longitude, timezone, description, country_id) VALUES
  ('Mexico City', 19.4326, -99.1332, 'America/Mexico_City', 'Ancient Aztec roots meet world-class cuisine and muralism', (SELECT id FROM countries WHERE country_code = 'MX')),
  ('Buenos Aires', -34.6037, -58.3816, 'America/Argentina/Buenos_Aires', 'Tango, steak, and the Paris of South America', (SELECT id FROM countries WHERE country_code = 'AR')),
  ('Lima', -12.0464, -77.0428, 'America/Lima', 'Gastronomic capital of the Americas with Incan heritage', (SELECT id FROM countries WHERE country_code = 'PE')),
  ('Bogotá', 4.7110, -74.0721, 'America/Bogota', 'High-altitude capital with colonial charm and street art culture', (SELECT id FROM countries WHERE country_code = 'CO')),
  ('Rio de Janeiro', -22.9068, -43.1729, 'America/Sao_Paulo', 'Christ the Redeemer, Copacabana, and samba rhythms', (SELECT id FROM countries WHERE country_code = 'BR')),
  ('Cartagena', 10.3910, -75.5364, 'America/Bogota', 'Walled colonial city on the Caribbean with vibrant culture', (SELECT id FROM countries WHERE country_code = 'CO'))
ON CONFLICT DO NOTHING;
