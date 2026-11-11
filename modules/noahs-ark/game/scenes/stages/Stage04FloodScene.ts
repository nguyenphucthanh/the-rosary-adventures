import * as Phaser from "phaser";
import { BaseNoahScene, DEPTH } from "@/modules/noahs-ark/game/scenes/BaseNoahScene";
import { registerStageTextures } from "@/modules/noahs-ark/game/utils/stageTextures";
import { NOAH_TEXT } from "@/modules/noahs-ark/data/stageText";
import { tr } from "@/modules/noahs-ark/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 240;
const FLOOR_H = 320; // portrait: short walk between table and hazards
const H = FLOOR_H + 48; // extra bottom wall: the on-screen controls row covers the lowest ~40px
const WAVE_MS = 40000;
const LEAKS: [number, number][] = [[16, 56], [16, 112], [16, 168], [16, 224], [224, 56], [224, 112], [224, 168], [224, 224]];
const TOP = 56; // thick top wall keeps windows clear of the on-screen controls row
const WINDOWS: [number, number][] = [[48, TOP], [120, TOP], [192, TOP], [48, FLOOR_H - 14], [192, FLOOR_H - 14]];
const PUDDLES: [number, number][] = [[64, 96], [176, 210], [96, 256]];
// per wave: how many hazards appear, and the gap between them (ms)
const WAVES = [{ n: 3, gap: 6000 }, { n: 5, gap: 4500 }, { n: 7, gap: 3500 }];
const DRAIN = 2; // hull integrity lost per second per open hazard

interface Hazard { type: "leak" | "wnd"; x: number; y: number; s: Phaser.GameObjects.Sprite; active: boolean }

/** Stage 4: hull sealing under time pressure. Fetch pitch or pins from the table, seal leaks and windows, keep the Hull Integrity up for three surges. */
export class Stage04FloodScene extends BaseNoahScene {
  private hazards: Hazard[] = [];
  private held: "pitch" | "pin" | null = null;
  private heldImg?: Phaser.GameObjects.Image;
  private wave = 0;
  private waveT = 0;
  private spawned = 0;
  private integrity = 100;
  private running = false;
  private final = false;
  private bar?: Phaser.GameObjects.Graphics;
  private label?: Phaser.GameObjects.Text;
  private mainDoor?: Phaser.GameObjects.Sprite;
  private lastV = new Phaser.Math.Vector2(0, 0);
  private rain?: Phaser.GameObjects.Graphics;
  private toast = { text: "", until: 0 };

  constructor() {
    super("Stage04FloodScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_04_dong_cua_mua_lu";
    this.spawn = [120, 210];
  }

  create() {
    this.hazards = [];
    this.held = null;
    this.wave = 0;
    this.running = false;
    this.final = false;
    this.integrity = 100;
    this.intro = { illustration: "stage4", speaker: NOAH_TEXT.s4.speaker, lines: NOAH_TEXT.s4.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerStageTextures(this);
    this.add.tileSprite(0, 0, W, FLOOR_H, "noah_deck").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 0, W, TOP, "noah_hull").setOrigin(0).setDepth(DEPTH.WALL - 1);
    this.add.tileSprite(0, FLOOR_H - 16, W, H - FLOOR_H + 16, "noah_hull").setOrigin(0).setDepth(DEPTH.WALL - 1);
    this.add.tileSprite(0, 0, 16, H, "noah_hull").setOrigin(0).setDepth(DEPTH.WALL - 1);
    this.add.tileSprite(W - 16, 0, 16, H, "noah_hull").setOrigin(0).setDepth(DEPTH.WALL - 1);
    this.add.rectangle(0, 0, W, H, 0x0f172a, 0.1).setOrigin(0).setDepth(DEPTH.LIGHT); // light storm gloom
    this.block(W / 2, TOP / 2, W, TOP); this.block(W / 2, FLOOR_H + 16, W, H - FLOOR_H + 16); this.block(8, H / 2, 16, H); this.block(W - 8, H / 2, 16, H);

    for (const [x, y] of PUDDLES) this.add.image(x, y, "noah_puddle").setDepth(DEPTH.RUG);
    this.add.image(120, 174, "noah_table").setOrigin(0.5, 1).setDepth(174);
    this.block(120, 166, 44, 10);
    this.add.image(106, 154, "noah_ladle").setOrigin(0.5, 1).setDepth(175);
    this.add.image(134, 154, "noah_pin").setOrigin(0.5, 1).setDepth(175);
    this.interactables.push(
      { x: 106, y: 176, r: 16, label: tx("[A] Lấy Gầu Nhựa Thông Nóng", "[A] Take the bucket of hot pitch"), active: () => this.running && this.held !== "pitch", act: () => this.take("pitch") },
      { x: 134, y: 176, r: 16, label: tx("[A] Lấy Chốt Gỗ Bách", "[A] Take a cypress peg"), active: () => this.running && this.held !== "pin", act: () => this.take("pin") },
    );
    // Noah and his sons help around the deck
    this.add.sprite(72, 110, "noah_shem").setOrigin(0.5, 1).setDepth(110);
    this.add.sprite(168, 110, "noah_ham").setOrigin(0.5, 1).setDepth(110);
    this.add.sprite(44, 150, "noah_japheth").setOrigin(0.5, 1).setDepth(150);
    this.add.sprite(70, 280, "noah_noah").setOrigin(0.5, 1).setDepth(280);

    // main door (bottom) with its lever
    this.mainDoor = this.add.sprite(120, FLOOR_H - 8, "noah_maindoor", 0).setOrigin(0.5, 1).setDepth(FLOOR_H);
    this.interactables.push({ x: 164, y: 286, r: 22, label: tx("[A] Kéo cần gạt cùng ông Nô-ê", "[A] Pull the lever with Noah"), active: () => this.final, act: () => this.pullLever() });
    this.add.sprite(164, 294, "noah_lever", 0).setOrigin(0.5, 1).setDepth(294);

    WINDOWS.forEach(([x, y]) => this.add.image(x, y, "noah_wnd", 2).setDepth(y + 1));
    const mk = (type: Hazard["type"], x: number, y: number) => {
      const s = this.add.sprite(x, y, type === "leak" ? "noah_leak" : "noah_wnd", 0).setDepth(y + 2).setVisible(false);
      this.hazards.push({ type, x, y, s, active: false });
    };
    LEAKS.forEach(([x, y]) => mk("leak", x, y));
    WINDOWS.forEach(([x, y]) => mk("wnd", x, y));
    this.hazards.forEach((h, i) => this.interactables.push({ x: h.x, y: h.y + (h.type === "wnd" ? (h.y < FLOOR_H / 2 ? 6 : -6) : 0), r: 24, label: h.type === "leak" ? tx("[A] Bịt khe rò bằng nhựa thông", "[A] Seal the leak with pitch") : tx("[A] Đóng chốt cửa sổ bằng chốt gỗ", "[A] Peg the window shut"), active: () => h.active, act: () => this.fix(i) }));
    this.heldImg = this.add.image(0, 0, "noah_ladle").setDepth(DEPTH.FX).setVisible(false);
    this.bar = this.add.graphics().setDepth(DEPTH.UI);
    this.label = this.add.text(W / 2, 24 + TOP - 16, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
    this.rain = this.add.graphics().setDepth(DEPTH.FX - 3);
  }

  protected onStageStart() {
    this.startWave(0);
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startWave(state as number);
  }

  private startWave(n: number) {
    this.wave = n;
    this.waveT = 0;
    this.spawned = 0;
    this.integrity = 100;
    this.held = null;
    this.running = true;
    this.final = false;
    this.hazards.forEach((h) => { h.active = false; h.s.setVisible(false); });
    this.saveCheckpoint(`wave${n}`, n, 120, 210);
  }

  private take(what: "pitch" | "pin") {
    this.held = what;
    audio.sfx("pickup");
    this.heldImg?.setTexture(what === "pitch" ? "noah_ladle" : "noah_pin").setVisible(true);
  }

  private fix(i: number) {
    const h = this.hazards[i];
    const need = h.type === "leak" ? "pitch" : "pin";
    if (this.held !== need) {
      audio.sfx("wrong");
      this.toast = { text: need === "pitch" ? tx("Khe rò cần NHỰA THÔNG!", "The leak needs PITCH!") : tx("Cửa sổ cần CHỐT GỖ!", "The window needs a WOODEN PEG!"), until: this.time.now + 1500 };
      return;
    }
    h.active = false;
    h.s.setVisible(false);
    this.held = null;
    this.heldImg?.setVisible(false);
    audio.sfx("chime");
    this.sparkleBurst(h.x, h.y, 6);
  }

  private pullLever() {
    this.final = false;
    this.running = false;
    audio.sfx("door");
    this.cameras.main.flash(600, 255, 244, 180);
    this.mainDoor?.setFrame(1);
    this.finishStage(NOAH_TEXT.s4);
  }

  private endWave() {
    this.running = false;
    this.hazards.forEach((h) => { h.active = false; h.s.setVisible(false); });
    this.held = null;
    this.heldImg?.setVisible(false);
    audio.sfx("bless");
    if (this.wave + 1 < WAVES.length) this.talk(tx("Ông Nô-ê", "Noah"), NOAH_TEXT.s4.wave.map(tr), () => this.startWave(this.wave + 1));
    else this.talk(tx("Ông Nô-ê", "Noah"), NOAH_TEXT.s4.last.map(tr), () => { this.final = true; });
  }

  update(time?: number, delta = 16) {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    super.update(time, delta);
    this.heldImg?.setPosition(Math.round(this.player.x), Math.round(this.player.y - 18));
    if (this.introActive || this.dialogueOpen) return;

    // slippery puddles: keep sliding the way you were going
    const inPuddle = PUDDLES.some(([x, y]) => Math.abs(this.player.x - x) < 11 && Math.abs(this.player.y + 9 - y) < 7);
    if (inPuddle) {
      if (body.velocity.lengthSq() < 1) body.velocity.copy(this.lastV).scale(0.85);
      else body.velocity.scale(1.3);
    } else if (body.velocity.lengthSq() > 1) this.lastV.copy(body.velocity);

    const frame = Math.floor(this.time.now / 300) % 2;
    this.hazards.forEach((h) => h.active && h.s.setFrame(frame));

    if (!this.running) { this.drawBar(); return; }
    const dt = Math.min(delta, 50) / 1000;
    this.waveT += delta;
    const cfg = WAVES[this.wave];
    while (this.spawned < cfg.n && this.waveT >= 2000 + this.spawned * cfg.gap) {
      const idle = this.hazards.filter((h) => !h.active);
      const h = Phaser.Utils.Array.GetRandom(idle);
      h.active = true;
      h.s.setVisible(true).setFrame(0);
      this.spawned++;
    }
    const open = this.hazards.filter((h) => h.active).length;
    this.integrity = Math.max(0, this.integrity - open * DRAIN * dt);
    this.rain?.clear().fillStyle(0xe0f2fe, 0.55);
    for (let i = 0; i < 30 + this.wave * 20; i++) this.rain?.fillRect((((i * 67 + this.waveT * 0.3) % W) | 0), (((i * 41 + this.waveT * 0.6) % H) | 0), 1, 4);
    this.drawBar();
    if (this.integrity <= 0) {
      this.running = false;
      audio.sfx("wrong");
      this.talk(tx("Con Tàu", "The Ark"), [tx("Nước tràn vào quá nhiều! Hãy bịt kín nhanh hơn. Em thử lại đợt sóng này nhé.", "Too much water is coming in! Seal faster. Try this wave again.")], () => this.resetToCheckpoint());
      return;
    }
    if (this.waveT >= WAVE_MS) this.endWave();
  }

  private drawBar() {
    const g = this.bar?.clear();
    if (!g) return;
    const w = 120, x = (W - w) / 2, y = 36 + TOP - 16;
    g.fillStyle(0x0f172a, 1).fillRect(x - 2, y - 2, w + 4, 8);
    g.fillStyle(this.integrity > 50 ? 0x22c55e : this.integrity > 25 ? 0xfbbf24 : 0xdc2626, 1).fillRect(x, y, Math.round((w * this.integrity) / 100), 4);
    const icon = (ox: number, oy: number, rows: string[], col: number) => {
      g.fillStyle(col, 1);
      rows.forEach((r, j) => [...r].forEach((ch, i) => ch === "X" && g.fillRect(ox + i, oy + j, 1, 1)));
    };
    icon(x - 11, y - 2, [".X.X.", "XXXXX", "XXXXX", ".XXX.", "..X.."], 0xf87171); // heart = hull integrity
    icon(x - 11, y + 6, ["XXXXX", ".XXX.", "..X..", ".XXX.", "XXXXX"], 0x38bdf8); // hourglass = wave time
    const left = this.running ? Math.max(0, 1 - this.waveT / WAVE_MS) : 0; // wave clock: full bar = whole surge ahead
    g.fillStyle(0x0f172a, 1).fillRect(x - 2, y + 6, w + 4, 6);
    g.fillStyle(0x38bdf8, 1).fillRect(x, y + 8, Math.round(w * left), 2);
    if (this.time.now < this.toast.until) this.label?.setText(this.toast.text);
    else if (this.running) this.label?.setText(tx(`Đợt sóng ${this.wave + 1}/3 – còn ${Math.max(0, Math.ceil((WAVE_MS - this.waveT) / 1000))}s`, `Wave ${this.wave + 1}/3 – ${Math.max(0, Math.ceil((WAVE_MS - this.waveT) / 1000))}s left`));
    else if (this.final) this.label?.setText(tx("Kéo cần gạt đóng Cửa Chính!", "Pull the lever to close the Main Door!"));
  }
}
