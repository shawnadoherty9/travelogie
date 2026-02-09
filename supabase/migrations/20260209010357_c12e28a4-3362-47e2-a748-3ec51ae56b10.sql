
-- Create event_bookings table for RSVP and paid reservations
CREATE TABLE public.event_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  ticket_count INTEGER NOT NULL DEFAULT 1 CHECK (ticket_count > 0),
  booking_type TEXT NOT NULL DEFAULT 'rsvp' CHECK (booking_type IN ('rsvp', 'paid')),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'pending')),
  confirmation_number TEXT NOT NULL DEFAULT ('EVT-' || substr(gen_random_uuid()::text, 1, 8)),
  total_amount NUMERIC DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_status TEXT NOT NULL DEFAULT 'not_required' CHECK (payment_status IN ('not_required', 'pending', 'completed', 'failed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;

-- Authenticated users can create bookings
CREATE POLICY "Users can create event bookings"
ON public.event_bookings
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Users can view their own bookings
CREATE POLICY "Users can view their own event bookings"
ON public.event_bookings
FOR SELECT
USING (auth.uid() = user_id);

-- Users can cancel their own bookings
CREATE POLICY "Users can update their own event bookings"
ON public.event_bookings
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_event_bookings_updated_at
BEFORE UPDATE ON public.event_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast lookups
CREATE INDEX idx_event_bookings_event_id ON public.event_bookings(event_id);
CREATE INDEX idx_event_bookings_user_id ON public.event_bookings(user_id);
CREATE INDEX idx_event_bookings_confirmation ON public.event_bookings(confirmation_number);
