-- Ensure the INSERT policy is also properly restricted to authenticated users
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;

CREATE POLICY "Authenticated users can create their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated  -- Explicitly restrict to authenticated users only
WITH CHECK (auth.uid() = user_id);

-- Let's also check if we need to remove any default role assignments
-- Remove any policy that might allow anonymous or public access
-- Force all operations to require authentication