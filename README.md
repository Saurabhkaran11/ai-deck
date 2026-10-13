# AI Deck

A glass-design learning deck built on the **AI Engineering Metro Map**. The left pane lists every station grouped by metro line (plus a Tools & Certificates hub and your own learnings); the right pane shows the selected topic: summary, key concepts, learning path, free resources, best paid pick, free certificates, YouTube links, a business idea, and your own note and link cards.

## Tech stack
- Next.js 14 (App Router) + React 18 + TypeScript
- Plain CSS (glassmorphism with `backdrop-filter`), fonts via `next/font/google`
- Browser `localStorage` for your notes, links and custom learnings (no backend needed)

## Project structure
```
app/
  layout.tsx      fonts + metadata
  page.tsx        renders <AIDeck />
  globals.css     glass theme + layout
components/
  AIDeck.tsx      state, modals, toasts
  Sidebar.tsx     metro-line navigator + search + "Add a learning"
  Detail.tsx      topic detail, resources, "+" menu, user cards
  Modal.tsx       reusable glass form modal
lib/
  data.ts         all topics, links, certificates, business ideas
  extra.ts        AWS / Microsoft Learn / OpenAI badges, open-source repos, AI Tools catalogue
  storage.ts      persisted state hook + URL validation
```

## Setup
1. Install Node.js 18.17 or newer (https://nodejs.org).
2. Unzip the project and open a terminal in the `ai-deck` folder.
3. Install dependencies:
   ```bash
   npm install
   ```

## Run (development)
```bash
npm run dev
```
Open http://localhost:3000.

## Build and run (production)
```bash
npm run build
npm start
```

## Deploy (free)
- **Vercel**: push the folder to GitHub, then import it at https://vercel.com/new. No configuration needed.
- **Netlify**: https://app.netlify.com/start, build command `npm run build`.

## Using the deck
- Click any station on the left to open it on the right.
- Search filters stations by title, summary and concepts.
- **+ Add a learning** (bottom-left) creates your own topic on any line.
- **+** next to "My cards" adds a **Note card** or a **Web link card** to the open topic.
- Delete buttons ask for a second click to confirm.

## Editing content
Badges, open-source projects and the AI Tools catalogue live in `lib/extra.ts` (re-check prices and links every quarter).

All topics live in `lib/data.ts`. Each topic has `free`, `paid`, `certs` and `yt` arrays of `[name, url, note]`. For YouTube entries, a plain phrase (not a URL) becomes a YouTube search link.

## Next steps (optional upgrades)
- Sync notes across devices with Supabase (free tier): https://supabase.com
- Add sign-in with NextAuth / Auth.js: https://authjs.dev
- Add progress tracking (mark stations as done) and export notes to Markdown.
