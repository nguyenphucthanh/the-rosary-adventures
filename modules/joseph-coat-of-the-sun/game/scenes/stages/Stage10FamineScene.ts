import * as Phaser from "phaser";
import { BaseJosephScene, DEPTH } from "@/modules/joseph-coat-of-the-sun/game/scenes/BaseJosephScene";
import { STAGE10, tr } from "@/modules/joseph-coat-of-the-sun/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 480;
const H = 240;
const TOP = 56; // walkable band y 56..200
const BOTTOM = 200;
const STORE: [number, number] = [64, 118];

type Kind = "child" | "elder" | "adult";
// 8 people in two columns; weak ones are mixed in so order matters
const PEOPLE: { x: number; y: number; kind: Kind; tex: string }[] = [
  { x: 290, y: 100, kind: "adult", tex: "joseph_egyptian" },
  { x: 360, y: 100, kind: "elder", tex: "joseph_jacob" },
  { x: 430, y: 100, kind: "child", tex: "joseph_benjamin" },
  { x: 290, y: 142, kind: "adult", tex: "joseph_brother_b" },
  { x: 360, y: 142, kind: "elder", tex: "joseph_stranger" },
  { x: 430, y: 142, kind: "adult", tex: "joseph_trader" },
  { x: 290, y: 184, kind: "adult", tex: "joseph_brother_c" },
  { x: 360, y: 184, kind: "child", tex: "joseph_benjamin" },
];

/** Stage 10 (St 41, 53 – 42, 38): famine. Hand out 8 sacks fairly: children and elders first (wrong order costs a Drop of Peace). Then the brothers arrive. */
export class Stage10FamineScene extends BaseJosephScene {
  private served: boolean[] = [];
  private carrying = false;
  private running = false;
  private finished = false;
  private tags: Phaser.GameObjects.Text[] = [];
  private marks: (Phaser.GameObjects.Image | null)[] = [];

  constructor() {
    super("Stage10FamineScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_10_nan_doi_cac_anh_tro_lai";
    this.spawn = [180, 140];
  }

  create() {
    this.served = PEOPLE.map(() => false);
    this.carrying = this.running = this.finished = false;
    this.tags = [];
    this.marks = [];
    this.intro = { illustration: "10", speaker: tx("Sách Sáng Thế", "The Book of Genesis"), lines: STAGE10.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    this.add.tileSprite(0, TOP - 4, W, H - TOP + 4, "joseph_dirt").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 8, W, TOP - 8, "joseph_brick").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, 8, 0x0f172a).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(0, 0, W, H, 0xfdba74, 0.08).setOrigin(0).setDepth(DEPTH.LIGHT); // dry hot light
    this.wallBelow(0, W, BOTTOM + 4, "joseph_brick");
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + 4 + H) / 2, W, H - BOTTOM - 4);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    // storehouse: a big granary with a stack of sacks in front
    this.prop(STORE[0], STORE[1] - 12, "joseph_granary", 30, 10);
    for (const [dx, dy] of [[-12, 8], [4, 10], [18, 6]]) this.add.image(STORE[0] + dx, STORE[1] + dy + 8, "joseph_sack").setOrigin(0.5, 1).setDepth(STORE[1] + dy + 8);
    for (const x of [200, 440]) this.add.image(x, 70, "joseph_pillar").setOrigin(0.5, 1).setDepth(70);
    // a few dry thorn bushes: the land is hungry
    for (const [x, y] of [[170, 190], [230, 90], [460, 192]]) this.add.image(x, y, "joseph_thorn").setOrigin(0.5, 1).setDepth(y);

    this.interactables = [
      { x: STORE[0] + 4, y: STORE[1] + 16, r: 30, label: tr(STAGE10.sackHint), active: () => this.running && !this.carrying, act: () => this.takeSack() },
    ];
    PEOPLE.forEach((p, i) => {
      this.add.image(p.x, p.y, p.tex).setOrigin(0.5, 1).setDepth(p.y);
      const tag = this.add.text(p.x, p.y - 28, tr(STAGE10.labels[p.kind]), { fontFamily: "Dearpix, monospace", fontSize: "10px", color: p.kind === "adult" ? "#e2e8f0" : "#fde68a", backgroundColor: "#0f172acc", padding: { x: 2, y: 0 }, resolution: 4 }).setOrigin(0.5, 1).setDepth(p.y + 1);
      this.tags.push(tag);
      this.marks.push(null);
      this.interactables.push({ x: p.x, y: p.y - 10, r: 22, label: tr(STAGE10.giveHint), active: () => this.running && this.carrying && !this.served[i], act: () => this.give(i) });
    });
  }

  protected onStageStart() {
    this.setCompanion("joseph_governor");
    this.initGrace(3);
    this.talk(tx("Giuse", "Joseph"), STAGE10.start.map(tr), () => {
      this.running = true;
      this.saveCheckpoint("start", 0);
      this.refreshBanner();
    });
  }

  protected onCheckpointRestore() {
    this.player.setVelocity(0, 0);
    this.carrying = false;
    this.setCarry(null);
    this.served = PEOPLE.map(() => false);
    this.marks.forEach((m, i) => { m?.destroy(); this.marks[i] = null; });
    this.tags.forEach((t, i) => t.setColor(PEOPLE[i].kind === "adult" ? "#e2e8f0" : "#fde68a"));
    this.refreshBanner();
  }

  private refreshBanner() {
    this.setBanner(tr(STAGE10.banner).replace("{n}", String(this.served.filter(Boolean).length)));
  }

  private takeSack() {
    this.carrying = true;
    this.setCarry("joseph_sack");
    audio.sfx("pickup");
  }

  private give(i: number) {
    const weakWaiting = PEOPLE.some((p, j) => p.kind !== "adult" && !this.served[j]);
    this.carrying = false;
    this.setCarry(null);
    if (PEOPLE[i].kind === "adult" && weakWaiting) {
      audio.sfx("wrong");
      if (this.loseGrace()) return;
      this.talk(tx("Dân chúng", "The crowd"), [tr(STAGE10.complain)]);
      return;
    }
    this.served[i] = true;
    audio.sfx("chime");
    const p = PEOPLE[i];
    this.tags[i].setColor("#86efac");
    this.marks[i] = this.add.image(p.x + 14, p.y - 4, "joseph_sack").setOrigin(0.5, 1).setDepth(p.y + 2);
    this.sparkleBurst(p.x, p.y - 12, 6);
    this.refreshBanner();
    if (this.served.every(Boolean)) this.brothersArrive();
  }

  private brothersArrive() {
    this.running = false;
    this.setBanner("");
    this.initGrace(0);
    this.player.setMovementLock(true);
    const keys = ["joseph_brother", "joseph_brother_b", "joseph_brother_c"];
    for (let i = 0; i < 10; i++) {
      const x = 110 + i * 32, y = 194;
      this.add.image(x, y, keys[i % 3]).setOrigin(0.5, 1).setDepth(y);
    }
    audio.sfx("bless");
    this.talk(tx("Lời kể", "Narrator"), STAGE10.brothers.map(tr), () => {
      this.player.setMovementLock(false);
      this.finished = true;
      this.finishStage(STAGE10);
    });
  }
}
