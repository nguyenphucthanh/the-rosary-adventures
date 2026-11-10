import * as Phaser from "phaser";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAnnunciationTextures } from "@/modules/the-rosary-adventures/game/utils/npcTextureGenerator";
import { registerVisitationTextures } from "@/modules/the-rosary-adventures/game/utils/visitationTextureGenerator";
import { registerInfancyTextures } from "@/modules/the-rosary-adventures/game/utils/infancyTextureGenerator";
import { registerLightTextures } from "@/modules/the-rosary-adventures/game/utils/lightTextureGenerator";
import { registerCanaTextures } from "@/modules/the-rosary-adventures/game/utils/canaTextureGenerator";

const W = 640;
const H = 576;
const WALL_H = 48;
const JAR_Y = 340;
const JAR_XS = [120, 200, 280, 360, 440, 520];
const WELL_AT: [number, number] = [572, 478];
const MARY_AT: [number, number] = [250, 196];
const JESUS_AT: [number, number] = [390, 196];
const STEWARD_AT: [number, number] = [320, 250];

export class Luminous02CanaScene extends InteractiveScene {
  private jars: Phaser.GameObjects.Image[] = [];
  private glows: (Phaser.GameObjects.Image | undefined)[] = [];
  private filled = new Set<number>();
  private carrying = false;
  private bucket!: Phaser.GameObjects.Image;
  private maryHeard = false;
  private commanded = false;
  private finished = false;
  private steward!: Phaser.GameObjects.Sprite;

  constructor() {
    super("Luminous02CanaScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAnnunciationTextures(this);
    registerVisitationTextures(this);
    registerInfancyTextures(this);
    registerLightTextures(this);
    registerCanaTextures(this);
    this.jars = [];
    this.glows = [];
    this.walkers = [];
    this.filled = new Set();
    this.carrying = this.maryHeard = this.commanded = this.finished = false;

    if (!this.anims.exists("cana_lamp_flicker")) {
      this.anims.create({
        key: "cana_lamp_flicker",
        frames: this.anims.generateFrameNumbers("cana_lamp", { frames: [0, 1] }),
        frameRate: 3,
        repeat: -1,
      });
    }

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildCourtyard();
    this.buildHall();
    this.buildJarsAndWell();
    this.buildCharacters();
    this.bucket = this.add.image(0, 0, "water_jar").setDepth(DEPTH.FX).setVisible(false);
    this.defineInteractables();

    this.begin("sang_02_tiec_cuoi_cana", [320, 520], {
      speaker: "Tiệc Cưới Cana",
      emoji: "🏺",
      lines: [
        "Mầu Nhiệm Thứ Hai Năm Sự Sáng: Đức Chúa Giêsu Dự Tiệc Cưới Cana (Ga 2, 1-11).",
        "Tiệc cưới đang vui, nhưng rượu đã hết, và gia đình ai cũng lo lắng.",
        "Hãy đến gặp Đức Mẹ Maria, Mẹ đang để ý đến mọi người.",
      ],
    });
  }

  // ---------- world ----------

  private buildCourtyard() {
    this.add.tileSprite(0, 0, W, H, "cobble_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    // grass verge along the bottom + dirt path to the well
    this.add.tileSprite(0, H - 48, W, 48, "grass_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(224, 400, 352, 48, "dirt_tile").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(528, 400, 48, 100, "dirt_tile").setOrigin(0).setDepth(DEPTH.RUG);
    this.edgeWalls(W, H);

    // far wall
    this.add.tileSprite(0, 0, W, WALL_H, "stone_wall").setOrigin(0).setDepth(DEPTH.WALL - 1);
    this.block(W / 2, WALL_H / 2, W, WALL_H);
    for (const x of [110, 530]) this.add.image(x, 6, "window_arch").setOrigin(0.5, 0).setDepth(DEPTH.WALL);
    for (const x of [200, 440]) this.add.image(x, 10, "grape_vine").setOrigin(0.5, 0).setDepth(DEPTH.WALL);

    // warm light spilling from the windows (flat low-alpha fills)
    const beams = this.add.graphics().setDepth(3).fillStyle(0xfef9c3, 0.1);
    beams.fillPoints([{ x: 98, y: 36 }, { x: 122, y: 36 }, { x: 170, y: 150 }, { x: 120, y: 150 }], true);
    beams.fillPoints([{ x: 518, y: 36 }, { x: 542, y: 36 }, { x: 520, y: 150 }, { x: 470, y: 150 }], true);

    // grass-edge decor
    for (const [x, y] of [[40, 556], [604, 560]]) this.prop(x, y, "hill_tree", 12, 8);
    for (const [x, y, k] of [[110, 540, "flower_w"], [190, 552, "flower_p"], [260, 548, "flower_y"], [430, 552, "flower_w"], [490, 540, "flower_p"]] as const)
      this.add.image(x, y, k).setOrigin(0.5, 1).setDepth(y);
  }

  private buildHall() {
    // banquet rug, tables and the festive lamps
    this.add.tileSprite(80, 64, 480, 184, "rug_tile").setOrigin(0).setDepth(DEPTH.RUG);
    for (const [x, y] of [[170, 150], [470, 150], [170, 230], [470, 230]]) this.prop(x, y, "banquet_table", 68, 12);

    for (const x of [140, 320, 500]) {
      const lamp = this.add.sprite(x, WALL_H, "cana_lamp").setOrigin(0.5, 0).setDepth(DEPTH.WALL).play("cana_lamp_flicker");
      const glow = this.add.image(x, WALL_H + 22, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.35);
      this.tweens.add({ targets: [glow, lamp], alpha: { from: 0.3, to: 0.5 }, duration: 900, yoyo: true, repeat: -1, delay: x });
      lamp.setAlpha(1);
    }

    // side decor
    for (const [x, y] of [[44, 130], [596, 130]]) this.prop(x, y, "olive_pot", 14, 8);
    this.prop(46, 300, "crate", 18, 10);
    this.prop(46, 322, "crate", 18, 10);
    this.prop(594, 300, "crate", 18, 10);
    for (const [x, y] of [[70, 420], [88, 436], [560, 330]]) this.prop(x, y, "clay_jar", 10, 6);
    this.prop(36, 470, "hay_bale", 22, 10);
  }

  private buildJarsAndWell() {
    for (const x of JAR_XS) {
      this.jars.push(this.prop(x, JAR_Y, "chum_empty", 16, 8));
      this.glows.push(undefined);
    }
    this.prop(WELL_AT[0], WELL_AT[1], "cana_well", 36, 12);
    const glow = this.add.image(WELL_AT[0], WELL_AT[1] - 22, "glow_small").setDepth(DEPTH.LIGHT).setAlpha(0.4);
    this.tweens.add({ targets: glow, alpha: 0.7, duration: 900, yoyo: true, repeat: -1 });
    this.hint(WELL_AT[0], WELL_AT[1] - 54);
  }

  private buildCharacters() {
    const person = (key: string, x: number, y: number) => this.add.sprite(x, y, key).setOrigin(0.5, 1).setDepth(y);
    person("groom", 292, 122);
    person("bride", 348, 122);
    person("mary_praying", ...MARY_AT);
    this.hint(MARY_AT[0], MARY_AT[1] - 36);
    person("jesus_adult", ...JESUS_AT);
    this.hint(JESUS_AT[0], JESUS_AT[1] - 36);
    this.steward = person("steward", ...STEWARD_AT);
    this.hint(STEWARD_AT[0], STEWARD_AT[1] - 34);
    // guests and servants
    person("merchant", 110, 190);
    person("scribe", 530, 190);
    person("shepherd", 110, 262);
    person("sweeper", 530, 262);
    const servant = person("servant", 60, 380);
    this.walkers.push(servant);
    this.tweens.add({ targets: servant, x: 100, duration: 3600, yoyo: true, repeat: -1 });
    this.hint(60, 346);
  }

  update() {
    super.update();
    this.bucket.setVisible(this.carrying);
    if (!this.carrying || !this.player) return;
    // held at the hip, beside the body; tucked behind the player when facing up
    const dir = this.player.getDirection();
    const dx = dir === "left" ? -9 : dir === "right" ? 9 : 8;
    this.bucket
      .setPosition(Math.round(this.player.x) + dx, Math.round(this.player.y) + 4)
      .setDepth(dir === "up" ? this.player.depth - 1 : this.player.depth + 1);
  }

  // ---------- interaction ----------

  private defineInteractables() {
    this.interactables = [
      {
        at: () => MARY_AT,
        r: 48,
        label: () => "[A] Trò chuyện với Đức Mẹ",
        active: () => !this.maryHeard,
        act: () => this.talkMary(),
      },
      {
        at: () => JESUS_AT,
        r: 48,
        label: () => "[A] Trò chuyện với Chúa Giêsu",
        active: () => !this.commanded,
        act: () => this.talkJesus(),
      },
      {
        at: () => WELL_AT,
        r: 52,
        label: () => (this.carrying ? "[A] Giếng làng" : "[A] Múc nước"),
        active: () => this.commanded && !this.finished && this.filled.size < JAR_XS.length,
        act: () => this.drawWater(),
      },
      ...JAR_XS.map((x, i) => ({
        at: (): [number, number] => [x, JAR_Y + 6],
        r: 36,
        label: () => (this.carrying ? "[A] Đổ nước vào chum" : "[A] Chum đá"),
        active: () => this.commanded && !this.filled.has(i),
        act: () => this.pour(i),
      })),
      {
        at: () => STEWARD_AT,
        r: 48,
        label: () => "[A] Trò chuyện với người quản tiệc",
        active: () => !this.finished,
        act: () =>
          this.talk("Người Quản Tiệc", "🍇", [
            "Tiệc cưới phải có rượu ngon cho khách. Vậy mà thức uống đã cạn rồi...",
            this.commanded ? "Các gia nhân đang làm theo lời Chúa Giêsu. Hãy cùng giúp nhé!" : "Hãy hỏi Đức Mẹ xem có cách nào không.",
          ]),
      },
      {
        at: () => [60, 380],
        r: 50,
        label: () => "[A] Trò chuyện với gia nhân",
        active: () => !this.finished,
        act: () =>
          this.talk("Gia Nhân", "🧑‍🍳", [
            this.commanded
              ? "Có sáu chum đá bên cạnh phòng tiệc. Chúng ta phải đổ đầy nước, từng gàu một."
              : "Mẹ của Chúa Giêsu bảo chúng tôi: 'Người bảo gì, các anh cứ việc làm theo.'",
          ]),
      },
    ];
  }

  private talkMary() {
    this.talk(
      "Đức Mẹ Maria",
      "👩",
      [
        "Con ơi, gia đình đây hết rượu rồi. Họ đang bối rối và xấu hổ lắm.",
        "Mẹ sẽ thưa với Con của Mẹ. (Ga 2, 3)",
        "Mẹ nói với các gia nhân: 'Người bảo gì, các anh cứ việc làm theo.' (Ga 2, 5)",
        "Con cũng đến gặp Chúa Giêsu nhé.",
      ],
      () => (this.maryHeard = true)
    );
  }

  private talkJesus() {
    if (!this.maryHeard) {
      this.talk("Chúa Giêsu", "✨", ["Con hãy nói chuyện với Mẹ Maria trước đã. Mẹ đang lo cho gia đình này."]);
      return;
    }
    this.talk(
      "Chúa Giêsu",
      "✨",
      [
        "'Thưa Bà, chuyện đó liên can gì đến Bà và con? Giờ của con chưa đến.' (Ga 2, 4)",
        "Rồi Chúa nhìn Mẹ và mỉm cười, vì Người luôn nghe lời Mẹ.",
        "'Các anh đổ đầy nước vào chum đi!' (Ga 2, 7)",
        "Hãy múc nước ở giếng, đổ đầy sáu chum đá nhé!",
      ],
      () => this.startPouring()
    );
  }

  private startPouring() {
    this.commanded = true;
    JAR_XS.forEach((x, i) => {
      const g = this.add.image(x, JAR_Y - 12, "glow_small").setDepth(JAR_Y - 1).setAlpha(0.4);
      this.tweens.add({ targets: g, alpha: 0.75, duration: 900, yoyo: true, repeat: -1 });
      this.glows[i] = g;
    });
  }

  private drawWater() {
    if (this.carrying) {
      this.talk("Giếng Làng", "⛲", ["Gàu nước đã đầy rồi. Hãy mang đến đổ vào một chum đá nhé!"]);
      return;
    }
    this.carrying = true;
    this.sparkleBurst(WELL_AT[0], WELL_AT[1] - 20);
  }

  private pour(i: number) {
    if (!this.carrying) {
      this.talk("Chum Đá", "🏺", [`Chum còn trống. Đã có ${this.filled.size}/${JAR_XS.length} chum đầy. Hãy ra giếng múc nước.`]);
      return;
    }
    this.carrying = false;
    this.filled.add(i);
    this.glows[i]?.destroy();
    this.jars[i].setTexture("chum_water");
    this.sparkleBurst(JAR_XS[i], JAR_Y - 14);
    if (this.filled.size === JAR_XS.length) this.time.delayedCall(800, () => this.miracle());
  }

  private miracle() {
    this.talk(
      "Chúa Giêsu",
      "✨",
      ["Sáu chum đã đầy ắp nước, đầy đến miệng chum. (Ga 2, 7)", "'Bây giờ các anh múc ra đem cho người quản tiệc.' (Ga 2, 8)"],
      () => {
        const cam = this.cameras.main;
        cam.flash(400, 255, 240, 200);
        this.jars.forEach((jar, i) => {
          jar.setTexture("chum_wine");
          this.sparkleBurst(JAR_XS[i], JAR_Y - 14);
        });
        this.walk(this.steward, [[360, JAR_Y + 18]], () =>
          this.talk(
            "Người Quản Tiệc",
            "🍇",
            [
              "Ông nếm nước đã hóa thành rượu mà không biết rượu từ đâu ra. (Ga 2, 9)",
              "'Ai cũng đãi rượu ngon trước, đến khi khách ngà ngà say mới đãi rượu thường. Còn anh, anh lại giữ rượu ngon đến bây giờ!' (Ga 2, 10)",
              "Các môn đệ thấy dấu lạ đầu tiên này thì tin vào Chúa Giêsu. (Ga 2, 11)",
            ],
            () => this.finish()
          )
        );
      }
    );
  }

  private finish() {
    this.finished = true;
    this.time.delayedCall(300, () =>
      this.complete(
        2,
        "Năm Sự Sáng",
        "Đức Chúa Giêsu Dự Tiệc Cưới Cana",
        "Vâng nghe Lời Chúa nhờ sự chuyển cầu của Mẹ Maria.",
        "Mẹ Maria luôn chuyển cầu cho chúng ta. Hãy cứ việc làm theo lời Chúa Giêsu như Mẹ dạy nhé!",
        ["hear_mary", "fill_jars", "water_to_wine"]
      )
    );
  }
}
