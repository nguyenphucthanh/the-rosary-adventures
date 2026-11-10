import * as Phaser from "phaser";
import { BaseNoahScene, DEPTH } from "@/modules/noahs-ark/game/scenes/BaseNoahScene";
import { registerStageTextures } from "@/modules/noahs-ark/game/utils/stageTextures";
import { registerVoyageTextures } from "@/modules/noahs-ark/game/utils/voyageTextures";
import { NOAH_TEXT } from "@/modules/noahs-ark/data/stageText";
import { tr } from "@/modules/noahs-ark/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 240;
const H = 420;
const START: [number, number] = [120, 388];
const STEER = 350; // px/s² from the rudder
const DRAG = 4; // 1/s
const GOLD_PUSH = 500; // px/s² north, sail open inside a golden wind lane
const GUST_PUSH = 625; // px/s² sideways, sail open inside a cross-gust
const CURRENT_PUSH = 275; // px/s² south, always
type R = [number, number, number, number]; // x, y, w, h
// Gold lanes (+ north), backwaters (+ south), cross-gusts (dir = -1 west / +1 east). Gaps between zones are calm water.
const GOLD: R[] = [[96, 330, 48, 90], [136, 220, 56, 100], [40, 110, 56, 100], [96, 50, 48, 70]];
const CURRENT: R[] = [[0, 282, 240, 44], [0, 160, 240, 46]];
const GUSTS: { r: R; dir: -1 | 1 }[] = [{ r: [0, 240, 110, 36], dir: 1 }, { r: [120, 100, 120, 44], dir: -1 }];
const REEFS: [number, number][] = [[46, 366], [194, 352], [120, 304], [58, 262], [192, 188], [112, 150], [190, 84], [46, 60]];
const SWIRLS: [number, number][] = [[170, 296], [84, 196], [172, 120]];
const BEACONS: [number, number][] = [[56, 322], [184, 216], [56, 106]];
const MOUNT: [number, number] = [120, 76];
const GRACE = 3;

/** Stage 6: momentum sailing. Steer the ark, open/furl the sail with A, ride golden wind, dodge reefs and whirlpools, light 3 beacons, land on Ararat. */
export class Stage06AraratWindScene extends BaseNoahScene {
  private ark?: Phaser.GameObjects.Sprite;
  private swirlS: Phaser.GameObjects.Sprite[] = [];
  private beaconS: Phaser.GameObjects.Sprite[] = [];
  private lit = [false, false, false];
  private sea?: Phaser.GameObjects.TileSprite;
  private fx?: Phaser.GameObjects.Graphics;
  private label?: Phaser.GameObjects.Text;
  private v = new Phaser.Math.Vector2();
  private sail = false;
  private running = false;
  private invuln = 0;
  private toast = { text: "", until: 0 };

  constructor() {
    super("Stage06AraratWindScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_06_dinh_nui_ararat";
    this.spawn = [...START];
  }

  create() {
    this.swirlS = [];
    this.beaconS = [];
    this.lit = [false, false, false];
    this.sail = false;
    this.running = false;
    this.invuln = 0;
    this.v.set(0, 0);
    this.intro = { illustration: "stage6", speaker: NOAH_TEXT.s6.speaker, lines: NOAH_TEXT.s6.intro.map(tr) };
    super.create();
    this.player.setAlpha(0); // the ark is the player here; this hidden body only anchors the camera
    this.initGrace(GRACE);
  }

  protected buildWorld() {
    registerStageTextures(this);
    registerVoyageTextures(this);
    this.sea = this.add.tileSprite(0, 0, W, H, "noah_sea").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, 90, 0xfde68a, 0.12).setOrigin(0).setDepth(DEPTH.LIGHT); // dawn glow over Ararat
    this.add.image(MOUNT[0], MOUNT[1], "noah_mount").setOrigin(0.5, 1).setDepth(MOUNT[1]);
    this.add.image(MOUNT[0] - 46, MOUNT[1] - 4, "noah_mount").setOrigin(0.5, 1).setDepth(MOUNT[1] - 1).setAlpha(0.8);
    for (const [x, y] of REEFS) this.add.image(x, y, "noah_reef").setOrigin(0.5, 1).setDepth(y);
    for (const [x, y] of SWIRLS) {
      this.swirlS.push(this.add.sprite(x, y, "noah_swirl", 0).setOrigin(0.5, 0.5).setDepth(DEPTH.RUG));
    }
    for (const [x, y] of BEACONS) {
      this.add.image(x, y - 14, "noah_glow_gold").setDepth(DEPTH.RUG).setAlpha(0.35);
      this.beaconS.push(this.add.sprite(x, y, "noah_beacon", 0).setOrigin(0.5, 1).setDepth(y));
    }
    this.ark = this.add.sprite(START[0], START[1], "noah_arktop", 0).setOrigin(0.5, 0.5).setDepth(1000);
    const zones = this.add.graphics().setDepth(DEPTH.RUG);
    for (const [x, y, w, h] of GOLD) zones.fillStyle(0xfde047, 0.16).fillRect(x, y, w, h);
    for (const [x, y, w, h] of CURRENT) zones.fillStyle(0x0c4a6e, 0.28).fillRect(x, y, w, h);
    for (const g of GUSTS) zones.fillStyle(0xe2e8f0, 0.2).fillRect(...g.r);
    this.fx = this.add.graphics().setDepth(DEPTH.RUG + 1);
    this.label = this.add.text(W / 2, 4, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI).setScrollFactor(0);
  }

  protected onStageStart() {
    this.running = true;
    this.saveCheckpoint("start", { x: START[0], y: START[1] }, START[0], START[1]);
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    const p = state as { x: number; y: number };
    this.ark?.setPosition(p.x, p.y);
    this.v.set(0, 0);
    this.sail = false;
    this.invuln = 1500;
    this.running = true;
  }

  protected handleActionTrigger() {
    if (!this.running) return;
    this.sail = !this.sail;
    audio.sfx("whoosh");
  }

  private inR(x: number, y: number, [rx, ry, rw, rh]: R) {
    return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
  }

  private hit() {
    this.invuln = 1500;
    this.v.scale(-0.6);
    this.sail = false;
    const reset = this.loseGrace(); // 0 pips -> checkpoint (previous beacon), onCheckpointRestore moves the ark
    if (reset) {
      this.running = false;
      this.talk("Con Tàu", NOAH_TEXT.s6.hit.map(tr), () => (this.running = true));
    }
  }

  update(time?: number, delta = 16) {
    void time;
    const ark = this.ark;
    if (!ark) return;
    this.player.setPosition(ark.x, ark.y).setVelocity(0, 0); // camera anchor
    this.sea?.setTilePosition(0, -((this.time.now / 90) | 0));
    ark.setFrame(this.sail ? 1 : 0).setAlpha(this.invuln > 0 && ((this.time.now / 100) | 0) % 2 ? 0.4 : 1);
    this.swirlS.forEach((s) => s.setFrame(((this.time.now / 250) | 0) % 2));
    this.drawFx();
    this.label?.setText(this.time.now < this.toast.until ? this.toast.text : `Buồm: ${this.sail ? "MỞ" : "THU"}  –  Hải đăng ${this.lit.filter(Boolean).length}/3`);
    if (!this.running || this.introActive || this.dialogueOpen) return;

    const dt = Math.min(delta, 50) / 1000;
    this.invuln = Math.max(0, this.invuln - delta);
    const steer = this.readSteer();
    let ax = steer.x * STEER, ay = steer.y * STEER;
    for (const z of CURRENT) if (this.inR(ark.x, ark.y, z)) ay += CURRENT_PUSH;
    if (this.sail) {
      for (const z of GOLD) if (this.inR(ark.x, ark.y, z)) ay -= GOLD_PUSH;
      for (const g of GUSTS) if (this.inR(ark.x, ark.y, g.r)) ax += g.dir * GUST_PUSH;
    }
    this.v.x += (ax - this.v.x * DRAG) * dt;
    this.v.y += (ay - this.v.y * DRAG) * dt;
    ark.x = Phaser.Math.Clamp(ark.x + this.v.x * dt, 12, W - 12);
    ark.y = Phaser.Math.Clamp(ark.y + this.v.y * dt, 20, H - 20);
    ark.setPosition(Math.round(ark.x), Math.round(ark.y));

    // reefs and whirlpools hurt (the ark's hull is 14x26 around its centre)
    if (this.invuln === 0) {
      const bad = REEFS.some(([x, y]) => Math.abs(ark.x - x) < 18 && Math.abs(ark.y - (y - 11)) < 24)
        || SWIRLS.some(([x, y]) => Math.abs(ark.x - x) < 17 && Math.abs(ark.y - y) < 22);
      if (bad) this.hit();
    }
    // beacons: touch to light, saves the checkpoint
    BEACONS.forEach(([x, y], i) => {
      if (this.lit[i] || Math.abs(ark.x - x) > 18 || Math.abs(ark.y - (y - 10)) > 24) return;
      this.lit[i] = true;
      this.beaconS[i].setFrame(1).setDepth(1001); // draw over the ark so the child sees it light
      this.cameras.main.flash(250, 255, 244, 180);
      audio.sfx("bless");
      this.sparkleBurst(x, y - 16, 8);
      this.toast = { text: tr(NOAH_TEXT.s6.beacon[0]), until: this.time.now + 2500 };
      this.saveCheckpoint(`b${i}`, { x, y: y + 22 }, x, y + 22);
    });
    // landing on Ararat
    if (ark.y < MOUNT[1] + 6) {
      if (this.lit.every(Boolean)) {
        this.running = false;
        this.v.set(0, 0);
        this.cameras.main.flash(600, 255, 244, 180);
        this.finishStage(NOAH_TEXT.s6);
      } else {
        this.v.y = 40;
        this.toast = { text: "Hãy thắp đủ 3 Hải Đăng trước đã!", until: this.time.now + 2500 };
      }
    }
  }

  /** Moving streaks make the wind and currents readable; integer rects only. */
  private drawFx() {
    const g = this.fx?.clear();
    if (!g) return;
    const t = (this.time.now / 40) | 0;
    g.fillStyle(0xfef08a, 0.8);
    for (const [x, y, w, h] of GOLD) for (let i = 0; i < 4; i++) g.fillRect(x + 6 + i * ((w - 12) / 3 | 0), y + h - ((t * 2 + i * 23) % h), 2, 8);
    g.fillStyle(0x7dd3fc, 0.8);
    for (const [x, y, , h] of CURRENT) for (let i = 0; i < 6; i++) g.fillRect(x + 12 + i * 40, y + ((t + i * 9) % h), 2, 6);
    g.fillStyle(0xffffff, 0.8);
    for (const { r: [x, y, w, h], dir } of GUSTS) for (let i = 0; i < 3; i++) g.fillRect(dir > 0 ? x + ((t * 2 + i * 31) % w) : x + w - ((t * 2 + i * 31) % w), y + 6 + i * ((h - 8) / 2 | 0), 8, 2);
  }
}
