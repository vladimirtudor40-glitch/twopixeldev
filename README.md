# twopixeldev.com

Animated twopixeldev logo → click the logo → login → internal site-management app.

## Run locally

```
npm install
npm run dev
```

Open http://localhost:3000. The logo plays once (~6 s), then the logo becomes clickable and opens the login panel.

## Deploy (Cloudflare Workers)

```
npx wrangler login     # once, opens the browser
npm run deploy         # builds to out/ and uploads it
```

Then in Cloudflare: Workers & Pages → twopixeldev → Settings → Domains & Routes → add `twopixeldev.com` and `www.twopixeldev.com`.

## Accounts + data (Supabase)

1. Create a Supabase project, run `supabase/schema.sql` in the SQL Editor.
2. Authentication → Users → add Vladimir and Eve. Turn off public sign-ups.
3. Copy `.env.example` to `.env.local` and fill in the URL + anon key, then `npm run deploy`.

Without `.env.local` the app runs in DEMO mode (any login works, data stays in the browser).

## Files

- `components/twopixel-intro-engine.ts`: canvas animation engine (`once`, `holdAt`, `onComplete`, `wordmarkBox()`).
- `components/Gate.tsx`: intro → click logo → login.
- `components/LoginPanel.tsx`, `components/Dashboard.tsx`, `components/SiteForm.tsx`: login and the management app (`/app`).
- `lib/backend.ts`: Supabase auth + data (or demo mode). `lib/types.ts`: site fields.

`old-landing/` holds the earlier agency landing page.
