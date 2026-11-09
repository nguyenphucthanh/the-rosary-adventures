import * as Phaser from "phaser";
import { BaseMysteryScene, DEPTH } from "../BaseMysteryScene";
import EventBus from "../../EventBus";
import { registerAnnunciationTextures } from "../../utils/npcTextureGenerator";
import { registerVisitationTextures } from "../../utils/visitationTextureGenerator";

const W = 800;
const H = 600;
const STREAM_Y = 325; // centre of the stream band (30px tall)
const ROCKS_Y = 236; // boulder row; thorn bush plugs the gap at x=400
const HOUSE_Y = 150;

interface Interactable {
  at: () => [number, number];
  r: number;
  label: () => string;
  active: () => boolean;
  act: () => void;
}

type Pickup = Phaser.GameObjects.GameObject[];

export class Joyful02VisitationScene extends BaseMysteryScene {
  private mary!: Phaser.GameObjects.Sprite;
  private maryHalo!: Phaser.GameObjects.Image;
  private elizabeth?: Phaser.GameObjects.Sprite;
  private water!: Phaser.GameObjects.TileSprite;
  private bridgeGap!: Phaser.GameObjects.Rectangle;
  private thorns!: Phaser.GameObjects.Image;
  private thornBlock!: Phaser.GameObjects.Rectangle;
  private plankPickup: Pickup = [];
  private jarPickup: Pickup = [];

  private hasPlank = false;
  private bridgeBuilt = false;
  private thornsCleared = false;
  private hasJar = false;
  private finished = false;

  private interactables: Interactable[] = [];
  private prompt!: Phaser.GameObjects.Text;

  constructor() {
    super("Joyful02VisitationScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAnnunciationTextures(this); // sparkle, glows, mary_praying
    registerVisitationTextures(this);
    this.hasPlank = this.bridgeBuilt = this.thornsCleared = this.hasJar = this.finished = false;
    this.elizabeth = undefined;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildLand();
    this.buildProps();
    this.spawnNpcs();
    super.createPlayerAt(400, 560);
    this.setupCamera();
    this.spawnItems();
    this.buildLight();
    this.defineInteractables();
    this.setupActionListeners();

    this.prompt = this.add
      .text(0, 0, "", {
        fontFamily: "'Dearpix', monospace",
        fontSize: "10px",
        color: "#fef08a",
        backgroundColor: "#1e1b4bee",
        padding: { x: 4, y: 2 },
        resolution: 4,
      })
      .setOrigin(0.5, 1)
      .setDepth(DEPTH.UI)
      .setVisible(false);

    this.beginStage("vui_02_vieng_ba");
    this.cameras.main.fadeIn(500, 0, 0, 0);
    EventBus.emit("scene-ready", { sceneKey: this.scene.key });

    this.time.delayedCall(800, () =>
      EventBus.emit("dialogue-open", {
        speaker: "Đường Lên Giu-đê",
        avatarEmoji: "⛰️",
        lines: [
          "Mầu Nhiệm Thứ Hai: Đức Mẹ Đi Viếng Bà Thánh Isave (Lc 1, 39-56).",
          "Vừa nhận lời Sứ thần, Đức Mẹ vội vã lên miền núi Giu-đê để giúp người chị họ Isave đang mang thai.",
          "Đường đồi hiểm trở: suối chắn lối, bụi gai cản bước. Hãy cùng Mẹ vượt qua nhé!",
          "Gợi ý: tìm một tấm ván gỗ để bắc qua suối.",
        ],
      })
    );
  }

  // ---------- world ----------

  private buildLand() {
    this.add.tileSprite(0, 0, W, H, "grass_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(376, HOUSE_Y, 48, H - HOUSE_Y, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR);

    // stream: mud banks + flowing water (shifts 1px at a time)
    this.add.rectangle(0, STREAM_Y - 19, W, 4, 0x7a5a32).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, STREAM_Y + 15, W, 4, 0x7a5a32).setOrigin(0).setDepth(DEPTH.RUG);
    this.water = this.add.tileSprite(0, STREAM_Y - 15, W, 30, "water_tile").setOrigin(0).setDepth(DEPTH.RUG);
    this.time.addEvent({ delay: 160, loop: true, callback: () => (this.water.tilePositionX = (this.water.tilePositionX + 1) % 16) });

    // colliders: world edge, stream (with a plank-sized gap that starts shut)
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    this.block(W / 2, 8, W, 16);
    this.block(W / 2, H - 8, W, 16);
    this.block(188, STREAM_Y, 376, 34);
    this.block(612, STREAM_Y, 376, 34);
    this.bridgeGap = this.add.rectangle(400, STREAM_Y, 48, 34);
    this.obstacles.add(this.bridgeGap);
  }

  private buildProps() {
    // boulder wall with one gap, plugged by thorns
    for (let k = 0; k < 12; k++) {
      this.prop(16 + 32 * k, ROCKS_Y, "boulder", 30, 10);
      this.prop(784 - 32 * k, ROCKS_Y, "boulder", 30, 10);
    }
    this.thorns = this.prop(400, ROCKS_Y + 4, "thorn_bush", 36, 12);
    this.thornBlock = this.obstacles.getChildren()[this.obstacles.getChildren().length - 1] as Phaser.GameObjects.Rectangle;

    // Elizabeth's house, spring, trees
    this.prop(400, HOUSE_Y, "elizabeth_house", 100, 14);
    this.prop(150, 168, "spring_pool", 38, 10);
    for (const [x, y] of [[60, 120], [740, 110], [250, 100], [640, 130], [36, 330 + 60], [760, 400], [120, 470], [690, 520], [220, 570], [540, 450], [40, 250], [760, 260]])
      this.prop(x, y, "hill_tree", 10, 8);

    // flowers on the grass, clear of the path
    const keys = ["flower_w", "flower_p", "flower_y"];
    for (let i = 0; i < 46; i++) {
      const x = Phaser.Math.Between(24, W - 24);
      const y = Phaser.Math.Between(40, H - 24);
      if (Math.abs(x - 400) < 36 || Math.abs(y - STREAM_Y) < 24 || Math.abs(y - ROCKS_Y) < 14) continue;
      this.add.image(x, y, keys[i % 3]).setOrigin(0.5, 1).setDepth(y);
    }
  }

  private spawnNpcs() {
    // Mary (no collider so she can never trap the child). Halo follows her in update().
    this.mary = this.add.sprite(350, 540, "mary_praying").setOrigin(0.5, 1).setDepth(540);
    this.maryHalo = this.add.image(350, 518, "glow_gold").setAlpha(0.35);
    this.tweens.add({ targets: this.maryHalo, alpha: 0.6, duration: 1800, yoyo: true, repeat: -1 });

    this.prop(560, 176, "zechariah", 14, 8);
    const hint = this.add.image(560, 140, "sparkle").setDepth(DEPTH.FX);
    this.tweens.add({ targets: hint, y: 137, alpha: 0.3, duration: 600, yoyo: true, repeat: -1, ease: "Stepped" });
  }

  private pickup(x: number, y: number, key: string): Pickup {
    const glow = this.add.image(x, y, "glow_small").setDepth(y - 1).setAlpha(0.5);
    this.tweens.add({ targets: glow, alpha: 0.85, duration: 900, yoyo: true, repeat: -1 });
    const sprite = this.add.image(x, y, key).setDepth(y);
    this.tweens.add({ targets: sprite, y: y - 3, duration: 1100, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    const sp = this.add.image(x + 7, y - 8, "sparkle").setDepth(y + 1);
    this.tweens.add({ targets: sp, alpha: 0, duration: 500, yoyo: true, repeat: -1, delay: Math.random() * 600 });
    return [glow, sprite, sp];
  }

  private vanish(items: Pickup) {
    this.tweens.add({ targets: items, alpha: 0, y: "-=12", duration: 350, onComplete: () => items.forEach((o) => o.destroy()) });
  }

  private spawnItems() {
    this.plankPickup = this.pickup(640, 470, "wood_plank");
    this.jarPickup = this.pickup(190, 186, "water_jar");
  }

  private buildLight() {
    // morning sun shafts: flat low-alpha fills
    const g = this.add.graphics().setDepth(DEPTH.LIGHT).fillStyle(0xfef08a, 0.09);
    g.fillPoints([{ x: 60, y: 0 }, { x: 110, y: 0 }, { x: 330, y: 400 }, { x: 250, y: 400 }], true);
    g.fillPoints([{ x: 500, y: 0 }, { x: 540, y: 0 }, { x: 720, y: 360 }, { x: 650, y: 360 }], true);
    const lamp = this.add.image(400, HOUSE_Y + 4, "glow_small").setDepth(HOUSE_Y + 1).setAlpha(0.5);
    this.tweens.add({ targets: lamp, alpha: 0.8, duration: 800, yoyo: true, repeat: -1 });
  }

  // ---------- interaction ----------

  private defineInteractables() {
    const talk = (speaker: string, emoji: string, lines: string[], onComplete?: () => void) =>
      EventBus.emit("dialogue-open", { speaker, avatarEmoji: emoji, lines, onComplete });

    this.interactables = [
      {
        at: () => [640, 470],
        r: 40,
        label: () => "[A] Nhặt tấm ván gỗ",
        active: () => !this.hasPlank,
        act: () => {
          this.hasPlank = true;
          this.vanish(this.plankPickup);
          talk("Tấm Ván Gỗ", "🪵", ["Bạn nhặt được một tấm ván chắc chắn!", "Hãy mang đến bờ suối để Đức Mẹ qua được."]);
        },
      },
      {
        at: () => [400, STREAM_Y],
        r: 58,
        label: () => (this.hasPlank ? "[A] Bắc ván qua suối" : "[A] Nhìn dòng suối"),
        active: () => !this.bridgeBuilt,
        act: () => (this.hasPlank ? this.buildBridge() : talk("Dòng Suối", "🌊", ["Nước chảy xiết và sâu, Đức Mẹ không thể lội qua.", "Cần một tấm ván gỗ để bắc cầu. Hãy tìm quanh đây nhé!"])),
      },
      {
        at: () => [400, ROCKS_Y + 4],
        r: 50,
        label: () => "[A] Gạt bụi gai",
        active: () => this.bridgeBuilt && !this.thornsCleared,
        act: () => this.clearThorns(),
      },
      {
        at: () => [190, 186],
        r: 40,
        label: () => "[A] Múc bình nước suối",
        active: () => !this.hasJar,
        act: () => {
          this.hasJar = true;
          this.vanish(this.jarPickup);
          talk("Mạch Nước Suối", "💧", ["Nước suối trong và mát lạnh!", "Bạn đã có bình nước. Hãy mang đến cho Đức Mẹ."]);
        },
      },
      {
        at: () => [560, 176],
        r: 56,
        label: () => "[A] Chào ông Dacaria",
        active: () => true,
        act: () => this.talkToZechariah(),
      },
      {
        at: () => [this.mary.x, this.mary.y],
        r: 60,
        label: () => (this.mayDeliverWater() ? "[A] Đưa nước cho Đức Mẹ" : "[A] Trò chuyện với Đức Mẹ"),
        active: () => !this.finished,
        act: () => (this.mayDeliverWater() ? this.deliverWater() : this.talkToMary()),
      },
    ];
  }

  update() {
    super.update();
    this.mary.setDepth(this.mary.y);
    this.maryHalo.setPosition(this.mary.x, this.mary.y - 22).setDepth(this.mary.y - 1);

    const hit = this.nearestInteractable();
    if (!hit) return void this.prompt.setVisible(false);
    const [x, y] = hit.at();
    this.prompt.setPosition(x, y - 36).setText(hit.label()).setVisible(true);
  }

  private nearestInteractable() {
    if (!this.player) return undefined;
    return this.interactables.find((it) => {
      const [x, y] = it.at();
      return it.active() && Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y) < it.r;
    });
  }

  protected handleActionTrigger() {
    this.nearestInteractable()?.act();
  }

  // ---------- quest steps ----------

  private walkMary(points: [number, number][], then?: () => void) {
    const [next, ...rest] = points;
    if (!next) return then?.();
    const dist = Phaser.Math.Distance.Between(this.mary.x, this.mary.y, next[0], next[1]);
    this.tweens.add({
      targets: this.mary,
      x: next[0],
      y: next[1],
      duration: (dist / 70) * 1000,
      onComplete: () => this.walkMary(rest, then),
    });
  }

  private buildBridge() {
    this.bridgeBuilt = true;
    this.obstacles.remove(this.bridgeGap, true, true);
    this.add.image(400, STREAM_Y, "plank_bridge").setDepth(DEPTH.LIGHT);
    EventBus.emit("dialogue-open", {
      speaker: "Dòng Suối",
      avatarEmoji: "🌉",
      lines: ["Tấm ván đã bắc vững chãi qua suối!", "Đức Mẹ nhẹ nhàng bước sang bờ bên kia."],
      onComplete: () =>
        this.walkMary([[400, 380], [400, 285]], () =>
          EventBus.emit("dialogue-open", {
            speaker: "Đức Mẹ Maria",
            avatarEmoji: "💙",
            lines: ["Cảm ơn con! Nhưng bụi gai kia chắn mất lối rồi.", "Con gạt giúp Mẹ nhé."],
          })
        ),
    });
  }

  private clearThorns() {
    this.thornsCleared = true;
    this.obstacles.remove(this.thornBlock, true, true);
    this.tweens.add({ targets: this.thorns, alpha: 0, x: "+=6", duration: 400, onComplete: () => this.thorns.destroy() });
    EventBus.emit("dialogue-open", {
      speaker: "Bụi Gai",
      avatarEmoji: "🌿",
      lines: ["Bạn cẩn thận gạt từng cành gai sang bên.", "Lối đi đã thông thoáng, an toàn cho Đức Mẹ!"],
      onComplete: () => this.walkMary([[400, 200]]),
    });
  }

  private talkToZechariah() {
    const lines = this.hasJar
      ? ["(Ông Dacaria mỉm cười, gật đầu và giơ ngón tay cái.)"]
      : [
          "(Ông Dacaria không nói được từ khi gặp Sứ thần, Lc 1, 20. Ông mỉm cười chào bạn.)",
          "(Ông chỉ tay về mạch nước nhỏ bên trái, rồi làm dấu uống nước.)",
          "Có lẽ ông muốn bạn mang bình nước mát cho Đức Mẹ sau chặng đường dài.",
        ];
    EventBus.emit("dialogue-open", { speaker: "Ông Dacaria", avatarEmoji: "👴", lines });
  }

  private talkToMary() {
    const lines = !this.bridgeBuilt
      ? ["Dòng suối chảy xiết quá. Mẹ cần một tấm ván để bước qua.", "Con tìm giúp Mẹ nhé!"]
      : !this.thornsCleared
        ? ["Bụi gai chắn lối rồi. Con gạt giúp Mẹ nhé!"]
        : ["Đường đã thông, nhưng Mẹ khát nước quá.", "Ông Dacaria hình như biết chỗ có mạch nước mát đấy."];
    EventBus.emit("dialogue-open", { speaker: "Đức Mẹ Maria", avatarEmoji: "💙", lines });
  }

  private mayDeliverWater() {
    return this.hasJar && this.thornsCleared && !this.finished;
  }

  private deliverWater() {
    this.finished = true;
    EventBus.emit("dialogue-open", {
      speaker: "Đức Mẹ Maria",
      avatarEmoji: "💙",
      lines: ["Nước mát quá! Cảm ơn con đã chăm sóc Mẹ.", "Giờ ta cùng đến nhà bà Isave nhé."],
      onComplete: () => this.walkMary([[385, 176]], () => this.elizabethGreets()),
    });
  }

  private elizabethGreets() {
    const e = this.add.sprite(418, 176, "elizabeth").setOrigin(0.5, 1).setDepth(176).setAlpha(0);
    this.elizabeth = e;
    this.tweens.add({ targets: e, alpha: 1, duration: 700 });
    this.sparkleBurst(418, 160);
    EventBus.emit("dialogue-open", {
      speaker: "Bà Isave",
      avatarEmoji: "👵",
      lines: [
        "Em được chúc phúc hơn mọi người phụ nữ, và hoa trái lòng dạ em cũng được chúc phúc! (Lc 1, 42)",
        "Bởi đâu tôi được Thân Mẫu Chúa tôi đến với tôi thế này?",
        "Vừa nghe tiếng em chào, đứa con trong bụng tôi đã nhảy mừng!",
      ],
      onComplete: () => this.magnificat(),
    });
  }

  private magnificat() {
    EventBus.emit("dialogue-open", {
      speaker: "Đức Mẹ Maria",
      avatarEmoji: "🎶",
      lines: [
        "Linh hồn tôi ngợi khen Đức Chúa, thần trí tôi hớn hở vui mừng vì Thiên Chúa, Đấng cứu độ tôi. (Lc 1, 46-47)",
        "Đấng Toàn Năng đã làm cho tôi biết bao điều cao cả, danh Người thật chí thánh!",
      ],
      onComplete: () => {
        this.sparkleBurst(this.mary.x, this.mary.y - 16);
        this.sparkleBurst(418, 160);
        this.time.delayedCall(900, () => this.completeStage());
      },
    });
  }

  private sparkleBurst(cx: number, cy: number) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const sp = this.add.image(cx, cy, "sparkle").setDepth(DEPTH.FX);
      this.tweens.add({
        targets: sp,
        x: cx + Math.round(Math.cos(a) * 28),
        y: cy + Math.round(Math.sin(a) * 28),
        alpha: 0,
        duration: 900,
        onComplete: () => sp.destroy(),
      });
    }
  }

  private completeStage() {
    this.saveStageComplete(["cross_stream", "clear_thorns", "bring_water", "magnificat"]);
    EventBus.emit("dialogue-open", {
      speaker: "✨ HOÀN THÀNH MẦU NHIỆM THỨ HAI ✨",
      avatarEmoji: "📿",
      lines: [
        "CHÚC MỪNG BẠN ĐÃ THẮP SÁNG HẠT MÂN CÔI SỐ 2!",
        "Mầu Nhiệm Thứ Hai Năm Sự Vui: Đức Bà Đi Viếng Bà Thánh Isave.",
        "Hoa trái suy niệm: Lòng bác ái và sẵn sàng phục vụ tha nhân.",
        "Mẹ Maria vội vã lên đường để giúp người khác. Hãy noi gương Mẹ nhé!",
      ],
      onComplete: () => this.goToNextStage(),
    });
  }
}
