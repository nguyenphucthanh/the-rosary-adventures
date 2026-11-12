import * as Phaser from "phaser";
import { BaseJosephScene, DEPTH } from "@/modules/joseph-coat-of-the-sun/game/scenes/BaseJosephScene";
import { STAGE4, tr } from "@/modules/joseph-coat-of-the-sun/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 1400;
const H = 240;
const TOP = 56; // walkable band y 56..200
const BOTTOM = 200;
const END_X = 1340;
const CARAVAN_SPEED = 36; // px/s
const WAIT_GAP = 150; // the caravan waits when the player is this far behind
const OASES = [460, 940];
const JARS: [number, number][] = [[200, 150], [330, 92], [560, 170], [700, 100], [800, 178], [1040, 92], [1160, 160], [1260, 104]];
// obstacles stay off the camel lane (y 112..144) so the caravan is never boxed in
const OBSTACLES: [number, number, "joseph_thorn" | "joseph_rock"][] = [
  [150, 84, "joseph_thorn"], [260, 184, "joseph_rock"], [300, 76, "joseph_rock"], [390, 176, "joseph_thorn"], [520, 84, "joseph_thorn"],
  [610, 190, "joseph_rock"], [660, 80, "joseph_rock"], [760, 186, "joseph_thorn"], [860, 82, "joseph_thorn"], [1010, 188, "joseph_rock"],
  [1100, 78, "joseph_rock"], [1200, 186, "joseph_thorn"], [1290, 82, "joseph_rock"],
];

/** Stage 4 (St 37, 25-36): follow the camel caravan over the desert. Collect water jars, rest at 2 oases (checkpoints), keep up or the caravan waits. */
export class Stage04DesertCaravanScene extends BaseJosephScene {
  private water = 100;
  private running = false;
  private finished = false;
  private camels: Phaser.GameObjects.Sprite[] = [];
  private caravanX = 120;
  private jarImgs: (Phaser.GameObjects.Image | null)[] = [];
  private waiting = false;

  constructor() {
    super("Stage04DesertCaravanScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_04_doan_lai_buon_sa_mac";
    this.spawn = [60, 128];
  }

  create() {
    this.water = 100;
    this.running = this.finished = this.waiting = false;
    this.caravanX = 120;
    this.camels = [];
    this.jarImgs = [];
    this.intro = { illustration: "4", speaker: tx("Sách Sáng Thế", "The Book of Genesis"), lines: STAGE4.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // sky and far dunes
    [[0x38bdf8, 0, 14], [0x7dd3fc, 14, 14], [0xfde68a, 28, 12]].forEach(([c, y, h]) => this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR));
    for (let x = 0; x < W; x += 70) this.add.rectangle(x, 36, 46, 8, 0xd6a84a).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.tileSprite(0, 40, W, H - 40, "joseph_sand").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.18).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(0, 0, W, H, 0xfef08a, 0.07).setOrigin(0).setDepth(DEPTH.LIGHT);
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + H) / 2, W, H - BOTTOM);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);

    // obstacles
    OBSTACLES.forEach(([x, y, k]) => this.prop(x, y, k, 12, 6));

    // oases: pool + palms; resting there refills water and saves a checkpoint
    OASES.forEach((x) => {
      this.add.tileSprite(x - 24, 150, 48, 32, "joseph_pool").setOrigin(0).setDepth(DEPTH.RUG);
      this.add.rectangle(x - 26, 148, 52, 2, 0x16a34a).setOrigin(0).setDepth(DEPTH.RUG);
      this.add.image(x - 34, 150, "joseph_palm").setOrigin(0.5, 1).setDepth(150);
      this.add.image(x + 34, 156, "joseph_palm").setOrigin(0.5, 1).setDepth(156);
      this.block(x, 166, 44, 22);
      this.litGlow(x, 142, 12, "joseph_glow_sky");
      this.interactables.push({ x, y: 138, r: 36, label: tr(STAGE4.oasisHint), active: () => this.running && !this.finished, act: () => this.rest(x) });
    });

    // water jars
    JARS.forEach(([x, y], i) => {
      this.jarImgs[i] = this.pickup(x, y, "joseph_jar");
      this.interactables.push({ x, y: y - 8, r: 24, label: tr(STAGE4.jarHint), active: () => this.running && !!this.jarImgs[i], act: () => this.takeJar(i) });
    });

    // the camel caravan (decor: three camels in a row, 2-frame walk)
    if (!this.anims.exists("joseph_camel_walk")) this.anims.create({ key: "joseph_camel_walk", frames: this.anims.generateFrameNumbers("joseph_camel", { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
    [0, 1, 2].forEach((i) => this.camels.push(this.add.sprite(this.caravanX - i * 54, 130, "joseph_camel").setOrigin(0.5, 1).setDepth(130).play("joseph_camel_walk")));
    this.add.image(END_X + 30, 150, "joseph_palm").setOrigin(0.5, 1).setDepth(150);
  }

  protected onStageStart() {
    this.setCompanion("joseph_slave");
    this.saveCheckpoint("start", 0, 60, 128);
    this.talk(tx("Giuse", "Joseph"), STAGE4.start.map(tr), () => (this.running = true));
  }

  protected onCheckpointRestore() {
    this.water = 100;
  }

  private takeJar(i: number) {
    const img = this.jarImgs[i];
    if (!img) return;
    this.removePickup(img);
    this.jarImgs[i] = null;
    this.water = Math.min(100, this.water + 40);
    audio.sfx("pickup");
    this.sparkleBurst(Math.round(this.player.x), Math.round(this.player.y - 8), 6);
  }

  private rest(x: number) {
    this.water = 100;
    audio.sfx("chime");
    this.saveCheckpoint(`oasis${x}`, x, x, 120);
    this.sparkleBurst(x, 130, 10);
    this.talk(tx("Giuse", "Joseph"), [tr(STAGE4.oasis)]);
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (!this.running || this.finished || this.dialogueOpen) return;
    const dt = delta / 1000;

    // the caravan moves on only while the player keeps up
    this.waiting = this.player.x < this.caravanX - WAIT_GAP;
    if (!this.waiting && this.caravanX < END_X) this.caravanX += CARAVAN_SPEED * dt;
    this.camels.forEach((c, i) => {
      c.setPosition(Math.round(this.caravanX - i * 54), 130).setDepth(130);
      if (this.waiting) c.anims.pause(); else c.anims.resume();
    });

    this.water -= 3.2 * dt;
    this.setBanner(this.waiting ? tr(STAGE4.waitHint) : `${tr(STAGE4.banner)}: ${Math.max(0, Math.round(this.water))}%`);
    if (this.water <= 0) {
      this.running = false;
      this.talk(tx("Giuse", "Joseph"), [tr(STAGE4.thirsty)], () => {
        this.resetToCheckpoint();
        this.running = true;
      });
      return;
    }

    if (this.player.x >= END_X && this.caravanX >= END_X - 4) {
      this.finished = true;
      this.setBanner("");
      this.player.setMovementLock(true);
      this.talk(tx("Lời kể", "Narrator"), STAGE4.bridge.map(tr), () => {
        this.player.setMovementLock(false);
        this.finishStage(STAGE4);
      });
    }
  }
}
