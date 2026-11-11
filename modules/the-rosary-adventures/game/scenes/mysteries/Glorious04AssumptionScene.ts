import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAllForGlory } from "@/modules/the-rosary-adventures/game/utils/gloryTextureGenerator";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 760;
const HEAVEN_H = 160; // cloud floor at the top
const TOMB_AT: [number, number] = [320, 560];
const LILIES: [number, number][] = [[90, 640], [550, 640], [140, 470], [500, 470], [60, 330], [580, 330], [320, 300]];
const RAINBOW = [0xef4444, 0xf97316, 0xfacc15, 0x22c55e, 0x38bdf8, 0x6366f1, 0xa855f7];

export class Glorious04AssumptionScene extends InteractiveScene {
  private placed = new Set<number>();
  private done = false;

  constructor() {
    super("Glorious04AssumptionScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAllForGlory(this);
    this.resetCarry();
    this.walkers = [];
    this.placed = new Set();
    this.done = false;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildGarden();
    this.buildPeople();
    this.defineInteractables();

    this.begin("mung_04_duc_me_len_troi", [320, 700], {
      speaker: tx("Mộ Đức Mẹ", "Our Lady's Tomb"),
      emoji: "🌸",
      lines: [
        tx("Mầu Nhiệm Thứ Tư Năm Sự Mừng: Đức Chúa Trời Cho Đức Bà Lên Trời (Kh 12, 1).", "Fourth Glorious Mystery: The Assumption of Mary into Heaven (Rev 12:1)."),
        tx("Các Tông đồ quây quần quanh mộ Mẹ, thơm ngát hoa hồng trắng. Mộ Mẹ trống không, vì Thiên Chúa đã đưa Mẹ về trời cả hồn lẫn xác.", "The Apostles gather around Mary's tomb, fragrant with white roses. Her tomb is empty, because God took her to heaven, body and soul."),
        tx("Hãy nhặt bảy bông huệ trắng đặt vào mộ Mẹ để mở đường hoa lên thiên quốc nhé.", "Pick up seven white lilies and lay them at Mary's tomb to open a flower path to heaven."),
      ],
    });
  }

  // ---------- world ----------

  private buildGarden() {
    this.add.tileSprite(0, HEAVEN_H, W, H - HEAVEN_H, "grass_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 0, W, HEAVEN_H, "cloud_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(272, 200, 96, H - 200, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.edgeWalls(W, H);
    // the sky gate is closed until the way of flowers is lit
    this.add.rectangle(0, HEAVEN_H - 4, W, 8, 0xfde68a).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.block(W / 2, HEAVEN_H - 4, W, 8);
    this.add.image(320, 60, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.5);
    for (const [x, y] of [[50, 240], [590, 250], [40, 520], [600, 540], [40, 720], [600, 720]]) this.prop(x, y, "hill_tree", 12, 8);
    for (const [x, y] of [[200, 380], [440, 380], [210, 600], [430, 610], [120, 520], [520, 520], [250, 270], [390, 270]]) {
      this.prop(x, y, "rose_bush", 14, 8);
    }
    this.prop(TOMB_AT[0], TOMB_AT[1], "empty_tomb", 104, 12);
  }

  private buildPeople() {
    // apostles kneel around the tomb
    const spots: [string, number, number][] = [
      ["peter", 250, 600], ["john_apostle", 390, 600], ["andrew", 230, 640], ["james", 410, 640],
      ["apostle_a", 260, 680], ["apostle_b", 380, 680],
    ];
    for (const [k, x, y] of spots) {
      this.add.sprite(x, y, k).setOrigin(0.5, 1).setDepth(y);
      this.block(x, y - 4, 14, 8);
    }
    this.hint(250, 562);
  }

  private defineInteractables() {
    LILIES.forEach(([x, y], i) => this.spawnLoot(`lily${i}`, x, y, "lily_big"));
    this.interactables = [
      ...LILIES.map((l, i) => ({
        at: (): [number, number] => l,
        r: 32,
        label: () => tx("[A] Nhặt hoa huệ trắng", "[A] Pick up a white lily"),
        active: () => !this.placed.has(i) && this.lootActive(`lily${i}`),
        act: () => this.takeLoot(`lily${i}`),
      })),
      {
        at: () => [TOMB_AT[0], TOMB_AT[1] + 12],
        r: 64,
        label: () => (this.held ? tx("[A] Đặt hoa vào mộ Mẹ", "[A] Lay flowers at Mary's tomb") : tx("Mộ trống của Mẹ", "Mary's empty tomb")),
        active: () => !this.done,
        act: () => this.offer(),
      },
      {
        at: () => [250, 600],
        r: 42,
        label: () => tx("[A] Thánh Phêrô", "[A] Saint Peter"),
        active: () => !this.done,
        act: () =>
          this.talk(tx("Thánh Phêrô", "Saint Peter"), "🕊️", [
            tx("Chúng tôi đến thăm mộ Mẹ, nhưng mộ trống rồi, chỉ còn hương hoa ngào ngạt.", "We came to visit Mary's tomb, but it is empty, with only a sweet fragrance of flowers."),
            tx("Mẹ đã được Thiên Chúa đưa về trời cả hồn lẫn xác. Hãy mang hoa đến dâng Mẹ nhé.", "God took Mary to heaven, body and soul. Bring flowers to honor her."),
          ]),
      },
    ];
  }

  // ---------- quest ----------

  private offer() {
    if (!this.held) {
      this.talk(tx("Mộ trống của Mẹ", "Mary's empty tomb"), "🌸", [tx("Hãy nhặt những bông huệ trắng quanh khu vườn, rồi mang đến đặt vào mộ Mẹ nhé.", "Pick up the white lilies around the garden, then lay them at Mary's tomb.")]);
      return;
    }
    const n = this.placed.size;
    const id = Number(this.held.id.replace("lily", ""));
    this.placed.add(id);
    this.dropItem();
    const x = TOMB_AT[0] - 42 + n * 14; // one row of seven
    const y = TOMB_AT[1] - 14;
    this.add.image(x, y, "lily_big").setOrigin(0.5, 1).setDepth(TOMB_AT[1] + 1);
    this.sparkleBurst(x, y - 8);
    if (this.placed.size < LILIES.length) return;
    this.done = true;
    this.time.delayedCall(500, () => this.bloom());
  }

  private bloom() {
    const cam = this.cameras.main;
    cam.flash(700, 255, 255, 255);
    // the rainbow road: seven stepped stripes climbing from the tomb to the sky gate
    const road = this.add.graphics().setDepth(DEPTH.RUG);
    RAINBOW.forEach((c, i) => road.fillStyle(c, 0.9).fillRect(298 + i * 6, HEAVEN_H, 6, TOMB_AT[1] - 28 - HEAVEN_H));
    road.setAlpha(0);
    this.tweens.add({ targets: road, alpha: 1, duration: 1200 });
    this.talk(tx("Đường hoa thiên quốc", "The heavenly flower path"), "🌈", [tx("Một cầu vồng ánh sáng bừng lên, dẫn từ mộ Mẹ lên các tầng trời!", "A rainbow of light bursts forth, leading from Mary's tomb up through the heavens!")], () => this.rise());
  }

  private rise() {
    const cam = this.cameras.main;
    const mary = this.add.sprite(TOMB_AT[0], TOMB_AT[1] - 20, "mary_glory").setOrigin(0.5, 1).setDepth(DEPTH.FX).setAlpha(0);
    const glow = this.add.image(mary.x, mary.y - 16, "glow_gold").setDepth(DEPTH.FX - 1).setAlpha(0);
    const cloud = this.add.image(320, 140, "cloud_big").setOrigin(0.5, 1).setDepth(DEPTH.FX - 2).setAlpha(0);
    const jesus = this.add.sprite(320, 130, "jesus_risen").setOrigin(0.5, 1).setDepth(DEPTH.FX).setAlpha(0);
    this.tweens.add({ targets: [mary, glow, cloud, jesus], alpha: 1, duration: 900 });
    // angel choir
    for (const [i, x] of [210, 270, 370, 430].entries()) {
      const a = this.add.sprite(x, 120 + (i % 2) * 14, "archangel_gabriel").setOrigin(0.5, 1).setDepth(DEPTH.FX).setAlpha(0).play("angel_flap");
      this.tweens.add({ targets: a, alpha: 1, duration: 900, delay: i * 150 });
    }
    cam.stopFollow();
    cam.pan(320, 200, 1600, "Linear");
    this.time.delayedCall(1800, () =>
      this.talk(
        tx("Chúa Giêsu", "Jesus"),
        "🌸",
        [
          tx("Chúa Giêsu cúi xuống, nắm lấy bàn tay dịu hiền của Mẹ, đưa Mẹ lên ngai vinh hiển.", "Jesus bends down, takes His Mother's gentle hand and lifts her to the throne of glory."),
          tx("'Người Phụ Nữ mặc áo mặt trời, có vầng trăng dưới chân.' (Kh 12, 1)", "‘A woman clothed with the sun, with the moon under her feet.’ (Rev 12:1)"),
        ],
        () => {
          // Mary rises up the rainbow on x=320. Nearing Jesus, he steps right; level with him, she steps left.
          const RISE = 3600;
          const START = 700;
          this.tweens.add({ targets: mary, y: 130, duration: RISE, delay: START, ease: "Stepped", easeParams: [28] });
          this.tweens.add({ targets: glow, y: 114, duration: RISE, delay: START, ease: "Stepped", easeParams: [28] });
          this.time.delayedCall(START + RISE * 0.85, () =>
            this.tweens.add({ targets: jesus, x: 336, duration: 300, ease: "Stepped", easeParams: [2] })
          );
          this.time.delayedCall(START + RISE, () =>
            this.tweens.add({ targets: [mary, glow], x: 304, duration: 300, ease: "Stepped", easeParams: [2] })
          );
          this.time.delayedCall(START + RISE + 600, () => this.talkEnd());
        }
      )
    );
  }

  private talkEnd() {
    this.talk(
      tx("Các Thiên Thần", "The Angels"),
      "👼",
      [tx("Mẹ Maria được rước lên trời cả hồn lẫn xác. Mẹ đi trước để chuẩn bị chỗ cho các con cái của Mẹ.", "Mary is taken up to heaven, body and soul. She goes ahead to prepare a place for her children."), tx("Hãy hy vọng được cùng Mẹ hưởng hạnh phúc thiên đàng nhé!", "Hope to share the joy of heaven with her!")],
      () => this.finish()
    );
  }

  private finish() {
    this.time.delayedCall(300, () =>
      this.complete(
        4,
        tx("Năm Sự Mừng", "Glorious"),
        tx("Đức Chúa Trời Cho Đức Bà Lên Trời", "The Assumption of Mary into Heaven"),
        tx("Ơn chết lành và niềm hy vọng được đoàn tụ với Mẹ trên thiên đàng.", "The grace of a happy death and the hope of being reunited with Mary in heaven."),
        tx("Mẹ Maria đã về trời và luôn nhìn xuống con. Mỗi ngày hãy đọc một kinh Kính Mừng để xin Mẹ cầu cho con nhé!", "Mary is in heaven and always looks down on you. Pray one Hail Mary each day and ask her to pray for you!"),
        ["lily_path_to_heaven", "rainbow_bridge"]
      )
    );
  }
}
