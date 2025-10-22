-- Fix 1: Create admin-only payment transactions table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  tour_booking_id uuid REFERENCES public.tour_bookings(id) ON DELETE CASCADE,
  stripe_payment_intent_id text,
  stripe_session_id text,
  payment_status text NOT NULL DEFAULT 'pending',
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT one_booking_reference CHECK (
    (booking_id IS NOT NULL AND tour_booking_id IS NULL) OR
    (booking_id IS NULL AND tour_booking_id IS NOT NULL)
  )
);

-- Enable RLS on payment_transactions
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Only admins can access payment transaction details
CREATE POLICY "Only admins can access payment transactions"
ON public.payment_transactions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Migrate existing payment data from bookings table
INSERT INTO public.payment_transactions (booking_id, stripe_payment_intent_id, stripe_session_id, payment_status, amount, currency, created_at, updated_at)
SELECT id, stripe_payment_intent_id, stripe_session_id, payment_status, total_amount, currency, created_at, updated_at
FROM public.bookings
WHERE stripe_payment_intent_id IS NOT NULL OR stripe_session_id IS NOT NULL;

-- Migrate existing payment data from tour_bookings table
INSERT INTO public.payment_transactions (tour_booking_id, stripe_payment_intent_id, stripe_session_id, payment_status, amount, currency, created_at, updated_at)
SELECT id, stripe_payment_intent_id, stripe_session_id, payment_status, total_amount, currency, created_at, updated_at
FROM public.tour_bookings
WHERE stripe_payment_intent_id IS NOT NULL OR stripe_session_id IS NOT NULL;

-- Remove Stripe fields from bookings (keep payment_status for user reference)
ALTER TABLE public.bookings
DROP COLUMN IF EXISTS stripe_payment_intent_id,
DROP COLUMN IF EXISTS stripe_session_id;

-- Remove Stripe fields from tour_bookings (keep payment_status for user reference)
ALTER TABLE public.tour_bookings
DROP COLUMN IF EXISTS stripe_payment_intent_id,
DROP COLUMN IF EXISTS stripe_session_id;

-- Fix 2: Add validation for lesson_recordings to prevent teacher_id manipulation
CREATE OR REPLACE FUNCTION public.validate_lesson_recording()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify teacher_id matches the provider_id from the booking
  IF NOT EXISTS (
    SELECT 1 FROM public.bookings
    WHERE id = NEW.booking_id
    AND provider_id = NEW.teacher_id
  ) THEN
    RAISE EXCEPTION 'Teacher ID does not match the booking provider';
  END IF;
  
  -- Verify student_id matches the customer_id from the booking
  IF NOT EXISTS (
    SELECT 1 FROM public.bookings
    WHERE id = NEW.booking_id
    AND customer_id = NEW.student_id
  ) THEN
    RAISE EXCEPTION 'Student ID does not match the booking customer';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_lesson_recording_trigger
BEFORE INSERT OR UPDATE ON public.lesson_recordings
FOR EACH ROW
EXECUTE FUNCTION public.validate_lesson_recording();

-- Fix 3: Create security definer function to get payment status for users
CREATE OR REPLACE FUNCTION public.get_booking_payment_status(booking_id_param uuid)
RETURNS TABLE (
  payment_status text,
  amount numeric,
  currency text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify user owns the booking as customer or provider
  IF NOT EXISTS (
    SELECT 1 FROM public.bookings
    WHERE id = booking_id_param
    AND (customer_id = auth.uid() OR provider_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT pt.payment_status, pt.amount, pt.currency
  FROM public.payment_transactions pt
  WHERE pt.booking_id = booking_id_param;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_tour_booking_payment_status(tour_booking_id_param uuid)
RETURNS TABLE (
  payment_status text,
  amount numeric,
  currency text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify user owns the tour booking
  IF NOT EXISTS (
    SELECT 1 FROM public.tour_bookings
    WHERE id = tour_booking_id_param
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT pt.payment_status, pt.amount, pt.currency
  FROM public.payment_transactions pt
  WHERE pt.tour_booking_id = tour_booking_id_param;
END;
$$;