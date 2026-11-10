import * as Phaser from "phaser";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAnnunciationTextures } from "@/modules/the-rosary-adventures/game/utils/npcTextureGenerator";
import { registerVisitationTextures } from "@/modules/the-rosary-adventures/game/utils/visitationTextureGenerator";
import { registerInfancyTextures } from "@/modules/the-rosary-adventures/game/utils/infancyTextureGenerator";
import { registerLightTextures } from "@/modules/the-rosary-adventures/game/utils/lightTextureGenerator";
import { registerCanaTextures } from "@/modules/the-rosary-adventures/game/utils/canaTextureGenerator";
import { registerGalileeTextures } from "@/modules/the-rosary-adventures/game/utils/galileeTextureGenerator";

const W = 640;
const H = 512;
const WALL_H = 48;
const TABLE: [number, number] = [320, 232];
const JESUS_AT: [number, number] = [456, 238];
const PLATE: [number, number] = [292, 210];
const CHALICE: [number, number] = [366, 210];
const LOOT: Record<string, [string, number, number, string]> = {
  basin: ["basin", 70, 340, "thau đồng"],
  towel: ["towel", 570, 340, "khăn thắt lưng"],
  wheat: ["wheat", 80, 430, "bông lúa miến"],
  grapes: ["grapes", 560, 430, "chùm nho"],
};
const APOSTLES = ["peter", "andrew", "james", "john_apostle", "apostle_a", "apostle_b", "apostle_c", "mourner", "hungry", "prisoner", "shepherd", "scribe"];

export class Luminous05EucharistScene extends InteractiveScene {
  private step = 0; // 0 intro, 1 foot-washing items, 2 bread & wine, 3 done
  private delivered = new Set<string>();
  private plate!: Phaser.GameObjects.Image;
  private chalice!: Phaser.GameObjects.Image;
  private plated = false;
  private poured = false;

  constructor() {
    super("Luminous05EucharistScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAnnunciationTextures(this);
    registerVisitationTextures(this);
    registerInfancyTextures(this);
    registerLightTextures(this);
    registerCanaTextures(this);
    registerGalileeTextures(this);
    this.resetCarry();
    this.walkers = [];
    this.step = 0;
    this.delivered = new Set();
    this.plated = this.poured = false;

    if (!this.anims.exists("cana_lamp_flicker")) {
      this.anims.create({ key: "cana_lamp_flicker", frames: this.anims.generateFrameNumbers("cana_lamp", { frames: [0, 1] }), frameRate: 3, repeat: -1 });
    }

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildRoom();
    this.buildTable();
    this.buildCharacters();
    this.defineInteractables();

    this.begin("sang_05_thanh_the", [320, 456], {
      speaker: "Phòng Tiệc Ly",
      emoji: "🍞",
      lines: [
        "Mầu Nhiệm Thứ Năm Năm Sự Sáng: Đức Chúa Giêsu Lập Bí Tích Thánh Thể (Lc 22, 14-20).",
        "Đêm Lễ Vượt Qua, Chúa Giêsu cùng mười hai Tông đồ quây quần trong căn phòng trên lầu cao.",
        "Hãy đến gặp Chúa Giêsu ở đầu bàn tiệc nhé.",
      ],
    });
  }

  // ---------- world ----------

  private buildRoom() {
    this.add.tileSprite(0, 0, W, H, "floor_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(176, 150, 320, 150, "rug_tile").setOrigin(0).setDepth(DEPTH.RUG);
    this.edgeWalls(W, H);
    this.add.tileSprite(0, 0, W, WALL_H, "stone_wall").setOrigin(0).setDepth(DEPTH.WALL - 1);
    this.block(W / 2, WALL_H / 2, W, WALL_H);
    for (const x of [120, 520]) this.add.image(x, 6, "window_arch").setOrigin(0.5, 0).setDepth(DEPTH.WALL);
    const beams = this.add.graphics().setDepth(3).fillStyle(0xfef9c3, 0.08);
    beams.fillPoints([{ x: 108, y: 36 }, { x: 132, y: 36 }, { x: 180, y: 160 }, { x: 130, y: 160 }], true);
    beams.fillPoints([{ x: 508, y: 36 }, { x: 532, y: 36 }, { x: 510, y: 160 }, { x: 460, y: 160 }], true);
    for (const x of [180, 320, 460]) {
      const lamp = this.add.sprite(x, WALL_H, "cana_lamp").setOrigin(0.5, 0).setDepth(DEPTH.WALL).play("cana_lamp_flicker");
      const glow = this.add.image(x, WALL_H + 22, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.35);
      this.tweens.add({ targets: glow, alpha: 0.5, duration: 900, yoyo: true, repeat: -1, delay: x });
      void lamp;
    }
    this.prop(60, 110, "menorah", 20, 8);
    this.prop(580, 110, "menorah", 20, 8);
    for (const [x, y] of [[40, 190], [600, 190], [40, 480], [600, 480]]) this.prop(x, y, "olive_pot", 14, 8);
    this.prop(110, 490, "clay_jar", 10, 6);
    this.prop(520, 492, "clay_jar", 10, 6);
    this.prop(46, 300, "crate", 18, 10);
    this.prop(594, 300, "crate", 18, 10);
  }

  private buildTable() {
    this.prop(TABLE[0], TABLE[1], "supper_table", 186, 18);
    this.plate = this.add.image(PLATE[0], PLATE[1], "plate_empty").setOrigin(0.5, 1).setDepth(TABLE[1] + 1);
    this.chalice = this.add.image(CHALICE[0], CHALICE[1], "chalice_empty").setOrigin(0.5, 1).setDepth(TABLE[1] + 1);
  }

  private buildCharacters() {
    const person = (key: string, x: number, y: number) => this.add.sprite(x, y, key).setOrigin(0.5, 1).setDepth(y);
    APOSTLES.forEach((k, i) => person(k, 232 + (i % 6) * 32, i < 6 ? 194 : 272));
    person("jesus_adult", ...JESUS_AT);
    this.hint(JESUS_AT[0], JESUS_AT[1] - 38);
  }

  // ---------- interaction ----------

  private defineInteractables() {
    const loot = (id: string, show: () => boolean) => {
      const [, x, y, name] = LOOT[id];
      return { at: (): [number, number] => [x, y], r: 32, label: () => `[A] Nhặt ${name}`, active: () => show() && this.lootActive(id), act: () => this.takeLoot(id) };
    };
    this.interactables = [
      loot("basin", () => this.step === 1),
      loot("towel", () => this.step === 1),
      loot("wheat", () => this.step === 2),
      loot("grapes", () => this.step === 2),
      {
        at: () => JESUS_AT,
        r: 52,
        label: () => "[A] Trò chuyện với Chúa Giêsu",
        active: () => this.step < 3,
        act: () => this.jesus(),
      },
      {
        at: () => [PLATE[0], 256],
        r: 40,
        label: () => "[A] Đĩa bánh",
        active: () => this.step === 2 && !this.plated,
        act: () => this.serve("wheat", "Đĩa bánh", "🥖", "bông lúa miến"),
      },
      {
        at: () => [CHALICE[0], 256],
        r: 40,
        label: () => "[A] Chén thánh",
        active: () => this.step === 2 && !this.poured,
        act: () => this.serve("grapes", "Chén thánh", "🍷", "chùm nho"),
      },
    ];
  }

  private jesus() {
    if (this.step === 0) {
      this.talk(
        "Chúa Giêsu",
        "✨",
        [
          "'Thầy hết sức mong muốn ăn bữa Vượt Qua này với anh em trước khi chịu khổ hình.' (Lc 22, 15)",
          "Trước bữa ăn, Thầy muốn rửa chân cho anh em, để làm gương phục vụ. (Ga 13, 14-15)",
          "Con hãy tìm giúp Thầy chiếc thau đồng và chiếc khăn thắt lưng nhé.",
        ],
        () => {
          this.step = 1;
          this.spawnLoot("basin", LOOT.basin[1], LOOT.basin[2]);
          this.spawnLoot("towel", LOOT.towel[1], LOOT.towel[2]);
        }
      );
      return;
    }
    if (this.step === 1) {
      const id = this.held?.id;
      if (id === "basin" || id === "towel") {
        this.delivered.add(id);
        this.dropItem();
        this.sparkleBurst(JESUS_AT[0], JESUS_AT[1] - 20);
        if (this.delivered.size === 2) this.washFeet();
        else this.talk("Chúa Giêsu", "✨", [`Cảm ơn con! Còn thiếu ${id === "basin" ? "chiếc khăn thắt lưng" : "chiếc thau đồng"} nữa.`]);
        return;
      }
      this.talk("Chúa Giêsu", "✨", ["Thầy cần chiếc thau đồng và chiếc khăn thắt lưng. Con hãy nhặt và mang đến cho Thầy nhé."]);
      return;
    }
    this.talk("Chúa Giêsu", "✨", ["Con hãy đặt bông lúa miến lên đĩa bánh và chùm nho vào chén thánh trên bàn tiệc nhé."]);
  }

  private washFeet() {
    this.talk(
      "Chúa Giêsu",
      "✨",
      [
        "Chúa Giêsu cởi áo ngoài, thắt khăn, đổ nước vào thau và rửa chân cho các môn đệ. (Ga 13, 4-5)",
        "'Thầy là Chúa, là Thầy mà còn rửa chân cho anh em, thì anh em cũng phải rửa chân cho nhau.' (Ga 13, 14)",
        "Bây giờ con hãy chuẩn bị bàn tiệc: nhặt lúa miến đặt lên đĩa bánh, nhặt chùm nho đặt vào chén thánh.",
      ],
      () => {
        this.step = 2;
        this.spawnLoot("wheat", LOOT.wheat[1], LOOT.wheat[2]);
        this.spawnLoot("grapes", LOOT.grapes[1], LOOT.grapes[2]);
      }
    );
  }

  private serve(id: string, speaker: string, emoji: string, name: string) {
    if (this.held?.id !== id) {
      this.talk(speaker, emoji, [`Nơi này đang chờ ${name}. Hãy nhặt ${name} trong phòng mang đến nhé.`]);
      return;
    }
    this.dropItem();
    if (id === "wheat") {
      this.plated = true;
      this.plate.setTexture("plate_bread");
      this.sparkleBurst(PLATE[0], PLATE[1] - 8);
    } else {
      this.poured = true;
      this.chalice.setTexture("chalice_wine");
      this.sparkleBurst(CHALICE[0], CHALICE[1] - 10);
    }
    if (this.plated && this.poured) this.time.delayedCall(800, () => this.consecrate());
  }

  private consecrate() {
    this.step = 3;
    const glow = this.add.image(JESUS_AT[0], JESUS_AT[1] - 20, "glow_gold").setDepth(DEPTH.FX - 1).setAlpha(0.7);
    this.tweens.add({ targets: glow, alpha: 0.35, duration: 700, yoyo: true, repeat: -1 });
    this.cameras.main.flash(400, 255, 240, 200);
    this.talk(
      "Chúa Giêsu",
      "🍞",
      [
        "Người cầm lấy bánh, tạ ơn, bẻ ra trao cho các môn đệ và nói: (Lc 22, 19)",
        "'Này là Mình Thầy, hiến tế vì anh em. Anh em hãy làm việc này mà tưởng nhớ đến Thầy.'",
        "Rồi Người cầm chén rượu: 'Này là chén Máu Thầy, đổ ra vì anh em, giao ước mới.' (Lc 22, 20)",
      ],
      () => this.finish()
    );
  }

  private finish() {
    this.time.delayedCall(300, () =>
      this.complete(
        5,
        "Năm Sự Sáng",
        "Đức Chúa Giêsu Lập Bí Tích Thánh Thể",
        "Lòng yêu mến Bí tích Thánh Thể và tinh thần phục vụ hiến thân.",
        "Mỗi Thánh Lễ, Chúa Giêsu trao chính mình cho bạn. Hãy yêu mến Thánh Thể và phục vụ mọi người nhé!",
        ["wash_feet", "bread_and_wine", "last_supper"]
      )
    );
  }
}
