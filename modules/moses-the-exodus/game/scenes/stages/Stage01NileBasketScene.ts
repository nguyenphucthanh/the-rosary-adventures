import * as Phaser from "phaser";
import { BaseExodusScene, DEPTH } from "@/modules/moses-the-exodus/game/scenes/BaseExodusScene";
import { registerNileTextures } from "@/modules/moses-the-exodus/game/utils/nileTextures";
import { STAGE1, tr } from "@/modules/moses-the-exodus/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 480;
const H = 240;
const BANK_N = 96; // north bank ends here; the river runs y 96..176
const BANK_S = 176;
const LANES = [114, 136, 158]; // basket foot y per lane
const SPEED = 16; // basket drift, px/s
const REACH_X = [40, 180, 330]; // where each river reach starts
const REACH_LANE = [1, 1, 2]; // lane the basket starts in
const PLAYER_AT: [number, number][] = [[62, 80], [236, 80], [352, 80]];
const DOCK_X = 428;
const LEVERS: [number, number][] = [[96, 84], [374, 84]];
const POST: [number, number] = [250, 84];
const ZONE: [number, number] = [212, 292]; // x range the guard can see
// Hazards: reach 1 is safe in lane 2; reach 3 needs lane 0 at x=350 then lane 2 at x=400.
const HAZARDS: { x: number; lane: number; kind: "whirl" | "croc" }[] = [
  { x: 120, lane: 1, kind: "whirl" }, { x: 160, lane: 0, kind: "croc" },
  { x: 350, lane: 1, kind: "croc" }, { x: 350, lane: 2, kind: "whirl" },
  { x: 400, lane: 0, kind: "whirl" }, { x: 400, lane: 1, kind: "croc" },
];
const GUARD: [number, number] = [252, 194]; // watches the river from the south bank
const AWAY = 4500, WARN = 900, WATCH = 2600; // guard cycle, ms

/** Stage 1: the basket drifts down the Nile. Change its lane at the lotus levers, hide it from the guard, hand it to the Princess. */
export class Stage01NileBasketScene extends BaseExodusScene {
  private reach = 0;
  private running = false;
  private docked = false;
  private finished = false;
  private lane = 1;
  private bx = REACH_X[0];
  private held = false;
  private guardT = 0;
  private basket?: Phaser.GameObjects.Image;
  private reeds?: Phaser.GameObjects.Image;
  private miriam?: Phaser.GameObjects.Image;
  private cone?: Phaser.GameObjects.Rectangle;
  private bang?: Phaser.GameObjects.Text;
  private label?: Phaser.GameObjects.Text;
  private ly = LANES[1];

  constructor() {
    super("Stage01NileBasketScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_01_thung_coi_song_nin";
    this.spawn = PLAYER_AT[0];
  }

  create() {
    this.reach = 0; this.running = this.docked = this.finished = this.held = false;
    this.lane = 1; this.bx = REACH_X[0]; this.guardT = 0; this.ly = LANES[1];
    this.intro = { illustration: "1", speaker: STAGE1.speaker, lines: STAGE1.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerNileTextures(this);
    for (const k of ["nile_whirl", "nile_croc"]) {
      if (!this.anims.exists(k)) this.anims.create({ key: k, frames: this.anims.generateFrameNumbers(k, { start: 0, end: 1 }), frameRate: 2, repeat: -1 });
    }
    this.add.tileSprite(0, 0, W, BANK_N, "nile_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, BANK_S, W, H - BANK_S, "nile_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, BANK_N, W, BANK_S - BANK_N, "nile_water").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, H, 0xfbbf24, 0.07).setOrigin(0).setDepth(DEPTH.LIGHT); // sunrise tint
    // sand path along the north bank
    this.add.rectangle(16, 72, W - 32, 18, 0xebd0a3, 0.55).setOrigin(0).setDepth(DEPTH.RUG);
    // stone landing for the Princess (walkable from the north bank)
    this.add.tileSprite(436, BANK_N, W - 436, BANK_S - BANK_N, "exodus_stone").setOrigin(0).setDepth(DEPTH.RUG);

    // walls: top treeline, river (not walkable), edges
    this.block(W / 2, 26, W, 52);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    this.block(W / 2, H - 8, W, 16);
    this.block(218, (BANK_N + 4 + BANK_S) / 2, 436, BANK_S - BANK_N - 8); // river, leaves the landing open

    // dressing: palms and papyrus on the north bank, lotus on the water, reeds on the south bank
    for (const x of [30, 120, 220, 330, 440]) this.prop(x, 52, "nile_palm", 12, 6);
    for (const x of [60, 180, 290, 400]) this.add.image(x, 62, "nile_papyrus").setOrigin(0.5, 1).setDepth(62);
    for (const [x, y] of [[70, 104], [210, 170], [300, 104], [380, 172], [140, 170]]) this.add.image(x, y, "nile_lotus").setDepth(y);
    for (const x of [40, 130, 330, 410]) this.add.image(x, 190, "nile_papyrus").setOrigin(0.5, 1).setDepth(190);

    HAZARDS.forEach((h) => {
      const s = this.add.sprite(h.x, LANES[h.lane] - 4, h.kind === "whirl" ? "nile_whirl" : "nile_croc").setOrigin(0.5, 1).setDepth(LANES[h.lane] - 5);
      s.play(h.kind === "whirl" ? "nile_whirl" : "nile_croc");
    });

    // levers and the reed post, each with a gold glow so they read at a glance
    const mark = (x: number, y: number, key: string) => {
      const glow = this.add.image(x, y - 8, "exodus_glow_gold").setDepth(y - 1).setAlpha(0.5);
      this.add.image(x, y, key).setOrigin(0.5, 1).setDepth(y);
      this.tweens.add({ targets: glow, alpha: 0.85, duration: 900, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    };
    LEVERS.forEach(([x, y]) => mark(x, y + 6, "nile_lever"));
    mark(POST[0], POST[1] + 6, "nile_lever");
    this.interactables.push(
      ...LEVERS.map(([x, y], i) => ({ x, y, r: 28, label: tr(STAGE1.leverHint), active: () => this.running && !this.docked && (this.reach === (i === 0 ? 0 : 2)), act: () => this.turnLever() })),
      { x: POST[0], y: POST[1], r: 28, label: () => tr(this.held ? STAGE1.releaseHint : STAGE1.holdHint), active: () => this.running && this.reach === 1, act: () => this.toggleHold() },
      { x: 452, y: 130, r: 36, label: tr(STAGE1.dockHint), active: () => this.docked && !this.finished, act: () => this.dockTalk() },
    );

    // guard on the south bank, Miriam on the south bank, Princess on the landing
    this.add.image(GUARD[0], GUARD[1], "exodus_guard").setOrigin(0.5, 1).setDepth(GUARD[1]);
    this.bang = this.add.text(GUARD[0], GUARD[1] - 30, "!", { fontFamily: "Dearpix, monospace", fontSize: "12px", color: "#fecaca", resolution: 4 }).setOrigin(0.5, 1).setDepth(DEPTH.FX).setVisible(false);
    this.cone = this.add.rectangle(ZONE[0], BANK_N, ZONE[1] - ZONE[0], BANK_S - BANK_N, 0xdc2626, 0.22).setOrigin(0).setDepth(DEPTH.LIGHT).setVisible(false);
    this.miriam = this.add.image(REACH_X[0] - 8, 220, "exodus_miriam").setOrigin(0.5, 1).setDepth(220);
    this.add.image(462, 160, "exodus_princess").setOrigin(0.5, 1).setDepth(160);

    this.basket = this.add.image(this.bx, this.ly, "exodus_basket").setOrigin(0.5, 1).setDepth(this.ly);
    this.reeds = this.add.image(this.bx, this.ly, "nile_reed").setOrigin(0.5, 1).setDepth(this.ly + 2).setVisible(false);
    this.label = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
  }

  protected onStageStart() {
    this.talk("Mi-ri-am", STAGE1.start.map(tr), () => this.startReach(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startReach(state as number, false);
  }

  private startReach(n: number, intro = true) {
    this.reach = n;
    this.bx = REACH_X[n];
    this.lane = REACH_LANE[n];
    this.ly = LANES[this.lane];
    this.held = false;
    this.guardT = 0;
    this.docked = false;
    this.running = false;
    this.saveCheckpoint(`reach${n}`, n, PLAYER_AT[n][0], PLAYER_AT[n][1]);
    const go = () => { this.running = true; };
    if (intro && n === 1) this.talk("Mi-ri-am", STAGE1.reach2.map(tr), go);
    else if (intro && n === 2) this.talk("Mi-ri-am", STAGE1.reach3.map(tr), go);
    else this.time.delayedCall(600, go);
  }

  private turnLever() {
    this.lane = (this.lane + 1) % 3;
    audio.sfx("chime");
    this.sparkleBurst(this.bx, LANES[this.lane] - 6, 5);
  }

  private toggleHold() {
    this.held = !this.held;
    audio.sfx(this.held ? "pickup" : "chime");
  }

  private fail(kind: "hit" | "spotted") {
    this.running = false;
    audio.sfx("wrong");
    this.talk("Mi-ri-am", (kind === "hit" ? STAGE1.hit : STAGE1.spotted).map(tr), () => this.resetToCheckpoint());
  }

  private dockTalk() {
    this.talk("Công chúa Pha-ra-ô", STAGE1.dock.map(tr), undefined, [
      { label: tr(STAGE1.askRight), onSelect: () => this.won() },
      { label: tr(STAGE1.askWrong), onSelect: () => { audio.sfx("wrong"); this.talk("Mi-ri-am", STAGE1.wrong.map(tr)); } },
    ]);
  }

  private won() {
    this.finished = true;
    audio.sfx("complete");
    this.sparkleBurst(this.bx, this.ly - 8, 12);
    this.completeStage();
    this.talk("Công chúa Pha-ra-ô", STAGE1.right.map(tr), () =>
      this.talk("Ấn Dấu thứ 1", STAGE1.outro.map(tr), () =>
        this.talk("Suy niệm", [tr(STAGE1.lesson)], () =>
          this.talk("Lớn Lên Nơi Hoàng Cung", STAGE1.cutscene.map(tr), () => this.goToNextStage()))));
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    const cam = this.cameras.main;
    const view = cam.worldView;
    this.label?.setPosition(Math.round(view.centerX), Math.round(view.y + this.safeInsetTop() + 4)).setText(this.docked ? "" : tr(STAGE1.reach[this.reach]));

    // basket: glide to its lane, bob one pixel
    this.ly += (LANES[this.lane] - this.ly) * 0.2;
    const by = Math.round(this.ly) + (Math.floor(this.time.now / 450) % 2);
    this.basket?.setPosition(Math.round(this.bx), by).setDepth(by).setAlpha(this.held ? 0.55 : 1);
    this.reeds?.setPosition(Math.round(this.bx), by + 1).setDepth(by + 2).setVisible(this.held);
    this.miriam?.setX(Math.round(Phaser.Math.Clamp(this.bx - 8, 30, 420)));

    const watching = this.guardPhase() === "watch";
    const warning = this.guardPhase() === "warn";
    const guardOn = this.reach === 1 && this.running;
    this.cone?.setVisible(guardOn && (watching || (warning && Math.floor(this.time.now / 150) % 2 === 0))).setFillStyle(watching ? 0xdc2626 : 0xfbbf24, watching ? 0.26 : 0.2);
    this.bang?.setVisible(guardOn && (watching || warning));

    if (!this.running || this.introActive || this.dialogueOpen) return;
    const dt = Math.min(delta, 50) / 1000;
    if (this.reach === 1) this.guardT += delta;
    if (!this.held) this.bx += SPEED * dt;

    if (this.reach === 1 && watching && !this.held && this.bx >= ZONE[0] && this.bx <= ZONE[1]) return this.fail("spotted");
    for (const h of HAZARDS) if (h.lane === this.lane && Math.abs(this.bx - h.x) < 9) return this.fail("hit");

    if (this.reach < 2 && this.bx >= REACH_X[this.reach + 1]) {
      audio.sfx("bless");
      this.startReach(this.reach + 1);
    } else if (this.reach === 2 && this.bx >= DOCK_X) {
      this.running = false;
      this.docked = true;
      this.lane = 1;
      audio.sfx("bless");
      this.sparkleBurst(DOCK_X, LANES[1] - 8, 8);
    }
  }

  private guardPhase(): "away" | "warn" | "watch" {
    const t = this.guardT % (AWAY + WARN + WATCH);
    return t < AWAY ? "away" : t < AWAY + WARN ? "warn" : "watch";
  }
}
