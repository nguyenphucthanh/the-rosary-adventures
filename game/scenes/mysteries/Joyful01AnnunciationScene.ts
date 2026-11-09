import * as Phaser from "phaser";
import audio from "../../audio/AudioManager";
import { BaseMysteryScene, DEPTH } from "../BaseMysteryScene";
import EventBus from "../../EventBus";
import { registerAnnunciationTextures } from "../../utils/npcTextureGenerator";

const ALTAR_Y = 130;

interface ScrollItem {
  id: string;
  name: string;
  scripture: string;
  x: number;
  y: number;
  sprite?: Phaser.GameObjects.Sprite;
  glow?: Phaser.GameObjects.Image;
  sparkle?: Phaser.GameObjects.Image;
  collected: boolean;
}

export class Joyful01AnnunciationScene extends BaseMysteryScene {
  private marySprite!: Phaser.GameObjects.Sprite;
  private gabrielSprite?: Phaser.GameObjects.Sprite;
  private altarSprite!: Phaser.GameObjects.Image;
  private gabrielAura?: Phaser.GameObjects.Image;
  private holySpiritBeam?: Phaser.GameObjects.Graphics;
  private holySpiritDove?: Phaser.GameObjects.Sprite;

  private scrolls: ScrollItem[] = [
    {
      id: "scroll_isaiah",
      name: "Cuộn Sách Tiên Tri Isaia",
      scripture:
        "Is 7, 14: 'Này đây một trinh nữ sẽ thụ thai và sinh hạ một con trai, và người ta sẽ gọi tên con trẻ là Em-ma-nu-en.'",
      x: 180,
      y: 190,
      collected: false,
    },
    {
      id: "scroll_micah",
      name: "Cuộn Sách Tiên Tri Mikha",
      scripture:
        "Mk 5, 1: 'Phần ngươi, hỡi Bê-lem Ép-ra-tha, từ nơi ngươi sẽ xuất hiện vị thống lãnh Ít-ra-en.'",
      x: 630,
      y: 220,
      collected: false,
    },
    {
      id: "scroll_david",
      name: "Lời Hứa Với Nhà Đavít",
      scripture:
        "2 Sm 7, 16: 'Nhà của ngươi và vương quyền của ngươi sẽ bền vững muôn đời trước mặt Ta.'",
      x: 480,
      y: 450,
      collected: false,
    },
  ];

  private scrollsCollectedCount = 0;
  private scrollsPlacedOnAltar = false;
  private gabrielAppeared = false;
  private mysteryCompleted = false;

  private interactionPromptText?: Phaser.GameObjects.Text;

  constructor() {
    super("Joyful01AnnunciationScene");
    this.worldWidth = 800;
    this.worldHeight = 600;
  }

  create() {
    // 1. Generate & load textures into Phaser TextureManager
    this.initCustomTextures();

    // 2. Physics bounds
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

    // 3. Render Nazareth Room Environment
    this.createNazarethRoom();

    // 4. Initialize Player (Base setup)
    super.createPlayerAt(this.worldWidth / 2, this.worldHeight - 120);

    // 5. Setup Camera
    this.setupCamera();

    // 6. Spawn Mary and Nazareth Altar
    this.spawnEntities();

    // 7. Spawn Scattered Scripture Scrolls
    this.spawnScrolls();

    // 8. Setup Interaction Listeners
    this.setupActionListeners();

    // 9. Floating action hint text
    this.interactionPromptText = this.add
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

    this.beginStage("vui_01_truyen_tin");
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Emit Scene Ready
    EventBus.emit("scene-ready", { sceneKey: this.scene.key });

    // Intro cutscene dialogue
    this.time.delayedCall(800, () => {
      this.triggerIntroDialogue();
    });
  }

  private initCustomTextures() {
    registerAnnunciationTextures(this);
    const anim = (key: string, texture: string, frameRate: number) => {
      if (!this.anims.exists(key))
        this.anims.create({
          key,
          frames: this.anims.generateFrameNumbers(texture, { start: 0, end: 1 }),
          frameRate,
          repeat: -1,
        });
    };
    anim("gabriel_flap", "archangel_gabriel", 3);
    anim("dove_flap", "holy_spirit_dove", 6);
  }

  private createNazarethRoom() {
    const W = this.worldWidth;
    const H = this.worldHeight;
    const WALL = 48; // top wall face height (3 tiles)
    const CAP = 16; // side / bottom wall thickness (1 tile)

    // Floor, back wall, contact shadow
    this.add.tileSprite(0, WALL, W, H - WALL, "floor_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 0, W, WALL, "wall_face").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, WALL, W, 4, 0x000000, 0.18).setOrigin(0).setDepth(DEPTH.FLOOR);

    this.drawRug(296, 176, 208, 128);

    // Arched windows + morning light beams
    for (const wx of [140, 620]) {
      this.add.image(wx, 8, "window_arch").setOrigin(0.5, 0).setDepth(DEPTH.FLOOR);
      this.add
        .graphics()
        .setDepth(DEPTH.LIGHT)
        .fillStyle(0xfef08a, 0.1)
        .fillPoints(
          [
            { x: wx - 9, y: 36 },
            { x: wx + 9, y: 36 },
            { x: wx + 72, y: 280 },
            { x: wx + 24, y: 280 },
          ],
          true
        );
    }
    this.add.image(470, 14, "wall_shelf").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Side & bottom wall caps sit above everything walkable
    this.add.tileSprite(0, 0, CAP, H, "wall_cap").setOrigin(0).setDepth(DEPTH.WALL);
    this.add.tileSprite(W - CAP, 0, CAP, H, "wall_cap").setOrigin(0).setDepth(DEPTH.WALL);
    this.add.tileSprite(0, H - CAP, W, CAP, "wall_cap").setOrigin(0).setDepth(DEPTH.WALL);

    // Colliders
    this.obstacles = this.physics.add.staticGroup();
    this.block(W / 2, (WALL + 6) / 2, W, WALL + 6);
    this.block(CAP / 2, H / 2, CAP, H);
    this.block(W - CAP / 2, H / 2, CAP, H);
    this.block(W / 2, H - CAP / 2, W, CAP);

    // Furniture (foot-anchored, y-sorted)
    this.prop(40, 92, "olive_pot", 14, 8);
    this.prop(W - 40, 92, "olive_pot", 14, 8);
    this.prop(40, 568, "clay_jar", 12, 8);
    this.prop(58, 576, "clay_jar", 12, 8);
    this.prop(W - 40, 320, "clay_jar", 12, 8);
    this.prop(W - 72, 560, "sleeping_mat", 36, 14);
  }

  /** Woven rug from integer rects: red field, gold + navy borders, diamond medallion, fringe. */
  private drawRug(x: number, y: number, w: number, h: number) {
    const g = this.add.graphics().setDepth(DEPTH.RUG);
    const r = (rx: number, ry: number, rw: number, rh: number, c: number) =>
      g.fillStyle(c, 1).fillRect(x + rx, y + ry, rw, rh);
    r(0, 0, w, h, 0x9f2d20);
    r(4, 4, w - 8, 4, 0xd4a037);
    r(4, h - 8, w - 8, 4, 0xd4a037);
    r(4, 4, 4, h - 8, 0xd4a037);
    r(w - 8, 4, 4, h - 8, 0xd4a037);
    r(12, 12, w - 24, 2, 0x1e3a8a);
    r(12, h - 14, w - 24, 2, 0x1e3a8a);
    r(12, 12, 2, h - 24, 0x1e3a8a);
    r(w - 14, 12, 2, h - 24, 0x1e3a8a);
    // stepped diamond medallion
    const cx = w / 2;
    const cy = h / 2;
    for (let i = 0; i < 6; i++) {
      const half = (6 - i) * 4;
      r(cx - half, cy - 2 - i * 4, half * 2, 4, i % 2 ? 0xd4a037 : 0x1e3a8a);
      r(cx - half, cy - 2 + i * 4, half * 2, 4, i % 2 ? 0xd4a037 : 0x1e3a8a);
    }
    r(cx - 2, cy - 2, 4, 4, 0xf8fafc);
    // fringe on short ends
    for (let fx = 2; fx < w; fx += 4) {
      r(fx, -3, 2, 3, 0xefe3c8);
      r(fx, h, 2, 3, 0xefe3c8);
    }
  }

  private spawnEntities() {
    const centerX = this.worldWidth / 2;
    const altarFootY = ALTAR_Y + 20;

    // 1. Prayer table
    this.altarSprite = this.prop(centerX, altarFootY, "nazareth_altar", 42, 14);

    // Candle light (stepped glow, alpha pulse only — never scale pixel art)
    const candleGlow = this.add
      .image(centerX, altarFootY - 38, "glow_small")
      .setDepth(altarFootY + 1)
      .setAlpha(0.6);
    this.tweens.add({ targets: candleGlow, alpha: 0.9, duration: 700, yoyo: true, repeat: -1 });

    // 2. Mary kneeling in prayer, left of the table
    const maryX = centerX - 48;
    const maryY = altarFootY + 8;
    const maryHalo = this.add
      .image(maryX, maryY - 22, "glow_gold")
      .setDepth(maryY - 1)
      .setAlpha(0.35);
    this.tweens.add({ targets: maryHalo, alpha: 0.6, duration: 1800, yoyo: true, repeat: -1 });

    this.marySprite = this.add.sprite(maryX, maryY, "mary_praying").setOrigin(0.5, 1).setDepth(maryY);
    this.block(maryX, maryY - 4, 14, 8);
    // 1px breathing bob (roundPixels keeps it on the grid)
    this.tweens.add({
      targets: this.marySprite,
      y: maryY - 1,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: "Stepped",
    });
  }

  private spawnScrolls() {
    for (const item of this.scrolls) {
      const glow = this.add.image(item.x, item.y, "glow_small").setDepth(item.y - 1).setAlpha(0.5);
      this.tweens.add({ targets: glow, alpha: 0.85, duration: 900, yoyo: true, repeat: -1 });

      const sprite = this.add.sprite(item.x, item.y, "scripture_scroll").setDepth(item.y);
      this.tweens.add({
        targets: sprite,
        y: item.y - 3,
        duration: 1000 + Math.random() * 400,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      const sparkle = this.add.image(item.x + 7, item.y - 8, "sparkle").setDepth(item.y + 1);
      this.tweens.add({
        targets: sparkle,
        alpha: 0,
        duration: 500,
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 600,
      });

      item.sprite = sprite;
      item.glow = glow;
      item.sparkle = sparkle;
    }
  }

  private triggerIntroDialogue() {
    EventBus.emit("dialogue-open", {
      speaker: "Bối Cảnh Nazareth",
      avatarEmoji: "🕊️",
      lines: [
        "Mầu Nhiệm Thứ Nhất: Thiên Thần Truyền Tin Cho Đức Bà (Lc 1, 26-38).",
        "Tại một ngôi nhà nhỏ thanh bình ở xứ Nazareth, Đức Mẹ Maria đang khiêm nhường quỳ cầu nguyện bên Bàn Thờ.",
        "Một cơn gió thổi qua làm rơi những cuộn Kinh Thánh Cựu Ước tiên báo về Đấng Cứu Thế.",
        "Hãy bước lại gần và thu thập đủ 3 cuộn Lời Chúa để đặt lại ngay ngắn trên Bàn Cầu Nguyện của Mẹ!",
      ],
    });
  }

  update() {
    super.update();
    this.updateInteractionPrompt();
  }

  private updateInteractionPrompt() {
    if (!this.player || !this.interactionPromptText) return;

    // 1. Check proximity to uncollected scrolls
    for (const item of this.scrolls) {
      if (!item.collected && item.sprite) {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);
        if (dist < 48) {
          this.interactionPromptText
            .setPosition(item.x, item.y - 24)
            .setText(`[A] Nhặt ${item.name}`)
            .setVisible(true);
          return;
        }
      }
    }

    // 2. Check proximity to Altar
    const centerX = this.worldWidth / 2;
    const altarY = ALTAR_Y;
    const distToAltar = Phaser.Math.Distance.Between(this.player.x, this.player.y, centerX, altarY + 20);

    if (distToAltar < 75) {
      if (this.scrollsCollectedCount > 0 && !this.scrollsPlacedOnAltar) {
        this.interactionPromptText
          .setPosition(centerX, altarY - 30)
          .setText(`[A] Đặt ${this.scrollsCollectedCount}/3 Cuộn Sách lên Bàn`)
          .setVisible(true);
        return;
      }
    }

    // 3. Check proximity to Archangel Gabriel
    if (this.gabrielSprite && this.gabrielAppeared && !this.mysteryCompleted) {
      const distToGabriel = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.gabrielSprite.x,
        this.gabrielSprite.y
      );
      if (distToGabriel < 65) {
        this.interactionPromptText
          .setPosition(this.gabrielSprite.x, this.gabrielSprite.y - 36)
          .setText("[A] Đối thoại với Sứ Thần")
          .setVisible(true);
        return;
      }
    }

    // 4. Check proximity to Mary
    const distToMary = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.marySprite.x,
      this.marySprite.y
    );
    if (distToMary < 60) {
      this.interactionPromptText
        .setPosition(this.marySprite.x, this.marySprite.y - 34)
        .setText("[A] Trò chuyện với Đức Mẹ")
        .setVisible(true);
      return;
    }

    this.interactionPromptText.setVisible(false);
  }

  protected handleActionTrigger() {
    if (!this.player) return;

    // 1. Try collecting nearby scroll
    for (const item of this.scrolls) {
      if (!item.collected && item.sprite) {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);
        if (dist < 48) {
          this.collectScroll(item);
          return;
        }
      }
    }

    // 2. Try placing scrolls on altar
    const centerX = this.worldWidth / 2;
    const altarY = ALTAR_Y;
    const distToAltar = Phaser.Math.Distance.Between(this.player.x, this.player.y, centerX, altarY + 20);
    if (distToAltar < 75) {
      if (this.scrollsCollectedCount > 0 && !this.scrollsPlacedOnAltar) {
        this.placeScrollsOnAltar();
        return;
      }
    }

    // 3. Try talking to Gabriel
    if (this.gabrielSprite && this.gabrielAppeared) {
      const distToGabriel = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.gabrielSprite.x,
        this.gabrielSprite.y
      );
      if (distToGabriel < 65) {
        this.talkToGabriel();
        return;
      }
    }

    // 4. Talk to Mary
    const distToMary = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.marySprite.x,
      this.marySprite.y
    );
    if (distToMary < 60) {
      this.talkToMary();
      return;
    }
  }

  private collectScroll(item: ScrollItem) {
    item.collected = true;
    this.scrollsCollectedCount++;

    // Fade out and destroy
    if (item.sprite && item.glow && item.sparkle) {
      this.tweens.add({
        targets: [item.sprite, item.glow, item.sparkle],
        alpha: 0,
        y: "-=12",
        duration: 350,
        onComplete: () => {
          item.sprite?.destroy();
          item.glow?.destroy();
          item.sparkle?.destroy();
        },
      });
    }

    // Pop dialogue explaining scripture
    EventBus.emit("dialogue-open", {
      speaker: item.name,
      avatarEmoji: "📜",
      lines: [
        `Bạn đã nhặt được: ${item.name}!`,
        item.scripture,
        `Tiến độ: ${this.scrollsCollectedCount}/3 cuộn sách Lời Chúa.`,
        this.scrollsCollectedCount === 3
          ? "Bạn đã gom đủ 3 cuộn sách! Hãy mang tới đặt lên Bàn Cầu Nguyện của Đức Mẹ."
          : "Hãy tiếp tục tìm kiếm những cuộn sách còn lại trong phòng.",
      ],
    });
  }

  private placeScrollsOnAltar() {
    if (this.scrollsCollectedCount < 3) {
      EventBus.emit("dialogue-open", {
        speaker: "Bàn Cầu Nguyện",
        avatarEmoji: "🕯️",
        lines: [
          `Bạn đang giữ ${this.scrollsCollectedCount}/3 cuộn sách.`,
          "Hãy gom đủ cả 3 cuộn Lời Chúa tiên báo Đấng Cứu Thế trước khi đặt lên bàn nhé!",
        ],
      });
      return;
    }

    this.scrollsPlacedOnAltar = true;

    // Display scrolls stacked on altar
    const centerX = this.worldWidth / 2;
    const altarY = ALTAR_Y;
    this.add.image(centerX - 12, altarY - 6, "scripture_scroll").setDepth(altarY + 21);

    EventBus.emit("dialogue-open", {
      speaker: "Bàn Cầu Nguyện",
      avatarEmoji: "✨",
      lines: [
        "Các cuộn Kinh Thánh đã được đặt lại ngay ngắn, trang nghiêm trên Bàn Cầu Nguyện!",
        "Một bầu khí thánh thiêng bao trùm khắp căn phòng Nazareth...",
      ],
      onComplete: () => {
        this.triggerGabrielAppearance();
      },
    });
  }

  private triggerGabrielAppearance() {
    if (this.gabrielAppeared) return;
    this.gabrielAppeared = true;
    audio.sfx("angel");

    const gabrielX = this.worldWidth / 2 + 56;
    const gabrielY = ALTAR_Y + 34;

    // 1. Holy aura behind the angel
    this.gabrielAura = this.add.image(gabrielX, gabrielY - 18, "glow_gold").setDepth(gabrielY - 1).setAlpha(0);

    // 2. Gabriel (2-frame wing flap + slow hover)
    this.gabrielSprite = this.add
      .sprite(gabrielX, gabrielY, "archangel_gabriel")
      .setOrigin(0.5, 1)
      .setAlpha(0)
      .setDepth(gabrielY)
      .play("gabriel_flap");
    this.tweens.add({
      targets: this.gabrielSprite,
      y: gabrielY - 4,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Sparkle burst
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const sp = this.add.image(gabrielX, gabrielY - 16, "sparkle").setDepth(DEPTH.FX);
      this.tweens.add({
        targets: sp,
        x: gabrielX + Math.round(Math.cos(angle) * 28),
        y: gabrielY - 16 + Math.round(Math.sin(angle) * 28),
        alpha: 0,
        duration: 900,
        onComplete: () => sp.destroy(),
      });
    }

    // Fade in Gabriel and aura
    this.tweens.add({ targets: this.gabrielAura, alpha: 0.55, duration: 1200, ease: "Cubic.easeOut" });
    this.tweens.add({
      targets: this.gabrielSprite,
      alpha: 1,
      duration: 1200,
      ease: "Cubic.easeOut",
      onComplete: () => this.talkToGabriel(),
    });
  }

  private talkToGabriel() {
    if (this.mysteryCompleted) {
      EventBus.emit("dialogue-open", {
        speaker: "Sứ Thần Gabriel",
        avatarEmoji: "🕊️",
        lines: [
          "Bình an cho bạn, người lữ khách nhỏ đức tin!",
          "Lời 'Xin Vâng' của Mẹ Maria đã mở lối cho Ơn Cứu Độ bước vào trần thế.",
          "Hãy luôn giữ lòng khiêm nhường và lắng nghe tiếng Chúa trong đời sống mỗi ngày!",
        ],
      });
      return;
    }

    EventBus.emit("dialogue-open", {
      speaker: "Sứ Thần Gabriel",
      avatarEmoji: "🌟",
      lines: [
        "Hỡi Lữ Khách nhỏ, Thiên Chúa đã sai ta đến truyền tin cho Trinh Nữ Maria!",
        "Hãy cùng ta cất lời chào Đấng Đầy Ơn Phúc đẹp lòng Thiên Chúa nhất:",
      ],
      options: [
        {
          label: "Kính mừng Maria đầy ơn phúc, Đức Chúa Trời ở cùng Bà!",
          onSelect: () => this.handleGreetingCorrect(),
        },
        {
          label: "Xin chào Maria, một ngày thật đẹp trời tại Nazareth!",
          onSelect: () => this.handleGreetingIncorrect(1),
        },
        {
          label: "Hỡi Maria, hãy mau mau tìm nơi an toàn để trú ẩn!",
          onSelect: () => this.handleGreetingIncorrect(2),
        },
      ],
    });
  }

  private handleGreetingIncorrect(optionId: number) {
    EventBus.emit("dialogue-open", {
      speaker: "Sứ Thần Gabriel",
      avatarEmoji: "🌟",
      lines: [
        optionId === 1
          ? "Đó là một lời chào lịch thiệp trần thế, nhưng sứ điệp từ Trời cao còn linh thánh và sâu sắc hơn nhiều!"
          : "Đừng sợ hãi! Sứ mạng của Thiên Chúa mang lại bình an chứ không phải sự sợ hãi.",
        "Hãy nhớ lại lời chúc tụng mà muôn thế hệ sẽ cùng hát khen Đức Mẹ...",
      ],
      options: [
        {
          label: "Kính mừng Maria đầy ơn phúc, Đức Chúa Trời ở cùng Bà!",
          onSelect: () => this.handleGreetingCorrect(),
        },
      ],
    });
  }

  private handleGreetingCorrect() {
    // Gabriel gives the Annunciation prophecy
    EventBus.emit("dialogue-open", {
      speaker: "Sứ Thần Gabriel",
      avatarEmoji: "🌟",
      lines: [
        "Chính là lời ấy! 'Kính mừng Maria đầy ơn phúc, Đức Chúa Trời ở cùng Bà!'",
        "Thánh Thần sẽ ngự xuống trên Bà, và quyền năng Đấng Tối Cao sẽ rợp bóng trên Bà,",
        "vì thế, Đấng Thánh sắp sinh ra sẽ được gọi là Con Thiên Chúa!",
      ],
      onComplete: () => {
        this.triggerMaryFiatClimax();
      },
    });
  }

  private triggerMaryFiatClimax() {
    // Mary's Fiat proclamation
    EventBus.emit("dialogue-open", {
      speaker: "Đức Mẹ Maria",
      avatarEmoji: "💙",
      lines: [
        "Vâng, tôi đây là nữ tỳ của Chúa...",
        "Xin Người thực hiện cho tôi như lời sứ thần nói!",
      ],
      onComplete: () => {
        this.performHolySpiritDescendingEffect();
      },
    });
  }

  private performHolySpiritDescendingEffect() {
    const maryX = this.marySprite.x;
    const maryY = this.marySprite.y;

    // 1. Stepped beam of light (3 nested bands, no soft edges)
    this.holySpiritBeam = this.add.graphics().setDepth(DEPTH.FX).setAlpha(0);
    [56, 36, 16].forEach((w) =>
      this.holySpiritBeam!.fillStyle(0xfef08a, 0.18).fillRect(maryX - w / 2, 0, w, maryY)
    );
    this.tweens.add({ targets: this.holySpiritBeam, alpha: 1, duration: 600 });
    this.tweens.add({
      targets: this.holySpiritBeam,
      alpha: 0.6,
      duration: 500,
      delay: 600,
      yoyo: true,
      repeat: 3,
    });

    // 2. Holy Spirit dove descends, flapping
    this.holySpiritDove = this.add
      .sprite(maryX, this.cameras.main.worldView.top + 8, "holy_spirit_dove")
      .setDepth(DEPTH.FX + 1)
      .setAlpha(0)
      .play("dove_flap");

    this.tweens.add({
      targets: this.holySpiritDove,
      y: maryY - 44,
      alpha: 1,
      duration: 1800,
      ease: "Cubic.easeOut",
      onComplete: () => {
        this.completeStage();
      },
    });
  }

  private completeStage() {
    this.mysteryCompleted = true;

    // 1. Auto-save progress (also advances the resume pointer to stage 2)
    this.saveStageComplete(["collect_3_scrolls", "gabriel_greeting", "mary_fiat"]);

    // 3. Outro meditation banner & reflection
    EventBus.emit("dialogue-open", {
      speaker: "✨ HOÀN THÀNH MẦU NHIỆM THỨ NHẤT ✨",
      avatarEmoji: "📿",
      lines: [
        "CHÚC MỪNG BẠN ĐÃ THẮP SÁNG HẠT MÂN CÔI SỐ 1!",
        "Mầu Nhiệm Thứ Nhất Năm Sự Vui: Thiên Thần Truyền Tin Cho Đức Bà.",
        "Ý cầu nguyện & Hoa trái suy niệm: Xin cho được lòng khiêm nhường và luôn biết vâng theo Thánh Ý Thiên Chúa.",
        "Ngôi Lời đã Nhập Thể trong lòng Đức Trinh Nữ Maria!",
      ],
      onComplete: () => this.goToNextStage(),
    });
  }

  private talkToMary() {
    if (this.mysteryCompleted) {
      EventBus.emit("dialogue-open", {
        speaker: "Đức Mẹ Maria",
        avatarEmoji: "💙",
        lines: [
          "Linh hồn tôi ngợi khen Đức Chúa, và thần trí tôi hớn hở vui mừng trong Thiên Chúa Đấng Cứu Độ tôi!",
          "Cảm ơn con đã cùng Mẹ đón nhận Hồng Ân Cứu Độ.",
        ],
      });
      return;
    }

    if (!this.scrollsPlacedOnAltar) {
      EventBus.emit("dialogue-open", {
        speaker: "Đức Mẹ Maria",
        avatarEmoji: "💙",
        lines: [
          "Bình an cho con, người lữ khách nhỏ!",
          "Mẹ đang chuẩn bị tâm hồn lắng nghe Lời Chúa.",
          `Con hãy giúp Mẹ tìm lại đủ 3 cuộn sách Lời Chúa đang rơi trong phòng nhé! (Đã có: ${this.scrollsCollectedCount}/3)`,
        ],
      });
    } else {
      EventBus.emit("dialogue-open", {
        speaker: "Đức Mẹ Maria",
        avatarEmoji: "💙",
        lines: [
          "Sứ thần Gabriel đang hiện diện với lời nhắn từ Trời Cao.",
          "Con hãy cùng Mẹ lắng nghe và cất lời chào mừng Sứ thần nhé!",
        ],
      });
    }
  }
}
