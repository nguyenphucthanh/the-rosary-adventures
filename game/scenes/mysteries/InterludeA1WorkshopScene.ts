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

const TOOLS = [
  { key: "tool_hammer", name: "cái búa" },
  { key: "tool_saw", name: "cái cưa" },
  { key: "tool_plane", name: "cái bào" },
  { key: "tool_chisel", name: "cái đục" },
  { key: "tool_square", name: "cây thước vuông" },
];

/** Chests: foot position + how Jesus describes them. 5 of 8 hide a tool (random each play). */
const CHESTS = [
  { x: 64, y: 190, where: "ở góc trái, ngay dưới chậu ô-liu" },
  { x: 576, y: 190, where: "ở góc phải, ngay dưới chậu ô-liu" },
  { x: 120, y: 262, where: "cạnh đống củi bên trái" },
  { x: 520, y: 262, where: "cạnh đống củi bên phải" },
  { x: 130, y: 420, where: "cạnh mấy cái chum đất" },
  { x: 500, y: 420, where: "gần bó rơm" },
  { x: 400, y: 390, where: "phía dưới bàn mộc, hơi lệch bên phải" },
  { x: 490, y: 112, where: "bên dưới cửa sổ phía phải" },
];

const WANDER: [number, number][] = [
  [250, 295],
  [390, 295],
  [440, 215],
  [200, 215],
  [320, 300],
];

/**
 * Season Bridge A1 (Between Joyful 5 & Luminous 1): The Carpenter's Workshop at Nazareth (Lc 2, 51-52).
 * Search game: St. Joseph wanders the workshop. Talk to young Jesus for a hint, then open chests
 * to find 5 of Joseph's lost tools (the other chests are empty).
 */
export class InterludeA1WorkshopScene extends InteractiveScene {
  private joseph!: Phaser.GameObjects.Sprite;
  private chests: { img: Phaser.GameObjects.Image; opened: boolean; tool?: number }[] = [];
  private found = 0;
  private finished = false;

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

    this.found = 0;
    this.finished = false;
    this.chests = [];
    this.walkers = [];

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildWorkshop();
    this.buildCharactersAndChests();
    this.defineInteractables();
    this.wander();

    this.begin("bridge_a1_xuong_moc", [320, 440], {
      speaker: "Xưởng Mộc Nazareth",
      emoji: "🪚",
      lines: [
        "Cầu Nối Mùa Vui → Mùa Sáng: Xưởng Mộc Nazareth (Lc 2, 51-52).",
        "“Chúa Giêsu xuống cùng với cha mẹ trở về Na-da-rét và hằng vâng phục các ngài... Người ngày càng thêm khôn ngoan, thêm cao lớn và thêm ân nghĩa.”",
        "Thánh Giuse làm mất 5 dụng cụ mộc rồi! Hãy đến hỏi Chúa Giêsu bé nhỏ để nghe gợi ý, rồi mở các rương [A] tìm giúp Ngài nhé. Có rương trống đó!",
      ],
    });
    this.syncProgress();
  }

  private syncProgress() {
    this.emitInterludeProgress([
      {
        id: "workshop_tools",
        emoji: "🪚",
        label: "DỤNG CỤ",
        current: this.found,
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

  private buildCharactersAndChests() {
    this.joseph = this.add.sprite(250, 295, "joseph").setOrigin(0.5, 1);
    this.walkers.push(this.joseph);
    this.add.sprite(320, 345, "jesus12").setOrigin(0.5, 1).setDepth(345);
    this.hint(320, 316);
    this.add.sprite(120, 150, "mary_praying").setOrigin(0.5, 1).setDepth(150);
    this.hint(120, 114);

    this.prop(BENCH_X, BENCH_Y, "carpenter_bench", 136, 16);

    const toolChests = Phaser.Utils.Array.Shuffle(CHESTS.map((_, i) => i)).slice(0, GOAL);
    this.chests = CHESTS.map((c, i) => ({
      img: this.prop(c.x, c.y, "chest_closed", 18, 8),
      opened: false,
      tool: toolChests.indexOf(i) >= 0 ? toolChests.indexOf(i) : undefined,
    }));
  }

  /** Joseph strolls between random spots, pausing between walks. */
  private wander() {
    if (this.finished) return;
    const pts = Phaser.Utils.Array.Shuffle(WANDER.slice()).slice(0, 2);
    this.walk(this.joseph, pts, () => this.time.delayedCall(900, () => this.wander()));
  }

  private defineInteractables() {
    this.interactables = [
      {
        at: () => [320, 330],
        r: 36,
        label: () => "[A] Hỏi Chúa Giêsu",
        active: () => !this.finished,
        act: () => this.askJesus(),
      },
      {
        at: () => [this.joseph.x, this.joseph.y - 12],
        r: 34,
        label: () => "[A] Trò chuyện với Thánh Giuse",
        active: () => !this.finished,
        act: () =>
          this.talk("Thánh Giuse", "🪚", [
            "Ôi, bác tìm mãi mà chưa thấy đủ dụng cụ! Con hỏi Giêsu giúp bác nhé.",
            `Đã tìm được ${this.found}/${GOAL} món rồi. Cảm ơn con!`,
          ]),
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
      ...CHESTS.map((c, i) => ({
        at: (): [number, number] => [c.x, c.y - 6],
        r: 26,
        label: () => "[A] Mở rương",
        active: () => !this.finished && !this.chests[i].opened,
        act: () => this.openChest(i),
      })),
    ];
  }

  private askJesus() {
    const next = this.chests.find((c) => c.tool !== undefined && !c.opened);
    if (!next) return;
    const where = CHESTS[this.chests.indexOf(next)].where;
    this.talk("Chúa Giêsu", "💛", [
      `Con nhớ rồi! Có một dụng cụ của Cha Giuse nằm trong rương ${where}.`,
      `Còn ${GOAL - this.found} món nữa. Mình cùng tìm nhé!`,
    ]);
  }

  private openChest(i: number) {
    const chest = this.chests[i];
    const c = CHESTS[i];
    chest.opened = true;
    chest.img.setTexture("chest_open");
    if (chest.tool === undefined) {
      audio.sfx("blip", 1);
      const t = this.add
        .text(c.x, c.y - 22, "Rương trống!", {
          fontFamily: "'Dearpix', monospace",
          fontSize: "20px",
          color: "#fef08a",
          resolution: 4,
        })
        .setOrigin(0.5, 1)
        .setDepth(DEPTH.FX);
      this.tweens.add({ targets: t, y: t.y - 10, alpha: 0, duration: 1200, onComplete: () => t.destroy() });
      return;
    }
    const tool = TOOLS[chest.tool];
    this.found++;
    this.syncProgress();
    this.sparkleBurst(c.x, c.y - 10);
    const pop = this.add.image(c.x, c.y - 10, tool.key).setDepth(DEPTH.FX);
    const slotX = 240 + (this.found - 1) * 40;
    this.tweens.add({ targets: pop, y: c.y - 30, duration: 400 });
    this.tweens.add({
      targets: pop,
      x: slotX,
      y: 118,
      delay: 600,
      duration: 700,
      onComplete: () => pop.setDepth(118),
    });
    this.talk("Tìm thấy rồi!", "🔨", [`Bạn tìm được ${tool.name} của Thánh Giuse! (${this.found}/${GOAL})`], () => {
      if (this.found >= GOAL) this.finishWorkshop();
    });
  }

  private finishWorkshop() {
    this.finished = true;
    audio.sfx("bless");
    this.sparkleBurst(this.joseph.x, this.joseph.y - 20);
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
