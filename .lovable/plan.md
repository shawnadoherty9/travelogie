# Fix mobile layout so pages fit any screen

## What's wrong (checked at phone width)
- **Explore the World map (home + Tours pages):** the filter panel is a fixed width and sits beside the map, so on phones the map is pushed off the right edge.
- **Languages page:** lesson cards use a fixed 3-column stats row that pushes cards slightly past the screen edge.
- Other pages (Experiences, Destinations) already fit.

## Changes
1. Explore map: stack the filters above the map on phones/tablets; keep side-by-side on desktop. Give the map a sensible fixed height on mobile, and shrink the "sort/near" dropdown and legend so they don't cover the map.
2. Languages cards: let the stats row wrap/shrink on small screens.
3. Guard against stray sideways scrolling site-wide (clip horizontal overflow on the page body).
4. Re-check every main page at phone (375px), tablet (768px) and desktop sizes with screenshots.

## Technical details
- `ExploreMap.tsx`: `flex gap-4` -> `flex flex-col lg:flex-row`; `w-80 shrink-0` -> `w-full lg:w-80`; map wrapper `h-[420px] lg:h-auto min-h-0`; select `w-[140px] sm:w-[180px]`; legend hidden or collapsed below `sm`.
- `Languages.tsx` line ~1132: `grid-cols-3` -> `grid-cols-2 sm:grid-cols-3`, add `min-w-0` to cards.
- `index.css`: `html, body { overflow-x: hidden; }`. Remove unused Vite template `App.css` `#root` max-width/padding if it's imported.
