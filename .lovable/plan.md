# Tour operator promo videos

## What sign-up collects today
Profile photo, first/last name, birthdate, home city, tour area, one or more tours (title, type, description, hours, price, group size), languages, specialties, and an "About you" bio. No video upload exists.

## What we'll add
1. **Intro video on the operator's profile**: an optional "Introduce yourself" video during sign-up, which they can change later from their dashboard.
2. **Promo video per tour**: each tour they list can have its own optional video.
3. **Travelers see the videos**: on the operator's profile and each tour card, with a play button and a poster image. Videos only play when tapped so pages stay fast on phones.
4. **Limits**: MP4, MOV or WebM, up to 100 MB and about 2 minutes. Upload shows a progress bar, and the form explains clearly if a file is too big or the wrong type.

## Technical details
- New public `tour-videos` storage bucket (100MB limit). Operators can upload to and delete from their own `{user_id}/...` folder only, and anyone can read. Store relative paths in the database.
- Migration: add `intro_video_url text` to `tour_operators` and `video_url text` to `services`. Update `get_public_tour_operators()` so it returns `intro_video_url`.
- New `VideoUpload` component (validation, progress, preview) used in TourOperatorForm (profile + each tour) and in the operator dashboard.
- New `VideoPlayer` component (lazy `<video preload="none">`) on operator/tour displays.
- Add unit tests for the file type, size and length rules.
