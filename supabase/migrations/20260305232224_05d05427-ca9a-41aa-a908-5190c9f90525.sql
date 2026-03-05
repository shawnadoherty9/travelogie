-- Fix 1: Make travel-photos bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'travel-photos';

-- Fix 2: Add RLS policy for tour operators to view tours assigned to them
CREATE POLICY "Tour operators can view tours assigned to them"
ON public.personalized_tours
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.tour_operators
    WHERE tour_operators.id = personalized_tours.tour_operator_id
    AND tour_operators.user_id = auth.uid()
  )
);