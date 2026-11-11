import * as Phaser from "phaser";
import { BaseGenesisScene, DEPTH } from "@/modules/the-garden-of-eden/game/scenes/BaseGenesisScene";
import type { Player } from "@/modules/shared/game/entities/Player";
import { DEFAULT_CHARACTER, type CharacterCustomization } from "@/modules/shared/types";
import { registerStageTextures } from "@/modules/the-garden-of-eden/game/utils/stageTextures";
import { registerEdenTextures } from "@/modules/the-garden-of-eden/game/utils/edenTextures";
import { STAGE_TEXT } from "@/modules/the-garden-of-eden/data/stageText";
import { tr } from "@/modules/the-garden-of-eden/data/dialogues";
import { ADAM as ADAM_MAP, EVE as EVE_MAP } from "@/modules/the-garden-of-eden/game/utils/genesisTextures";
import { type PixelMap, drawMap, makeCanvas } from "@/modules/shared/game/utils/pixelArt";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

/** 4 dirs x 4 steps from one front-facing map; walk steps (1, 3) bob up 1px. */
const sheetOf = (map: PixelMap) => {
  const { canvas, ctx } = makeCanvas(128, 128);
  for (let d = 0; d < 4; d++) for (let s = 0; s < 4; s++) drawMap(ctx, map, s * 32, d * 32 - (s % 2));
  return canvas;
};

const W = 320;
const H = 240;
const EVE = { ...DEFAULT_CHARACTER, name: "E-va", gender: "girl" as const, hairStyle: "wavy", hairColor: "#d97706", outfitColor: "#be185d", accessory: undefined, spriteKey: "eve_partner" };
const ADAM = { ...DEFAULT_CHARACTER, name: tx("A-đam", "Adam"), hairColor: "#5b3a1e", outfitColor: "#15803d", accessory: undefined, spriteKey: "adam_partner" };
const RED: [number, number] = [40, 204]; // Red Plate (west bank, south)
const BLUE: [number, number] = [250, 204]; // Blue Plate (east bank, south)
const JAR: [number, number] = [110, 204];
const PULLEY: [number, number] = [184, 150];
const BED: [number, number] = [112, 44]; // Flower Bed (west bank, north)
const ROPE_X = 140; // west rope post column
// rope segments [x, y, w, h]: along y150 (east post -> west post), then up x140 to the bed's y
const ROPE: [number, number, number, number][] = [[ROPE_X, PULLEY[1] - 10, PULLEY[0] - ROPE_X, 1], [ROPE_X, BED[1] - 20, 1, PULLEY[1] - BED[1] + 10], [BED[0] + 10, BED[1] - 20, ROPE_X - BED[0] - 10, 1]];
const PAD_W: [number, number] = [36, 28];
const PAD_E: [number, number] = [250, 28];
const HOLD = 3000; // ms both must stand on the Light Pads

/** Stage 9: dual-character co-op. [B] swaps Adam's bank and Eve's bank; neither bank can be solved alone. */
export class Stage09EveCoopScene extends BaseGenesisScene {
  private adam!: Player;
  private eve!: Player;
  private bridge!: ReturnType<BaseGenesisScene["door"]>;
  private gate!: ReturnType<BaseGenesisScene["door"]>;
  private hedge!: ReturnType<BaseGenesisScene["door"]>;
  private hasJar = false;
  private jarSent = false;
  private watered = false;
  private jarOnWall?: Phaser.GameObjects.Image;
  private jarWorld?: Phaser.GameObjects.Image;
  private bed?: Phaser.GameObjects.Sprite;
  private padsLit = [false, false];
  private pads: Phaser.GameObjects.Sprite[] = [];
  private plates: Phaser.GameObjects.Sprite[] = [];
  private hold = 0;
  private bar?: Phaser.GameObjects.Text;
  private done = false;

  constructor() {
    super("Stage09EveCoopScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_09_tao_dung_eva";
    this.spawn = [60, 172];
  }

  protected createPlayerAt(x: number, y: number, _custom?: CharacterCustomization) {
    super.createPlayerAt(x, y, ADAM); // story character, not the saved avatar
    this.player.fixedLook = true;
    this.player.useSheet(sheetOf(ADAM_MAP)); // same look as the Adam in the other Eden scenes
  }

  create() {
    this.hasJar = this.jarSent = this.watered = this.done = false;
    this.hold = 0;
    this.pads = [];
    this.plates = [];
    this.padsLit = [false, false];
    this.intro = { illustration: "eve", speaker: STAGE_TEXT.s9.speaker, lines: STAGE_TEXT.s9.intro.map(tr) };
    super.create();
  }

  private wall(x0: number, y0: number, x1: number, y1: number, key = "gen_hedge") {
    const w = x1 - x0, h = y1 - y0;
    this.add.tileSprite(x0 + w / 2, y0 + h / 2, w, h, key).setDepth(y1);
    this.block(x0 + w / 2, y0 + h / 2, w, h);
  }

  protected buildWorld() {
    registerStageTextures(this);
    registerEdenTextures(this);
    this.add.tileSprite(0, 0, W, H, "gen_flower_floor").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, H).setOrigin(0).setStrokeStyle(4, 0xf9a8d4).setDepth(DEPTH.RUG);
    this.block(W / 2, 4, W, 8); this.block(W / 2, H - 4, W, 8); this.block(4, H / 2, 8, H); this.block(W - 4, H / 2, 8, H);
    // crystal creek down the middle; the bridge gap sits at y 112-128
    for (const [y0, y1] of [[8, 112], [128, 232]]) {
      this.add.tileSprite(160, (y0 + y1) / 2, 24, y1 - y0, "gen_water").setDepth(DEPTH.RUG + 1);
      this.block(160, (y0 + y1) / 2, 24, y1 - y0);
    }
    this.add.tileSprite(160, 120, 24, 16, "gen_bridge").setDepth(DEPTH.RUG + 1);
    this.bridge = this.door(160, 120, 24, 16, "gen_water");
    // west bank: wall with a stone gate, hedge-sealed Light Pad room
    this.wall(8, 88, 40, 104, "gen_wall"); this.wall(72, 88, 148, 104, "gen_wall");
    this.gate = this.door(56, 96, 32, 16, "gen_gate");
    this.wall(64, 8, 72, 60);
    this.hedge = this.door(36, 56, 56, 16, "gen_hedge");
    // east bank: hedge maze (path: south gap east -> west along the corridor -> north gap west)
    this.wall(172, 88, 280, 104); this.wall(200, 48, 312, 64);

    this.plates.push(this.add.sprite(RED[0], RED[1], "gen_plate_r", 0).setOrigin(0.5, 1).setDepth(DEPTH.RUG + 1));
    this.plates.push(this.add.sprite(BLUE[0], BLUE[1], "gen_plate_b", 0).setOrigin(0.5, 1).setDepth(DEPTH.RUG + 1));
    this.pads = [PAD_W, PAD_E].map(([x, y]) => this.add.sprite(x, y, "gen_pad_light", 0).setOrigin(0.5, 1).setDepth(DEPTH.RUG + 1));
    this.bed = this.add.sprite(BED[0], BED[1], "gen_flowerbed", 0).setOrigin(0.5, 1).setDepth(BED[1]);
    this.jarWorld = this.pickup(JAR[0], JAR[1], "gen_jar");
    for (const [x, y, w, h] of ROPE) this.add.rectangle(x, y, w, h, 0x5b2a0c).setOrigin(0).setDepth(DEPTH.FX - 3); // pulley rope: east post -> across creek -> up the west bank to the bed
    for (const [x, y] of [[ROPE_X, PULLEY[1]], [ROPE_X, BED[1] - 10]]) this.add.rectangle(x - 2, y - 10, 4, 12, 0x5b2a0c).setOrigin(0).setDepth(y + 2);
    this.add.image(PULLEY[0], PULLEY[1], "gen_seed").setOrigin(0.5, 1).setDepth(PULLEY[1]);
    this.bar = this.add.text(W / 2, 12, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5).setDepth(DEPTH.FX);
    this.label(RED, tx("Bàn Đạp Đỏ", "Red Pedal")); this.label(BLUE, tx("Bàn Đạp Xanh", "Blue Pedal")); this.label(PULLEY, tx("Ròng Rọc", "Pulley"), -26); this.label(BED, tx("Cầu Hoa Leo", "Vine Bridge"), -22);

    this.interactables.push(
      { x: JAR[0], y: JAR[1], r: 20, label: tx("[A] Nhặt Bình Nước", "[A] Pick up the Water Jar"), active: () => !this.hasJar && !this.jarSent && this.player === this.eve, act: () => this.takeJar() },
      { x: PULLEY[0], y: PULLEY[1] - 4, r: 24, label: tx("[A] Đặt bình lên Ròng Rọc", "[A] Put the jar on the Pulley"), active: () => this.hasJar && this.player === this.eve, act: () => this.sendJar() },
      { x: BED[0], y: BED[1] - 4, r: 24, label: tx("[A] Tưới Cầu Hoa Leo", "[A] Water the Vine Bridge"), active: () => this.jarSent && !this.watered && this.player === this.adam, act: () => this.water() },
    );
  }

  private label(p: [number, number], s: string, dy = 8) {
    this.add.text(p[0], p[1] + dy, s, { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fef3c7", resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.FX);
  }

  protected onStageStart() {
    this.adam = this.player;
    this.enableDualCharacters(EVE, 236, 150);
    this.eve = this.chars[1];
    this.eve.fixedLook = true;
    this.eve.useSheet(sheetOf(EVE_MAP));
    this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), [tx("Em điều khiển bờ Tây. Nhấn B để chuyển sang E-va ở bờ Đông. Bước 1: đứng lên Bàn Đạp Đỏ để hạ cầu rồi đổi người, cho E-va sang lấy Bình Nước.", "You control the west bank. Press B to switch to Eve on the east bank. Step 1: stand on the Red Pedal to lower the bridge, then switch so Eve can fetch the Water Jar.")]);
  }

  private takeJar() {
    audio.sfx("pickup");
    this.hasJar = true;
    if (this.jarWorld) this.removePickup(this.jarWorld);
    this.jarWorld = undefined;
    this.talk("E-va", [tx("Đã có Bình Nước Suối Nguồn! Mang về bờ Đông, đặt lên Ròng Rọc nhé.", "You have the Spring Water Jar! Bring it to the east bank and put it on the Pulley.")]);
  }

  private sendJar() {
    audio.sfx("whoosh");
    this.hasJar = false;
    this.jarSent = true;
    const j = this.add.image(PULLEY[0], PULLEY[1] - 12, "gen_jar").setDepth(DEPTH.FX);
    const t = (props: object, duration: number, onComplete?: () => void) => this.tweens.add({ targets: j, ...props, duration, ease: "Stepped", easeParams: [8], onComplete });
    // slide along the rope: across the creek, up the west bank, then in to the bed
    t({ x: ROPE_X }, 500, () => t({ y: BED[1] - 20 }, 700, () => t({ x: BED[0] + 10, y: BED[1] - 6 }, 300, () => { this.jarOnWall = j; })));
    this.time.delayedCall(1700, () => this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), [tx("Bình Nước đã sang bờ Tây! Bước 2: A-đam rời Bàn Đạp Đỏ, tưới Cầu Hoa Leo. E-va đứng lên Bàn Đạp Xanh để mở cổng đá cho A-đam.", "The Water Jar has reached the west bank! Step 2: Adam leaves the Red Pedal and waters the Vine Bridge. Eve stands on the Blue Pedal to open the stone gate for Adam.")]));
  }

  private water() {
    audio.sfx("chime");
    this.watered = true;
    this.jarOnWall?.destroy();
    this.bed?.setFrame(1);
    this.hedge.set(false);
    this.sparkleBurst(BED[0], BED[1] - 10, 8);
    this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), [tx("Hoa leo nở rộ, hàng rào mở lối! Bước 3: cả hai cùng đứng trên Bệ Ánh Sáng trong 3 giây.", "The vines bloom and the fence opens! Step 3: both stand on the Light Pad for 3 seconds.")]);
  }

  private on(p: Player, [x, y]: [number, number], r = 11) {
    return !!p && Math.hypot(p.x - x, p.y + 9 - y) < r;
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    this.chars.slice(1).forEach((p) => p.setMovementLock(true)); // dialogue-close unlocks every Player; keep the idle one parked
    if (!this.eve || this.introActive || this.done) return;
    const red = this.on(this.adam, RED) || this.on(this.eve, RED);
    const blue = this.on(this.adam, BLUE) || this.on(this.eve, BLUE);
    if (this.bridge.isClosed() === red) { this.bridge.set(!red); audio.sfx("door"); }
    if (this.gate.isClosed() === blue) { this.gate.set(!blue); audio.sfx("door"); }
    this.plates[0].setFrame(red ? 1 : 0);
    this.plates[1].setFrame(blue ? 1 : 0);
    this.padsLit = [this.on(this.adam, PAD_W), this.on(this.eve, PAD_E)];
    this.pads.forEach((p, i) => p.setFrame(this.padsLit[i] ? 1 : 0));
    if (this.padsLit[0] && this.padsLit[1]) {
      this.hold += delta;
      this.bar?.setText(tx(`Đồng tâm hiệp lực... ${Math.max(0, Math.ceil((HOLD - this.hold) / 1000))}`, `Working together... ${Math.max(0, Math.ceil((HOLD - this.hold) / 1000))}`));
      if (this.hold >= HOLD) this.finale();
    } else {
      this.hold = 0;
      this.bar?.setText("");
    }
  }

  private finale() {
    this.done = true;
    this.bar?.setText("");
    audio.sfx("bless");
    this.cameras.main.flash(700, 255, 244, 180);
    for (let y = 8; y < 232; y += 16) { // bridge of light joining both banks
      const r = this.add.rectangle(160, y + 8, 24, 16, 0xfef08a, 0.8).setDepth(DEPTH.FX - 2);
      this.tweens.add({ targets: r, alpha: 0.35, duration: 500, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    }
    this.sparkleBurst(160, 120, 16);
    this.time.delayedCall(1400, () => this.finishStage(STAGE_TEXT.s9));
  }
}
