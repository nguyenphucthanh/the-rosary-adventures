import * as Phaser from "phaser";
import { BaseJosephScene, DEPTH } from "@/modules/joseph-coat-of-the-sun/game/scenes/BaseJosephScene";
import { STAGE8, tr } from "@/modules/joseph-coat-of-the-sun/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 480;
const H = 240;
const TOP = 56; // walkable band y 56..200
const BOTTOM = 200;
const PLENTY: [number, number] = [130, 146]; // mat centres
const FAMINE: [number, number] = [350, 146];
const GRANARY: [number, number] = [436, 112];
const PHARAOH: [number, number] = [240, 96];
// 14 cows (7 fat, 7 thin) in a mixed row along the bottom of the hall
const COW_FAT = [true, false, true, true, false, false, true, false, true, false, true, false, false, true];
const COW_X = COW_FAT.map((_, i) => 46 + i * 29);
const COW_Y = 188;
const SHEAF_X = [70, 120, 170, 220, 270, 320, 370];

/** Stage 8 (St 41, 1-36): sort Pharaoh's 14 cows into plenty / famine years, then store 7 sheaves in the granary. */
export class Stage08PharaohDreamScene extends BaseJosephScene {
  private phase = 0;
  private running = false;
  private finished = false;
  private carrying: number | null = null; // cow index (phase 0) or sheaf index (phase 1)
  private sorted: boolean[] = [];
  private cowImgs: (Phaser.GameObjects.Image | null)[] = [];
  private stored: boolean[] = [];
  private sheafImgs: (Phaser.GameObjects.Image | null)[] = [];
  private placed = { plenty: 0, famine: 0 };

  constructor() {
    super("Stage08PharaohDreamScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_08_cung_pharao_bay_bo";
    this.spawn = [240, 150];
  }

  create() {
    this.phase = 0;
    this.running = this.finished = false;
    this.carrying = null;
    this.sorted = COW_FAT.map(() => false);
    this.cowImgs = [];
    this.stored = SHEAF_X.map(() => false);
    this.sheafImgs = [];
    this.placed = { plenty: 0, famine: 0 };
    this.intro = { illustration: "8", speaker: tx("Sách Sáng Thế", "The Book of Genesis"), lines: STAGE8.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    this.add.tileSprite(0, TOP - 4, W, H - TOP + 4, "joseph_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 8, W, TOP - 8, "joseph_brick").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, 8, 0x0f172a).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 40, W, 4, 0x2563eb).setOrigin(0).setDepth(DEPTH.FLOOR + 1); // blue + gold wall band
    this.add.rectangle(0, 44, W, 2, 0xfbbf24).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(0, 0, W, H, 0xfef08a, 0.05).setOrigin(0).setDepth(DEPTH.LIGHT);
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + 4 + H) / 2, W, H - BOTTOM - 4);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);

    // central royal carpet + pillars + throne + Pharaoh
    this.add.rectangle(212, TOP - 4, 56, BOTTOM - TOP + 8, 0x1d4ed8).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(214, TOP - 4, 2, BOTTOM - TOP + 8, 0xfbbf24).setOrigin(0).setDepth(DEPTH.RUG + 1);
    this.add.rectangle(264, TOP - 4, 2, BOTTOM - TOP + 8, 0xfbbf24).setOrigin(0).setDepth(DEPTH.RUG + 1);
    for (const x of [40, 180, 300, 440]) this.add.image(x, TOP + 8, "joseph_pillar").setOrigin(0.5, 1).setDepth(TOP + 8);
    this.prop(PHARAOH[0], PHARAOH[1] - 8, "joseph_throne", 24, 8);
    this.litGlow(PHARAOH[0], PHARAOH[1] + 12, 26, "joseph_glow_gold");
    this.add.image(PHARAOH[0], PHARAOH[1] + 12, "joseph_pharaoh").setOrigin(0.5, 1).setDepth(PHARAOH[1] + 12);
    this.block(PHARAOH[0], PHARAOH[1] + 8, 14, 6);

    // two sorting mats with labels
    const mat = (cx: number, color: number, label: string) => {
      this.add.rectangle(cx - 60, 120, 120, 56, color, 0.55).setOrigin(0).setDepth(DEPTH.RUG);
      this.add.rectangle(cx - 60, 120, 120, 2, 0xfbbf24).setOrigin(0).setDepth(DEPTH.RUG + 1);
      this.add.text(cx, 124, label, { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fef3c7", resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.RUG + 2);
    };
    mat(PLENTY[0], 0xca8a04, tx("NĂM NO", "YEARS OF PLENTY"));
    mat(FAMINE[0], 0x475569, tx("NĂM ĐÓI", "YEARS OF FAMINE"));
    this.prop(GRANARY[0], GRANARY[1] + 24, "joseph_granary", 28, 10);

    // interactables
    this.interactables = [
      { x: PLENTY[0], y: PLENTY[1], r: 46, label: tr(STAGE8.plentyHint), active: () => this.running && this.phase === 0 && this.carrying !== null, act: () => this.dropCow(true) },
      { x: FAMINE[0], y: FAMINE[1], r: 46, label: tr(STAGE8.famineHint), active: () => this.running && this.phase === 0 && this.carrying !== null, act: () => this.dropCow(false) },
      { x: GRANARY[0], y: GRANARY[1] + 28, r: 30, label: tr(STAGE8.granaryHint), active: () => this.running && this.phase === 1 && this.carrying !== null, act: () => this.dropSheaf() },
    ];
    COW_FAT.forEach((fat, i) => {
      this.cowImgs[i] = this.pickup(COW_X[i], COW_Y, fat ? "joseph_cow_fat" : "joseph_cow_thin");
      this.interactables.push({ x: COW_X[i], y: COW_Y - 8, r: 16, label: tr(STAGE8.cowHint), active: () => this.running && this.phase === 0 && this.carrying === null && !this.sorted[i] && !!this.cowImgs[i], act: () => this.pickCow(i) });
    });
  }

  protected onStageStart() {
    this.setCompanion("joseph_freed");
    this.talk(tx("Giuse", "Joseph"), STAGE8.start.map(tr), () => {
      this.running = true;
      this.saveCheckpoint("phase0", 0);
      this.refreshBanner();
    });
  }

  protected onCheckpointRestore() {
    this.player.setVelocity(0, 0);
    this.carrying = null;
    this.setCarry(null);
    // put any cow in hand back on the floor
    COW_FAT.forEach((fat, i) => { if (!this.sorted[i] && !this.cowImgs[i]) this.cowImgs[i] = this.pickup(COW_X[i], COW_Y, fat ? "joseph_cow_fat" : "joseph_cow_thin"); });
    SHEAF_X.forEach((x, i) => { if (this.phase === 1 && !this.stored[i] && !this.sheafImgs[i]) this.sheafImgs[i] = this.pickup(x, COW_Y, "joseph_sheaf"); });
  }

  private refreshBanner() {
    const n = this.phase === 0 ? this.sorted.filter(Boolean).length : this.stored.filter(Boolean).length;
    this.setBanner(tr(STAGE8.banner[this.phase]).replace("{n}", String(n)));
  }

  private pickCow(i: number) {
    const img = this.cowImgs[i];
    if (!img) return;
    this.removePickup(img);
    this.cowImgs[i] = null;
    this.carrying = i;
    this.setCarry(COW_FAT[i] ? "joseph_cow_fat" : "joseph_cow_thin");
    audio.sfx("pickup");
  }

  private dropCow(plenty: boolean) {
    const i = this.carrying;
    if (i === null) return;
    this.carrying = null;
    this.setCarry(null);
    if (COW_FAT[i] !== plenty) {
      // wrong mat: the cow trots back to where it was
      audio.sfx("wrong");
      this.cowImgs[i] = this.pickup(COW_X[i], COW_Y, COW_FAT[i] ? "joseph_cow_fat" : "joseph_cow_thin");
      this.talk(tx("Giuse", "Joseph"), [tr(STAGE8.wrong)]);
      return;
    }
    this.sorted[i] = true;
    audio.sfx("chime");
    const k = plenty ? this.placed.plenty++ : this.placed.famine++;
    const cx = plenty ? PLENTY[0] : FAMINE[0];
    const x = cx - 45 + (k % 4) * 30, y = 150 + Math.floor(k / 4) * 20;
    this.add.image(x, y, COW_FAT[i] ? "joseph_cow_fat" : "joseph_cow_thin").setOrigin(0.5, 1).setDepth(y);
    this.sparkleBurst(x, y - 8, 5);
    this.refreshBanner();
    if (this.sorted.every(Boolean)) this.beginPhase2();
  }

  private beginPhase2() {
    this.running = false;
    this.talk(tx("Giuse", "Joseph"), STAGE8.phase2.map(tr), () => {
      this.phase = 1;
      SHEAF_X.forEach((x, i) => {
        this.sheafImgs[i] = this.pickup(x, COW_Y, "joseph_sheaf");
        this.interactables.push({ x, y: COW_Y - 8, r: 18, label: tr(STAGE8.sheafHint), active: () => this.running && this.phase === 1 && this.carrying === null && !this.stored[i] && !!this.sheafImgs[i], act: () => this.pickSheaf(i) });
      });
      this.running = true;
      this.saveCheckpoint("phase1", 1);
      this.refreshBanner();
    });
  }

  private pickSheaf(i: number) {
    const img = this.sheafImgs[i];
    if (!img) return;
    this.removePickup(img);
    this.sheafImgs[i] = null;
    this.carrying = i;
    this.setCarry("joseph_sheaf");
    audio.sfx("pickup");
  }

  private dropSheaf() {
    const i = this.carrying;
    if (i === null) return;
    this.carrying = null;
    this.setCarry(null);
    this.stored[i] = true;
    audio.sfx("chime");
    this.sparkleBurst(GRANARY[0], GRANARY[1] + 8, 8);
    this.refreshBanner();
    if (this.stored.every(Boolean)) this.finish();
  }

  private finish() {
    this.finished = true;
    this.running = false;
    this.setBanner("");
    audio.sfx("bless");
    this.cameras.main.flash(400, 255, 244, 190);
    this.talk(tx("Giuse", "Joseph"), STAGE8.pharaoh.map(tr), () => this.finishStage(STAGE8));
  }
}
