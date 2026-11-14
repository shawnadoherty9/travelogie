# Stop the "Run failed: Registration Flow CI" emails

## What's happening
Every time Lovable saves a change, GitHub runs an automatic check on the sign-up forms. That check fails at its first step, installing the app's building blocks, so GitHub emails you each time.

The cause: when live video sessions were added, the new video packages were recorded in one of the app's package lists but not the other one GitHub uses. GitHub sees the two lists disagree and stops.

Your live site is not affected. Only the automatic check fails.

## Fix
1. Bring the package list GitHub uses up to date so it includes the video packages.
2. Make the check install with the same tool Lovable uses (bun), so the two lists can't drift apart again.
3. Run the same install, type check, lint and tests here to confirm they pass.

After this, new saves should show a green check on GitHub and the failure emails should stop. If you'd rather not get any of these emails, you can delete the automatic check instead, or turn off Actions emails in GitHub's notification settings.

## Technical details
- `npm ci` fails: `@livekit/components-react` and `livekit-client` are missing from `package-lock.json`.
- Switch `.github/workflows/registration-flow-ci.yml` to `oven-sh/setup-bun` + `bun install --frozen-lockfile`. Key the caches on `bun.lock` and run the tsc/eslint/vitest steps through `bunx`.
- Delete the stale `package-lock.json` so it can't fall out of sync again.
