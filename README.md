# AI Deck

A glass-design learning deck built on the **AI Engineering Metro Map**. The left pane lists every station grouped by metro line (plus a Tools & Certificates hub and your own learnings); the right pane shows the selected topic: summary, key concepts, learning path, free resources, best paid pick, free certificates, YouTube links, a business idea, and your own note and link cards.

## Tech stack
- Next.js 14 (App Router) + React 18 + TypeScript
- Plain CSS (glassmorphism with `backdrop-filter`), fonts via `next/font/google`
- Browser `localStorage` for your notes, links and custom learnings (no backend needed)

## Pages
- **Home** (`/`): what AI Deck is, where to start, how it works, AI words explained
- **Learn** (`/learn`): 38 topics in 7 levels (Foundations → Deep dive) with progress tracking
- **Topic** (`/learn/[id]`): plain-English explanation, then tabs for plan, free courses, certificates, videos, projects, earning ideas and your notes
- **AI Tools** (`/tools`): 150+ tools with search and price filters
- **Certificates** (`/certificates`): every free certificate and paid exam, by provider
- **My Notes** (`/notes`): your notes, links and own topics
- **Glossary** (`/glossary`): AI jargon in plain English

## Project structure
```
app/                 one folder per page (Next.js App Router)
components/          Home, LearnPath, TopicPage, ToolsBrowser, CertBrowser, NotesPage, Nav, Modal, Bits
lib/
  plain.ts           levels, simple explanations, glossary  ← edit wording here
  data.ts            topics: learning steps, courses, videos, business ideas
  extra.ts           AWS / Microsoft / OpenAI badges, open-source repos, AI tools
  catalog.ts         builds the certificate list
  store.tsx          progress, notes and own topics (saved in the browser)
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

## Using AI Deck
- Start on **Learn**, open a topic, read “In simple words”, then work through the tabs.
- Press **Mark as complete** when you finish a topic; progress shows on Home and Learn.
- Use the **My notes** tab on any topic, or the **My Notes** page, to save notes and links.
- Notes and progress are stored in your browser only.

## Editing content
Badges, open-source projects and the AI Tools catalogue live in `lib/extra.ts` (re-check prices and links every quarter).

All topics live in `lib/data.ts`. Each topic has `free`, `paid`, `certs` and `yt` arrays of `[name, url, note]`. For YouTube entries, a plain phrase (not a URL) becomes a YouTube search link.

## Next steps (optional upgrades)
- Sync notes across devices with Supabase (free tier): https://supabase.com
- Add sign-in with NextAuth / Auth.js: https://authjs.dev
- Add progress tracking (mark stations as done) and export notes to Markdown.
