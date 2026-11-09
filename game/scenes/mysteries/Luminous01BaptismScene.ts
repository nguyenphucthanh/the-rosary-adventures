import * as Phaser from "phaser";
import { DEPTH } from "../BaseMysteryScene";
import { InteractiveScene } from "../InteractiveScene";
import { registerAnnunciationTextures } from "../../utils/npcTextureGenerator";
import { registerVisitationTextures } from "../../utils/visitationTextureGenerator";
import { registerInfancyTextures } from "../../utils/infancyTextureGenerator";
import { registerLightTextures } from "../../utils/lightTextureGenerator";

const CELL = 32;
const COLS = 20;
const ROWS = 18;
const W = COLS * CELL;
const H = ROWS * CELL;
const FORD_COL = 9;
const FORD_ROWS = [7, 8, 9]; // water cells a sunk boulder turns into stepping stones
const RIVER_TOP = 3; // water rows 3..9
const RIVER_BOTTOM = 9;
const ISLAND = { c0: 8, c1: 11, r0: 5, r1: 6 }; // sandbar where John stands
const JOHN_AT: [number, number] = [296, 212];
const JESUS_START: [number, number] = [432, 380];
const JESUS_END: [number, number] = [346, 212];
const PUSH_HOLD_MS = 120;
const BOULDER_STARTS: [number, number][] = [[5, 13], [14, 12], [9, 15]];

const cx = (c: number) => c * CELL + CELL / 2;
const cy = (r: number) => r * CELL + CELL / 2;

interface Rock {
  sprite: Phaser.GameObjects.Image;
  col: Phaser.GameObjects.Rectangle;
  c: number;
  r: number;
  moving: boolean;
  hold: number;
  glow: Phaser.GameObjects.Image;
}

export class Luminous01BaptismScene extends InteractiveScene {
  private rocks: Rock[] = [];
  private filled = new Set<number>(); // ford rows already stone
  private fordBlock = new Map<number, Phaser.GameObjects.Rectangle>();
  private water!: Phaser.GameObjects.TileSprite;
  private jesus!: Phaser.GameObjects.Sprite;
  private jesusBlock!: Phaser.GameObjects.Rectangle;
  private pathNoted = false;
  private johnMet = false;
  private finished = false;

  constructor() {
    super("Luminous01BaptismScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAnnunciationTextures(this);
    registerVisitationTextures(this);
    registerInfancyTextures(this);
    registerLightTextures(this);
    this.rocks = [];
    this.walkers = [];
    this.filled = new Set();
    this.fordBlock = new Map();
    this.pathNoted = this.johnMet = this.finished = false;

    if (!this.anims.exists("dove_flap")) {
      this.anims.create({
        key: "dove_flap",
        frames: this.anims.generateFrameNumbers("holy_spirit_dove", { frames: [0, 1] }),
        frameRate: 6,
        repeat: -1,
      });
    }

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildLand();
    this.buildRiver();
    this.buildProps();
    this.buildCharacters();
    this.buildSky();
    this.defineInteractables();

    this.begin("sang_01_phep_rua", [cx(4), cy(16)], {
      speaker: "Sông Gio-đan",
      emoji: "🌊",
      lines: [
        "Mầu Nhiệm Thứ Nhất Năm Sự Sáng: Đức Chúa Giêsu Chịu Phép Rửa Tại Sông Gio-đan (Mt 3, 13-17).",
        "Dòng nước chảy xiết đã cuốn trôi những bậc đá. Thánh Gioan Tẩy Giả đang đứng giữa sông, chờ Chúa Giêsu.",
        "Hãy đẩy ba tảng đá xuống sông, chỗ cạn trước mặt Thánh Gioan, để làm lối đi cho Chúa nhé!",
      ],
    });
  }

  // ---------- world ----------

  private buildLand() {
    this.add.tileSprite(0, 0, W, H, "grass_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    // barren far bank (wilderness) and sandy near bank
    this.add.tileSprite(0, 0, W, RIVER_TOP * CELL, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, (RIVER_BOTTOM + 1) * CELL, W, CELL, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.edgeWalls(W, H);
  }

  private buildRiver() {
    const top = RIVER_TOP * CELL;
    const height = (RIVER_BOTTOM + 1 - RIVER_TOP) * CELL;
    this.add.rectangle(0, top - 4, W, 4, 0x7a5a32).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, top + height, W, 4, 0x7a5a32).setOrigin(0).setDepth(DEPTH.RUG);
    this.water = this.add.tileSprite(0, top, W, height, "water_tile").setOrigin(0).setDepth(DEPTH.RUG);
    this.time.addEvent({ delay: 120, loop: true, callback: () => (this.water.tilePositionX = (this.water.tilePositionX + 1) % 16) });

    // sandbar
    const { c0, c1, r0, r1 } = ISLAND;
    const sand = this.add
      .tileSprite(c0 * CELL, r0 * CELL, (c1 - c0 + 1) * CELL, (r1 - r0 + 1) * CELL, "dirt_tile")
      .setOrigin(0)
      .setDepth(DEPTH.RUG + 1);
    this.add.rectangle(sand.x - 2, sand.y - 2, sand.width + 4, sand.height + 4, 0xe0f2fe).setOrigin(0).setDepth(DEPTH.RUG);

    // water colliders: everything except the sandbar and the ford column
    const wall = (c0: number, c1: number, r0: number, r1: number) =>
      this.block(((c0 + c1 + 1) * CELL) / 2, ((r0 + r1 + 1) * CELL) / 2, (c1 - c0 + 1) * CELL, (r1 - r0 + 1) * CELL);
    wall(0, COLS - 1, RIVER_TOP, ISLAND.r0 - 1);
    wall(0, ISLAND.c0 - 1, ISLAND.r0, ISLAND.r1);
    wall(ISLAND.c1 + 1, COLS - 1, ISLAND.r0, ISLAND.r1);
    wall(0, FORD_COL - 1, ISLAND.r1 + 1, RIVER_BOTTOM);
    wall(FORD_COL + 1, COLS - 1, ISLAND.r1 + 1, RIVER_BOTTOM);
    for (const r of FORD_ROWS) {
      const b = this.add.rectangle(cx(FORD_COL), cy(r), CELL, CELL);
      this.obstacles.add(b);
      this.fordBlock.set(r, b);
    }
  }

  private buildProps() {
    // reeds along both banks
    for (let c = 1; c < COLS; c += 2) {
      this.add.image(c * CELL + (c % 3) * 4, RIVER_TOP * CELL - 2, "reed").setOrigin(0.5, 1).setDepth(RIVER_TOP * CELL);
      if (c < 7 || c > 12) this.add.image(c * CELL + 6, (RIVER_BOTTOM + 1) * CELL + 2, "reed").setOrigin(0.5, 1).setDepth((RIVER_BOTTOM + 1) * CELL + 2);
    }
    // wilderness on the far bank: rocks and a lone tree
    for (const x of [60, 150, 250, 380, 470, 560]) this.add.image(x, 70 + ((x / 10) % 3) * 8, "boulder").setOrigin(0.5, 1).setDepth(70);
    this.add.image(110, 50, "hill_tree").setOrigin(0.5, 1).setDepth(50);
    this.add.image(520, 42, "hill_tree").setOrigin(0.5, 1).setDepth(42);
    // near bank: trees in the corners, flowers, thorn bushes
    for (const [x, y] of [[44, 540], [596, 548], [44, 372], [600, 380]]) this.prop(x, y, "hill_tree", 12, 8);
    this.prop(600, 470, "thorn_bush", 30, 10);
    for (const [x, y, k] of [[120, 470, "flower_w"], [210, 520, "flower_p"], [350, 530, "flower_y"], [480, 540, "flower_w"], [570, 430, "flower_p"], [90, 420, "flower_y"]] as const)
      this.add.image(x, y, k).setOrigin(0.5, 1).setDepth(y);

    BOULDER_STARTS.forEach(([c, r]) => {
      const sprite = this.add.image(cx(c), cy(r) + 12, "boulder").setOrigin(0.5, 1).setDepth(cy(r) + 12);
      const col = this.add.rectangle(cx(c), cy(r), CELL - 2, CELL - 2);
      this.obstacles.add(col);
      // a soft glow so the child spots the pushable stones
      const glow = this.add.image(cx(c), cy(r), "glow_small").setDepth(DEPTH.LIGHT).setAlpha(0.35);
      this.tweens.add({ targets: glow, alpha: 0.6, duration: 900, yoyo: true, repeat: -1 });
      this.rocks.push({ sprite, col, c, r, moving: false, hold: 0, glow });
    });
  }

  private buildCharacters() {
    const person = (key: string, x: number, y: number) => this.add.sprite(x, y, key).setOrigin(0.5, 1).setDepth(y);
    person("john", ...JOHN_AT);
    this.hint(JOHN_AT[0], JOHN_AT[1] - 34);

    this.jesus = person("jesus_adult", ...JESUS_START);
    this.jesusBlock = this.add.rectangle(JESUS_START[0], JESUS_START[1] - 6, 16, 12);
    this.obstacles.add(this.jesusBlock);
    this.hint(JESUS_START[0], JESUS_START[1] - 36);

    // the crowd waiting to be baptised
    person("shepherd", cx(3), cy(10) + 8);
    this.hint(cx(3), cy(10) - 24);
    person("scribe", cx(16), cy(10) + 8);
    this.hint(cx(16), cy(10) - 24);
    person("merchant", cx(17), cy(11) + 10);
    person("sweeper", cx(2), cy(11) + 14);
    const kneel = person("shepherd", cx(7), cy(10) + 8);
    this.walkers.push(kneel);
    this.tweens.add({ targets: kneel, x: cx(5), duration: 4200, yoyo: true, repeat: -1 });
  }

  private buildSky() {
    // sun glow + flat shafts of light
    const sun = this.add.image(W - 90, 30, "glow_gold").setDepth(DEPTH.FX - 1).setAlpha(0.5);
    this.tweens.add({ targets: sun, alpha: 0.8, duration: 1600, yoyo: true, repeat: -1 });
    const beams = this.add.graphics().setDepth(3).fillStyle(0xfef9c3, 0.1);
    beams.fillPoints([{ x: 520, y: 0 }, { x: 560, y: 0 }, { x: 440, y: 300 }, { x: 400, y: 300 }], true);
    beams.fillPoints([{ x: 600, y: 0 }, { x: 624, y: 0 }, { x: 540, y: 280 }, { x: 516, y: 280 }], true);
    // doves drifting high over the river (stepped, 1 frame flap)
    [0, 1].forEach((i) => {
      const dove = this.add.sprite(-20, 54 + i * 26, "holy_spirit_dove").setDepth(DEPTH.FX).play("dove_flap");
      this.tweens.add({ targets: dove, x: W + 20, duration: 16000 + i * 5000, repeat: -1, delay: i * 5000 });
    });
  }

  // ---------- push puzzle ----------

  private fordRow(c: number, r: number) {
    return c === FORD_COL && FORD_ROWS.includes(r);
  }

  private rockAt(c: number, r: number) {
    return this.rocks.find((k) => k.c === c && k.r === r);
  }

  /** A boulder may roll onto: the open lower bank (rows 12+, never the border), the ford column, or a ford cell still in the water. */
  private canRoll(c: number, r: number) {
    if (this.rockAt(c, r)) return false;
    if (this.fordRow(c, r)) return true;
    if (c === FORD_COL && r >= RIVER_BOTTOM + 1) return r <= ROWS - 3;
    return c >= 3 && c <= COLS - 4 && r >= 12 && r <= ROWS - 3;
  }

  update() {
    super.update();
    if (this.finished || !this.player) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    // Use the input intent (not body velocity): the analog joystick is rarely
    // axis-aligned, and collisions zero the blocked axis of the velocity.
    const { x: ix, y: iy } = this.player.getMoveIntent();
    const DEAD = 0.35;
    const dt = this.game.loop.delta;

    for (const k of this.rocks) {
      if (k.moving) continue;
      const x0 = k.c * CELL;
      const y0 = k.r * CELL;
      const touchesX = (d: number) =>
        Math.abs((d > 0 ? body.right : body.left) - (d > 0 ? x0 : x0 + CELL)) <= 3 && body.bottom > y0 + 4 && body.top < y0 + CELL - 4;
      const touchesY = (d: number) =>
        Math.abs((d > 0 ? body.bottom : body.top) - (d > 0 ? y0 : y0 + CELL)) <= 3 && body.right > x0 + 4 && body.left < x0 + CELL - 4;

      let dx = 0;
      let dy = 0;
      const hx = Math.abs(ix) >= DEAD && touchesX(ix);
      const hy = Math.abs(iy) >= DEAD && touchesY(iy);
      // If pressing against the rock on both axes, prefer the stronger input.
      if (hx && (!hy || Math.abs(ix) >= Math.abs(iy))) dx = Math.sign(ix);
      else if (hy) dy = Math.sign(iy);

      k.hold = dx !== 0 || dy !== 0 ? k.hold + dt : 0;
      if (k.hold >= PUSH_HOLD_MS) {
        k.hold = 0;
        this.push(k, dx, dy);
      }
    }
  }

  private push(k: Rock, dx: number, dy: number) {
    const nc = k.c + dx;
    const nr = k.r + dy;
    if (!this.canRoll(nc, nr)) return;
    k.moving = true;
    this.tweens.add({
      targets: k.sprite,
      x: cx(nc),
      y: cy(nr) + 12,
      duration: 220,
      onUpdate: () => {
        k.col.setPosition(k.sprite.x, k.sprite.y - 12);
        (k.col.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
        k.sprite.setDepth(k.sprite.y);
      },
      onComplete: () => {
        k.c = nc;
        k.r = nr;
        k.moving = false;
        if (this.fordRow(nc, nr) && !this.filled.has(nr)) this.sink(k);
      },
    });
  }

  private sink(k: Rock) {
    k.glow.destroy();
    this.rocks = this.rocks.filter((r) => r !== k);
    this.obstacles.remove(k.col, true, true);
    const fb = this.fordBlock.get(k.r);
    if (fb) this.obstacles.remove(fb, true, true);
    this.fordBlock.delete(k.r);
    this.filled.add(k.r);
    k.sprite.setTexture("ford_stone").setOrigin(0.5).setPosition(cx(k.c), cy(k.r)).setDepth(DEPTH.RUG + 2);
    this.sparkleBurst(cx(k.c), cy(k.r));

    if (this.filled.size === FORD_ROWS.length && !this.pathNoted) {
      this.pathNoted = true;
      this.time.delayedCall(700, () =>
        this.talk("Sông Gio-đan", "🌊", ["Ba bậc đá đã nằm yên trong lòng sông!", "Lối đi đã mở. Hãy bước qua và gặp Thánh Gioan Tẩy Giả nhé."])
      );
    }
  }

  // ---------- interaction ----------

  private defineInteractables() {
    this.interactables = [
      {
        at: () => [cx(FORD_COL), cy(RIVER_BOTTOM + 1)],
        r: 40,
        label: () => "[A] Nhìn dòng sông",
        active: () => this.filled.size < FORD_ROWS.length,
        act: () =>
          this.talk("Sông Gio-đan", "🌊", [
            `Nước chảy xiết, không thể lội qua. Đã có ${this.filled.size}/${FORD_ROWS.length} bậc đá.`,
            "Hãy đẩy các tảng đá sáng lấp lánh vào hàng chỗ cạn trước mặt. Đẩy sang ngang cho thẳng hàng, rồi đẩy thẳng lên phía sông.",
          ]),
      },
      {
        at: () => [cx(3), cy(10) + 8],
        r: 44,
        label: () => "[A] Trò chuyện với người dân",
        active: () => true,
        act: () =>
          this.talk("Người Dân", "🧑‍🌾", [
            "Chúng tôi từ khắp nơi đến đây xưng tội và xin Gioan làm phép rửa. (Mt 3, 5-6)",
            "Nhưng sóng đã cuốn mất đá bắc ngang sông. Bạn đẩy đá vào chỗ nông nhé: đá nằm được trên đá, đẩy qua là đi được.",
          ]),
      },
      {
        at: () => [cx(16), cy(10) + 8],
        r: 44,
        label: () => "[A] Trò chuyện với kinh sư",
        active: () => true,
        act: () =>
          this.talk("Một Kinh Sư", "📜", [
            "Gioan mặc áo lông lạc đà, ăn châu chấu và mật ong rừng. Ông kêu gọi: 'Hãy sám hối!' (Mt 3, 1-4)",
            "Ông nói sau ông sẽ có Đấng quyền thế hơn ông đến.",
          ]),
      },
      {
        at: () => JESUS_START,
        r: 46,
        label: () => "[A] Trò chuyện với Chúa Giêsu",
        active: () => !this.johnMet,
        act: () =>
          this.talk("Chúa Giêsu", "✨", [
            "Từ Ga-li-lê, Thầy đến sông Gio-đan để Gioan làm phép rửa cho Thầy. (Mt 3, 13)",
            this.filled.size < FORD_ROWS.length ? "Khi lối đi qua sông sẵn sàng, Thầy sẽ đi." : "Con cứ đến gặp Gioan trước, Thầy sẽ theo sau.",
          ]),
      },
      {
        at: () => JOHN_AT,
        r: 52,
        label: () => "[A] Trò chuyện với Thánh Gioan",
        active: () => !this.johnMet,
        act: () => this.meetJohn(),
      },
    ];
  }

  private meetJohn() {
    this.johnMet = true;
    this.talk(
      "Thánh Gioan Tẩy Giả",
      "🐪",
      [
        "Cảm ơn con đã mở lối! Ta lấy nước làm phép rửa để người ta sám hối. Nhưng Đấng đến sau ta thì quyền thế hơn, ta không đáng xách dép cho Người. (Mt 3, 11)",
        "Kìa, Người đang đến!",
      ],
      () => this.baptism()
    );
  }

  private baptism() {
    this.obstacles.remove(this.jesusBlock, true, true);
    const [ex, ey] = JESUS_END;
    this.walk(this.jesus, [[cx(FORD_COL), cy(RIVER_BOTTOM) + 16], [cx(FORD_COL), ey], [ex, ey]], () =>
      this.talk(
        "Thánh Gioan Tẩy Giả",
        "🐪",
        ["'Chính tôi mới cần được Ngài làm phép rửa, thế mà Ngài lại đến với tôi!' (Mt 3, 14)"],
        () =>
          this.talk("Chúa Giêsu", "✨", ["'Cứ để như vậy, vì chúng ta nên làm cho trọn đạo công chính.' (Mt 3, 15)"], () => this.heavensOpen())
      )
    );
  }

  private heavensOpen() {
    const [jx, jy] = JESUS_END;
    // Jesus bows into the water
    this.tweens.add({ targets: this.jesus, y: jy + 4, duration: 500, yoyo: true, hold: 500, ease: "Stepped" });

    this.time.delayedCall(1200, () => {
      const cam = this.cameras.main;
      cam.flash(350, 255, 255, 255);
      cam.shake(300, 0.004);

      // flat shaft of light from the open sky
      const beam = this.add.rectangle(jx - 14, jy - 220, 28, 220, 0xfef9c3, 0.28).setOrigin(0).setDepth(DEPTH.FX - 2);
      this.tweens.add({ targets: beam, alpha: 0.12, duration: 500, yoyo: true, repeat: -1 });

      const dove = this.add.sprite(jx, jy - 150, "holy_spirit_dove").setDepth(DEPTH.FX).setAlpha(0).play("dove_flap");
      const glow = this.add.image(jx, jy - 150, "glow_gold").setDepth(DEPTH.FX - 1).setAlpha(0);
      this.tweens.add({
        targets: [dove, glow],
        y: jy - 44,
        alpha: 1,
        duration: 1800,
        ease: "Stepped",
        easeParams: [8],
        onComplete: () => {
          this.sparkleBurst(jx, jy - 40);
          this.time.delayedCall(500, () =>
            this.talk(
              "Tiếng Từ Trời",
              "☁️",
              ["Trời mở ra, Thánh Thần như chim bồ câu đậu xuống trên Người.", "'Đây là Con yêu dấu của Ta, Ta hài lòng về Người.' (Mt 3, 16-17)"],
              () => this.finish()
            )
          );
        },
      });
    });
  }

  private finish() {
    this.finished = true;
    this.time.delayedCall(300, () =>
      this.complete(
        1,
        "Năm Sự Sáng",
        "Đức Chúa Giêsu Chịu Phép Rửa Tại Sông Gio-đan",
        "Sống xứng đáng với ơn gọi làm con cái Thiên Chúa.",
        "Nhờ Bí tích Rửa Tội, bạn cũng là con yêu dấu của Cha trên trời. Hãy sống xứng đáng nhé!",
        ["push_stones", "meet_john", "see_dove"]
      )
    );
  }
}
