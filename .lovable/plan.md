# Travel-tip voting after the security changes

## What I checked
- **Casting a vote:** signed-in members can still vote. The voting step runs with full permission, so it can still see every vote, count them all and save the new total on the tip.
- **Vote totals:** everyone, signed in or not, can still see each tip's total, because it's stored on the tip itself.
- **"Already voted" marker:** signed-in members can still see their own votes, so the app still knows which tips they've voted on and stops repeat votes.
- **Signed-out visitors:** they still get the "Please sign in to upvote" message.

## Result
Nothing is broken, so no fix is needed. The security change only stopped people from seeing *other* members' votes, and the voting flow never used that.

## Small tidy-up (optional)
If someone taps vote again on a tip they already voted on, the app shows the correct total but doesn't re-save it on the tip. I'd make that case save the total too, so it stays exact even if it ever drifts.

## Not verified
I can't sign in to your app from here, so I haven't cast a real vote. To confirm, sign in, open the travel map on the home page and vote on a tip: the number should go up by one and "Thanks for your upvote!" should appear.

## Technical details
- `increment_suggestion_upvotes` is SECURITY DEFINER, owned by `postgres` (bypasses RLS), and executable by `authenticated`.
- `travel_suggestion_upvotes`: owner-only SELECT and INSERT policies, matching the client query `.eq('user_id', user.id)`.
- `travel_suggestions`: public SELECT, readable by anon.
- Optional migration: in the `already_voted` branch, also `UPDATE travel_suggestions SET upvotes = new_count`.
