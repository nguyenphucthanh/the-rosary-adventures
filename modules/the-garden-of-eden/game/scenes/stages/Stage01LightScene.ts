import * as Phaser from "phaser";
import { BaseGenesisScene, DEPTH } from "@/modules/the-garden-of-eden/game/scenes/BaseGenesisScene";
import { registerStageTextures } from "@/modules/the-garden-of-eden/game/utils/stageTextures";
import { STAGE_TEXT } from "@/modules/the-garden-of-eden/data/stageText";
import { tr } from "@/modules/the-garden-of-eden/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const T = 16;
const COLS = 33;
const ROWS = 15;
type Dir = 0 | 1 | 2 | 3; // N E S W
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];
type Cell = [number, number];

const SRC: Cell = [5, 1]; // Nguồn Sáng Khởi Nguyên, beam leaves heading south
const CRYSTALS: Cell[] = [[5, 3], [9, 3], [9, 10], [15, 10], [15, 2], [27, 2]];
const SOLUTION: Dir[] = [1, 2, 1, 0, 1, 2]; // facings that chain the beam through all 3 altars
const START_FACE: Dir[] = [0, 3, 0, 2, 3, 1]; // every crystal starts wrong
const ALTARS: Cell[] = [[9, 7], [15, 4], [27, 9]];
const DOORS: Cell[] = [[11, 10], [22, 2]]; // door k opens once altar k is lit
const ZONE_START: Cell[] = [[3, 12], [12, 11], [24, 3]]; // soft-reset points
const ZONE_COLS: Cell[] = [[1, 10], [12, 21], [23, 31]];

const px = (c: number) => c * T + T / 2;
const py = (r: number) => r * T - 1; // sprite y that puts the player's feet-box centre on tile row r
const isDoor = (c: number, r: number) => DOORS.some(([a, b]) => a === c && b === r);
const isWall = (c: number, r: number) =>
  c <= 0 || r <= 0 || c >= COLS - 1 || r >= ROWS - 1 || ((c === 11 || c === 22) && !isDoor(c, r)) || (c === SRC[0] && r === SRC[1]);

/** Follow the beam from the source. Crystals send it out in their facing; altars light up and let it pass. */
function trace(faces: Dir[]) {
  const lit = new Map<number, Dir>();
  const altars = new Set<number>();
  let c = SRC[0], r = SRC[1], d: Dir = 2;
  for (let n = 0; n < 300; n++) {
    c += DX[d];
    r += DY[d];
    if (isWall(c, r)) break;
    lit.set(r * COLS + c, d);
    const ci = CRYSTALS.findIndex(([a, b]) => a === c && b === r);
    if (ci >= 0) d = faces[ci];
    const ai = ALTARS.findIndex(([a, b]) => a === c && b === r);
    if (ai >= 0) altars.add(ai);
  }
  return { lit, altars };
}

/** Stage 1: turn the crystals so one beam of light chains through three Sun Altars and clears the dark. */
export class Stage01LightScene extends BaseGenesisScene {
  private faces: Dir[] = [...START_FACE];
  private fog = new Map<number, Phaser.GameObjects.Image>();
  private lit = new Map<number, Dir>();
  private beam!: Phaser.GameObjects.Graphics;
  private prisms: Phaser.GameObjects.Sprite[] = [];
  private altarSprites: Phaser.GameObjects.Sprite[] = [];
  private gates: ({ body: Phaser.GameObjects.Rectangle; img: Phaser.GameObjects.Image } | null)[] = [];
  private shades: Phaser.GameObjects.Rectangle[] = [];
  private zone = 0;
  private done = false;
  private toldFog = false;
  private pulse = 0;

  constructor() {
    super("Stage01LightScene");
    this.worldWidth = COLS * T;
    this.worldHeight = ROWS * T;
    this.stageKey = "stage_01_anh_sang";
    this.spawn = [px(ZONE_START[0][0]), py(ZONE_START[0][1])];
  }

  create() {
    this.faces = [...START_FACE];
    this.fog = new Map();
    this.prisms = [];
    this.altarSprites = [];
    this.gates = [];
    this.shades = [];
    this.zone = 0;
    this.done = false;
    this.toldFog = false;
    this.intro = { illustration: "light", speaker: STAGE_TEXT.s1.speaker, lines: STAGE_TEXT.s1.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerStageTextures(this);
    this.add.tileSprite(0, 0, this.worldWidth, this.worldHeight, "gen_stone").setOrigin(0).setDepth(DEPTH.FLOOR);

    const wall = (c0: number, r0: number, c1: number, r1: number) => {
      const w = (c1 - c0 + 1) * T, h = (r1 - r0 + 1) * T;
      this.add.tileSprite(c0 * T, r0 * T, w, h, "gen_wall").setOrigin(0).setDepth(DEPTH.RUG);
      this.block(c0 * T + w / 2, r0 * T + h / 2, w, h);
    };
    wall(0, 0, COLS - 1, 0); wall(0, ROWS - 1, COLS - 1, ROWS - 1); wall(0, 1, 0, ROWS - 2); wall(COLS - 1, 1, COLS - 1, ROWS - 2);
    wall(11, 1, 11, 9); wall(11, 11, 11, 13); wall(22, 1, 22, 1); wall(22, 3, 22, 13);

    // darkness still lying over each zone; lifts when that zone's altar is lit
    this.shades = ZONE_COLS.map(([a, b]) =>
      this.add.rectangle(a * T, T, (b - a + 1) * T, (ROWS - 2) * T, 0x1e1b4b, 0.4).setOrigin(0).setDepth(DEPTH.LIGHT)
    );

    this.beam = this.add.graphics().setDepth(DEPTH.LIGHT + 1);

    const src = this.add.image(px(SRC[0]), py(SRC[1] + 1) + 1, "gen_light_src").setOrigin(0.5, 1).setDepth(SRC[1] * T + T);
    this.block(px(SRC[0]), px(SRC[1]), T, T);
    this.add.image(src.x, src.y - 8, "gen_glow_gold").setDepth(DEPTH.LIGHT + 2).setAlpha(0.6);

    // fog = every cell the solved beam will cross (minus crystals, altars, doors): impassable until lit
    trace(SOLUTION).lit.forEach((_, idx) => {
      const c = idx % COLS, r = Math.floor(idx / COLS);
      if (CRYSTALS.some(([a, b]) => a === c && b === r) || ALTARS.some(([a, b]) => a === c && b === r) || isDoor(c, r)) return;
      this.fog.set(idx, this.add.image(px(c), px(r), "gen_fog").setAlpha(0.92).setDepth(DEPTH.LIGHT + 2));
    });

    ALTARS.forEach(([c, r]) => {
      this.altarSprites.push(this.add.sprite(px(c), (r + 1) * T, "gen_sun_altar", 0).setOrigin(0.5, 1).setDepth((r + 1) * T));
      this.block(px(c), px(r), T, T);
    });
    DOORS.forEach(([c, r]) => {
      const img = this.add.image(px(c), px(r), "gen_gate").setDepth(DEPTH.RUG + 1);
      const body = this.add.rectangle(px(c), px(r), T, T);
      this.obstacles.add(body);
      this.gates.push({ body, img });
    });

    CRYSTALS.forEach(([c, r], i) => {
      const glow = this.add.image(px(c), px(r), "gen_glow_gold").setDepth((r + 1) * T - 1).setAlpha(0.3);
      this.tweens.add({ targets: glow, alpha: 0.55, duration: 900, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
      this.prisms.push(this.add.sprite(px(c), px(r), "gen_prism", this.faces[i]).setDepth((r + 1) * T));
      this.block(px(c), px(r), T, T);
      this.interactables.push({
        x: px(c), y: px(r), r: 26, label: tx("[A] Xoay Trụ Tinh Thể", "[A] Turn the Crystal Pillar"),
        act: () => {
          this.faces[i] = ((this.faces[i] + 1) % 4) as Dir;
          this.prisms[i].setFrame(this.faces[i]);
          audio.sfx("select");
          this.refresh();
        },
      });
    });
  }

  protected onStageStart() {
    this.saveCheckpoint("zone0", null, px(ZONE_START[0][0]), py(ZONE_START[0][1]));
    this.refresh();
  }

  /** Retrace the beam, then update light, fog, altars and doors. */
  private refresh() {
    const { lit, altars } = trace(this.faces);
    this.lit = lit;
    this.fog.forEach((img, idx) => img.setVisible(!lit.has(idx)));
    this.altarSprites.forEach((s, i) => s.setFrame(altars.has(i) ? 1 : 0));
    this.shades.forEach((s, i) => s.setVisible(!altars.has(i)));
    this.gates.forEach((g, k) => {
      if (!g || !altars.has(k)) return;
      g.body.destroy();
      this.tweens.add({ targets: g.img, alpha: 0, duration: 500, onComplete: () => g.img.destroy() });
      this.gates[k] = null;
      audio.sfx("door");
    });
    this.drawBeam();
    if (altars.size === ALTARS.length && !this.done) {
      this.done = true;
      audio.sfx("bless");
      ALTARS.forEach(([c, r]) => this.sparkleBurst(px(c), px(r), 8));
      this.time.delayedCall(1200, () => this.finishStage(STAGE_TEXT.s1));
    }
  }

  private drawBeam() {
    const w = this.pulse ? 6 : 4;
    this.beam.clear();
    this.lit.forEach((d, idx) => {
      const x = (idx % COLS) * T, y = Math.floor(idx / COLS) * T;
      this.beam.fillStyle(0xfef08a, 0.3).fillRect(x, y, T, T);
      this.beam.fillStyle(0xffffff, 0.9);
      if (d % 2 === 0) this.beam.fillRect(x + (T - w) / 2, y, w, T);
      else this.beam.fillRect(x, y + (T - w) / 2, T, w);
    });
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (this.introActive) return;
    const p = Math.floor((time ?? 0) / 400) % 2;
    if (p !== this.pulse) {
      this.pulse = p;
      this.drawBeam(); // beam core breathes 2px
    }
    const c = Math.floor(this.player.x / T), r = Math.floor((this.player.y + 9) / T);
    const idx = r * COLS + c;
    if (this.fog.has(idx) && !this.lit.has(idx)) {
      if (!this.toldFog) {
        this.toldFog = true;
        this.time.delayedCall(350, () => this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), [tx("Sương đen còn dày đặc! Hãy để ánh sáng mở đường trước khi em bước vào nhé.", "The black mist is still thick! Let the light clear the way before you step in.")]));
      }
      this.resetToCheckpoint();
    }
    // moving on into a new zone moves the soft-reset point there
    const z = c >= 23 ? 2 : c >= 12 ? 1 : 0;
    if (z > this.zone) {
      this.zone = z;
      this.saveCheckpoint(`zone${z}`, null, px(ZONE_START[z][0]), py(ZONE_START[z][1]));
    }
  }
}
