DROP POLICY IF EXISTS "Users can view upvotes" ON public.travel_suggestion_upvotes;
CREATE POLICY "Users can view their own upvotes" ON public.travel_suggestion_upvotes FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view all user languages" ON public.user_languages;