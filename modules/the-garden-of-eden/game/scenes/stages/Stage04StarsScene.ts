import * as Phaser from "phaser";
import { BaseGenesisScene, DEPTH, type Interactable } from "@/modules/the-garden-of-eden/game/scenes/BaseGenesisScene";
import { registerStageTextures } from "@/modules/the-garden-of-eden/game/utils/stageTextures";
import { STAGE_TEXT } from "@/modules/the-garden-of-eden/data/stageText";
import { tr } from "@/modules/the-garden-of-eden/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 320;
const H = 240;
const CX = 160;
const CY = 120;
// Phase 1: six slots in 3 mirror pairs (left/right), piece colour = star type
const SLOTS = [
  { x: 64, y: 66, type: 0 }, { x: 64, y: 120, type: 1 }, { x: 64, y: 174, type: 2 },
  { x: 256, y: 66, type: 0 }, { x: 256, y: 120, type: 1 }, { x: 256, y: 174, type: 2 },
];
const LIFE = 8000; // a falling star piece fades after 8 s
// Phase 2: orbits. Angles (deg from the top) = OMEGA * (t - T_ALIGN); everything lines up at t = 4, 10, 16...
const PEDS: [number, number][] = [[48, 48], [272, 48], [272, 192], [48, 192]];
const SEASONS = ["Xuân", "Hạ", "Thu", "Đông"];
const WINDOW = [34, 28, 22, 17]; // Golden Window half-width (deg), narrower each season
const OMEGA = [60, -60, 120]; // sun, moon, stars (deg/s)
const RADII = [24, 40, 56];
const T_ALIGN = 4;
const wrap = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180;

interface Piece { s: Phaser.GameObjects.Image; type: number; born: number; it: Interactable }

/** Stage 4: catch falling Star Pieces into mirrored slots, then lock Sun, Moon and stars at four Time Pedestals. */
export class Stage04StarsScene extends BaseGenesisScene {
  private phase: 0 | 1 | 2 = 0;
  private pieces: Piece[] = [];
  private slotItems: Interactable[] = [];
  private slotImgs: Phaser.GameObjects.Image[] = [];
  private filled: boolean[] = [];
  private carry = -1;
  private carryImg?: Phaser.GameObjects.Image;
  private spawnTimer = 0;
  private bodies: Phaser.GameObjects.Image[] = [];
  private windowGfx?: Phaser.GameObjects.Graphics;
  private clock = 0;
  private season = 0;
  private seasonText?: Phaser.GameObjects.Text;
  private pedImgs: Phaser.GameObjects.Image[] = [];
  private pedGlow: Phaser.GameObjects.Image[] = [];
  private cue?: Phaser.GameObjects.Image;
  private over = false;

  constructor() {
    super("Stage04StarsScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_04_mat_troi_tinh_tu";
    this.spawn = [CX, 150];
  }

  create() {
    this.phase = 0;
    this.pieces = [];
    this.slotItems = [];
    this.slotImgs = [];
    this.filled = SLOTS.map(() => false);
    this.carry = -1;
    this.bodies = [];
    this.pedImgs = [];
    this.pedGlow = [];
    this.pedItems = [];
    this.season = 0;
    this.clock = 0;
    this.over = false;
    this.intro = { illustration: "stars", speaker: STAGE_TEXT.s4.speaker, lines: STAGE_TEXT.s4.intro.map(tr) };
    super.create();
  }

  private label(x: number, y: number, s: string) {
    return this.add.text(x, y, s, { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", resolution: 4 }).setOrigin(0.5).setDepth(DEPTH.FX);
  }

  protected buildWorld() {
    registerStageTextures(this);
    this.add.tileSprite(0, 0, W, H, "gen_obs_floor").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, H).setOrigin(0).setStrokeStyle(4, 0x4c1d95).setDepth(DEPTH.RUG);
    this.block(W / 2, 4, W, 8); this.block(W / 2, H - 4, W, 8); this.block(4, H / 2, 8, H); this.block(W - 4, H / 2, 8, H);
    // star map slots (dim until filled)
    SLOTS.forEach((s) => {
      this.add.rectangle(s.x, s.y, 20, 20).setStrokeStyle(1, 0x7c3aed).setDepth(DEPTH.RUG);
      this.slotImgs.push(this.add.image(s.x, s.y, `gen_star_${s.type}`).setAlpha(0.3).setDepth(DEPTH.RUG + 1));
    });
    this.slotItems = SLOTS.map((s, i) => ({
      x: s.x, y: s.y, r: 26, label: "[A] Đặt Mảnh Tinh Tú", active: () => this.phase === 1 && this.carry >= 0 && !this.filled[i], act: () => this.place(i),
    }));
    this.carryImg = this.add.image(0, 0, "gen_star_0").setVisible(false).setDepth(DEPTH.FX);
    this.spawnDove(CX, 40);
  }

  protected onStageStart() {
    this.phase = 1;
    this.syncItems();
  }

  private syncItems() {
    this.interactables = this.phase === 1 ? [...this.slotItems, ...this.pieces.map((p) => p.it)] : this.interactables.filter((i) => this.pedItems.includes(i));
  }
  private pedItems: Interactable[] = [];

  // ---------------------------------------------------------------- phase 1

  private spawnPiece() {
    const placed = [0, 1, 2].map((t) => SLOTS.filter((s, i) => s.type === t && this.filled[i]).length);
    const need = [0, 1, 2].filter((t) => 2 - placed[t] - this.pieces.filter((p) => p.type === t).length - (this.carry === t ? 1 : 0) > 0);
    if (!need.length) return;
    const type = Phaser.Utils.Array.GetRandom(need);
    let x = 0, y = 0;
    for (let n = 0; n < 12; n++) {
      x = Phaser.Math.Between(40, W - 40);
      y = Phaser.Math.Between(40, H - 40);
      if (SLOTS.every((s) => Math.hypot(s.x - x, s.y - y) > 28)) break;
    }
    const img = this.add.image(x, y - 40, `gen_star_${type}`).setDepth(y);
    this.tweens.add({ targets: img, y, duration: 450, ease: "Stepped", easeParams: [5] }); // falls in
    const p: Piece = {
      s: img, type, born: this.time.now,
      it: { x, y, r: 22, label: "[A] Nhặt Mảnh Tinh Tú", active: () => this.carry < 0, act: () => this.pick(p) },
    };
    this.pieces.push(p);
    this.syncItems();
  }

  private pick(p: Piece) {
    this.carry = p.type;
    audio.sfx("pickup");
    this.carryImg?.setTexture(`gen_star_${p.type}`).setVisible(true);
    this.dropPiece(p);
  }

  private dropPiece(p: Piece) {
    p.s.destroy();
    this.pieces.splice(this.pieces.indexOf(p), 1);
    this.syncItems();
  }

  private place(i: number) {
    if (this.carry !== SLOTS[i].type) {
      audio.sfx("wrong");
      this.talk("Chúa Thánh Thần", ["Mảnh này thuộc về ô cùng màu, ở bên đối xứng. Hãy tìm đúng chỗ nhé!"]);
      return;
    }
    this.filled[i] = true;
    this.carry = -1;
    this.carryImg?.setVisible(false);
    this.slotImgs[i].setAlpha(1).setTint(0xffffff);
    audio.sfx("chime");
    this.sparkleBurst(SLOTS[i].x, SLOTS[i].y, 6);
    if (this.filled.every(Boolean)) {
      this.phase = 0;
      this.syncItems();
      SLOTS.forEach((s) => this.sparkleBurst(s.x, s.y, 8));
      this.time.delayedCall(900, () => this.talk("Chúa Thánh Thần", STAGE_TEXT.s4.phase2.map(tr), () => this.startOrbits()));
    }
  }

  // ---------------------------------------------------------------- phase 2

  private startOrbits() {
    this.phase = 2;
    this.clock = 0;
    this.season = 0;
    this.cue = this.add.image(CX, CY, "gen_glow_gold").setAlpha(0.1).setDepth(DEPTH.RUG + 2);
    RADII.forEach((r, i) => {
      this.add.image(CX, CY, `gen_ring_${r}`).setAlpha(0.7).setDepth(DEPTH.RUG + 2);
      this.bodies.push(this.add.image(CX, CY - r, ["gen_sun", "gen_moon", "gen_starbody"][i]).setDepth(DEPTH.FX - 1));
    });
    this.windowGfx = this.add.graphics().setDepth(DEPTH.RUG + 3);
    this.seasonText = this.label(CX, 22, "");
    PEDS.forEach(([x, y], i) => {
      this.pedImgs.push(this.add.image(x, y, `gen_ped_${i}`).setOrigin(0.5, 1).setDepth(y));
      this.pedGlow.push(this.add.image(x, y - 8, "gen_glow_gold").setDepth(y - 1));
      this.label(x, y + 6, SEASONS[i]);
      this.block(x, y - 6, 14, 10);
    });
    this.pedItems = PEDS.map(([x, y], i) => ({ x, y: y - 6, r: 30, label: `[A] Khóa mùa ${SEASONS[i]}`, active: () => this.phase === 2 && this.season === i, act: () => this.lock() }));
    this.interactables = [...this.pedItems];
    this.showSeason();
  }

  private showSeason() {
    this.seasonText?.setText(this.season < 4 ? `Mùa ${SEASONS[this.season]}: nhấn A ở bệ sáng khi cả ba thiên thể vào Khung Vàng` : "");
    this.pedGlow.forEach((g, i) => g.setAlpha(i === this.season ? 0.7 : 0.05));
    this.pedImgs.forEach((p, i) => p.setAlpha(i < this.season ? 1 : i === this.season ? 1 : 0.5));
    const g = this.windowGfx;
    if (!g || this.season > 3) return g?.clear();
    g.clear().fillStyle(0xfde68a, 0.45);
    const half = (WINDOW[this.season] * Math.PI) / 180;
    RADII.forEach((r) => { // flat bar at the top of each ring, as wide as the window
      const w = Math.max(4, Math.round(2 * r * Math.sin(half)));
      g.fillRect(CX - Math.floor(w / 2), CY - r - 4, w, 8);
    });
  }

  private angles() {
    return OMEGA.map((w) => w * (this.clock - T_ALIGN));
  }
  private aligned(mult = 1) {
    const win = WINDOW[Math.min(this.season, 3)] * mult;
    return this.angles().every((a) => Math.abs(wrap(a)) <= win);
  }

  private lock() {
    if (!this.aligned()) {
      audio.sfx("wrong");
      this.cameras.main.shake(200, 0.006); // the orbits tremble; wait for the next turn
      return;
    }
    audio.sfx("bless");
    this.sparkleBurst(CX, CY, 14);
    this.sparkleBurst(PEDS[this.season][0], PEDS[this.season][1] - 8, 8);
    this.season++;
    this.showSeason();
    if (this.season >= 4 && !this.over) {
      this.over = true;
      this.interactables = [];
      this.time.delayedCall(1100, () => this.finishStage(STAGE_TEXT.s4));
    }
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (this.introActive) return;
    if (this.carryImg?.visible) this.carryImg.setPosition(Math.round(this.player.x), Math.round(this.player.y - 22));
    if (this.dialogueOpen) return;
    const dt = Math.min(delta, 50);

    if (this.phase === 1) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0 && this.pieces.length < 3) {
        this.spawnTimer = 1100;
        this.spawnPiece();
      }
      for (const p of [...this.pieces]) {
        const age = this.time.now - p.born;
        if (age > LIFE) this.dropPiece(p);
        else if (age > LIFE - 3000) p.s.setAlpha(Math.floor(age / 200) % 2 ? 0.35 : 1); // fading: hurry
      }
    } else if (this.phase === 2) {
      this.clock += dt / 1000;
      this.angles().forEach((deg, i) => {
        const a = ((deg - 90) * Math.PI) / 180;
        this.bodies[i].setPosition(Math.round(CX + Math.cos(a) * RADII[i]), Math.round(CY + Math.sin(a) * RADII[i]));
      });
      this.cue?.setAlpha(this.over ? 0.8 : this.aligned() ? 0.7 : this.aligned(2.2) ? 0.3 : 0.1); // glow swells as the bodies near the window
    }
  }
}
