-- Clean up stale events with dates before 2025
DELETE FROM events WHERE start_date < '2025-01-01';