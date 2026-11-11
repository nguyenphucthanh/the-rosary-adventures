import * as Phaser from "phaser";
import { BaseGenesisScene, DEPTH } from "@/modules/the-garden-of-eden/game/scenes/BaseGenesisScene";
import { registerPrologueTextures } from "@/modules/the-garden-of-eden/game/utils/prologueTextures";
import { PROLOGUE, tr } from "@/modules/the-garden-of-eden/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const ROOM_W = 320;
const ROOM_H = 240;
const WALL = 48;
const PLANT: [number, number] = [76, 74];
const DESK: [number, number] = [200, 90];
const ALTAR: [number, number] = [276, 84];
const CAN: [number, number] = [56, 176];
// Where the three bookmark pieces lie once the plant is watered; index = correct order (Khởi Đầu → Tình Yêu → Sáng Tạo)
const PIECE_AT: [number, number][] = [[40, 126], [170, 200], [270, 176]];

/** Prologue: water the plant, find 3 bookmark pieces, order them to open Genesis, receive the Scroll. */
export class PrologueScene extends BaseGenesisScene {
  private hasCan = false;
  private watered = false;
  private bookOpen = false;
  private pieces: (Phaser.GameObjects.Image | null)[] = [null, null, null];
  private got = [false, false, false];
  private can?: Phaser.GameObjects.Image;
  private plant?: Phaser.GameObjects.Image;
  private book?: Phaser.GameObjects.Image;

  constructor() {
    super("PrologueScene");
    this.worldWidth = ROOM_W;
    this.worldHeight = ROOM_H;
    this.stageKey = "prologue_trang_sach_dau";
    this.spawn = [160, 200];
  }

  create() {
    this.hasCan = this.watered = this.bookOpen = false;
    this.got = [false, false, false];
    this.pieces = [null, null, null];
    this.intro = { illustration: "prologue", speaker: tx("Trang Sách Đầu Tiên", "The First Page"), lines: PROLOGUE.intro.map(tr) };
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

    // morning window + flat sunbeam on the floor
    this.add.image(76, 4, "morning_window").setOrigin(0.5, 0).setDepth(DEPTH.FLOOR);
    this.add.graphics().setDepth(DEPTH.LIGHT).fillStyle(0xfef08a, 0.18).fillPoints([{ x: 56, y: 44 }, { x: 98, y: 44 }, { x: 130, y: 170 }, { x: 70, y: 170 }], true);

    // rug
    const g = this.add.graphics().setDepth(DEPTH.RUG);
    const r = (x: number, y: number, w: number, h: number, c: number) => g.fillStyle(c, 1).fillRect(104 + x, 130 + y, w, h);
    r(0, 0, 112, 72, 0x7f1d1d); r(4, 4, 104, 64, 0xb91c1c); r(8, 8, 96, 2, 0xfef08a); r(8, 62, 96, 2, 0xfef08a); r(50, 30, 12, 12, 0xfef08a); r(53, 33, 6, 6, 0x7f1d1d);

    this.plant = this.prop(PLANT[0], PLANT[1], "plant_sprout", 12, 6);
    this.prop(140, 66, "bookshelf", 28, 8);
    this.prop(DESK[0], DESK[1], "desk", 40, 10);
    this.prop(ALTAR[0], ALTAR[1], "home_altar", 32, 10);
    this.add.image(ALTAR[0], ALTAR[1] - 8, "rosary_item").setOrigin(0.5, 1).setDepth(ALTAR[1] + 1);
    this.book = this.add.image(DESK[0] - 6, DESK[1] - 14, "book_closed").setOrigin(0.5, 1).setDepth(DESK[1] + 1);

    const lamp = this.add.image(DESK[0] + 14, DESK[1] - 12, "gen_glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.3);
    this.tweens.add({ targets: lamp, alpha: 0.45, duration: 1800, yoyo: true, repeat: -1 });

    this.can = this.pickup(CAN[0], CAN[1], "watering_can");
    this.defineInteractables();
  }

  private defineInteractables() {
    this.interactables = [
      {
        x: CAN[0], y: CAN[1] - 6, r: 28, label: tr(PROLOGUE.canHint), active: () => !this.hasCan,
        act: () => {
          this.hasCan = true;
          audio.sfx("pickup");
          if (this.can) this.removePickup(this.can);
          this.talk(tx("Bình tưới", "Watering can"), PROLOGUE.canPicked.map(tr));
        },
      },
      {
        x: PLANT[0], y: PLANT[1] - 6, r: 34, label: tx("[A] Chậu cây non", "[A] Seedling pot"), active: () => !this.watered,
        act: () => (this.hasCan ? this.water() : this.talk(tx("Chậu cây", "Plant pot"), PROLOGUE.plantNoCan.map(tr))),
      },
      { x: DESK[0], y: DESK[1] - 4, r: 38, label: tx("[A] Cuốn Kinh Thánh", "[A] The Bible"), active: () => !this.bookOpen, act: () => this.desk() },
    ];
    PIECE_AT.forEach(([x, y], i) => {
      this.interactables.push({
        x, y: y - 6, r: 24, label: tx("[A] Mảnh dấu trang", "[A] Bookmark piece"), active: () => !!this.pieces[i] && !this.got[i],
        act: () => this.collect(i),
      });
    });
  }

  private water() {
    this.watered = true;
    audio.sfx("bless");
    this.plant?.setTexture("plant_bloom");
    this.sparkleBurst(PLANT[0], PLANT[1] - 14);
    this.talk(tx("Chậu cây", "Plant pot"), PROLOGUE.plantWater.map(tr), () => {
      PIECE_AT.forEach(([x, y], i) => {
        this.pieces[i] = this.pickup(x, y, `bookmark_${i}`);
        this.sparkleBurst(x, y - 6, 6);
      });
    });
  }

  private collect(i: number) {
    this.got[i] = true;
    audio.sfx("pickup");
    const img = this.pieces[i];
    if (img) this.removePickup(img);
    this.talk(tx("Dấu trang", "Bookmark"), [tr(PROLOGUE.pieceFound) + tr(PROLOGUE.pieces[i])]);
  }

  private desk() {
    const n = this.got.filter(Boolean).length;
    if (!this.watered) return this.talk(tx("Kinh Thánh", "Bible"), PROLOGUE.deskNotYet.map(tr));
    if (n < 3) return this.talk(tx("Kinh Thánh", "Bible"), [tr(PROLOGUE.deskPartial).replace("{n}", String(n))]);
    this.arrange([]);
  }

  /** Pick the pieces in order. A wrong pick clears the row and the child tries again (soft reset, no penalty). */
  private arrange(order: number[]) {
    const left = [0, 1, 2].filter((i) => !order.includes(i));
    if (left.length === 1) return this.openBook();
    this.talk(
      tx("Cuốn Kinh Thánh", "The Bible"),
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
            this.talk(tx("Cuốn Kinh Thánh", "The Bible"), PROLOGUE.deskWrong.map(tr));
          }
        },
      }))
    );
  }

  private openBook() {
    this.bookOpen = true;
    this.book?.setTexture("book_open");
    this.cameras.main.flash(500, 255, 244, 180);
    audio.sfx("bless");
    this.galaxyRise(DESK[0] - 6, DESK[1] - 18);
    this.talk(tx("Trang Sách Đầu Tiên", "The First Page"), PROLOGUE.bookOpens.map(tr), () => this.spiritAppears());
  }

  /** Stepped violet/blue motes rising from the page. */
  private galaxyRise(x: number, y: number) {
    const cols = [0x4c1d95, 0x7c3aed, 0x1d4ed8, 0xfef08a];
    for (let i = 0; i < 24; i++) {
      const m = this.add.rectangle(x + Phaser.Math.Between(-10, 10), y, 2, 2, cols[i % 4]).setDepth(DEPTH.FX);
      this.tweens.add({
        targets: m, y: y - Phaser.Math.Between(30, 70), x: m.x + Phaser.Math.Between(-16, 16), alpha: 0,
        duration: Phaser.Math.Between(1200, 2400), delay: i * 90, ease: "Stepped", easeParams: [10], onComplete: () => m.destroy(),
      });
    }
  }

  private spiritAppears() {
    const dove = this.spawnDove(DESK[0] - 6, DESK[1] - 24);
    this.sparkleBurst(DESK[0] - 6, DESK[1] - 24);
    this.glideTo(dove, ALTAR[0] - 28, ALTAR[1] + 20);
    this.time.delayedCall(1500, () =>
      this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), PROLOGUE.spirit.map(tr), () => {
        this.completeStage();
        this.talk(tx("Suy niệm", "Reflection"), [tr(PROLOGUE.lesson)], () => this.goToNextStage());
      })
    );
  }
}
