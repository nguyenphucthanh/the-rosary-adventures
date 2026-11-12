import * as Phaser from "phaser";
import { BaseJosephScene, DEPTH } from "@/modules/joseph-coat-of-the-sun/game/scenes/BaseJosephScene";
import { STAGE3, tr } from "@/modules/joseph-coat-of-the-sun/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 900;
const H = 240;
const TOP = 56; // pasture walkable band y 56..200
const BOTTOM = 200;
const PASTURE_W = 520;
const CALMS = 6;
const SPAWN_YS = [90, 128, 166];
const BROTHER_KEYS = ["joseph_brother", "joseph_brother_b", "joseph_brother_c"];
// The well chamber sits far right; the camera is re-bounded to it so the pasture never shows.
const CH = { x: 672, y: 44, w: 176, h: 152 };
const ROPES: [number, number][] = [[708, 152], [812, 98], [742, 90]];
const CHAMBER_SPAWN: [number, number] = [760, 150];

interface Brother {
  spr: Phaser.GameObjects.Image;
  state: "hidden" | "approach" | "away";
  x: number;
  y: number;
}

/** Stage 3 (St 37, 18-28): pray to calm six angry brothers, get lowered into the well, then join 3 ropes and climb out. Non-violent. */
export class Stage03DryWellScene extends BaseJosephScene {
  private phase = 0;
  private running = false;
  private finished = false;
  private calmed = 0;
  private spawnTimer = 1500;
  private brothers: Brother[] = [];
  private ropes = [false, false, false];
  private ropeImgs: Phaser.GameObjects.Image[] = [];

  constructor() {
    super("Stage03DryWellScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_03_gieng_can_dothan";
    this.spawn = [180, 128];
  }

  create() {
    this.phase = 0;
    this.running = this.finished = false;
    this.calmed = 0;
    this.spawnTimer = 1500;
    this.brothers = [];
    this.ropes = [false, false, false];
    this.ropeImgs = [];
    this.intro = { illustration: "3", speaker: tx("Sách Sáng Thế", "The Book of Genesis"), lines: STAGE3.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // ---- pasture (phase 0)
    [[0x0284c7, 0, 12], [0x38bdf8, 12, 10], [0xbae6fd, 22, 12]].forEach(([c, y, h]) => this.add.rectangle(0, y, PASTURE_W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR));
    this.add.tileSprite(0, 34, PASTURE_W, TOP - 30, "joseph_cliff").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, TOP - 4, PASTURE_W, H - TOP + 4, "joseph_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, TOP - 8, PASTURE_W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, PASTURE_W, H, 0xfef08a, 0.05).setOrigin(0).setDepth(DEPTH.LIGHT);
    this.block(PASTURE_W / 2, TOP / 2, PASTURE_W, TOP);
    this.block(PASTURE_W / 2, (BOTTOM + 4 + H) / 2, PASTURE_W, H - BOTTOM - 4);
    this.block(8, H / 2, 16, H);
    this.block(PASTURE_W + 8, H / 2, 16, H);
    this.prop(250, 118, "joseph_well", 28, 10); // the dry well
    for (const [x, y] of [[90, 80], [420, 84], [120, 190], [470, 190]]) this.add.image(x, y, "joseph_rock").setOrigin(0.5, 1).setDepth(y);
    for (const [x, y] of [[50, 100], [360, 190], [500, 76]]) this.add.image(x, y, "joseph_thorn").setOrigin(0.5, 1).setDepth(y);

    // brothers (hidden until they approach)
    BROTHER_KEYS.forEach((k) => this.brothers.push({ spr: this.add.image(0, 0, k).setOrigin(0.5, 1).setVisible(false), state: "hidden", x: 0, y: 0 }));
    this.interactables = [{
      x: 0, y: 0, r: 0, label: tr(STAGE3.prayHint),
      active: () => false, act: () => this.pray(),
    }];
    ROPES.forEach(([x, y], i) => {
      this.interactables.push({ x, y: y - 6, r: 24, label: tr(STAGE3.ropeHint), active: () => this.phase === 1 && !this.ropes[i], act: () => this.takeRope(i) });
    });
    this.interactables.push({ x: CHAMBER_SPAWN[0], y: 146, r: 28, label: tr(STAGE3.joinHint), active: () => this.phase === 1 && this.running && !this.finished, act: () => this.join() });

    // ---- well chamber (phase 1), far right
    this.add.tileSprite(CH.x, CH.y, CH.w, CH.h, "joseph_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(CH.x, CH.y, CH.w, CH.h, 0x0f172a, 0.4).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    for (const [x, y, w, h] of [[CH.x - 16, CH.y - 16, CH.w + 32, 16], [CH.x - 16, CH.y + CH.h, CH.w + 32, 16], [CH.x - 16, CH.y, 16, CH.h], [CH.x + CH.w, CH.y, 16, CH.h]]) {
      this.add.tileSprite(x, y, w, h, "joseph_cliff").setOrigin(0).setDepth(DEPTH.RUG);
      this.block(x + w / 2, y + h / 2, w, h);
    }
    // shaft of daylight from the round opening above
    this.add.rectangle(CH.x + 70, CH.y, 36, 8, 0x7dd3fc).setOrigin(0).setDepth(DEPTH.RUG + 1);
    this.add.graphics().setDepth(DEPTH.LIGHT).fillStyle(0xfef9c3, 0.14).fillPoints([{ x: CH.x + 70, y: CH.y + 8 }, { x: CH.x + 106, y: CH.y + 8 }, { x: CH.x + 130, y: CH.y + CH.h }, { x: CH.x + 46, y: CH.y + CH.h }], true);
    ROPES.forEach(([x, y]) => this.ropeImgs.push(this.pickup(x, y, "joseph_rope")));
    this.add.image(CHAMBER_SPAWN[0], 146, "joseph_slot").setOrigin(0.5, 1).setDepth(145).setAlpha(0.6);
  }

  protected onStageStart() {
    this.setCompanion("joseph_sun");
    this.initGrace(3);
    this.talk(tx("Giuse", "Joseph"), STAGE3.start.map(tr), () => {
      this.phase = 0;
      this.running = true;
      this.saveCheckpoint("phase0", 0, 180, 128);
      this.refreshBanner();
    });
  }

  protected onCheckpointRestore() {
    this.brothers.forEach((b) => this.hide(b));
    this.spawnTimer = 1500;
  }

  private refreshBanner() {
    const n = this.phase === 0 ? this.calmed : this.ropes.filter(Boolean).length;
    this.setBanner(tr(STAGE3.phase[this.phase]).replace("{n}", String(n)));
  }

  private hide(b: Brother) {
    b.state = "hidden";
    b.spr.setVisible(false);
  }

  /** The brother in reach of the player, if any (prayer calms him). */
  private nearBrother(): Brother | undefined {
    return this.brothers.find((b) => b.state === "approach" && Phaser.Math.Distance.Between(b.x, b.y, this.player.x, this.player.y) < 64);
  }

  private pray() {
    const b = this.nearBrother();
    if (!b) return;
    b.state = "away";
    this.calmed++;
    audio.sfx("chime");
    this.sparkleBurst(Math.round(this.player.x), Math.round(this.player.y - 8), 8);
    this.refreshBanner();
    if (this.calmed >= CALMS) this.taken();
  }

  private taken() {
    this.running = false;
    this.setBanner("");
    this.player.setMovementLock(true);
    this.brothers.forEach((b) => this.hide(b));
    this.talk(tx("Giuse", "Joseph"), STAGE3.taken.map(tr), () => {
      this.setCompanion("joseph_slave"); // the coat is taken
      this.add.image(260, 112, "joseph_coat_torn").setOrigin(0.5, 1).setDepth(112);
      const cam = this.cameras.main;
      cam.fadeOut(500, 0, 0, 0);
      cam.once("camerafadeoutcomplete", () => this.enterWell());
    });
  }

  private enterWell() {
    const cam = this.cameras.main;
    this.phase = 1;
    this.initGrace(0);
    // bounds exactly one screen big and centred on the chamber, so the camera sits still on it
    const vw = Math.max(CH.w, cam.width / cam.zoom), vh = Math.max(CH.h, cam.height / cam.zoom);
    cam.setBounds(Math.round(CH.x + CH.w / 2 - vw / 2), Math.round(CH.y + CH.h / 2 - vh / 2), Math.round(vw), Math.round(vh));
    this.player.setPosition(CHAMBER_SPAWN[0], CHAMBER_SPAWN[1]);
    this.companion?.setPosition(CHAMBER_SPAWN[0] - 18, CHAMBER_SPAWN[1] + 14);
    this.saveCheckpoint("well", 1, CHAMBER_SPAWN[0], CHAMBER_SPAWN[1]);
    this.player.setMovementLock(false);
    cam.fadeIn(500, 0, 0, 0);
    this.refreshBanner();
    this.talk(tx("Giuse", "Joseph"), [...STAGE3.wellStart.map(tr), tr(STAGE3.pray)], () => { this.running = true; });
  }

  private takeRope(i: number) {
    this.ropes[i] = true;
    audio.sfx("pickup");
    this.removePickup(this.ropeImgs[i]);
    this.refreshBanner();
  }

  private join() {
    if (this.ropes.some((r) => !r)) return this.talk(tx("Giuse", "Joseph"), [tr(STAGE3.needRopes)]);
    this.finished = true;
    this.running = false;
    this.setBanner("");
    audio.sfx("bless");
    this.cameras.main.flash(400, 255, 244, 190);
    this.sparkleBurst(CHAMBER_SPAWN[0], 130, 12);
    this.finishStage(STAGE3);
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (this.phase !== 0 || !this.running || this.dialogueOpen) return;

    // keep the single "pray" interactable glued to the nearest approaching brother
    const near = this.nearBrother();
    const it = this.interactables[0];
    it.x = near?.x ?? 0;
    it.y = (near?.y ?? 0) - 10;
    it.r = near ? 66 : 0;
    it.active = () => !!this.nearBrother();

    // spawn one brother at a time from the east edge
    const live = this.brothers.some((b) => b.state === "approach");
    if (!live && this.calmed < CALMS) {
      this.spawnTimer -= delta;
      if (this.spawnTimer <= 0) {
        const b = this.brothers.find((o) => o.state === "hidden") ?? this.brothers[0];
        b.state = "approach";
        b.x = PASTURE_W - 24;
        b.y = SPAWN_YS[this.calmed % SPAWN_YS.length];
        b.spr.setTexture(BROTHER_KEYS[this.calmed % BROTHER_KEYS.length]).setVisible(true);
        this.spawnTimer = 1400;
      }
    }

    for (const b of this.brothers) {
      if (b.state === "hidden") continue;
      const tx2 = b.state === "approach" ? this.player.x : PASTURE_W - 12;
      const ty = b.state === "approach" ? this.player.y : b.y;
      const d = Phaser.Math.Distance.Between(b.x, b.y, tx2, ty);
      const step = ((b.state === "approach" ? 30 : 60) * delta) / 1000;
      if (d > 1) {
        b.x = Math.round(b.x + ((tx2 - b.x) / d) * Math.min(step, d));
        b.y = Math.round(b.y + ((ty - b.y) / d) * Math.min(step, d));
      }
      b.spr.setPosition(b.x, b.y).setDepth(b.y).setFlipX(tx2 < b.x);
      if (b.state === "away" && b.x >= PASTURE_W - 16) this.hide(b);
      if (b.state === "approach" && d < 14) {
        b.state = "away"; // he reached Joseph: peace slips, he storms off and returns later
        this.startle(b);
        this.loseGrace();
      }
    }
  }

  private startle(b: Brother) {
    this.cameras.main.shake(100, 0.003);
    this.sparkleBurst(Math.round(b.x), Math.round(b.y - 10), 4);
  }
}
