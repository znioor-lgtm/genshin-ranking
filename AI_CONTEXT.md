# GenshinRanking — AI Context

## Goal
- Genshin Impact DPS ranking system for Jussi and Erii with Supabase persistence, Vercel deployment, password auth, charts, wishlist, and banner scraping.

## Constraints & Preferences
- Rank #2 silver, #3 bronze; crown icon (Flaticon 2665606) for #1.
- Dark/light theme toggle with Flaticon sun (66275) and moon (728068), persisted to localStorage.
- UIDs: Jussi `617781814`, Erii `638653766`.
- Supabase table `rankings`: id (int8 PK), created_at (timestamptz), profile (text), char_id (text), char_name (text), dps (numeric), record_id (text).
- Supabase table `wishlist`: id (int8 PK), created_at (timestamptz), profile (text), char_id (text), char_name (text), priority (text default 'medium').
- Shared password `amores2026` for access (set via env ACCESS_PASSWORD or fallback in server.js).
- Vercel auto-deploy from GitHub pushes.
- All requests to /api/* require `x-access-password` header.
- Git at `C:\Program Files\Git\bin\git.exe` (not in PATH on this machine).
- Login screen on page load if no password in sessionStorage.
- Mobile: sidebar hidden, opens via hamburger button; cards centered.

## Progress
### Done
- Silver/bronze CSS variables and rank classes for #2 and #3.
- Crown image for #1 (Flaticon 2665606) and sidebar trophy (Flaticon 8187996).
- Dark/light theme toggle with Flaticon sun/moon, persisted to localStorage.
- UID text for Jussi (617781814) and Erii (638653766) in sidebar.
- Added Zibai (Geo, Sword, 5★) to CHARS and DIRECT_URLS.
- Installed `@supabase/supabase-js` and `cheerio`.
- Supabase persistence for rankings (GET/POST `/api/ranking`), replaces all entries per profile per POST.
- Created `migrate.js` for legacy JSON → Supabase import.
- Git repo at `github.com/znioor-lgtm/genshin-ranking`.
- Vercel project `genshin-ranking-q9ez` at `https://genshin-ranking-q9ez.vercel.app`.
- Shared password auth: `/api/login` endpoint, login overlay, `x-access-password` header on all API calls.
- Auto-sync every 30s (when page visible); `saveRanking()` and `removeEntry()` are async awaiting server confirmation.
- Cache headers set to `no-cache, no-store, must-revalidate` on API and HTML responses.
- Mobile hamburger menu: sidebar slides in/out, overlay click or profile/nav click closes it.
- Charts tab: element distribution, avg DPS by element (strongest highlighted with emoji), weapon distribution, overall comparison between profiles.
- Wishlist tab: char search with priority selector (Alta/Média/Baixa), local + Supabase persistence, sync every 30s.
- Banners tab: fetches `https://game8.co/games/Genshin-Impact/archives/305012`, parses banner tables with cheerio, displays current/next banners with images, characters, and live countdown timers (1s interval).
- Removed duplicate `index.html` at project root.
- Sidebar nav items spacing increased.
- Chart labels use fixed 140px width for alignment.
- Updated nav icons: charts (4367980), wishlist (1828884), banners (1788182 — star), comparativo (4108986).
- Banner countdown: "⏳ Termina em Xd Xh Xm" for current, "📅 Começa em Xd Xh Xm" for next (updates every 1s).

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- Supabase `rankings` uses `record_id` text column for frontend-generated IDs (delete operations).
- Static files in `public/`; index.html read into memory at startup for Vercel compatibility.
- Password auth uses a simple shared string: `ACCESS_PASSWORD` env var or fallback in source.
- Wishlist uses same replace-all pattern as rankings (DELETE + INSERT per profile).
- Banners scraped live from Game8 on each `/api/banners` request (no caching layer).
- Charts and wishlist re-render when sidebar profile switches if their tab is active.

## Next Steps
- (none — pick up where we left off)

## Critical Context
- Vercel deployment URL: `https://genshin-ranking-q9ez.vercel.app`.
- Supabase anon key and URL are hardcoded in server.js (public).
- No environment variables configured on Vercel for Supabase or password (keys in source; ACCESS_PASSWORD defaults to `amores2026`).
- Git commands use full path: `& "C:\Program Files\Git\bin\git.exe" add/commit/push`.
- npm scripts: `npm start` for local dev (port 3002).
- `vercel.json` routes all traffic to `server.js` as a serverless function.
- Banners scraping depends on Game8 page structure; may break if they change their HTML.
- `index.html` at root was deleted — the real one is `public/index.html`.

## Relevant Files
- `C:\Users\xnioo\Downloads\Projetos VSCODE\GenshinRanking\server.js`: Node.js server with Supabase API, image proxy, static files, wishlist API, banner scraping via cheerio.
- `C:\Users\xnioo\Downloads\Projetos VSCODE\GenshinRanking\public\index.html`: All frontend (inline HTML, CSS, JS) — ranking, charts, wishlist, banners, auth, theme, mobile sidebar.
- `C:\Users\xnioo\Downloads\Projetos VSCODE\GenshinRanking\vercel.json`: Routes all traffic to server.js.
- `C:\Users\xnioo\Downloads\Projetos VSCODE\GenshinRanking\.gitignore`: Ignores `node_modules/` and `.vercel`.
- `C:\Users\xnioo\Downloads\Projetos VSCODE\GenshinRanking\package.json`: Dependencies: `@supabase/supabase-js`, `cheerio`.
- `C:\Users\xnioo\Downloads\Projetos VSCODE\GenshinRanking\migrate.js`: Legacy JSON → Supabase migration script.
- `C:\Users\xnioo\Downloads\Projetos VSCODE\GenshinRanking\ranking.json`, `ranking_jussi.json`, `ranking_erii.json`: Legacy data (migrated).
- `C:\Users\xnioo\Downloads\Projetos VSCODE\GenshinRanking\AI_CONTEXT.md`: This file.
