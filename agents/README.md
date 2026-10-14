# AI Deck resource agents

There are 14 agents: one for each learning level and one for each site feature. Each agent has:

- its own **`agent.env`** config,
- its own **`resources.json`** registry listing every resource it looks after,
- a shared **ledger** that counts what was fetched, researched, added and updated.

The live numbers appear on the website at **`/tracker`**.

Nothing is ever deleted:

- Registries are append-only.
- Agent output is merged *on top of* the hand-written site data (`lib/agent-merge.ts`).
- A rejected candidate stays in the registry for the record.

## The agents

| Agent | Folder | Looks after | May add |
|---|---|---|---|
| Level 1 · Foundations | `level-1-foundations/` | ai-intro, python, math, data, ml-basics, neural-nets | course, paid, video, repo |
| Level 2 · AI basics | `level-2-ai-basics/` | chat, prompting, llm, context, agents | course, paid, video, repo |
| Level 3 · Make AI work for you | `level-3-make-ai-work-for-you/` | rag, memory, mcp, patterns, design | course, paid, video, repo |
| Level 4 · Build AI apps | `level-4-build-ai-apps/` | vectordb, evals, finetune, multiagent, a2a, scale | course, paid, video, repo |
| Level 5 · More AI fields | `level-5-more-ai-fields/` | vision, speech, genmedia, multimodal, recsys, timeseries, robotics | course, paid, video, repo |
| Level 6 · Responsible AI & business | `level-6-responsible-ai-and-business/` | ethics, safety, ai-law, ai-business, ai-product | course, paid, video, repo |
| Level 7 · AI in your industry | `level-7-ai-in-your-industry/` | 10 industry topics | course, paid, video, repo |
| Level 8 · Specialist topics | `level-8-specialist-topics/` | 12 specialist topics | course, paid, video, repo |
| Level 9 · Deep dive | `level-9-deep-dive/` | rl, hnsw, infra, agentic-eng | course, paid, video, repo |
| AI Tools | `tools/` | 14 tool categories (`t-*`) | tool |
| Certificates | `certificates/` | badges on every topic + the cert status board | badge |
| Careers | `careers/` | 16 job tracks | step |
| Projects | `projects/` | business project ideas + their tool/launch links | project |
| Glossary | `glossary/` | "AI words, explained" | glossary |

## Files

```
agents/
├── .env.example              # copy to agents/.env (git-ignored) for the API key
├── cli.ts                    # all commands
├── core/                     # env parser, registry + ledger, link checker, research, site extractor
├── ledger.json               # running totals + activity log (fetched / researched / added / updated)
├── REPORT.md                 # latest report (auto-generated)
├── research-batches/         # JSON batches of researched resources (importable, kept for audit)
└── <agent>/
    ├── agent.env             # this agent's own config: targets, allowed kinds, trusted sources, focus
    └── resources.json        # every resource it owns, with status, link health and history
```

Each entry in `resources.json` has the following fields:

- **`status`**: one of `site`, `pending`, `approved`, `added` or `rejected`.
- **`linkState`**: `ok`, `blocked` or `broken`. `blocked` means the site stops bots; the page itself is up.
- **`http`**: the last HTTP status code.
- **`origin`**: `site`, `research` or `manual`.
- **`history`**: a log of the entry's changes.

## Setup

**Requirements:** Node.js 18.17 or later. Node 20 or 22 is recommended.

1. **Install packages** (the agents run on `tsx`, which is already a dev dependency):

   ```bash
   cd ai-deck
   npm install
   ```

2. **Add your API key.** This is only needed for live research. Every other command works without a key.

   ```bash
   cp agents/.env.example agents/.env
   # then edit agents/.env:
   ANTHROPIC_API_KEY=sk-ant-...
   ```

   - Create a key at https://console.anthropic.com/ (pay as you go).
   - A research run for one agent usually costs a few cents: one request with up to 8 web searches.

## Run

```bash
npm run agents -- list                         # agents, what they own, resource counts
npm run agents -- sync                         # index everything on the site into the registries
npm run agents -- check                        # fetch every URL, record link health  → "fetched"
npm run agents -- check --broken               # re-check only broken links
npm run agents -- research --agent level-3     # find NEW resources with Claude + web search → "researched"
npm run agents -- import agents/research-batches/<file>.json   # add candidates without an API key
npm run agents -- pending                      # review what is waiting
npm run agents -- approve                      # approve pending items whose link checks out
npm run agents -- reject --ids <uid1,uid2>     # reject (kept for the record)
npm run agents -- apply                        # publish approved items to the site → "added"
npm run agents -- report                       # terminal table + REPORT.md + /tracker data
npm run agents -- run --agent level-2          # sync → research → check → (auto-approve) → apply → report
```

`--agent` accepts any of these:

- an agent id: `level-4`, `tools`, `certificates`, `careers`, `projects` or `glossary`;
- a prefix: `level` (selects all 9 level agents);
- `all`.

### Typical weekly routine

```bash
npm run agents -- sync
npm run agents -- check --stale-days 7
npm run agents -- research --agent level
npm run agents -- check --only pending
npm run agents -- pending        # read through, reject anything off-topic
npm run agents -- approve
npm run agents -- apply
npm run agents -- report
npm run build                    # or just commit + push; Vercel rebuilds the site
git add -A && git commit -m "Agents: weekly resources" && git push
```

## How the agents avoid re-searching

The research prompt carries three things:

- the agent's own `agent.env` (its targets, allowed kinds, trusted sources and focus);
- the full list of URLs the agents already know;
- an instruction not to return anything on that list.

Every candidate is also screened locally. It is dropped if:

- it is a duplicate URL or title;
- its kind is not allowed for that agent;
- it targets a topic the agent does not own;
- it does not use an https URL.

**Exception:** career steps and badges may reuse a course URL, because the same course can appear as a step on a job track.

## What the counters mean

| Counter | Meaning |
|---|---|
| **Resources tracked** | Every resource across all registries, both from the site and found by agents |
| **Fetched** | URLs requested by `check`, counted on every run |
| **Researched** | New candidates found by `research` or `import` |
| **Added** | Resources the agents published to the website with `apply` |
| **Updated** | Existing resources whose link state changed (for example, OK → broken) |
| **Pending / Broken** | Waiting for review / links currently failing |

## Adding a new agent or level

- **New level:** add the level to `lib/plain.ts` (`LEVELS`), then run `npm run agents -- init`. This creates the folder and `agent.env` for it and never overwrites existing agents. Then run `npm run agents -- sync`.
- **Custom agent:** create a folder with an `agent.env`. The CLI discovers it automatically.
