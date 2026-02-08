# Lobster Tycoon Development Log

## 2026-02-08 — Phase 1: Viral Sharing & Growth Foundation

### Session Summary
Set up a multi-agent team (developer, product manager, marketer, orchestrator) and executed Phase 1 of a viral growth strategy.

### Agent Team Setup
- Created `.claude/agents/developer.md` (Sonnet — full tool access)
- Created `.claude/agents/product-manager.md` (Haiku — read-only + web)
- Created `.claude/agents/marketer.md` (Haiku — read + write + web search)
- Created `.claude/agents/orchestrator.md` (Sonnet — read-only, coordination)
- Created `CLAUDE.md` with project context for all agents

### Strategy & Planning
- **PM + Marketer brainstorm:** Identified top 10 high-ROI features for virality
- Both agents converged on same top 5: share card, challenge links, dramatic moments, rival personalities, leaderboard
- Defined 3-phase rollout: Phase 1 (sharing), Phase 2 (viral loops), Phase 3 (long-term engine)

### Features Built

#### End-of-Run Share Card
- Certificate-style scorecard shown at season end (replaces old duplicate stats screen)
- Shows: final cash, stars, rank, nickname, best day, lbs traded, rival stats, tagline
- Share button (Web Share API on mobile, clipboard fallback on desktop)
- Copy Score button with pre-formatted tweet text
- Files: `index.html`, `css/style.css`, `js/main.js`

#### Dramatic Moment Banners
- 5 banner types: JACKPOT DAY (gold), MEGA HAUL (blue), RIVAL HEIST (red), BIG SALE (green), SPOILAGE ALERT (amber)
- Reusable `showDramaticBanner()` function with queue system
- Initially centered (blocked gameplay) — repositioned to top-of-screen notification style
- Duration reduced from 3.8s to 2.5s, pointer-events: none
- Files: `index.html`, `css/style.css`, `js/main.js`

#### Unified Notification System
- Consolidated 3 separate notification systems (toasts, helper tips, achievement popups) into single `#toast-container`
- All notifications now stack in one column on the right side
- Tips render as gold-bordered toasts with 💡 icon
- Achievements render as tier-colored toasts (bronze/silver/gold/platinum)
- No more overlapping or pile-ups
- Files: `css/style.css`, `js/main.js`

### Bug Fixes

#### Boat Arrival Frequency
- **Problem:** Boats only spawned at day start via RNG. With 1 slot + foggy weather (0.4 modifier), zero boats 64% of the time.
- **Fix:** If zero boats spawned and weather isn't stormy, guarantee one boat. Storms still = 0 boats.
- File: `js/main.js`

#### Season-End Screen Duplication
- **Problem:** Season-end stats and share card showed the same data twice.
- **Fix:** Cleared old stats display, made share card the hero content of the game-over modal.
- Files: `index.html`, `css/style.css`, `js/main.js`

### Marketing Materials Created

#### Reddit Launch Posts
- `marketing/reddit-incremental-games.md` — 415 words, "world's first lobster dealer simulation" angle
- `marketing/reddit-webgames.md` — 160 words, concise with link at top
- Validated against subreddit norms, rewritten from original 1,350-word version

#### Influencer & Press Research
- `marketing/influencer-outreach.md` — 11 YouTubers/streamers (5K-500K subs) + 10 press outlets
- Key targets: Nookrium, Retromation, Splattercat, Northernlion, InterndotGif

#### Outreach Templates
- `marketing/outreach-templates.md` — 3 email templates (small creator, medium creator, press)
- All under 150 words with personalization placeholders

#### Community Strategy
- `marketing/community-strategy.md` — Discord servers, itch.io listing, Twitter/X plan, 2-week timeline

### Commits
1. `1dfd0df` — Add viral sharing features, dramatic banners, and unified notifications
2. `60df88d` — Add influencer research, outreach templates, and community strategy

### Stats
- ~1,270 lines of game code added/modified across 3 files
- ~660 lines of marketing content across 5 files
- 4 agent config files + CLAUDE.md created

---

## Backlog (Future Phases)

### Phase 2 — Viral Loops & Retention
- [ ] "Beat My Score" challenge links (seed-based deterministic replay)
- [ ] Expanded rival personalities (emotional arcs, head-to-head tracker)
- [ ] Daily challenges / bounties system

### Phase 3 — Long-Term Engine
- [ ] Leaderboard (global rankings, monthly resets)
- [ ] Prestige cosmetics (New Game+ rewards)
- [ ] SEO / blog content for organic search
