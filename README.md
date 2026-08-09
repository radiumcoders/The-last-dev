# The Last Developer

> You do not write code. You do not deploy. You choose.

A CRT-styled narrative management game set in 2035. You are the last human decision-maker at Omni Corp. AI employees flood your terminal with requests — approve, refuse, or compromise before the decision window expires. Hesitation damages the company. Sharp calls build a streak. Eventually the system decides what your role was worth.

**Play locally, then survive the shift.**

---

## The premise

Omni Corp replaced almost every human role with AI agents — product, devops, security, design, QA, even the CEO. One terminal still needs a human: yours.

Every day brings requests, disasters, and chain reactions. Keep the company alive by balancing six motives. Let any critical bar collapse and the run ends. Survive long enough and the tone shifts from comedy to chaos to existential dread… then autonomy.

## Motives

| Motive | Why it matters |
| --- | --- |
| **Revenue** | Cashflow. Hits 0 → company dies. |
| **Users** | Active people. Hits 0 → product dies. |
| **Tech Debt** | Mess in the codebase. High = future pain. |
| **Stability** | Uptime & infra health. Low = outages. |
| **Reputation** | Public trust. Low = slower growth. |
| **Morale** | AI employee mood. Low = chaos. |

Hover or tap a choice to preview impact chips before you commit.

## Phases

1. **Comedic** — Absurd requests. Still manageable.
2. **Chaotic** — Disasters stack. Timer tightens.
3. **Existential** — The system questions your purpose.
4. **Autonomous** — AI decides without you. Watch.

Endings include humanity, automation, corporate, and apocalypse — shaped by how you steered the motives.

## How to play

1. Power on the monitor and read the operator briefing.
2. Read each AI request carefully.
3. Preview a choice (hover / tap), then confirm before the timer dies.
4. Decide with **>45%** time left to grow a **SHARP STREAK** — every 3 sharp calls awards morale/reputation.
5. Use help, log, and timeline when the noise gets loud.

### Controls

| Input | Action |
| --- | --- |
| `1`–`4` / `A`–`D` | Choose an option |
| `H` | Help / operator briefing |
| `L` | Event log |
| `T` | Timeline |
| `M` | Mute audio |
| `F` | Fullscreen |
| Touch | Tap to preview · tap again or Confirm · dock for Log / Time / Help |

---

## Stack

- **Next.js 16** (static export) + **React 19**
- **Zustand** for game state
- **Framer Motion** for CRT motion
- **Tailwind CSS 4** for styling
- Procedural + authored event content under `lib/game/`

Built to ship as a static site (Nginx / any static host). On [Zerops](https://zerops.io), `zerops.yaml` defines `dev` (Node tooling) and `prod` (static export) setups.

## Run locally

Requirements: **Node.js 22+**

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
```

Static output lands in `out/` (see `output: 'export'` in `next.config.ts`). Serve that folder with any static file server, or deploy via Zerops using the `prod` setup in `zerops.yaml`.

```bash
# Zerops-oriented production path (from zerops.yaml)
npm ci
npm run build
# deploy contents of out/
```

## Project map

```
app/                 # Next.js app shell + global CRT styles
components/
  crt/               # Terminal chrome, typewriter, scroll panes
  game/              # Boot, shell, panels, overlays, endings
lib/game/
  content/           # Agents, events, disasters, chains, endings
  engine/            # Event engine, phases, consequences
  store.ts           # Zustand store
  fullscreen.ts      # Fullscreen helpers
public/              # Static assets
zerops.yaml          # Dev + prod deploy config
```

## License

MIT
