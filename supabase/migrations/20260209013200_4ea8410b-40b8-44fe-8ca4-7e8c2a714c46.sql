-- Add missing event-focused categories
INSERT INTO activity_categories (id, name, description, icon) VALUES
  ('a1b2c3d4-1111-4444-aaaa-111111111111', 'Music & Concerts', 'Live music, concerts, and music festivals', '🎵'),
  ('a1b2c3d4-2222-4444-aaaa-222222222222', 'Theater & Performing Arts', 'Theater, dance, opera, and performing arts', '🎭'),
  ('a1b2c3d4-3333-4444-aaaa-333333333333', 'Art Galleries & Studios', 'Art exhibitions, galleries, and artist studios', '🎨'),
  ('a1b2c3d4-4444-4444-aaaa-444444444444', 'Outdoor & Nature', 'Hiking, nature outings, and outdoor adventures', '🌿'),
  ('a1b2c3d4-5555-4444-aaaa-555555555555', 'Water Sports', 'Surfing, sailing, diving, and water activities', '🏄'),
  ('a1b2c3d4-6666-4444-aaaa-666666666666', 'Sports & Fitness', 'Sports events, fitness activities, and competitions', '⚽')
ON CONFLICT (id) DO NOTHING;