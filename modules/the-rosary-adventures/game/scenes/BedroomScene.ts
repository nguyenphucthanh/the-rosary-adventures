import * as Phaser from "phaser";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAllForGlory } from "@/modules/the-rosary-adventures/game/utils/gloryTextureGenerator";
import { registerBedroomTextures } from "@/modules/the-rosary-adventures/game/utils/bedroomTextureGenerator";

export const ROOM_W = 320;
export const ROOM_H = 240;
const WALL = 48;

/** Furniture spots (foot positions) shared by Prologue and Epilogue. */
export const SPOT = {
  bed: [44, 108],
  shelf: [108, 66],
  desk: [172, 76],
  altar: [276, 80],
  bag: [118, 170],
  spawn: [160, 200],
  window: [240, 6],
} as const satisfies Record<string, readonly [number, number]>;

/** The child's small bedroom at night. Subclass calls buildRoom() first in create(). */
export abstract class BedroomScene extends InteractiveScene {
  protected bookSprite!: Phaser.GameObjects.Image;
  protected candleSprites: Phaser.GameObjects.Sprite[] = [];

  constructor(key: string) {
    super(key);
    this.worldWidth = ROOM_W;
    this.worldHeight = ROOM_H;
  }

  protected buildRoom() {
    registerAllForGlory(this);
    registerBedroomTextures(this);
    this.resetCarry();
    this.walkers = [];
    this.candleSprites = [];
    this.physics.world.setBounds(0, 0, ROOM_W, ROOM_H);
    this.obstacles = this.physics.add.staticGroup();

    this.add.tileSprite(0, WALL, ROOM_W, ROOM_H - WALL, "floor_wood").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 0, ROOM_W, WALL, "wall_paper").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, WALL, ROOM_W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 0, 16, ROOM_H, "wall_cap").setOrigin(0).setDepth(DEPTH.WALL);
    this.add.tileSprite(ROOM_W - 16, 0, 16, ROOM_H, "wall_cap").setOrigin(0).setDepth(DEPTH.WALL);
    this.add.tileSprite(0, ROOM_H - 16, ROOM_W, 16, "wall_cap").setOrigin(0).setDepth(DEPTH.WALL);
    this.block(ROOM_W / 2, (WALL + 6) / 2, ROOM_W, WALL + 6);
    this.block(8, ROOM_H / 2, 16, ROOM_H);
    this.block(ROOM_W - 8, ROOM_H / 2, 16, ROOM_H);
    this.block(ROOM_W / 2, ROOM_H - 8, ROOM_W, 16);

    // night window + a flat moonbeam falling on the rug
    this.add.image(SPOT.window[0], SPOT.window[1], "night_window").setOrigin(0.5, 0).setDepth(DEPTH.FLOOR);
    this.add
      .graphics()
      .setDepth(DEPTH.LIGHT)
      .fillStyle(0xbfdbfe, 0.08)
      .fillPoints([{ x: 228, y: 42 }, { x: 252, y: 42 }, { x: 262, y: 170 }, { x: 214, y: 170 }], true);

    this.drawRug(104, 130, 112, 72);

    this.prop(SPOT.bed[0], SPOT.bed[1], "bed", 44, 12);
    this.prop(SPOT.shelf[0], SPOT.shelf[1], "bookshelf", 28, 8);
    this.prop(SPOT.desk[0], SPOT.desk[1], "desk", 40, 10);
    this.prop(SPOT.altar[0], SPOT.altar[1], "home_altar", 32, 10);
    this.prop(SPOT.bag[0], SPOT.bag[1], "schoolbag", 12, 6);

    // warm lamp glow on the desk, soft glow on the little altar
    const lamp = this.add.image(SPOT.desk[0] + 14, SPOT.desk[1] - 12, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.35);
    this.tweens.add({ targets: lamp, alpha: 0.5, duration: 1800, yoyo: true, repeat: -1 });

    // open book left on the desk
    this.bookSprite = this.add
      .image(SPOT.desk[0] - 6, SPOT.desk[1] - 14, "book_open")
      .setOrigin(0.5, 1)
      .setDepth(SPOT.desk[1] + 1);
  }

  /** Unlit candle that can be lit later. */
  protected placeCandles() {
    for (const dx of [-12, 12]) {
      this.add.image(SPOT.altar[0] + dx, SPOT.altar[1] - 12, "candle").setOrigin(0.5, 1).setDepth(SPOT.altar[1] + 1);
    }
  }

  protected lightCandles() {
    for (const dx of [-12, 12]) {
      const x = SPOT.altar[0] + dx;
      const y = SPOT.altar[1] - 12;
      this.candleSprites.push(this.add.sprite(x, y, "candle_flame").setOrigin(0.5, 1).setDepth(y + 2).play("candle_burn"));
      this.add.image(x, y - 10, "glow_small").setDepth(DEPTH.LIGHT).setAlpha(0.6);
    }
    const halo = this.add.image(SPOT.altar[0], SPOT.altar[1] - 20, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.4);
    this.tweens.add({ targets: halo, alpha: 0.65, duration: 1500, yoyo: true, repeat: -1 });
  }

  /** The Holy Spirit as a white dove with a pixel glow; bobs in place. Glow follows the dove, so it can be walked. */
  protected spawnDove(x: number, y: number) {
    const glow = this.add.image(x, y - 8, "glow_gold").setDepth(y + 1).setAlpha(0.7);
    const dove = this.add.sprite(x, y, "holy_spirit_dove").setOrigin(0.5, 1).setDepth(y + 2).play("spirit_flap");
    // Bob via the origin (4px = 0.25 of the 16px frame), not y: a y tween would fight walk() and snap the dove back.
    this.tweens.add({ targets: dove, originY: 1.25, duration: 900, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    const follow = () => glow.setPosition(Math.round(dove.x), Math.round(dove.y - dove.displayOriginY + 8));
    this.events.on("update", follow);
    this.events.once("shutdown", () => this.events.off("update", follow));
    return dove;
  }

  private drawRug(x: number, y: number, w: number, h: number) {
    const g = this.add.graphics().setDepth(DEPTH.RUG);
    const r = (rx: number, ry: number, rw: number, rh: number, c: number) => g.fillStyle(c, 1).fillRect(x + rx, y + ry, rw, rh);
    r(0, 0, w, h, 0x1e3a8a);
    r(4, 4, w - 8, h - 8, 0x2563eb);
    r(8, 8, w - 16, 2, 0xfef08a);
    r(8, h - 10, w - 16, 2, 0xfef08a);
    r(w / 2 - 6, h / 2 - 6, 12, 12, 0xfef08a);
    r(w / 2 - 3, h / 2 - 3, 6, 6, 0x1e3a8a);
  }
}
