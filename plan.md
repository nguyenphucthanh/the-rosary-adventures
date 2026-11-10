# Bible Adventures — Technical Plan

Platform hosting multiple browser games. Each game is an independent module; shared engine/UI is reused. Game content/design lives in each module's own `plan.md`.

## 1. Stack
- **Next.js** (App Router, TypeScript, Turbopack). Read `node_modules/next/dist/docs/` before using APIs — this version has breaking changes.
- **Phaser 3** (Arcade Physics) for game canvas. **React + Tailwind CSS 4** for HUD, dialogs, menus.
- **mitt** for the EventBus.
- Mobile-first, desktop supported. i18n: Vietnamese first, English supported.

## 2. Repository layout
```text
app/                         # Routes only — thin pages, metadata, global layout/styles
  layout.tsx                 # Root layout, fonts, viewport
  page.tsx                   # Home: lists games as cards
  <game-slug>/page.tsx       # One route per game; exports metadata, renders the module's root component
modules/
  shared/                    # Reused by 2+ games (no imports from any game module)
    components/              # CharacterCreationModal, CharacterPreview, DialogueBox, VirtualController, DesktopControlHint
    game/                    # EventBus, audio/, entities/Player, utils/pixelArt, utils/playerTextureGenerator
    types.ts                 # CharacterCustomization, DEFAULT_CHARACTER
  <game-slug>/               # One folder per game
    <Game>.tsx               # Client root component mounted by the route
    components/              # Game-only React UI (HUDs, overlays)
    game/                    # config.ts, scenes/, utils/ (game-only textures, helpers)
    data/  types/  utils/    # Game content, save schema, save manager
    plan.md                  # Game roadmap and content design
public/                      # Static assets; public/games/<slug>.png = home card art
```

### Rules
- `app/` holds no game logic. A route = metadata + one import.
- `modules/shared` never imports from a game module. A game may import shared and only itself.
- Promote code to `shared` when a second game needs it, not before.
- Import with the `@/modules/...` alias, not deep relative paths across modules.

## 3. Adding a game
1. Create `modules/<slug>/` with a root client component and its own `game/config.ts`.
2. Add `app/<slug>/page.tsx` exporting `metadata` and rendering the root component.
3. Add a card (title, blurb, tags, image in `public/games/`) to `GAMES` in `app/page.tsx`.
4. Namespace persistent keys (localStorage) per game.
5. Reuse shared pieces; extend them there if a change benefits all games.

## 4. Runtime architecture
- **React ↔ Phaser** talk only through `modules/shared/game/EventBus.ts` (typed events). No direct state sharing.
- **Phaser mount**: client component loaded with `next/dynamic` (`ssr: false`); one `Phaser.Game` per mounted route, destroyed on unmount.
- **Scenes**: a base scene per game holds common movement, collision, camera and save hooks; stages/levels subclass it. Textures registered idempotently per scene.
- **Rendering**: `pixelArt: true`, `roundPixels: true`, integer camera zoom. Art is drawn in code from pixel maps/rects (`pixelArt.ts`), no smoothing, no fractional coordinates.
- **Input**: keyboard + on-screen virtual controller (auto-shown on coarse pointers), both emit through the EventBus.
- **Audio**: single `AudioManager`, unlocked on first user gesture (pointer/touch/key), mute persisted.
- **Layout**: canvas fills `w-screen h-dvh`; HUD overlays are React, `pointer-events-none` except interactive bits.

## 5. Persistence
- Phase 1 (current): `localStorage`, per-game key, JSON export/import as backup.
- Phase 2: auth + cloud DB (Convex/Supabase) behind a save-manager interface so games don't change.

## 6. Quality gates
- `npx tsc --noEmit`, `npx eslint modules app`, `npx next build` pass.
- Visual changes verified rendered at game zoom (see `AGENTS.md`).

## 7. Roadmap
- [x] Multi-game structure: `app/` routes + `modules/shared` + per-game modules.
- [x] Home page with game cards.
- [ ] Move game-neutral audio track mapping out of `shared` (scene→track map is game-specific).
- [ ] Move game-neutral EventBus event types per game (e.g. interlude progress) out of `shared`.
- [ ] Generic base scene in `shared` once a second game needs it.
- [ ] Per-game save-manager interface (cloud-ready).
- [ ] PWA / install-to-homescreen, asset compression, mobile perf pass.
