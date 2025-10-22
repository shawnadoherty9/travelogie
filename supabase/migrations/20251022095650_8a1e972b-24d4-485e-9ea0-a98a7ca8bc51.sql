-- Fix tour operator contact access - require active booking
DROP FUNCTION IF EXISTS public.get_tour_operator_contact(uuid);

CREATE OR REPLACE FUNCTION public.get_tour_operator_contact(operator_id uuid)
RETURNS TABLE(contact_email text, contact_phone text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only return contact info if user has an active or pending booking with this operator
  IF NOT EXISTS (
    SELECT 1
    FROM tour_bookings
    WHERE tour_bookings.tour_operator_id = operator_id
      AND tour_bookings.user_id = auth.uid()
      AND tour_bookings.booking_status IN ('pending', 'confirmed', 'paid')
  ) THEN
    RAISE EXCEPTION 'Access denied: Contact information only available to users with active bookings';
  END IF;

  RETURN QUERY
  SELECT 
    t.contact_email,
    t.contact_phone
  FROM tour_operators t
  WHERE t.id = operator_id 
    AND t.is_active = true;
END;
$$;