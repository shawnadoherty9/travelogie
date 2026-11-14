ALTER FUNCTION public.increment_suggestion_upvotes(uuid) SECURITY DEFINER;
REVOKE EXECUTE ON FUNCTION public.increment_suggestion_upvotes(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_suggestion_upvotes(uuid) TO authenticated;