<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# The Rosary Adventures

Cute 8-bit top-down RPG (Phaser 3 inside Next.js) teaching children the 20 Rosary mysteries. Mobile-first.

- **Stage content** (story, NPCs, puzzle, outro for each of the 20 stages): read `stage-scripts.md` before building or changing any stage — it is the source of truth.
- **Roadmap / architecture**: `plan.md`. Tick its checkboxes when you finish an item.
- React ↔ Phaser talk only through `game/EventBus.ts`.

## Art style: one pixel grid

Every in-world graphic is 8-bit pixel art drawn in code, and must look like it belongs next to the player sprite (`game/utils/playerTextureGenerator.ts`). Benchmark: stage 1 (`game/utils/npcTextureGenerator.ts`).

- **Build textures from pixels.** Characters and small items are `PixelMap` string grids painted with `drawMap()`; tiles and big props are integer `rect()` calls. Both live in `game/utils/pixelArt.ts`. Colors come from its `PAL` palette — add a new key there when you need a color, so maps stay readable and the palette stays shared.
- **Characters use the chibi grid**: 32×32 frame, hair rows 6–9, face rows 10–15 (x 11–20), 2×2 eyes rows 12–13, blush row 14, body rows 17–24, feet 25–27, shadow rows 27–29. Flat colors plus one shade color, no outline. Bigger figures widen the canvas and keep the body on the grid (Gabriel: 48×32, body offset x+8, wings mirrored with `drawMap(..., mirror=true)`). Holy figures get a pixel halo ring in the map, not a blur.
- **Scale**: 16px tile grid. Characters ≈ 22px tall; props sized against them (table 48px wide, jar 14×20, scroll 16×16).
- **Light and magic** are stepped too: `glowCanvas()` for glows, `sparkle` texture for twinkles, flat low-alpha fills for beams.
- **Animate with frames, position and alpha** — spritesheet frames (`addSpriteSheet`, 2-frame loops are enough), 1–4px tweens, alpha pulses. Hard guardrail: canvas gradients, arcs/ellipses/curves, fractional coordinates and `setScale` on art all produce smooth/blurry shapes that break the look — draw with integer rects only.
- `game/config.ts` keeps `pixelArt: true` + `roundPixels: true`; camera zoom stays an integer (`BaseMysteryScene.setupCamera`).
- In-world text: Dearpix font, ~10px `fontSize`, `resolution: 4`.

## Scene building

Each stage is a `BaseMysteryScene` subclass in `game/scenes/mysteries/`, registering its textures once via an idempotent `register<Stage>Textures(scene)`.

- **Dress every scene**: a tiled floor, walls or terrain edges, at least one light source (window, lamp, sky), wall/ground decor, a floor accent (rug, path, water), and 4+ props that fit the biblical setting. An empty room of flat rectangles is unfinished.
- **Interactables read at a glance**: glow + sparkle + gentle bob on anything the child can pick up or talk to.
- **Y-sort**: world objects use origin `(0.5, 1)` at the foot and `depth = foot y`; use `this.prop(x, y, key, colW, colH)` (feet-sized collider) and `this.block(...)` for invisible walls. Fixed layers use `DEPTH` from `BaseMysteryScene.ts`.

## Done means seen

A visual change is done when you have looked at it rendered at game zoom beside the player (`npm run dev`, or render the canvas to PNG if no browser is available) and it matches the grid. `drawMap()` throws on ragged rows or unknown palette keys — a clean load is the first check, not the last. Then `npx tsc --noEmit` and `npx eslint game` pass.

## Tone

Vietnamese first (EN supported). Reverent, warm, simple words for children; Scripture quotes cite the reference (e.g. `Lc 1, 26-38`).
