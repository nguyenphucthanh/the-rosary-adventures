import * as Phaser from "phaser";
import audio from "@/modules/shared/game/audio/AudioManager";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAnnunciationTextures } from "@/modules/the-rosary-adventures/game/utils/npcTextureGenerator";
import { registerVisitationTextures } from "@/modules/the-rosary-adventures/game/utils/visitationTextureGenerator";
import { registerInfancyTextures } from "@/modules/the-rosary-adventures/game/utils/infancyTextureGenerator";
import { registerInterludeTextures } from "@/modules/the-rosary-adventures/game/utils/interludeTextureGenerator";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 480;
const BENCH_X = 320;
const BENCH_Y = 250;
const GOAL = 5;

const TOOLS = [
  { key: "tool_hammer", name: tx("cái búa", "hammer") },
  { key: "tool_saw", name: tx("cái cưa", "saw") },
  { key: "tool_plane", name: tx("cái bào", "plane") },
  { key: "tool_chisel", name: tx("cái đục", "chisel") },
  { key: "tool_square", name: tx("cây thước vuông", "square ruler") },
];

/** Chests: foot position + how Jesus describes them. 5 of 8 hide a tool (random each play). */
const CHESTS = [
  { x: 64, y: 190, where: tx("ở góc trái, ngay dưới chậu ô-liu", "in the left corner, right under the olive pot") },
  { x: 576, y: 190, where: tx("ở góc phải, ngay dưới chậu ô-liu", "in the right corner, right under the olive pot") },
  { x: 120, y: 262, where: tx("cạnh đống củi bên trái", "next to the left woodpile") },
  { x: 520, y: 262, where: tx("cạnh đống củi bên phải", "next to the right woodpile") },
  { x: 130, y: 420, where: tx("cạnh mấy cái chum đất", "beside the clay jars") },
  { x: 500, y: 420, where: tx("gần bó rơm", "near the straw bundle") },
  { x: 400, y: 390, where: tx("phía dưới bàn mộc, hơi lệch bên phải", "below the workbench, slightly to the right") },
  { x: 490, y: 112, where: tx("bên dưới cửa sổ phía phải", "under the right-hand window") },
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
      speaker: tx("Xưởng Mộc Nazareth", "The Nazareth Carpenter's Workshop"),
      emoji: "🪚",
      lines: [
        tx("Cầu Nối Mùa Vui → Mùa Sáng: Xưởng Mộc Nazareth (Lc 2, 51-52).", "Season Bridge Joyful → Luminous: The Nazareth Carpenter's Workshop (Lk 2:51-52)."),
        tx("“Chúa Giêsu xuống cùng với cha mẹ trở về Na-da-rét và hằng vâng phục các ngài... Người ngày càng thêm khôn ngoan, thêm cao lớn và thêm ân nghĩa.”", "“Jesus went down with them and came to Nazareth, and was obedient to them... And Jesus grew in wisdom and stature, and in favor with God and men.”"),
        tx("Thánh Giuse làm mất 5 dụng cụ mộc rồi! Hãy đến hỏi Chúa Giêsu bé nhỏ để nghe gợi ý, rồi mở các rương [A] tìm giúp Ngài nhé. Có rương trống đó!", "Saint Joseph has lost 5 carpentry tools! Ask little Jesus for a hint, then open the chests with [A] to help Him look. Some chests are empty!"),
      ],
    });
    this.syncProgress();
  }

  private syncProgress() {
    this.emitInterludeProgress([
      {
        id: "workshop_tools",
        emoji: "🪚",
        label: tx("DỤNG CỤ", "TOOLS"),
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
        label: () => tx("[A] Hỏi Chúa Giêsu", "[A] Ask Jesus"),
        active: () => !this.finished,
        act: () => this.askJesus(),
      },
      {
        at: () => [this.joseph.x, this.joseph.y - 12],
        r: 34,
        label: () => tx("[A] Trò chuyện với Thánh Giuse", "[A] Talk to Saint Joseph"),
        active: () => !this.finished,
        act: () =>
          this.talk(tx("Thánh Giuse", "Saint Joseph"), "🪚", [
            tx("Ôi, bác tìm mãi mà chưa thấy đủ dụng cụ! Con hỏi Giêsu giúp bác nhé.", "Oh, I've searched and searched but I can't find all my tools! Please ask Jesus to help me."),
            tx(`Đã tìm được ${this.found}/${GOAL} món rồi. Cảm ơn con!`, `You've found ${this.found}/${GOAL} tools already. Thank you!`),
          ]),
      },
      {
        at: () => [120, 134],
        r: 44,
        label: () => tx("[A] Trò chuyện với Đức Mẹ", "[A] Talk to Mary"),
        active: () => !this.finished,
        act: () =>
          this.talk(tx("Đức Mẹ Maria", "Mother Mary"), "💙", [
            tx("Suốt những năm tháng ở Nazareth, Chúa Giêsu luôn vui vẻ phụ giúp Thánh Giuse trong xưởng mộc.", "Through all the years in Nazareth, Jesus happily helped Saint Joseph in the carpenter's workshop."),
            tx("Làm việc nhỏ với tình yêu lớn chính là con đường nên thánh đó con!", "Doing small things with great love is the path to holiness, my child!"),
          ]),
      },
      ...CHESTS.map((c, i) => ({
        at: (): [number, number] => [c.x, c.y - 6],
        r: 26,
        label: () => tx("[A] Mở rương", "[A] Open the chest"),
        active: () => !this.finished && !this.chests[i].opened,
        act: () => this.openChest(i),
      })),
    ];
  }

  private askJesus() {
    const next = this.chests.find((c) => c.tool !== undefined && !c.opened);
    if (!next) return;
    const where = CHESTS[this.chests.indexOf(next)].where;
    this.talk(tx("Chúa Giêsu", "Jesus"), "💛", [
      tx(`Con nhớ rồi! Có một dụng cụ của Cha Giuse nằm trong rương ${where}.`, `I remember! One of Joseph's tools is in the chest ${where}.`),
      tx(`Còn ${GOAL - this.found} món nữa. Mình cùng tìm nhé!`, `${GOAL - this.found} more to go. Let's find them together!`),
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
        .text(c.x, c.y - 22, tx("Rương trống!", "Empty chest!"), {
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
    this.talk(tx("Tìm thấy rồi!", "Found it!"), "🔨", [tx(`Bạn tìm được ${tool.name} của Thánh Giuse! (${this.found}/${GOAL})`, `You found Saint Joseph's ${tool.name}! (${this.found}/${GOAL})`)], () => {
      if (this.found >= GOAL) this.finishWorkshop();
    });
  }

  private finishWorkshop() {
    this.finished = true;
    audio.sfx("bless");
    this.sparkleBurst(this.joseph.x, this.joseph.y - 20);
    this.time.delayedCall(500, () =>
      this.completeInterlude(
        tx("CẦU NỐI MÙA A1", "SEASON BRIDGE A1"),
        tx("Xưởng Mộc Nazareth (Lc 2, 51-52)", "The Nazareth Carpenter's Workshop (Lk 2:51-52)"),
        tx("Thánh hóa công việc học tập và bổn phận hằng ngày bằng sự chăm chỉ và lòng vâng phục.", "Make school work and daily duties holy through diligence and obedience."),
        tx("Chúa Giêsu đã khôn lớn tại mái nhà Nazareth. Giờ đây, Chúa Thánh Thần sẽ đưa chúng ta bước sang Năm Sự Sáng tại dòng sông Gio-đan!", "Jesus grew up under the roof at Nazareth. Now the Holy Spirit leads us on to the Luminous Mysteries at the River Jordan!")
      )
    );
  }
}
