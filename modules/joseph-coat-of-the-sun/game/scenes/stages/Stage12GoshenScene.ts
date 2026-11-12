import * as Phaser from "phaser";
import { BaseJosephScene, DEPTH } from "@/modules/joseph-coat-of-the-sun/game/scenes/BaseJosephScene";
import { STAGE12, tr } from "@/modules/joseph-coat-of-the-sun/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 240;
const TOP = 56; // walkable band y 56..200
const BOTTOM = 200;
const CAMP_X = 450; // reaching this x starts the reunion
const JACOB: [number, number] = [596, 140];
const WAGON_PARK: [number, number][] = [[414, 176], [366, 176], [318, 176]];
const BROTHERS: [number, number][] = [
  ...[72, 96, 120, 144, 168, 192].map((y): [number, number] => [496, y]),
  ...[84, 108, 132, 156, 180].map((y): [number, number] => [536, y]),
];
const BROTHER_TEX = ["joseph_brother", "joseph_brother_b", "joseph_brother_c"];

/** Stage 12 (St 45; 46; 50, 15-21): lead the wagon train to Goshen, give 11 gifts to the brothers, run to embrace Jacob. */
export class Stage12GoshenScene extends BaseJosephScene {
  private phase = 0;
  private running = false;
  private carrying = false;
  private given: boolean[] = [];
  private wagons: Phaser.GameObjects.Image[] = [];

  constructor() {
    super("Stage12GoshenScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_12_gosen_tha_thu";
    this.spawn = [60, 130];
  }

  create() {
    this.phase = 0;
    this.running = this.carrying = false;
    this.given = BROTHERS.map(() => false);
    this.wagons = [];
    this.intro = { illustration: "12", speaker: tx("Sách Sáng Thế", "The Book of Genesis"), lines: STAGE12.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // morning sky + fertile Goshen pasture with a sandy road
    [[0x0ea5e9, 0, 12], [0x38bdf8, 12, 12], [0xfde68a, 24, 14]].forEach(([c, y, h]) => this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR));
    this.add.tileSprite(0, 36, W, H - 36, "joseph_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 108, 470, 48, "joseph_dirt").setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.tileSprite(460, 60, 180, 150, "joseph_dirt").setOrigin(0).setDepth(DEPTH.FLOOR + 1).setAlpha(0.55);
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.18).setOrigin(0).setDepth(DEPTH.FLOOR + 2);
    this.add.rectangle(0, 0, W, H, 0xfef08a, 0.08).setOrigin(0).setDepth(DEPTH.LIGHT);
    this.wallBelow(0, W, BOTTOM + 4, "joseph_cliff");
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + 4 + H) / 2, W, H - BOTTOM - 4);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    for (const [x, y] of [[40, 80], [180, 70], [300, 84], [140, 190], [250, 196], [440, 74]]) this.add.image(x, y, "joseph_palm").setOrigin(0.5, 1).setDepth(y);
    for (const [x, y] of [[100, 170], [230, 80], [400, 196]]) this.add.image(x, y, "joseph_rock").setOrigin(0.5, 1).setDepth(y);

    // camp: tent, Jacob (glowing), 11 brothers
    this.add.image(612, 100, "joseph_tent").setOrigin(0.5, 1).setDepth(100);
    this.litGlow(JACOB[0], JACOB[1], 26, "joseph_glow_gold");
    this.add.image(JACOB[0], JACOB[1], "joseph_jacob").setOrigin(0.5, 1).setDepth(JACOB[1]);
    BROTHERS.forEach(([x, y], i) => this.add.image(x, y, BROTHER_TEX[i % 3]).setOrigin(0.5, 1).setDepth(y));

    // the wagon train (follows the player until the camp)
    for (let k = 0; k < 3; k++) this.wagons.push(this.add.image(this.spawn![0] - 56 - k * 50, 140, "joseph_wagon").setOrigin(0.5, 1).setDepth(140));

    this.interactables = [
      { x: 366, y: 160, r: 64, label: tr(STAGE12.wagonHint), active: () => this.running && this.phase === 1 && !this.carrying, act: () => this.takeGift() },
      { x: JACOB[0], y: JACOB[1] - 10, r: 28, label: tr(STAGE12.jacobHint), active: () => this.running && this.phase === 2, act: () => this.hug() },
    ];
    BROTHERS.forEach(([x, y], i) => {
      this.interactables.push({ x, y: y - 8, r: 20, label: tr(STAGE12.giveHint), active: () => this.running && this.phase === 1 && this.carrying && !this.given[i], act: () => this.give(i) });
    });
  }

  protected onStageStart() {
    this.setCompanion("joseph_governor");
    this.talk(tx("Giuse", "Joseph"), STAGE12.start.map(tr), () => {
      this.running = true;
      this.saveCheckpoint("road", 0);
      this.setBanner(tr(STAGE12.banner[0]));
    });
  }

  protected onCheckpointRestore() {
    this.player.setVelocity(0, 0);
  }

  private arrive() {
    this.phase = 1;
    this.running = false;
    this.player.setVelocity(0, 0);
    this.wagons.forEach((w, k) => this.tweens.add({ targets: w, x: WAGON_PARK[k][0], y: WAGON_PARK[k][1], duration: 700, ease: "Sine.easeInOut", onUpdate: () => w.setDepth(w.y) }));
    this.saveCheckpoint("camp", 1, CAMP_X, 130);
    this.talk(tx("Giuse", "Joseph"), STAGE12.arrive.map(tr), () => {
      this.running = true;
      this.refreshBanner();
    });
  }

  private refreshBanner() {
    if (this.phase === 1) this.setBanner(tr(STAGE12.banner[1]).replace("{n}", String(this.given.filter(Boolean).length)));
    else this.setBanner(tr(STAGE12.banner[this.phase]));
  }

  private takeGift() {
    this.carrying = true;
    this.setCarry("joseph_sack");
    audio.sfx("pickup");
  }

  private give(i: number) {
    this.carrying = false;
    this.setCarry(null);
    this.given[i] = true;
    audio.sfx("chime");
    this.sparkleBurst(BROTHERS[i][0], BROTHERS[i][1] - 14, 6);
    this.add.image(BROTHERS[i][0] + 12, BROTHERS[i][1] - 2, "joseph_sack").setOrigin(0.5, 1).setDepth(BROTHERS[i][1] + 1);
    if (this.given.every(Boolean)) {
      this.phase = 2;
      this.saveCheckpoint("jacob", 2);
    }
    this.refreshBanner();
  }

  private hug() {
    this.running = false;
    this.setBanner("");
    this.player.setMovementLock(true);
    audio.sfx("bless");
    this.cameras.main.flash(600, 255, 244, 190);
    this.sparkleBurst(JACOB[0], JACOB[1] - 14, 16);
    this.talk(tx("Lời kể", "Narrator"), STAGE12.hug.map(tr), () => {
      this.player.setMovementLock(false);
      this.finishStage(STAGE12);
    });
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (this.phase === 0 && this.running && !this.dialogueOpen) {
      // wagons trail the player, each one behind the one in front
      let lead: { x: number; y: number } = { x: this.player.x, y: this.player.y + 10 };
      this.wagons.forEach((w) => {
        const d = Phaser.Math.Distance.Between(w.x, w.y, lead.x, lead.y);
        if (d > 46) {
          const step = Math.min(d - 46, (120 * delta) / 1000);
          w.setPosition(Math.round(w.x + ((lead.x - w.x) / d) * step), Math.round(w.y + ((lead.y - w.y) / d) * step)).setDepth(w.y);
        }
        lead = w;
      });
      if (this.player.x >= CAMP_X) this.arrive();
    }
  }
}
