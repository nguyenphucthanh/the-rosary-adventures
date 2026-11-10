import * as Phaser from "phaser";
import { BaseNoahScene, DEPTH } from "@/modules/noahs-ark/game/scenes/BaseNoahScene";
import { registerStageTextures } from "@/modules/noahs-ark/game/utils/stageTextures";
import { registerVoyageTextures } from "@/modules/noahs-ark/game/utils/voyageTextures";
import { NOAH_TEXT } from "@/modules/noahs-ark/data/stageText";
import { tr } from "@/modules/noahs-ark/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 320;
const H = 240;
const CARES_PER_LEG = 6;
// per leg: ms between big waves, wave strength, how many animals may call at once, ms between new calls
const LEGS = [{ gap: 16000, amp: 0.9, calls: 2, every: 5000 }, { gap: 13000, amp: 1, calls: 3, every: 4000 }];
const WARN_MS = 5000; // arrow shows this long before the wave hits
const HOLD_MS = 6000; // a wave leans on the ark this long
const CRATE_W = 0.4; // tilt contributed by one crate on a side
const DANGER = 0.85; // |tilt| above this is the red zone
const DANGER_FAIL_MS = 6000;
const PANIC_MS = 50000;
const AISLE_L = 112;
const AISLE_R = 208;
const CRATE_Y = [118, 170];
const STALLS = [[30, 80], [30, 125], [30, 170], [290, 80], [290, 125], [290, 170]] as const;
const ANIMALS = ["noah_sheep", "noah_rabbit", "noah_turtle", "noah_deer", "noah_zebra", "noah_lion"];
const ITEMS = [
  { key: "hay", tex: "noah_hay", need: "noah_need_hay", x: 120, label: "[A] Lấy Bó Cỏ Khô" },
  { key: "lamp", tex: "noah_lamp", need: "noah_need_lamp", x: 160, label: "[A] Lấy Đèn Dầu" },
  { key: "blanket", tex: "noah_blanket", need: "noah_need_blanket", x: 200, label: "[A] Lấy Chăn Rơm" },
] as const;

const NEED_NAMES = ["BÓ CỎ", "ĐÈN DẦU", "CHĂN RƠM"];

interface Need { item: number; since: number; bubble: Phaser.GameObjects.Image }

/** Stage 5: keep the ark level with food crates while caring for six animal stalls. Two legs of six cares each. */
export class Stage05ArkVoyageScene extends BaseNoahScene {
  private sides = [-1, 1]; // -1 = left of the aisle, 1 = right
  private crates: Phaser.GameObjects.Image[] = [];
  private needs: (Need | null)[] = [null, null, null, null, null, null];
  private held = -1;
  private heldImg?: Phaser.GameObjects.Image;
  private leg = 0;
  private cares = 0;
  private msg = "";
  private msgUntil = 0;
  private running = false;
  private tilt = 0;
  private amp = 0;
  private waveClock = 0;
  private waveLeft = 0;
  private warnDir = 0;
  private callClock = 0;
  private dangerT = 0;
  private hud?: Phaser.GameObjects.Graphics;
  private label?: Phaser.GameObjects.Text;
  private warn?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage05ArkVoyageScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_05_lenh_denh_bien_nuoc";
    this.spawn = [160, 200];
  }

  create() {
    this.crates = [];
    this.needs = [null, null, null, null, null, null];
    this.held = -1;
    this.running = false;
    this.leg = 0;
    this.intro = { illustration: "stage5", speaker: NOAH_TEXT.s5.speaker, lines: NOAH_TEXT.s5.intro.map(tr) };
    super.create();
  }

  /** The whole deck must be visible to watch every stall: pick the largest integer zoom (1 on narrow phones) that fits the room. */
  protected setupCamera() {
    super.setupCamera();
    const cam = this.cameras.main;
    const fit = () => {
      const { width, height } = this.scale.gameSize;
      const z = Math.max(1, Math.min(Math.floor(width / W), Math.floor(height / H), 4));
      cam.setZoom(z);
      const w = W * z, h = H * z;
      cam.setViewport(Math.floor((width - w) / 2), Math.floor((height - h) / 2), w, h);
    };
    fit();
    this.scale.on("resize", fit);
    this.events.once("shutdown", () => this.scale.off("resize", fit));
  }

  protected buildWorld() {
    registerStageTextures(this);
    registerVoyageTextures(this);
    this.add.tileSprite(0, 0, W, H, "noah_deck").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 0, W, 24, "noah_hull").setOrigin(0).setDepth(DEPTH.WALL - 1);
    this.add.tileSprite(0, H - 12, W, 12, "noah_hull").setOrigin(0).setDepth(DEPTH.WALL - 1);
    this.add.tileSprite(0, 0, 8, H, "noah_hull").setOrigin(0).setDepth(DEPTH.WALL - 1);
    this.add.tileSprite(W - 8, 0, 8, H, "noah_hull").setOrigin(0).setDepth(DEPTH.WALL - 1);
    this.block(W / 2, 12, W, 24); this.block(W / 2, H - 6, W, 12); this.block(4, H / 2, 8, H); this.block(W - 4, H / 2, 8, H);
    this.add.rectangle(0, 0, W, H, 0xfbbf24, 0.07).setOrigin(0).setDepth(DEPTH.LIGHT); // warm lamplight
    // centre rails the crates slide along
    for (const y of CRATE_Y) this.add.rectangle(AISLE_L - 8, y - 6, AISLE_R - AISLE_L + 16, 2, 0x5b2a0c).setOrigin(0).setDepth(DEPTH.RUG);

    // stalls with animals; the player talks to them from the aisle side
    STALLS.forEach(([x, y], i) => {
      this.add.image(x, y, "noah_stall").setDepth(DEPTH.RUG);
      this.add.image(x, y + 12, ANIMALS[i], 0).setOrigin(0.5, 1).setDepth(y + 12);
      const ix = x < W / 2 ? x + 36 : x - 36;
      this.interactables.push({ x: ix, y, r: 22, label: () => { const n = this.needs[i]; return n ? (this.held === n.item ? "[A] Chăm sóc con thú" : `Cần ${NEED_NAMES[n.item]} – lấy ở kệ trên`) : ""; }, active: () => this.running && !!this.needs[i], act: () => this.care(i) });
    });
    // supplies shelf
    this.add.rectangle(100, 28, 120, 14, 0x5b2a0c).setOrigin(0).setDepth(DEPTH.RUG + 1);
    ITEMS.forEach((it, k) => {
      this.pickup(it.x, 44, it.tex);
      this.interactables.push({ x: it.x, y: 40, r: 18, label: it.label, active: () => this.running && this.held !== k, act: () => this.take(k) });
    });
    // lamps on the walls
    for (const [x, y] of [[70, 34], [250, 34], [70, 210], [250, 210]]) {
      const g = this.add.image(x, y, "noah_glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.35);
      this.tweens.add({ targets: g, alpha: 0.5, duration: 1400 + x, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
      this.add.image(x, y + 6, "noah_lamp").setOrigin(0.5, 1).setDepth(DEPTH.WALL - 2);
    }
    // the family keeps watch
    this.add.sprite(60, 205, "noah_wife").setOrigin(0.5, 1).setDepth(205);
    this.add.sprite(262, 200, "noah_noah").setOrigin(0.5, 1).setDepth(200);
    // crates
    CRATE_Y.forEach((y, i) => {
      this.crates.push(this.add.image(this.sides[i] < 0 ? AISLE_L : AISLE_R, y, "noah_crate").setOrigin(0.5, 1).setDepth(y));
      this.interactables.push({ x: this.sides[i] < 0 ? AISLE_L : AISLE_R, y: y - 6, r: 30, label: () => (this.sides[i] < 0 ? "[A] Đẩy thùng sang Phải" : "[A] Đẩy thùng sang Trái"), active: () => this.running, act: () => this.shove(i) });
    });
    this.heldImg = this.add.image(0, 0, "noah_hay").setDepth(DEPTH.FX).setVisible(false);
    this.hud = this.add.graphics().setDepth(DEPTH.UI);
    const style = { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 };
    this.label = this.add.text(W / 2, 66, "", style).setOrigin(0.5, 0).setDepth(DEPTH.UI);
    this.warn = this.add.text(W / 2, 78, "", { ...style, color: "#fecaca" }).setOrigin(0.5, 0).setDepth(DEPTH.UI).setVisible(false);
  }

  protected onStageStart() {
    this.startLeg(0);
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startLeg(state as number);
  }

  private startLeg(n: number) {
    this.leg = n;
    this.cares = n * CARES_PER_LEG;
    this.tilt = this.amp = this.dangerT = this.waveClock = this.waveLeft = this.callClock = 0;
    this.warnDir = 0;
    this.held = -1;
    this.heldImg?.setVisible(false);
    this.sides = [-1, 1];
    this.crates.forEach((c, i) => {
      c.setX(this.sides[i] < 0 ? AISLE_L : AISLE_R);
      this.syncCrateHotspot(i);
    });
    this.needs.forEach((nd, i) => { nd?.bubble.destroy(); this.needs[i] = null; });
    this.running = true;
    this.saveCheckpoint(`leg${n}`, n, 160, 200);
  }

  private take(k: number) {
    this.held = k;
    audio.sfx("pickup");
    this.heldImg?.setTexture(ITEMS[k].tex).setVisible(true);
  }

  private shove(i: number) {
    this.sides[i] *= -1;
    audio.sfx("door");
    this.tweens.add({ targets: this.crates[i], x: this.sides[i] < 0 ? AISLE_L : AISLE_R, duration: 350, ease: "Stepped", easeParams: [5] });
    this.syncCrateHotspot(i);
  }

  /** Keep the push hotspot on the crate's current side (also after a leg reset). */
  private syncCrateHotspot(i: number) {
    const it = this.interactables.find((o) => o.y === CRATE_Y[i] - 6);
    if (it) it.x = this.sides[i] < 0 ? AISLE_L : AISLE_R;
  }

  private care(i: number) {
    const need = this.needs[i];
    if (!need) return;
    if (this.held !== need.item) {
      audio.sfx("wrong");
      this.msg = `Con thú cần ${NEED_NAMES[need.item]}!`;
      this.msgUntil = this.time.now + 2000;
      return;
    }
    need.bubble.destroy();
    this.needs[i] = null;
    this.held = -1;
    this.heldImg?.setVisible(false);
    audio.sfx("chime");
    const [sx, sy] = STALLS[i];
    this.sparkleBurst(sx, sy, 6);
    if (++this.cares % CARES_PER_LEG === 0) this.endLeg();
  }

  private endLeg() {
    this.running = false;
    audio.sfx("bless");
    if (this.leg === 0) this.talk("Ông Nô-ê", NOAH_TEXT.s5.leg.map(tr), () => this.startLeg(1));
    else this.finishStage(NOAH_TEXT.s5);
  }

  private fail(lines: typeof NOAH_TEXT.s5.tipped) {
    this.running = false;
    audio.sfx("wrong");
    this.talk("Con Tàu", lines.map(tr), () => this.resetToCheckpoint());
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    this.heldImg?.setPosition(Math.round(this.player.x), Math.round(this.player.y - 18));
    this.draw();
    if (!this.running || this.introActive || this.dialogueOpen) return;
    const cfg = LEGS[this.leg];
    const dt = Math.min(delta, 50);

    // waves: warning arrow, then a lean that holds for a while
    this.waveClock += dt;
    if (!this.warnDir && this.waveClock >= cfg.gap - WARN_MS) this.warnDir = Math.random() < 0.5 ? -1 : 1;
    if (this.waveClock >= cfg.gap) {
      this.waveClock = 0;
      this.amp = this.warnDir * cfg.amp;
      this.warnDir = 0;
      this.waveLeft = HOLD_MS;
      audio.sfx("whoosh");
      this.cameras.main.shake(300, 0.003);
    }
    if (this.waveLeft > 0) this.waveLeft -= dt;
    else this.amp *= 1 - Math.min(1, (dt / 1000) * 2);
    const bias = this.sides.reduce((a, s) => a + s, 0) * CRATE_W;
    this.tilt += (this.amp + bias - this.tilt) * Math.min(1, (dt / 1000) * 0.8);
    this.dangerT = Math.abs(this.tilt) > DANGER ? this.dangerT + dt : Math.max(0, this.dangerT - dt * 2);
    if (this.dangerT > DANGER_FAIL_MS) return this.fail(NOAH_TEXT.s5.tipped);

    // animals call for help
    this.callClock += dt;
    const open = this.needs.filter(Boolean).length;
    if (this.callClock >= cfg.every && open < cfg.calls) {
      this.callClock = 0;
      const idle = this.needs.map((n, i) => (n ? -1 : i)).filter((i) => i >= 0);
      const i = Phaser.Utils.Array.GetRandom(idle);
      const item = Phaser.Math.Between(0, 2);
      const [sx, sy] = STALLS[i];
      const bubble = this.add.image(sx, sy - 16, ITEMS[item].need).setDepth(DEPTH.FX - 1);
      this.tweens.add({ targets: bubble, y: sy - 19, duration: 500, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2] });
      this.needs[i] = { item, since: this.time.now, bubble };
    }
    if (this.needs.some((n) => n && this.time.now - n.since > PANIC_MS)) this.fail(NOAH_TEXT.s5.panic);
  }

  private draw() {
    const g = this.hud?.clear();
    if (!g) return;
    const w = 140, x = (W - w) / 2, y = 52;
    g.fillStyle(0x0f172a, 1).fillRect(x - 2, y - 2, w + 4, 12);
    g.fillStyle(0xdc2626, 1).fillRect(x, y, w, 8);
    const zone = (a: number, b: number, col: number) => g.fillStyle(col, 1).fillRect(x + Math.round(((a + 1) / 2) * w), y, Math.round(((b - a) / 2) * w), 8);
    zone(-DANGER, DANGER, 0xfbbf24); zone(-0.6, 0.6, 0x22c55e);
    const nx = x + Math.round(((Phaser.Math.Clamp(this.tilt, -1, 1) + 1) / 2) * w);
    g.fillStyle(0xffffff, 1).fillRect(nx - 1, y - 3, 3, 14);
    if (this.dangerT > 0) g.fillStyle(0xdc2626, 1).fillRect(x, y + 12, Math.round((w * this.dangerT) / DANGER_FAIL_MS), 2);
    this.label?.setText(this.running ? `Chặng ${this.leg + 1}/2 – chăm sóc ${this.cares}/${CARES_PER_LEG * 2}` : "");
    const msg = this.time.now < this.msgUntil;
    const show = this.running && (msg || this.warnDir !== 0);
    this.warn?.setVisible(show);
    if (show) this.warn?.setText(msg ? this.msg : this.warnDir < 0 ? "<< SÓNG ĐÁNH TRÁI <<" : ">> SÓNG ĐÁNH PHẢI >>");
  }
}
