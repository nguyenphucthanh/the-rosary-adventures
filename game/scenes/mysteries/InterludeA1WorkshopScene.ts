import * as Phaser from "phaser";
import audio from "../../audio/AudioManager";
import { DEPTH } from "../BaseMysteryScene";
import { InteractiveScene } from "../InteractiveScene";
import { registerAnnunciationTextures } from "../../utils/npcTextureGenerator";
import { registerVisitationTextures } from "../../utils/visitationTextureGenerator";
import { registerInfancyTextures } from "../../utils/infancyTextureGenerator";
import { registerInterludeTextures } from "../../utils/interludeTextureGenerator";

const W = 640;
const H = 480;
const BENCH_X = 320;
const BENCH_Y = 250;
const GOAL = 5;

/**
 * Season Bridge A1 (Between Joyful 5 & Luminous 1): The Carpenter's Workshop at Nazareth (Lc 2, 51-52).
 * Kid-friendly Rhythm / Timing action: Wood planks slide across St. Joseph's workbench.
 * Press [A] / Space when the plank enters the glowing golden center zone (or tap anywhere near the bench)
 * to craft 5 wooden items for the villagers!
 */
export class InterludeA1WorkshopScene extends InteractiveScene {
  private slidingPlank!: Phaser.GameObjects.Image;
  private plankGlow!: Phaser.GameObjects.Image;
  private zoneRing!: Phaser.GameObjects.Rectangle;
  private plankDir = 1;
  private plankSpeed = 115; // gentle speed for kids
  private crafted = 0;
  private finished = false;
  private craftedIcons: Phaser.GameObjects.Image[] = [];

  constructor() {
    super("InterludeA1WorkshopScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAnnunciationTextures(this);
    registerVisitationTextures(this);
    registerInfancyTextures(this);
    registerInterludeTextures(this);

    this.crafted = 0;
    this.finished = false;
    this.plankDir = 1;
    this.plankSpeed = 115;
    this.craftedIcons = [];
    this.walkers = [];

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildWorkshop();
    this.buildCharactersAndBench();
    this.defineInteractables();

    this.begin("bridge_a1_xuong_moc", [320, 340], {
      speaker: "Xưởng Mộc Nazareth",
      emoji: "🪚",
      lines: [
        "Cầu Nối Mùa Vui → Mùa Sáng: Xưởng Mộc Nazareth (Lc 2, 51-52).",
        "“Chúa Giêsu xuống cùng với cha mẹ trở về Na-da-rét và hằng vâng phục các ngài... Người ngày càng thêm khôn ngoan, thêm cao lớn và thêm ân nghĩa.”",
        "Hãy đứng gần Bàn Mộc ở giữa phòng và nhấn nút [A] (hoặc phím Space) đúng lúc thanh gỗ trượt vào Ô Sáng Vàng để đóng 5 món đồ giúp dân làng nhé!",
      ],
    });
    this.syncProgress();
  }

  private syncProgress() {
    this.emitInterludeProgress([
      {
        id: "workshop_craft",
        emoji: "🪚",
        label: "ĐỒ MỘC",
        current: this.crafted,
        total: GOAL,
        color: "amber",
      },
    ]);
  }

  private buildWorkshop() {
    const WALL = 48;
    const CAP = 16;

    // Warm stone & wood floor + walls
    this.add.tileSprite(0, WALL, W, H - WALL, "floor_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 0, W, WALL, "wall_face").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, WALL, W, 4, 0x000000, 0.18).setOrigin(0).setDepth(DEPTH.FLOOR);

    // Woven rug under the workbench
    const rug = this.add.graphics().setDepth(DEPTH.RUG);
    rug.fillStyle(0x92400e, 1).fillRect(180, 190, 280, 130);
    rug.fillStyle(0xfbbf24, 1).fillRect(186, 196, 268, 4);
    rug.fillStyle(0xfbbf24, 1).fillRect(186, 310, 268, 4);

    // Windows + warm sunbeams
    for (const wx of [150, 490]) {
      this.add.image(wx, 8, "window_arch").setOrigin(0.5, 0).setDepth(DEPTH.FLOOR);
      this.add
        .graphics()
        .setDepth(DEPTH.LIGHT)
        .fillStyle(0xfef08a, 0.12)
        .fillPoints(
          [
            { x: wx - 10, y: 36 },
            { x: wx + 10, y: 36 },
            { x: wx + 64, y: 240 },
            { x: wx + 16, y: 240 },
          ],
          true
        );
    }
    this.add.image(304, 14, "wall_shelf").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Side & bottom caps
    this.add.tileSprite(0, 0, CAP, H, "wall_cap").setOrigin(0).setDepth(DEPTH.WALL);
    this.add.tileSprite(W - CAP, 0, CAP, H, "wall_cap").setOrigin(0).setDepth(DEPTH.WALL);
    this.add.tileSprite(0, H - CAP, W, CAP, "wall_cap").setOrigin(0).setDepth(DEPTH.WALL);
    this.edgeWalls(W, H);
    this.block(W / 2, WALL / 2, W, WALL);

    // Props around the carpentry shop
    this.prop(56, 110, "olive_pot", 14, 8);
    this.prop(W - 56, 110, "olive_pot", 14, 8);
    this.prop(64, 420, "clay_jar", 12, 8);
    this.prop(84, 428, "clay_jar", 12, 8);
    this.prop(W - 72, 420, "hay_bale", 24, 10);
    for (const [x, y] of [
      [120, 220],
      [520, 220],
    ]) {
      this.add.image(x, y, "firewood").setDepth(y);
    }
  }

  private buildCharactersAndBench() {
    // St. Joseph, young Jesus, and Mother Mary
    this.add.sprite(BENCH_X - 48, BENCH_Y - 18, "joseph").setOrigin(0.5, 1).setDepth(BENCH_Y - 18);
    this.add.sprite(BENCH_X + 48, BENCH_Y - 18, "jesus12").setOrigin(0.5, 1).setDepth(BENCH_Y - 18);
    this.add.sprite(120, 150, "mary_praying").setOrigin(0.5, 1).setDepth(150);
    this.hint(120, 114);

    // Carpenter's Workbench
    this.prop(BENCH_X, BENCH_Y, "carpenter_bench", 136, 16);

    // Target strike zone indicator
    this.zoneRing = this.add
      .rectangle(BENCH_X, BENCH_Y - 20, 36, 16, 0xfef08a, 0.28)
      .setStrokeStyle(2, 0xfbbf24)
      .setDepth(BENCH_Y + 1);

    // Sliding wood plank on top of the bench
    this.plankGlow = this.add.image(BENCH_X - 50, BENCH_Y - 20, "glow_small").setDepth(BENCH_Y + 1).setAlpha(0.6);
    this.slidingPlank = this.add.image(BENCH_X - 50, BENCH_Y - 20, "wood_plank").setDepth(BENCH_Y + 2);
  }

  private defineInteractables() {
    this.interactables = [
      {
        at: () => [BENCH_X, BENCH_Y + 48],
        r: 95,
        label: () => "[A] Đóng ghép gỗ đúng nhịp!",
        active: () => !this.finished,
        act: () => this.tryStrikePlank(),
      },
      {
        at: () => [120, 134],
        r: 44,
        label: () => "[A] Trò chuyện với Đức Mẹ",
        active: () => !this.finished,
        act: () =>
          this.talk("Đức Mẹ Maria", "💙", [
            "Suốt những năm tháng ở Nazareth, Chúa Giêsu luôn vui vẻ phụ giúp Thánh Giuse trong xưởng mộc.",
            "Làm việc nhỏ với tình yêu lớn chính là con đường nên thánh đó con!",
          ]),
      },
    ];
  }

  private tryStrikePlank() {
    if (this.finished) return;
    // Generous hit window (±32px from center of workbench) so kids succeed easily
    const offset = Math.abs(this.slidingPlank.x - BENCH_X);
    if (offset <= 32) {
      this.crafted++;
      this.syncProgress();
      audio.sfx("chime");
      this.sparkleBurst(BENCH_X, BENCH_Y - 20);

      // Place a finished wooden craft icon on the display table row
      const iconX = 240 + (this.crafted - 1) * 40;
      const icon = this.add.image(iconX, 118, "wood_craft").setDepth(DEPTH.FX);
      this.craftedIcons.push(icon);

      if (this.crafted >= GOAL) {
        this.finishWorkshop();
      } else {
        // Gentle speed increase
        this.plankSpeed = 115 + this.crafted * 12;
      }
    } else {
      audio.sfx("blip", 1);
    }
  }

  update() {
    super.update();
    if (this.finished || !this.slidingPlank) return;
    const delta = this.game.loop.delta;

    const minX = BENCH_X - 54;
    const maxX = BENCH_X + 54;
    let nx = this.slidingPlank.x + (this.plankDir * this.plankSpeed * delta) / 1000;
    if (nx >= maxX) {
      nx = maxX;
      this.plankDir = -1;
    } else if (nx <= minX) {
      nx = minX;
      this.plankDir = 1;
    }
    this.slidingPlank.x = Math.round(nx);
    this.plankGlow.x = this.slidingPlank.x;

    // Highlight strike zone when plank is inside
    const inZone = Math.abs(this.slidingPlank.x - BENCH_X) <= 32;
    this.zoneRing.setFillStyle(inZone ? 0xfde047 : 0xfef08a, inZone ? 0.55 : 0.22);
  }

  private finishWorkshop() {
    this.finished = true;
    this.slidingPlank.setVisible(false);
    this.plankGlow.setVisible(false);
    audio.sfx("bless");
    this.sparkleBurst(BENCH_X - 48, BENCH_Y - 30);
    this.sparkleBurst(BENCH_X + 48, BENCH_Y - 30);

    this.time.delayedCall(500, () =>
      this.completeInterlude(
        "CẦU NỐI MÙA A1",
        "Xưởng Mộc Nazareth (Lc 2, 51-52)",
        "Thánh hóa công việc học tập và bổn phận hằng ngày bằng sự chăm chỉ và lòng vâng phục.",
        "Chúa Giêsu đã khôn lớn tại mái nhà Nazareth. Giờ đây, Chúa Thánh Thần sẽ đưa chúng ta bước sang Năm Sự Sáng tại dòng sông Gio-đan!"
      )
    );
  }
}
