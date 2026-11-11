import * as Phaser from "phaser";
import { BaseExodusScene, DEPTH } from "@/modules/moses-the-exodus/game/scenes/BaseExodusScene";
import { registerPrologueTextures } from "@/modules/moses-the-exodus/game/utils/prologueTextures";
import { PROLOGUE, tr } from "@/modules/moses-the-exodus/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const ROOM_W = 320;
const ROOM_H = 240;
const WALL = 48;
const WINDOW: [number, number] = [76, 4];
const DESK: [number, number] = [200, 90];
const ALTAR: [number, number] = [276, 84];
// Where the three map pieces lie once the lamp is on; index = correct route order (Egypt -> Red Sea -> Sinai)
const PIECE_AT: [number, number][] = [[40, 150], [170, 205], [270, 175]];

/** Prologue: light the desk lamp, find 3 torn map pieces, join them in order, receive the Journey Tablets. */
export class PrologueScene extends BaseExodusScene {
  private lit = false;
  private done = false;
  private pieces: (Phaser.GameObjects.Image | null)[] = [null, null, null];
  private got = [false, false, false];
  private map?: Phaser.GameObjects.Image;
  private lamp?: Phaser.GameObjects.Image;
  private lampGlow?: Phaser.GameObjects.Image;
  private beam?: Phaser.GameObjects.Graphics;

  constructor() {
    super("PrologueScene");
    this.worldWidth = ROOM_W;
    this.worldHeight = ROOM_H;
    this.stageKey = "prologue_cay_gay_nguoi_muc_tu";
    this.spawn = [160, 200];
  }

  create() {
    this.lit = this.done = false;
    this.got = [false, false, false];
    this.pieces = [null, null, null];
    this.intro = { illustration: "start", speaker: tx("Cuốn Sách Xuất Hành", "The Book of Exodus"), lines: PROLOGUE.intro.map(tr) };
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

    // night window (2-frame twinkle) + a cool moon beam on the floor
    if (!this.anims.exists("prologue_night_window")) this.anims.create({ key: "prologue_night_window", frames: this.anims.generateFrameNumbers("prologue_night_window", { start: 0, end: 1 }), frameRate: 1, repeat: -1 });
    this.add.sprite(WINDOW[0], WINDOW[1], "prologue_night_window").setOrigin(0.5, 0).setDepth(DEPTH.FLOOR).play("prologue_night_window");
    this.add.graphics().setDepth(DEPTH.LIGHT).fillStyle(0x94a3b8, 0.1).fillPoints([{ x: 56, y: 44 }, { x: 98, y: 44 }, { x: 130, y: 170 }, { x: 70, y: 170 }], true);

    // desert-coloured rug with a gold centre
    const g = this.add.graphics().setDepth(DEPTH.RUG);
    const r = (x: number, y: number, w: number, h: number, c: number) => g.fillStyle(c, 1).fillRect(104 + x, 130 + y, w, h);
    r(0, 0, 112, 72, 0x92400e); r(4, 4, 104, 64, 0xa16207); r(8, 8, 96, 2, 0xfef08a); r(8, 62, 96, 2, 0xfef08a); r(50, 30, 12, 12, 0xfef08a); r(53, 33, 6, 6, 0x92400e);

    this.prop(140, 66, "bookshelf", 28, 8);
    this.prop(DESK[0], DESK[1], "desk", 40, 10);
    this.prop(ALTAR[0], ALTAR[1], "home_altar", 32, 10);
    this.prop(40, 210, "schoolbag", 12, 6);
    this.add.image(ALTAR[0] - 18, ALTAR[1] - 4, "exodus_staff").setOrigin(0.5, 1).setDepth(ALTAR[1] + 1);
    this.map = this.add.image(DESK[0] + 6, DESK[1] - 14, "map_base").setOrigin(0.5, 1).setDepth(DESK[1] + 1);
    this.add.image(DESK[0] - 14, DESK[1] - 14, "book_open").setOrigin(0.5, 1).setDepth(DESK[1] + 1);
    this.lamp = this.add.image(DESK[0] + 24, DESK[1] - 12, "desk_lamp_off").setOrigin(0.5, 1).setDepth(DESK[1] + 1);
    this.lampGlow = this.add.image(DESK[0] + 24, DESK[1] - 20, "exodus_glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0);
    this.beam = this.add.graphics().setDepth(DEPTH.LIGHT);

    this.interactables = [
      { x: DESK[0] + 10, y: DESK[1] - 4, r: 38, label: () => tr(this.lit ? PROLOGUE.mapHint : PROLOGUE.lampHint), active: () => !this.done, act: () => this.desk() },
    ];
    PIECE_AT.forEach(([x, y], i) => {
      this.interactables.push({ x, y: y - 6, r: 24, label: tx("[A] Mảnh bản đồ", "[A] Map piece"), active: () => !!this.pieces[i] && !this.got[i], act: () => this.collect(i) });
    });
  }

  private desk() {
    if (!this.lit) return this.lightLamp();
    const n = this.got.filter(Boolean).length;
    if (n < 3) return this.talk(tx("Bản đồ cổ", "Old map"), [tr(PROLOGUE.mapPartial).replace("{n}", String(n))]);
    this.arrange([]);
  }

  private lightLamp() {
    this.lit = true;
    audio.sfx("bless");
    this.lamp?.setTexture("desk_lamp_on");
    this.lampGlow?.setAlpha(0.35);
    this.tweens.add({ targets: this.lampGlow, alpha: 0.5, duration: 1800, yoyo: true, repeat: -1 });
    this.beam?.clear().fillStyle(0xfef08a, 0.12).fillPoints([{ x: DESK[0] + 18, y: DESK[1] - 8 }, { x: DESK[0] + 30, y: DESK[1] - 8 }, { x: DESK[0] + 70, y: DESK[1] + 70 }, { x: DESK[0] - 10, y: DESK[1] + 70 }], true);
    this.sparkleBurst(DESK[0] + 24, DESK[1] - 20);
    this.talk(tx("Ngọn đèn bàn học", "Desk lamp"), PROLOGUE.lampLit.map(tr), () => {
      PIECE_AT.forEach(([x, y], i) => {
        this.pieces[i] = this.pickup(x, y, `map_piece_${i}`);
        this.sparkleBurst(x, y - 6, 6);
      });
    });
  }

  private collect(i: number) {
    this.got[i] = true;
    audio.sfx("pickup");
    const img = this.pieces[i];
    if (img) this.removePickup(img);
    this.talk(tx("Mảnh bản đồ", "Map piece"), [tr(PROLOGUE.pieceFound) + tr(PROLOGUE.pieces[i])]);
  }

  /** Pick the pieces in route order. A wrong pick clears the row and the child tries again (soft reset, no penalty). */
  private arrange(order: number[]) {
    const left = [0, 1, 2].filter((i) => !order.includes(i));
    if (left.length === 1) return this.finishMap();
    this.talk(
      tx("Lộ trình Xuất Hành", "Exodus route"),
      [tr(order.length ? PROLOGUE.mapNext : PROLOGUE.mapStart)],
      undefined,
      left.map((i) => ({
        label: tr(PROLOGUE.pieces[i]).split(" — ")[0],
        onSelect: () => {
          if (i === order.length) {
            audio.sfx("chime");
            this.arrange([...order, i]);
          } else {
            audio.sfx("wrong");
            this.talk(tx("Lộ trình Xuất Hành", "Exodus route"), PROLOGUE.mapWrong.map(tr));
          }
        },
      }))
    );
  }

  private finishMap() {
    this.done = true;
    this.map?.setTexture("map_done");
    this.cameras.main.flash(500, 255, 244, 180);
    audio.sfx("bless");
    this.sparkleBurst(DESK[0] + 6, DESK[1] - 24, 12);
    this.talk(tx("Bản đồ Xuất Hành", "Exodus map"), PROLOGUE.mapDone.map(tr), () => this.spiritAppears());
  }

  private spiritAppears() {
    const dove = this.spawnDove(DESK[0] - 14, DESK[1] - 30);
    this.sparkleBurst(DESK[0] - 14, DESK[1] - 30);
    this.glideTo(dove, DESK[0] - 36, DESK[1] + 28);
    this.time.delayedCall(1500, () =>
      this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), PROLOGUE.spirit.map(tr), () => {
        this.completeStage();
        this.talk(tx("Suy niệm", "Reflection"), [tr(PROLOGUE.lesson)], () => this.goToNextStage());
      })
    );
  }
}
