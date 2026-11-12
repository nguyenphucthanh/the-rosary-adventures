import * as Phaser from "phaser";
import { BaseJosephScene, DEPTH } from "@/modules/joseph-coat-of-the-sun/game/scenes/BaseJosephScene";
import { STAGE6, tr } from "@/modules/joseph-coat-of-the-sun/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const HALL_W = 176;
const HALLS = 4;
const W = HALL_W * HALLS;
const H = 240;
const TOP = 56; // walkable band y 56..200
const BOTTOM = 200;
const DOOR_DX = [28, 88, 148];
const WHITE = [1, 0, 2, 1]; // which of the 3 doors is the white-light one, per hall
const SHADOW_SPEED = [20, 23, 26, 29];

/** Stage 6 (St 39, 7-20): 4 halls, 3 doors each. Open the WHITE light door; red doors are temptations; a slow dark shadow chases Joseph. */
export class Stage06OpenDoorScene extends BaseJosephScene {
  private hall = 0;
  private running = false;
  private finished = false;
  private shadow!: Phaser.GameObjects.Image;
  private shadowFreeze = 0;

  constructor() {
    super("Stage06OpenDoorScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_06_hanh_lang_cua_mo";
    this.spawn = [HALL_W / 2, 150];
  }

  create() {
    this.hall = 0;
    this.running = this.finished = false;
    this.shadowFreeze = 0;
    this.intro = { illustration: "6", speaker: tx("Sách Sáng Thế", "The Book of Genesis"), lines: STAGE6.intro.map(tr) };
    super.create();
  }

  private hallStart(h: number): [number, number] {
    return [h * HALL_W + 28, 150];
  }

  protected buildWorld() {
    this.add.tileSprite(0, TOP - 4, W, H - TOP + 4, "joseph_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 8, W, TOP - 8, "joseph_brick").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, 8, 0x0f172a).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.3).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(0, 0, W, H, 0x1e1b4b, 0.22).setOrigin(0).setDepth(DEPTH.LIGHT); // dusky palace
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + 4 + H) / 2, W, H - BOTTOM - 4);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    // runner rug per hall
    for (let h = 0; h < HALLS; h++) {
      this.add.rectangle(h * HALL_W + 20, 132, HALL_W - 40, 36, 0x7f1d1d, 0.55).setOrigin(0).setDepth(DEPTH.RUG);
      this.add.rectangle(h * HALL_W + 22, 134, HALL_W - 44, 2, 0xfbbf24, 0.7).setOrigin(0).setDepth(DEPTH.RUG + 1);
      this.add.rectangle(h * HALL_W + 22, 164, HALL_W - 44, 2, 0xfbbf24, 0.7).setOrigin(0).setDepth(DEPTH.RUG + 1);
    }
    // dividers between halls: brick pillars across the band (the only way on is a white door)
    for (let h = 1; h < HALLS; h++) {
      const x = h * HALL_W;
      this.add.tileSprite(x - 6, TOP - 4, 12, BOTTOM - TOP + 8, "joseph_brick").setOrigin(0).setDepth(DEPTH.FLOOR + 2);
      this.block(x, (TOP + BOTTOM) / 2, 12, BOTTOM - TOP + 8);
      this.add.image(x, 110, "joseph_pillar").setOrigin(0.5, 1).setDepth(110);
      this.add.image(x, 200, "joseph_pillar").setOrigin(0.5, 1).setDepth(200);
    }

    // doors: one white (light), two red per hall
    this.interactables = [];
    for (let h = 0; h < HALLS; h++) {
      DOOR_DX.forEach((dx, d) => {
        const x = h * HALL_W + dx;
        const white = WHITE[h] === d;
        this.add.image(x, TOP + 6, white ? "joseph_door_white" : "joseph_door_red").setOrigin(0.5, 1).setDepth(TOP + 6);
        const glow = this.add.image(x, TOP - 14, white ? "joseph_glow_gold" : "joseph_glow_red").setDepth(TOP + 5).setAlpha(white ? 0.9 : 0.5);
        this.tweens.add({ targets: glow, alpha: white ? 1 : 0.3, duration: white ? 700 : 1200, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
        this.interactables.push({
          x, y: TOP + 16, r: 22,
          label: tr(STAGE6.doorHint),
          active: () => this.running && this.hall === h && !this.finished,
          act: () => (white ? this.rightDoor(h) : this.wrongDoor(h)),
        });
      });
    }

    this.shadow = this.add.image(0, 0, "joseph_shadow").setOrigin(0.5, 1).setAlpha(0.8).setVisible(false);
  }

  protected onStageStart() {
    this.setCompanion("joseph_slave");
    this.initGrace(3);
    this.talk(tx("Giuse", "Joseph"), STAGE6.start.map(tr), () => this.beginHall(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.placeShadow(state as number);
  }

  private beginHall(h: number) {
    this.hall = h;
    this.running = true;
    const [x, y] = this.hallStart(h);
    this.saveCheckpoint(`hall${h}`, h, x, y);
    this.placeShadow(h);
    this.setBanner(tr(STAGE6.banner).replace("{n}", String(h + 1)));
  }

  private placeShadow(h: number) {
    this.shadow.setPosition(h * HALL_W + 20, 190).setDepth(190).setVisible(true);
    this.shadowFreeze = 1800;
  }

  private rightDoor(h: number) {
    audio.sfx("door");
    this.sparkleBurst(h * HALL_W + DOOR_DX[WHITE[h]], TOP + 10, 10);
    if (h < HALLS - 1) {
      this.running = false;
      this.talk(tx("Giuse", "Joseph"), [tr(STAGE6.rightDoor)], () => {
        const [x, y] = this.hallStart(h + 1);
        this.player.setVelocity(0, 0);
        this.player.setPosition(x, y);
        this.companion?.setPosition(x - 18, y + 14);
        this.cameras.main.flash(250, 255, 244, 190);
        this.beginHall(h + 1);
      });
      return;
    }
    // last door: the great door. Joseph leaves his outer cloak behind.
    this.finished = true;
    this.running = false;
    this.setBanner("");
    this.shadow.setVisible(false);
    this.player.setMovementLock(true);
    const cx = h * HALL_W + DOOR_DX[WHITE[h]];
    this.add.image(cx + 8, TOP + 24, "joseph_coat_torn").setOrigin(0.5, 1).setDepth(TOP + 24);
    this.cameras.main.flash(500, 255, 255, 255);
    this.talk(tx("Lời kể", "Narrator"), STAGE6.bridge.map(tr), () => {
      this.player.setMovementLock(false);
      this.finishStage(STAGE6);
    });
  }

  private wrongDoor(h: number) {
    audio.sfx("wrong");
    if (this.loseGrace()) return;
    const [x, y] = this.hallStart(h);
    this.player.setVelocity(0, 0);
    this.player.setPosition(x, y);
    this.shadowFreeze = 1500;
    this.talk(tx("Giuse", "Joseph"), [tr(STAGE6.wrongDoor)]);
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (!this.running || this.finished || this.dialogueOpen) return;
    this.shadowFreeze -= delta;
    if (this.shadowFreeze > 0) return;
    const s = this.shadow;
    const p = this.player;
    const d = Phaser.Math.Distance.Between(s.x, s.y, p.x, p.y + 16);
    const step = (SHADOW_SPEED[this.hall] * delta) / 1000;
    if (d > 1) s.setPosition(Math.round(s.x + ((p.x - s.x) / d) * Math.min(step, d)), Math.round(s.y + ((p.y + 16 - s.y) / d) * Math.min(step, d))).setDepth(s.y);
    if (d < 14) {
      audio.sfx("wrong");
      if (this.loseGrace()) return;
      const [x, y] = this.hallStart(this.hall);
      p.setVelocity(0, 0);
      p.setPosition(x, y);
      this.placeShadow(this.hall);
      this.talk(tx("Giuse", "Joseph"), [tr(STAGE6.caught)]);
    }
  }
}
