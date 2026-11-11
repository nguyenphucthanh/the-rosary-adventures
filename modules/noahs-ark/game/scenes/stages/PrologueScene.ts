import * as Phaser from "phaser";
import { BaseNoahScene, DEPTH } from "@/modules/noahs-ark/game/scenes/BaseNoahScene";
import { registerPrologueTextures } from "@/modules/noahs-ark/game/utils/prologueTextures";
import { PROLOGUE, tr } from "@/modules/noahs-ark/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const ROOM_W = 320;
const ROOM_H = 240;
const WALL = 48;
const WINDOW: [number, number] = [76, 4];
const DESK: [number, number] = [200, 90];
const ALTAR: [number, number] = [276, 84];
// Where the three model pieces lie once the window is wiped; index = correct build order (hull → roof → door)
const PIECE_AT: [number, number][] = [[40, 150], [170, 205], [270, 175]];

/** Prologue: wipe the rainy window, find 3 ark-model pieces, build them in order, receive the Covenant Sea Chart. */
export class PrologueScene extends BaseNoahScene {
  private wiped = false;
  private done = false;
  private pieces: (Phaser.GameObjects.Image | null)[] = [null, null, null];
  private got = [false, false, false];
  private model?: Phaser.GameObjects.Image;
  private win?: Phaser.GameObjects.Sprite;
  private beam?: Phaser.GameObjects.Graphics;

  constructor() {
    super("PrologueScene");
    this.worldWidth = ROOM_W;
    this.worldHeight = ROOM_H;
    this.stageKey = "prologue_canh_chim_va_con_tau";
    this.spawn = [160, 200];
  }

  create() {
    this.wiped = this.done = false;
    this.got = [false, false, false];
    this.pieces = [null, null, null];
    this.intro = { illustration: "prologue", speaker: tx("Cơn Mưa Chiều", "The Afternoon Rain"), lines: PROLOGUE.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerPrologueTextures(this);
    this.add.tileSprite(0, WALL, ROOM_W, ROOM_H - WALL, "floor_wood").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 0, ROOM_W, WALL, "wall_paper").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, WALL, ROOM_W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.block(ROOM_W / 2, (WALL + 6) / 2, ROOM_W, WALL + 6);
    this.block(8, ROOM_H / 2, 16, ROOM_H);
    this.block(ROOM_W - 8, ROOM_H / 2, 16, ROOM_H);
    this.block(ROOM_W / 2, ROOM_H - 8, ROOM_W, 16);

    // rainy window (2-frame drizzle) + a cool grey beam on the floor; warms up when wiped
    if (!this.anims.exists("rain_window")) this.anims.create({ key: "rain_window", frames: this.anims.generateFrameNumbers("rain_window", { start: 0, end: 1 }), frameRate: 3, repeat: -1 });
    this.win = this.add.sprite(WINDOW[0], WINDOW[1], "rain_window").setOrigin(0.5, 0).setDepth(DEPTH.FLOOR).play("rain_window");
    this.beam = this.add.graphics().setDepth(DEPTH.LIGHT);
    this.drawBeam(0x94a3b8, 0.14);

    // rug
    const g = this.add.graphics().setDepth(DEPTH.RUG);
    const r = (x: number, y: number, w: number, h: number, c: number) => g.fillStyle(c, 1).fillRect(104 + x, 130 + y, w, h);
    r(0, 0, 112, 72, 0x1e3a8a); r(4, 4, 104, 64, 0x1d4ed8); r(8, 8, 96, 2, 0xfef08a); r(8, 62, 96, 2, 0xfef08a); r(50, 30, 12, 12, 0xfef08a); r(53, 33, 6, 6, 0x1e3a8a);

    this.prop(140, 66, "bookshelf", 28, 8);
    this.prop(DESK[0], DESK[1], "desk", 40, 10);
    this.prop(ALTAR[0], ALTAR[1], "home_altar", 32, 10);
    this.prop(40, 210, "schoolbag", 12, 6);
    this.add.image(ALTAR[0] - 18, ALTAR[1] - 4, "noah_olive").setOrigin(0.5, 1).setDepth(ALTAR[1] + 1);
    this.model = this.add.image(DESK[0] + 8, DESK[1] - 14, "ark_model_base").setOrigin(0.5, 1).setDepth(DESK[1] + 1);
    this.add.image(DESK[0] - 12, DESK[1] - 14, "book_open").setOrigin(0.5, 1).setDepth(DESK[1] + 1);

    const lamp = this.add.image(DESK[0] + 22, DESK[1] - 12, "noah_glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.3);
    this.tweens.add({ targets: lamp, alpha: 0.45, duration: 1800, yoyo: true, repeat: -1 });

    this.defineInteractables();
  }

  private drawBeam(color: number, alpha: number) {
    this.beam?.clear().fillStyle(color, alpha).fillPoints([{ x: 56, y: 44 }, { x: 98, y: 44 }, { x: 130, y: 170 }, { x: 70, y: 170 }], true);
  }

  private defineInteractables() {
    this.interactables = [
      { x: WINDOW[0], y: WALL + 8, r: 34, label: tr(PROLOGUE.windowHint), active: () => !this.wiped, act: () => this.wipeWindow() },
      { x: DESK[0], y: DESK[1] - 4, r: 38, label: tx("[A] Mô hình Con Tàu", "[A] Ark model"), active: () => !this.done, act: () => this.desk() },
    ];
    PIECE_AT.forEach(([x, y], i) => {
      this.interactables.push({ x, y: y - 6, r: 24, label: tx("[A] Mảnh gỗ mô hình", "[A] Model piece"), active: () => !!this.pieces[i] && !this.got[i], act: () => this.collect(i) });
    });
  }

  private wipeWindow() {
    this.wiped = true;
    audio.sfx("bless");
    this.win?.stop().setTexture("rainbow_window");
    this.drawBeam(0xfef08a, 0.18);
    this.sparkleBurst(WINDOW[0], WINDOW[1] + 24);
    this.talk(tx("Cửa sổ", "Window"), PROLOGUE.windowWipe.map(tr), () => {
      PIECE_AT.forEach(([x, y], i) => {
        this.pieces[i] = this.pickup(x, y, `ark_piece_${i}`);
        this.sparkleBurst(x, y - 6, 6);
      });
    });
  }

  private collect(i: number) {
    this.got[i] = true;
    audio.sfx("pickup");
    const img = this.pieces[i];
    if (img) this.removePickup(img);
    this.talk(tx("Mảnh gỗ", "Wooden piece"), [tr(PROLOGUE.pieceFound) + tr(PROLOGUE.pieces[i])]);
  }

  private desk() {
    const n = this.got.filter(Boolean).length;
    if (!this.wiped) return this.talk(tx("Mô hình", "Model"), PROLOGUE.deskNotYet.map(tr));
    if (n < 3) return this.talk(tx("Mô hình", "Model"), [tr(PROLOGUE.deskPartial).replace("{n}", String(n))]);
    this.arrange([]);
  }

  /** Pick the pieces in order. A wrong pick clears the row and the child tries again (soft reset, no penalty). */
  private arrange(order: number[]) {
    const left = [0, 1, 2].filter((i) => !order.includes(i));
    if (left.length === 1) return this.finishModel();
    this.talk(
      tx("Mô hình Con Tàu", "Ark model"),
      [tr(order.length ? PROLOGUE.deskNext : PROLOGUE.deskStart)],
      undefined,
      left.map((i) => ({
        label: tr(PROLOGUE.pieces[i]),
        onSelect: () => {
          if (i === order.length) {
            audio.sfx("chime");
            this.arrange([...order, i]);
          } else {
            audio.sfx("wrong");
            this.talk(tx("Mô hình Con Tàu", "Ark model"), PROLOGUE.deskWrong.map(tr));
          }
        },
      }))
    );
  }

  private finishModel() {
    this.done = true;
    this.model?.setTexture("ark_model_done");
    this.cameras.main.flash(500, 255, 244, 180);
    audio.sfx("bless");
    this.sparkleBurst(DESK[0] + 8, DESK[1] - 24, 12);
    this.talk(tx("Con Tàu Nô-ê", "Noah's Ark"), PROLOGUE.modelDone.map(tr), () => this.spiritAppears());
  }

  private spiritAppears() {
    const dove = this.spawnDove(DESK[0] - 12, DESK[1] - 30);
    this.sparkleBurst(DESK[0] - 12, DESK[1] - 30);
    this.glideTo(dove, DESK[0] - 34, DESK[1] + 28);
    this.time.delayedCall(1500, () =>
      this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), PROLOGUE.spirit.map(tr), () => {
        this.completeStage();
        this.talk(tx("Suy niệm", "Reflection"), [tr(PROLOGUE.lesson)], () => this.goToNextStage());
      })
    );
  }
}
