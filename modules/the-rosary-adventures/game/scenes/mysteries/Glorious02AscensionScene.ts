import * as Phaser from "phaser";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAllForGlory } from "@/modules/the-rosary-adventures/game/utils/gloryTextureGenerator";

const W = 640;
const H = 560;
const JESUS_AT: [number, number] = [320, 250];

/** Four compass symbols, each belongs to the apostles standing on that side of the circle. */
const DIRS = [
  { id: "icon_north", name: "ngôi sao phương Bắc", label: "Bắc", from: [90, 470] as [number, number], group: [320, 150] as [number, number], keys: ["peter", "andrew"] },
  { id: "icon_east", name: "mặt trời phương Đông", label: "Đông", from: [550, 470] as [number, number], group: [510, 250] as [number, number], keys: ["james", "john_apostle"] },
  { id: "icon_south", name: "đóa hoa phương Nam", label: "Nam", from: [90, 190] as [number, number], group: [320, 360] as [number, number], keys: ["apostle_a", "apostle_b"] },
  { id: "icon_west", name: "vầng trăng phương Tây", label: "Tây", from: [550, 190] as [number, number], group: [130, 250] as [number, number], keys: ["apostle_c", "apostle_d"] },
];

export class Glorious02AscensionScene extends InteractiveScene {
  private given = new Set<string>();
  private done = false;
  private jesus!: Phaser.GameObjects.Sprite;
  private cloud!: Phaser.GameObjects.Image;

  constructor() {
    super("Glorious02AscensionScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAllForGlory(this);
    this.resetCarry();
    this.walkers = [];
    this.given = new Set();
    this.done = false;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildMount();
    this.buildPeople();
    this.defineInteractables();

    this.begin("mung_02_len_troi", [320, 500], {
      speaker: "Núi Cây Dầu",
      emoji: "☁️",
      lines: [
        "Mầu Nhiệm Thứ Hai Năm Sự Mừng: Đức Chúa Giêsu Lên Trời Vinh Hiển (Cv 1, 6-11).",
        "Bình minh rực rỡ trên đỉnh Núi Cây Dầu. Chúa Giêsu sai các Tông đồ: 'Anh em hãy đi giảng dạy cho muôn dân.' (Mt 28, 19)",
        "Hãy nhặt bốn biểu tượng của bốn phương trời và trao cho bốn nhóm Tông đồ nhé.",
      ],
    });
  }

  // ---------- world ----------

  private buildMount() {
    this.add.tileSprite(0, 0, W, H, "grass_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(80, 90, 480, 400, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR).setTint(0xfde9b8);
    this.edgeWalls(W, H);
    this.add.rectangle(0, 0, W, H, 0xfb923c, 0.12).setOrigin(0).setDepth(DEPTH.FX - 5);
    const sun = this.add.image(W / 2, 20, "glow_gold").setDepth(DEPTH.FX - 4).setAlpha(0.8).setTint(0xfde68a);
    this.tweens.add({ targets: sun, alpha: 1, duration: 2200, yoyo: true, repeat: -1 });
    // the holy city far below
    this.add.image(W / 2, 56, "jerusalem").setOrigin(0.5, 1).setDepth(DEPTH.FLOOR + 1).setAlpha(0.9);
    this.block(W / 2, 40, W, 60);
    for (const [x, y] of [[44, 120], [598, 130], [40, 330], [602, 340], [50, 520], [596, 520]]) this.prop(x, y, "hill_tree", 12, 8);
    for (const [x, y] of [[190, 100], [450, 100], [190, 430], [450, 440]]) this.prop(x, y, "boulder", 26, 8);
    for (const [x, y] of [[230, 120], [410, 120], [260, 470], [380, 470], [60, 280], [580, 290]]) {
      this.add.image(x, y, "flower_y").setOrigin(0.5, 1).setDepth(y);
    }
    this.cloud = this.add.image(JESUS_AT[0], JESUS_AT[1] + 4, "cloud_big").setOrigin(0.5, 1).setDepth(DEPTH.FLOOR + 2).setAlpha(0);
  }

  private buildPeople() {
    this.jesus = this.add.sprite(JESUS_AT[0], JESUS_AT[1], "jesus_risen").setOrigin(0.5, 1).setDepth(JESUS_AT[1]);
    this.block(JESUS_AT[0], JESUS_AT[1] - 4, 16, 8);
    this.add.image(JESUS_AT[0], JESUS_AT[1] - 16, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.3);
    this.hint(JESUS_AT[0], JESUS_AT[1] - 38);
    for (const d of DIRS) {
      d.keys.forEach((k, i) => {
        const x = d.group[0] - 12 + i * 24;
        this.add.sprite(x, d.group[1], k).setOrigin(0.5, 1).setDepth(d.group[1]);
        this.block(x, d.group[1] - 4, 14, 8);
      });
      this.add
        .text(d.group[0], d.group[1] + 4, d.label, { fontFamily: "'Dearpix', monospace", fontSize: "20px", color: "#fef08a", resolution: 4 })
        .setOrigin(0.5, 0)
        .setDepth(DEPTH.FX);
    }
  }

  private defineInteractables() {
    for (const d of DIRS) this.spawnLoot(d.id, d.from[0], d.from[1]);
    this.interactables = [
      ...DIRS.map((d) => ({
        at: (): [number, number] => d.from,
        r: 34,
        label: () => `[A] Nhặt ${d.name}`,
        active: () => !this.given.has(d.id) && this.lootActive(d.id),
        act: () => this.takeLoot(d.id),
      })),
      ...DIRS.map((d) => ({
        at: (): [number, number] => [d.group[0], d.group[1] + 8],
        r: 40,
        label: () => (this.held ? `[A] Trao cho nhóm phương ${d.label}` : `Các Tông đồ phương ${d.label}`),
        active: () => !this.given.has(d.id),
        act: () => this.give(d),
      })),
      {
        at: () => JESUS_AT,
        r: 50,
        label: () => "[A] Chúa Giêsu",
        active: () => !this.done,
        act: () =>
          this.talk("Chúa Giêsu", "☁️", [
            "Anh em sẽ nhận được sức mạnh của Thánh Thần và làm chứng về Thầy ở Giêrusalem, khắp xứ Giuđê, Samari, cho đến tận cùng trái đất. (Cv 1, 8)",
            `Con đã trao ${this.given.size}/4 biểu tượng. Hãy trao đủ bốn phương trời nhé.`,
          ]),
      },
    ];
  }

  // ---------- quest ----------

  private give(d: (typeof DIRS)[number]) {
    if (!this.held) {
      this.talk(`Phương ${d.label}`, "🧭", [`Các Tông đồ phương ${d.label} đang chờ ${d.name}. Hãy nhặt biểu tượng trên đồi mang đến đây nhé.`]);
      return;
    }
    if (this.held.id !== d.id) {
      this.talk(`Phương ${d.label}`, "🧭", [`Chưa đúng rồi. Nhóm này ở phương ${d.label}, cần ${d.name}. Hãy xem tên dưới mỗi nhóm nhé.`]);
      return;
    }
    this.given.add(d.id);
    this.dropItem();
    const icon = this.add.image(d.group[0], d.group[1] - 32, d.id).setDepth(DEPTH.FX);
    this.tweens.add({ targets: icon, y: icon.y - 3, duration: 700, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    this.sparkleBurst(d.group[0], d.group[1] - 28);
    const last = this.given.size === DIRS.length;
    this.talk(`Tông đồ phương ${d.label}`, "🕊️", [`Chúng tôi sẽ mang Tin Mừng đến phương ${d.label}!`], last ? () => this.ascend() : undefined);
  }

  private ascend() {
    this.done = true;
    this.cloud.setAlpha(1);
    this.tweens.add({ targets: this.cloud, y: this.cloud.y - 6, duration: 600, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    this.talk("Chúa Giêsu", "☁️", ["Chúa giơ tay chúc lành cho các môn đệ... rồi từ từ được cất lên, một đám mây khuất mắt các ông. (Cv 1, 9)"], () => {
      this.tweens.add({ targets: [this.jesus, this.cloud], y: "-=190", alpha: { from: 1, to: 0 }, duration: 3200, ease: "Stepped", easeParams: [20] });
      this.cameras.main.flash(900, 255, 255, 220);
      this.time.delayedCall(3400, () => this.angels());
    });
  }

  private angels() {
    for (const [i, x] of [250, 390].entries()) {
      const a = this.add.sprite(x, 330, "archangel_gabriel").setOrigin(0.5, 1).setDepth(330).setAlpha(0).play("angel_flap");
      this.tweens.add({ targets: a, alpha: 1, duration: 700, delay: i * 200 });
      this.sparkleBurst(x, 306);
    }
    this.time.delayedCall(900, () =>
      this.talk(
        "Hai Thiên Thần",
        "👼",
        [
          "'Hỡi người Ga-li-lê, sao còn đứng nhìn trời? Đức Giêsu này vừa lên trời sẽ ngự đến cùng một thể ấy.' (Cv 1, 11)",
          "Hãy hướng lòng về quê trời và hăng say loan báo Tin Mừng nhé!",
        ],
        () => this.finish()
      )
    );
  }

  private finish() {
    this.time.delayedCall(300, () =>
      this.complete(
        2,
        "Năm Sự Mừng",
        "Đức Chúa Giêsu Lên Trời Vinh Hiển",
        "Luôn hướng lòng về quê trời và hăng say thi hành sứ mạng loan báo Tin Mừng.",
        "Chúa đã về trời chuẩn bị chỗ cho chúng ta. Hãy kể cho bạn bè nghe về Chúa Giêsu nhé!",
        ["mission_four_directions", "angels_promise"]
      )
    );
  }
}
