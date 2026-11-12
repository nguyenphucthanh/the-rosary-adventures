import * as Phaser from "phaser";
import { BaseJosephScene, DEPTH } from "@/modules/joseph-coat-of-the-sun/game/scenes/BaseJosephScene";
import { STAGE2, tr } from "@/modules/joseph-coat-of-the-sun/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 240;
const FORKS = [10, 20, 30]; // fork column (cells of 16px)
const UP = [true, false, true]; // which pocket holds the cairn at each fork (signposts say so)
const GATE_X = 600;

/** Walkable cells: start yard, a road band, and an up + down pocket at every fork. */
const walkable = (cx: number, cy: number) => {
  if (cx <= 5 && cy >= 3 && cy <= 11) return true;
  if (cy >= 6 && cy <= 8 && cx <= 37) return true;
  if (cx >= 38 && cy >= 5 && cy <= 9) return true;
  return FORKS.some((f) => cx >= f && cx <= f + 3 && ((cy >= 2 && cy <= 5) || (cy >= 9 && cy <= 12)));
};

const pocket = (i: number, up: boolean) => ({ x: FORKS[i] * 16, w: 64, y: up ? 32 : 144, h: 64 });

/** Stage 2 (St 37, 12-17): signposts at three forks; the right pocket has a stone cairn, the wrong one only thorns. Collect 3 cairns to open the way. */
export class Stage02RoadToDothanScene extends BaseJosephScene {
  private cairns = [false, false, false];
  private gate?: { set: (v: boolean) => void };
  private thornCooldown = 0;
  private finished = false;
  private cairnImgs: Phaser.GameObjects.Image[] = [];

  constructor() {
    super("Stage02RoadToDothanScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_02_duong_den_dothan";
    this.spawn = [48, 120];
  }

  create() {
    this.cairns = [false, false, false];
    this.cairnImgs = [];
    this.thornCooldown = 0;
    this.finished = false;
    this.intro = { illustration: "2", speaker: tx("Sách Sáng Thế", "The Book of Genesis"), lines: STAGE2.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    [[0x0284c7, 0, 12], [0x38bdf8, 12, 10]].forEach(([c, y, h]) => this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR));
    this.add.tileSprite(0, 0, W, H, "joseph_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    // sandy road: start yard, main band, pockets, Dothan end
    const road = (x: number, y: number, w: number, h: number) => this.add.tileSprite(x, y, w, h, "joseph_sand").setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    road(0, 48, 96, 144); road(0, 96, 38 * 16, 48); road(38 * 16, 80, 32, 80);
    FORKS.forEach((f) => { road(f * 16, 32, 64, 64); road(f * 16, 144, 64, 64); });
    this.blockMask(walkable, "joseph_cliff");
    this.add.rectangle(0, 0, W, H, 0xfef08a, 0.06).setOrigin(0).setDepth(DEPTH.LIGHT);
    this.initGrace(3);

    // Start yard: Hebron road sign + stranger, a few rocks
    this.prop(20, 70, "joseph_rock", 16, 6);
    this.prop(32, 180, "joseph_rock", 16, 6);
    this.litGlow(76, 140, 26, "joseph_glow_gold");
    this.prop(76, 140, "joseph_stranger", 14, 6);
    this.interactables = [
      { x: 76, y: 130, r: 28, label: tr(STAGE2.strangerHint), act: () => this.talk(tx("Người lạ", "The stranger"), STAGE2.strangerTalk.map(tr)) },
    ];

    FORKS.forEach((f, i) => {
      // signpost just before the fork on the road
      const sx = f * 16 - 14;
      this.prop(sx, 112, "joseph_sign", 10, 6);
      this.interactables.push({ x: sx, y: 100, r: 24, label: tr(STAGE2.signHint), act: () => this.talk(tx("Biển chỉ đường", "Signpost"), [tr(STAGE2.signs[i])]) });
      // right pocket: cairn; wrong pocket: thorns
      const right = pocket(i, UP[i]);
      const wrong = pocket(i, !UP[i]);
      const cy = UP[i] ? 62 : 194;
      this.cairnImgs[i] = this.pickup(right.x + 32, cy, "joseph_cairn");
      this.interactables.push({ x: right.x + 32, y: cy - 8, r: 24, label: tr(STAGE2.cairnHint), active: () => !this.cairns[i], act: () => this.takeCairn(i) });
      const ty = !UP[i] ? 62 : 194;
      [[8, 0], [30, 10], [50, -2]].forEach(([dx, dy]) => this.add.image(wrong.x + dx + 6, ty + dy, "joseph_thorn").setOrigin(0.5, 1).setDepth(ty + dy));
    });

    // Gate of piled rocks until all 3 cairns are found; Dothan's tent beyond
    this.gate = this.door(GATE_X, 120, 16, 48, "joseph_cliff", true);
    this.interactables.push({ x: GATE_X - 14, y: 120, r: 24, label: tr(STAGE2.gateHint), active: () => this.cairns.some((c) => !c), act: () => this.talk(tx("Giuse", "Joseph"), [tr(STAGE2.gateHint)]) });
    this.add.image(624, 112, "joseph_tent").setOrigin(0.5, 1).setDepth(112);
  }

  protected onStageStart() {
    this.setCompanion("joseph_sun");
    this.saveCheckpoint("start", 0, 48, 120);
    this.setBanner(tr(STAGE2.banner).replace("{n}", "0"));
    this.talk(tx("Giuse", "Joseph"), STAGE2.start.map(tr));
  }

  protected onCheckpointRestore() {
    this.player.setVelocity(0, 0);
  }

  private takeCairn(i: number) {
    this.cairns[i] = true;
    audio.sfx("chime");
    this.removePickup(this.cairnImgs[i]);
    const [x, y] = [FORKS[i] * 16 + 32, UP[i] ? 62 : 194];
    this.add.image(x, y, "joseph_cairn").setOrigin(0.5, 1).setDepth(y);
    this.sparkleBurst(x, y - 8, 8);
    const n = this.cairns.filter(Boolean).length;
    this.setBanner(tr(STAGE2.banner).replace("{n}", String(n)));
    this.saveCheckpoint(`cairn${i}`, i, FORKS[i] * 16 + 8, 120);
    this.talk(tx("Giuse", "Joseph"), [tr(STAGE2.cairnGot)], () => {
      if (n === 3) this.openGate();
    });
  }

  private openGate() {
    this.gate?.set(false);
    audio.sfx("bless");
    this.cameras.main.flash(300, 255, 244, 190);
    this.talk(tx("Giuse", "Joseph"), [tr(STAGE2.gateOpen)]);
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    // Thorn dead ends: a prick sends Joseph back to the road
    this.thornCooldown -= delta;
    const p = this.player;
    if (!this.finished && p.x > GATE_X + 16 && this.cairns.every(Boolean)) {
      this.finished = true;
      this.setBanner("");
      this.finishStage(STAGE2);
      return;
    }
    if (this.thornCooldown <= 0 && !this.dialogueOpen && !this.introActive) {
      const hit = FORKS.some((_f, i) => {
        const wrongUp = !UP[i];
        const r = pocket(i, wrongUp);
        return p.x >= r.x && p.x <= r.x + r.w && (wrongUp ? p.y < 60 : p.y > 178);
      });
      if (hit) {
        this.thornCooldown = 1000;
        const f = FORKS.reduce((best, fx) => (Math.abs(fx * 16 + 32 - p.x) < Math.abs(best * 16 + 32 - p.x) ? fx : best), FORKS[0]);
        if (!this.loseGrace()) {
          p.setPosition(f * 16 + 8, 120);
          this.talk(tx("Giuse", "Joseph"), [tr(STAGE2.thorn)]);
        }
      }
    }
  }
}
