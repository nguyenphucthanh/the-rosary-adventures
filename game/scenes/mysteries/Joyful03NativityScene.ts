import * as Phaser from "phaser";
import { DEPTH } from "../BaseMysteryScene";
import { InteractiveScene, type Pickup } from "../InteractiveScene";
import { registerAnnunciationTextures } from "../../utils/npcTextureGenerator";
import { registerVisitationTextures } from "../../utils/visitationTextureGenerator";
import { registerInfancyTextures } from "../../utils/infancyTextureGenerator";

const W = 800;
const H = 600;
const CX = 400;
const CAVE_Y = 250; // foot of the cave image (240x136)
const FLOOR_Y = 208; // top of the walkable floor band inside the cave
const HEARTH: [number, number] = [CX - 70, 242]; // front-left corner inside the cave
const WOOD_SPOTS: [number, number][] = [[150, 300], [620, 330], [250, 510]];
const FLINT_SPOT: [number, number] = [690, 540];
const SHEPHERD_SPOTS: [number, number][] = [[120, 440], [690, 400]];

export class Joyful03NativityScene extends InteractiveScene {
  private woodPickups: (Pickup | null)[] = [];
  private flintPickup: Pickup = [];
  private shepherds: Phaser.GameObjects.Sprite[] = [];
  private fire?: Phaser.GameObjects.Sprite;
  private hearthHints: Phaser.GameObjects.Image[] = [];

  private wood = 0;
  private hasFlint = false;
  private fireLit = false;
  private guided = [false, false];
  private finished = false;

  constructor() {
    super("Joyful03NativityScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAnnunciationTextures(this);
    registerVisitationTextures(this);
    registerInfancyTextures(this);
    this.wood = 0;
    this.hasFlint = this.fireLit = this.finished = false;
    this.guided = [false, false];
    this.woodPickups = [];
    this.shepherds = [];
    this.walkers = [];
    this.fire = undefined;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildLand();
    this.buildProps();
    this.buildCharacters();
    this.buildItems();
    this.buildLight();
    this.defineInteractables();

    this.begin("vui_03_sinh_chua", [CX, 540], {
      speaker: "Đêm Bê-lem",
      emoji: "⭐",
      lines: [
        "Mầu Nhiệm Thứ Ba: Đức Bà Sinh Đức Chúa Giêsu Nơi Hang Đá (Lc 2, 1-20).",
        "Đêm đông lạnh giá. Hang đá chiên bò thật tối và vắng. Đức Mẹ và Thánh Giuse đang chờ giờ Chúa ra đời.",
        "Hãy nhặt 3 cành củi khô, tìm viên đá lửa để nhóm lửa sưởi ấm ở góc hang (nơi có mũi tên vàng), rồi dẫn các mục đồng lạc đường về hang nhé!",
      ],
    });
  }

  // ---------- world ----------

  private buildLand() {
    this.add.tileSprite(0, 0, W, H, "night_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    // dirt path from the south up to the cave mouth
    this.add.tileSprite(CX - 24, CAVE_Y, 48, H - CAVE_Y, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.edgeWalls(W, H);
  }

  private buildProps() {
    this.add.image(CX, CAVE_Y, "stable_cave").setOrigin(0.5, 1).setDepth(100);
    this.block(CX - 100, CAVE_Y - 68, 40, 136);
    this.block(CX + 100, CAVE_Y - 68, 40, 136);
    this.block(CX, (CAVE_Y - 136 + FLOOR_Y) / 2, 240, FLOOR_Y - (CAVE_Y - 136));

    // boulder rows along the top and bottom edges (gap for the path at the bottom)
    for (let k = 0; k < 25; k++) {
      const x = 16 + 32 * k;
      this.prop(x, 44, "boulder", 30, 10);
      if (Math.abs(x - CX) > 40) this.prop(x, 594, "boulder", 30, 10);
    }
    for (const [x, y] of [[60, 130], [740, 120], [200, 90], [610, 100], [50, 330], [760, 300], [110, 540], [700, 500], [280, 400], [530, 450], [240, 220], [570, 230]])
      this.prop(x, y, "hill_tree", 10, 8);
    this.prop(290, 262, "hay_bale", 26, 10);
    this.prop(520, 268, "hay_bale", 26, 10);
    this.prop(560, 300, "crate", 18, 10);

    // cold hearth: stone ring until the fire is lit
    for (const [dx, dy] of [[-8, 0], [8, 0], [0, -4], [0, 4]])
      this.add.rectangle(HEARTH[0] + dx, HEARTH[1] + dy - 2, 5, 3, 0x6b6f78).setDepth(HEARTH[1] - 1);

    // beacon over the cold hearth: bobbing arrow + pulsing glow, removed once lit
    const arrow = this.add.image(HEARTH[0], HEARTH[1] - 26, "arrow_down").setDepth(DEPTH.FX);
    const beacon = this.add.image(HEARTH[0], HEARTH[1] - 6, "glow_small").setDepth(HEARTH[1] - 2).setAlpha(0.35);
    this.tweens.add({ targets: arrow, y: HEARTH[1] - 31, duration: 500, yoyo: true, repeat: -1, ease: "Stepped" });
    this.tweens.add({ targets: beacon, alpha: 0.7, duration: 800, yoyo: true, repeat: -1 });
    this.hearthHints = [arrow, beacon];

    // flowers of the field: a few sleeping lilies near the path
    for (const [x, y] of [[352, 300], [446, 380], [350, 470], [452, 520]]) this.add.image(x, y, "flower_w").setOrigin(0.5, 1).setDepth(y);
  }

  private buildCharacters() {
    // Holy Family inside the cave mouth (no colliders on people so a child can never be trapped)
    this.add.sprite(CX - 34, 218, "mary_praying").setOrigin(0.5, 1).setDepth(218);
    this.add.sprite(CX + 34, 218, "joseph").setOrigin(0.5, 1).setDepth(218);
    this.prop(CX, 216, "manger", 40, 10);
    this.add.image(CX, 202, "baby").setOrigin(0.5, 1).setDepth(217);

    SHEPHERD_SPOTS.forEach(([x, y], i) => {
      const s = this.add.sprite(x, y, "shepherd").setOrigin(0.5, 1).setDepth(y);
      const sheep = this.add.sprite(x + (i ? -22 : 22), y + 2, "sheep").setOrigin(0.5, 1).setDepth(y);
      this.shepherds.push(s);
      this.walkers.push(s, sheep);
      s.setData({ sheep, hint: this.hint(x, y - 34) });
    });
  }

  private buildItems() {
    WOOD_SPOTS.forEach(([x, y]) => this.woodPickups.push(this.pickup(x, y, "firewood")));
    this.flintPickup = this.pickup(FLINT_SPOT[0], FLINT_SPOT[1], "flint");
  }

  private buildLight() {
    // the Bethlehem star + a flat beam down to the manger
    const star = this.add.image(CX, 76, "star_big").setDepth(DEPTH.FX);
    this.tweens.add({ targets: star, y: 72, duration: 1400, yoyo: true, repeat: -1, ease: "Stepped" });
    const halo = this.add.image(CX, 76, "glow_gold").setDepth(4600).setAlpha(0.5);
    this.tweens.add({ targets: halo, alpha: 0.8, duration: 1600, yoyo: true, repeat: -1 });
    this.add
      .graphics()
      .setDepth(3)
      .fillStyle(0xfef08a, 0.1)
      .fillPoints([{ x: CX - 8, y: 84 }, { x: CX + 8, y: 84 }, { x: CX + 40, y: CAVE_Y - 60 }, { x: CX - 40, y: CAVE_Y - 60 }], true);

    // glow from the Child (the real light of the cave)
    const babyGlow = this.add.image(CX, 198, "glow_gold").setDepth(4600).setAlpha(0.4);
    this.tweens.add({ targets: babyGlow, alpha: 0.65, duration: 1800, yoyo: true, repeat: -1 });

    // cold night, applied last so lights read through it
    this.add.rectangle(0, 0, W, H, 0x0b1030, 0.38).setOrigin(0).setDepth(4500);
  }

  // ---------- interaction ----------

  private defineInteractables() {
    WOOD_SPOTS.forEach(([x, y], i) =>
      this.interactables.push({
        at: () => [x, y],
        r: 36,
        label: () => "[A] Nhặt củi khô",
        active: () => this.woodPickups[i] !== null,
        act: () => {
          this.vanish(this.woodPickups[i]!);
          this.woodPickups[i] = null;
          this.wood++;
          this.talk("Cành Củi Khô", "🪵", [
            this.wood < 3 ? `Bạn nhặt được cành củi khô thứ ${this.wood}/3.` : "Đủ 3 cành củi rồi! Hãy tìm viên đá lửa nhé.",
          ]);
        },
      })
    );

    this.interactables.push(
      {
        at: () => FLINT_SPOT,
        r: 36,
        label: () => "[A] Nhặt đá lửa",
        active: () => !this.hasFlint,
        act: () => {
          this.hasFlint = true;
          this.vanish(this.flintPickup);
          this.talk("Viên Đá Lửa", "🪨", ["Bạn nhặt được viên đá lửa. Cộc cộc... có tia lửa nhỏ lóe lên!", "Hãy mang đến bếp lửa trước cửa hang."]);
        },
      },
      {
        at: () => HEARTH,
        r: 44,
        label: () => (this.wood >= 3 && this.hasFlint ? "[A] Nhóm lửa" : "[A] Xem bếp lửa"),
        active: () => !this.fireLit,
        act: () => (this.wood >= 3 && this.hasFlint ? this.lightFire() : this.hearthHint()),
      }
    );

    this.shepherds.forEach((s, i) =>
      this.interactables.push({
        at: () => [s.x, s.y],
        r: 44,
        label: () => "[A] Chỉ đường cho mục đồng",
        active: () => !this.guided[i],
        act: () => this.guideShepherd(i),
      })
    );

    this.interactables.push(
      {
        at: () => [CX - 32, 218 + 14],
        r: 26,
        label: () => "[A] Trò chuyện với Đức Mẹ",
        active: () => !this.finished,
        act: () =>
          this.talk("Đức Mẹ Maria", "💙", [
            "Con ơi, đêm nay lạnh quá, nhưng lòng Mẹ ấm áp lạ lùng.",
            "Hài Nhi của chúng ta nằm trong máng cỏ. Chúa đã chọn sự nghèo khó để đến với nhân loại.",
          ]),
      },
      {
        at: () => [CX + 34, 218 + 14],
        r: 26,
        label: () => "[A] Trò chuyện với Thánh Giuse",
        active: () => !this.finished,
        act: () =>
          this.talk("Thánh Giuse", "🧔", [
            "Không có chỗ trong nhà trọ, ta đành nghỉ trong hang chiên bò này.",
            "Nhưng có Chúa ở cùng, hang đá nghèo cũng thành cung điện.",
            this.fireLit ? "Cảm ơn con đã nhóm lửa! Hài Nhi ấm hơn nhiều rồi." : "Giá mà có chút lửa sưởi ấm cho Hài Nhi...",
          ]),
      },
      {
        at: () => [CX, 234],
        r: 34,
        label: () => "[A] Quỳ trước Hài Nhi",
        active: () => !this.finished,
        act: () => this.kneel(),
      }
    );
  }

  private hearthHint() {
    const lines = [
      this.wood < 3 ? `Bếp lửa còn trống. Cần thêm củi khô (${this.wood}/3).` : "Đã đủ củi, nhưng còn thiếu thứ để đánh lửa.",
      this.hasFlint ? "Bạn đã có đá lửa." : "Hãy tìm viên đá lửa quanh đồi Bê-lem.",
    ];
    this.talk("Bếp Lửa", "🔥", lines);
  }

  private lightFire() {
    this.fireLit = true;
    this.hearthHints.forEach((h) => h.destroy());
    if (!this.anims.exists("campfire_burn"))
      this.anims.create({ key: "campfire_burn", frames: this.anims.generateFrameNumbers("campfire", { start: 0, end: 1 }), frameRate: 5, repeat: -1 });
    this.fire = this.add.sprite(HEARTH[0], HEARTH[1], "campfire").setOrigin(0.5, 1).setDepth(HEARTH[1]).play("campfire_burn");
    const glow = this.add.image(HEARTH[0], HEARTH[1] - 8, "glow_gold").setDepth(4600).setAlpha(0.6);
    this.tweens.add({ targets: glow, alpha: 0.85, duration: 500, yoyo: true, repeat: -1 });
    this.sparkleBurst(HEARTH[0], HEARTH[1] - 12);
    this.talk("Bếp Lửa", "🔥", ["Phựt! Ngọn lửa bừng lên, ấm áp cả góc hang.", "Ánh lửa sáng sẽ giúp các mục đồng lạc đường nhìn thấy hang đá."]);
  }

  private guideShepherd(i: number) {
    this.guided[i] = true;
    const s = this.shepherds[i];
    const sheep = s.getData("sheep") as Phaser.GameObjects.Sprite;
    (s.getData("hint") as Phaser.GameObjects.Image).destroy();
    this.talk(
      "Mục Đồng",
      "🐑",
      [
        i ? "Tôi lạc mất đường trong đêm tối rồi..." : "Đàn chiên của tôi sợ lắm, trời lạnh quá!",
        "Ô kìa, ngôi sao lạ trên kia! Có thiên thần báo tin vui: 'Hôm nay đã sinh ra cho anh em một Đấng Cứu Độ!' (Lc 2, 11)",
        "Cảm ơn bạn đã chỉ đường. Chúng tôi đi theo ánh sao đến hang đá ngay!",
      ],
      () => {
        const dx = i ? 26 : -26;
        this.walk(sheep, [[CX + dx * 2, 284]]);
        this.walk(s, [[CX + dx, 276]], () => this.sparkleBurst(s.x, s.y - 16));
      }
    );
  }

  private kneel() {
    if (!this.fireLit || !this.guided[0] || !this.guided[1]) {
      this.talk("Hài Nhi Giêsu", "👶", [
        !this.fireLit ? "Hang đá còn tối và lạnh. Hãy nhóm lửa sưởi ấm cho Hài Nhi trước nhé." : "Các mục đồng vẫn còn lạc đường ngoài đồi. Hãy dẫn họ về hang!",
      ]);
      return;
    }
    this.finished = true;
    this.sparkleBurst(CX, 194);
    this.sparkleBurst(CX - 30, 180);
    this.sparkleBurst(CX + 30, 180);
    this.talk(
      "Hài Nhi Giêsu",
      "👶",
      [
        "Bạn quỳ gối thật khẽ trước máng cỏ. Có tiếng bò lừa thở nhẹ nhàng...",
        "Từ trời cao vang tiếng hát thiên thần: 'Vinh danh Thiên Chúa trên trời, bình an dưới thế cho loài người Chúa thương.' (Lc 2, 14)",
        "Các mục đồng cúi chào, còn Đức Mẹ thì ghi nhớ mọi điều ấy và suy niệm trong lòng. (Lc 2, 19)",
      ],
      () =>
        this.time.delayedCall(500, () =>
          this.complete(
            3,
            "Năm Sự Vui",
            "Đức Bà Sinh Đức Chúa Giêsu Nơi Hang Đá",
            "Tinh thần nghèo khó, đơn sơ và lòng yêu mến người nghèo hèn.",
            "Chúa Giêsu sinh ra trong hang đá nghèo. Hãy yêu mến sự đơn sơ và chia sẻ với người nghèo nhé!",
            ["gather_wood", "light_fire", "guide_shepherds", "adore_child"]
          )
        )
    );
  }
}
