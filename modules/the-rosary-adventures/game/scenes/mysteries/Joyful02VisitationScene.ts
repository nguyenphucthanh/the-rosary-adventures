import * as Phaser from "phaser";
import { BaseMysteryScene, DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import EventBus from "@/modules/shared/game/EventBus";
import { registerAnnunciationTextures } from "@/modules/the-rosary-adventures/game/utils/npcTextureGenerator";
import { registerVisitationTextures } from "@/modules/the-rosary-adventures/game/utils/visitationTextureGenerator";
import { t as tx } from "@/modules/shared/i18n";

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
        fontSize: "20px",
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
        speaker: tx("Đường Lên Giu-đê", "The Road up to Judea"),
        avatarEmoji: "⛰️",
        lines: [
          tx("Mầu Nhiệm Thứ Hai: Đức Mẹ Đi Viếng Bà Thánh Isave (Lc 1, 39-56).", "Second Mystery: The Visitation of Mary to Saint Elizabeth (Lk 1:39-56)."),
          tx("Vừa nhận lời Sứ thần, Đức Mẹ vội vã lên miền núi Giu-đê để giúp người chị họ Isave đang mang thai.", "Right after accepting the Angel's message, Mary hurries to the hill country of Judea to help her cousin Elizabeth, who is expecting a child."),
          tx("Đường đồi hiểm trở: suối chắn lối, bụi gai cản bước. Hãy cùng Mẹ vượt qua nhé!", "The hill road is rough: a stream blocks the way and thorn bushes bar the path. Let's get past them with Mary!"),
          tx("Gợi ý: tìm một tấm ván gỗ để bắc qua suối.", "Hint: find a wooden plank to lay across the stream."),
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
        label: () => tx("[A] Nhặt tấm ván gỗ", "[A] Pick up the wooden plank"),
        active: () => !this.hasPlank,
        act: () => {
          this.hasPlank = true;
          this.vanish(this.plankPickup);
          talk(tx("Tấm Ván Gỗ", "Wooden Plank"), "🪵", [tx("Bạn nhặt được một tấm ván chắc chắn!", "You picked up a sturdy plank!"), tx("Hãy mang đến bờ suối để Đức Mẹ qua được.", "Bring it to the stream so Mary can cross.")]);
        },
      },
      {
        at: () => [400, STREAM_Y],
        r: 58,
        label: () => (this.hasPlank ? tx("[A] Bắc ván qua suối", "[A] Lay the plank across the stream") : tx("[A] Nhìn dòng suối", "[A] Look at the stream")),
        active: () => !this.bridgeBuilt,
        act: () => (this.hasPlank ? this.buildBridge() : talk(tx("Dòng Suối", "The Stream"), "🌊", [tx("Nước chảy xiết và sâu, Đức Mẹ không thể lội qua.", "The water is deep and fast. Mary cannot wade across."), tx("Cần một tấm ván gỗ để bắc cầu. Hãy tìm quanh đây nhé!", "We need a wooden plank to make a bridge. Look around here!")])),
      },
      {
        at: () => [400, ROCKS_Y + 4],
        r: 50,
        label: () => tx("[A] Gạt bụi gai", "[A] Push aside the thorn bushes"),
        active: () => this.bridgeBuilt && !this.thornsCleared,
        act: () => this.clearThorns(),
      },
      {
        at: () => [190, 186],
        r: 40,
        label: () => tx("[A] Múc bình nước suối", "[A] Scoop a jar of spring water"),
        active: () => !this.hasJar,
        act: () => {
          this.hasJar = true;
          this.vanish(this.jarPickup);
          talk(tx("Mạch Nước Suối", "Spring Water"), "💧", [tx("Nước suối trong và mát lạnh!", "The spring water is clear and cool!"), tx("Bạn đã có bình nước. Hãy mang đến cho Đức Mẹ.", "You have the water jar. Bring it to Mary.")]);
        },
      },
      {
        at: () => [560, 176],
        r: 56,
        label: () => tx("[A] Chào ông Dacaria", "[A] Greet Zechariah"),
        active: () => true,
        act: () => this.talkToZechariah(),
      },
      {
        at: () => [this.mary.x, this.mary.y],
        r: 60,
        label: () => (this.mayDeliverWater() ? tx("[A] Đưa nước cho Đức Mẹ", "[A] Give the water to Mary") : tx("[A] Trò chuyện với Đức Mẹ", "[A] Talk to Mary")),
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
      speaker: tx("Dòng Suối", "The Stream"),
      avatarEmoji: "🌉",
      lines: [tx("Tấm ván đã bắc vững chãi qua suối!", "The plank is laid firmly across the stream!"), tx("Đức Mẹ nhẹ nhàng bước sang bờ bên kia.", "Mary steps gently to the other side.")],
      onComplete: () =>
        this.walkMary([[400, 380], [400, 285]], () =>
          EventBus.emit("dialogue-open", {
            speaker: tx("Đức Mẹ Maria", "Mother Mary"),
            avatarEmoji: "💙",
            lines: [tx("Cảm ơn con! Nhưng bụi gai kia chắn mất lối rồi.", "Thank you! But those thorn bushes are blocking the way."), tx("Con gạt giúp Mẹ nhé.", "Please push them aside for me.")],
          })
        ),
    });
  }

  private clearThorns() {
    this.thornsCleared = true;
    this.obstacles.remove(this.thornBlock, true, true);
    this.tweens.add({ targets: this.thorns, alpha: 0, x: "+=6", duration: 400, onComplete: () => this.thorns.destroy() });
    EventBus.emit("dialogue-open", {
      speaker: tx("Bụi Gai", "Thorn Bush"),
      avatarEmoji: "🌿",
      lines: [tx("Bạn cẩn thận gạt từng cành gai sang bên.", "You carefully push each thorny branch aside."), tx("Lối đi đã thông thoáng, an toàn cho Đức Mẹ!", "The path is clear and safe for Mary!")],
      onComplete: () => this.walkMary([[400, 200]]),
    });
  }

  private talkToZechariah() {
    const lines = this.hasJar
      ? [tx("(Ông Dacaria mỉm cười, gật đầu và giơ ngón tay cái.)", "(Zechariah smiles, nods and gives a thumbs up.)")]
      : [
          tx("(Ông Dacaria không nói được từ khi gặp Sứ thần, Lc 1, 20. Ông mỉm cười chào bạn.)", "(Zechariah has been unable to speak since meeting the Angel, Lk 1:20. He smiles and greets you.)"),
          tx("(Ông chỉ tay về mạch nước nhỏ bên trái, rồi làm dấu uống nước.)", "(He points to the little spring on the left, then mimes drinking water.)"),
          tx("Có lẽ ông muốn bạn mang bình nước mát cho Đức Mẹ sau chặng đường dài.", "Maybe he wants you to bring cool water to Mary after her long journey."),
        ];
    EventBus.emit("dialogue-open", { speaker: tx("Ông Dacaria", "Zechariah"), avatarEmoji: "👴", lines });
  }

  private talkToMary() {
    const lines = !this.bridgeBuilt
      ? [tx("Dòng suối chảy xiết quá. Mẹ cần một tấm ván để bước qua.", "The stream is flowing too fast. I need a plank to step across."), tx("Con tìm giúp Mẹ nhé!", "Please find one for me!")]
      : !this.thornsCleared
        ? [tx("Bụi gai chắn lối rồi. Con gạt giúp Mẹ nhé!", "Thorn bushes block the way. Please push them aside for me!")]
        : [tx("Đường đã thông, nhưng Mẹ khát nước quá.", "The way is clear, but I am so thirsty."), tx("Ông Dacaria hình như biết chỗ có mạch nước mát đấy.", "Zechariah seems to know where there is a cool spring.")];
    EventBus.emit("dialogue-open", { speaker: tx("Đức Mẹ Maria", "Mother Mary"), avatarEmoji: "💙", lines });
  }

  private mayDeliverWater() {
    return this.hasJar && this.thornsCleared && !this.finished;
  }

  private deliverWater() {
    this.finished = true;
    EventBus.emit("dialogue-open", {
      speaker: tx("Đức Mẹ Maria", "Mother Mary"),
      avatarEmoji: "💙",
      lines: [tx("Nước mát quá! Cảm ơn con đã chăm sóc Mẹ.", "The water is so cool! Thank you for taking care of me."), tx("Giờ ta cùng đến nhà bà Isave nhé.", "Now let's go to Elizabeth's house together.")],
      onComplete: () => this.walkMary([[385, 176]], () => this.elizabethGreets()),
    });
  }

  private elizabethGreets() {
    const e = this.add.sprite(418, 176, "elizabeth").setOrigin(0.5, 1).setDepth(176).setAlpha(0);
    this.elizabeth = e;
    this.tweens.add({ targets: e, alpha: 1, duration: 700 });
    this.sparkleBurst(418, 160);
    EventBus.emit("dialogue-open", {
      speaker: tx("Bà Isave", "Elizabeth"),
      avatarEmoji: "👵",
      lines: [
        tx("Em được chúc phúc hơn mọi người phụ nữ, và hoa trái lòng dạ em cũng được chúc phúc! (Lc 1, 42)", "Blessed are you among women, and blessed is the fruit of your womb! (Lk 1:42)"),
        tx("Bởi đâu tôi được Thân Mẫu Chúa tôi đến với tôi thế này?", "Why am I so favored that the mother of my Lord should come to me?"),
        tx("Vừa nghe tiếng em chào, đứa con trong bụng tôi đã nhảy mừng!", "The moment your greeting reached my ears, the child in my womb leapt for joy!"),
      ],
      onComplete: () => this.magnificat(),
    });
  }

  private magnificat() {
    EventBus.emit("dialogue-open", {
      speaker: tx("Đức Mẹ Maria", "Mother Mary"),
      avatarEmoji: "🎶",
      lines: [
        tx("Linh hồn tôi ngợi khen Đức Chúa, thần trí tôi hớn hở vui mừng vì Thiên Chúa, Đấng cứu độ tôi. (Lc 1, 46-47)", "My soul proclaims the greatness of the Lord, my spirit rejoices in God my Savior. (Lk 1:46-47)"),
        tx("Đấng Toàn Năng đã làm cho tôi biết bao điều cao cả, danh Người thật chí thánh!", "The Mighty One has done great things for me, and holy is His name!"),
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
      speaker: tx("✨ HOÀN THÀNH MẦU NHIỆM THỨ HAI ✨", "✨ SECOND MYSTERY COMPLETE ✨"),
      avatarEmoji: "📿",
      lines: [
        tx("CHÚC MỪNG BẠN ĐÃ THẮP SÁNG HẠT MÂN CÔI SỐ 2!", "CONGRATULATIONS! YOU LIT ROSARY BEAD NUMBER 2!"),
        tx("Mầu Nhiệm Thứ Hai Năm Sự Vui: Đức Bà Đi Viếng Bà Thánh Isave.", "Second Joyful Mystery: The Visitation of Mary to Saint Elizabeth."),
        tx("Hoa trái suy niệm: Lòng bác ái và sẵn sàng phục vụ tha nhân.", "Fruit of the meditation: Love of neighbor and readiness to serve others."),
        tx("Mẹ Maria vội vã lên đường để giúp người khác. Hãy noi gương Mẹ nhé!", "Mary hurried off to help others. Follow her example!"),
      ],
      onComplete: () => this.goToNextStage(),
    });
  }
}
