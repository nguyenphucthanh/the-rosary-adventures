import * as Phaser from "phaser";
import audio from "@/modules/shared/game/audio/AudioManager";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAnnunciationTextures } from "@/modules/the-rosary-adventures/game/utils/npcTextureGenerator";
import { registerVisitationTextures } from "@/modules/the-rosary-adventures/game/utils/visitationTextureGenerator";
import { registerInfancyTextures } from "@/modules/the-rosary-adventures/game/utils/infancyTextureGenerator";
import { registerLightTextures } from "@/modules/the-rosary-adventures/game/utils/lightTextureGenerator";
import { registerGalileeTextures } from "@/modules/the-rosary-adventures/game/utils/galileeTextureGenerator";
import { registerPassionTextures } from "@/modules/the-rosary-adventures/game/utils/passionTextureGenerator";
import { registerInterludeTextures } from "@/modules/the-rosary-adventures/game/utils/interludeTextureGenerator";

const W = 640;
const H = 520;
const BRAMBLES_GOAL = 10;

interface Firefly {
  sprite: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Image;
  vx: number;
  vy: number;
}

interface BramblePatch {
  sprite: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Image;
  cleared: boolean;
}

/**
 * Season Bridge A2 (Between Luminous 5 & Sorrowful 1): Night Crossing of the Kidron Valley (Ga 18, 1).
 * Kid-friendly Lantern Light & Path-Clearing Action:
 * Carry a glowing oil lantern down the dark Kidron valley. Your lantern aura slowly dims;
 * catch floating fireflies/oil drops to keep it bright and clear 5 thorny brambles so Jesus
 * and the Apostles can cross the Kidron brook into Gethsemane!
 */
export class InterludeA2KidronValleyScene extends InteractiveScene {
  private lanternAura!: Phaser.GameObjects.Image;
  private lanternEnergy = 100; // 8..100 (starts dim, drains fast; fireflies refill it)
  private fireflies: Firefly[] = [];
  private brambles: BramblePatch[] = [];
  private clearedCount = 0;
  private finished = false;
  private brook!: Phaser.GameObjects.TileSprite;

  constructor() {
    super("InterludeA2KidronValleyScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAnnunciationTextures(this);
    registerVisitationTextures(this);
    registerInfancyTextures(this);
    registerLightTextures(this);
    registerGalileeTextures(this);
    registerPassionTextures(this);
    registerInterludeTextures(this);

    this.resetCarry();
    this.fireflies = [];
    this.brambles = [];
    this.walkers = [];
    this.clearedCount = 0;
    this.lanternEnergy = 25;
    this.finished = false;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildKidronValley();
    this.buildCharactersAndObjects();
    this.defineInteractables();

    this.begin("bridge_a2_suoi_kidron", [320, 440], {
      speaker: "Thung Lũng Suối Kidron",
      emoji: "🏮",
      lines: [
        "Cầu Nối Mùa Sáng → Mùa Thương: Đêm Vượt Suối Kidron (Ga 18, 1).",
        "“Nói xong những lời đó, Đức Giêsu đi ra cùng với các môn đệ, sang bên kia suối Kít-rôn; ở đó có một thửa vườn.”",
        "Đêm tối lạnh lẽo, con hãy cầm chiếc đèn dầu đi trước, chạm vào các Đom Đóm Sáng để giữ đèn luôn rực rỡ và dọn sạch 10 Bụi Gai trên đường nhé!",
      ],
    });
    this.holdItem("kidron_lantern", "kidron_lantern");
    this.syncProgress();
  }

  private syncProgress() {
    this.emitInterludeProgress([
      {
        id: "kidron_brambles",
        emoji: "🌿",
        label: "BỤI GAI",
        current: this.clearedCount,
        total: BRAMBLES_GOAL,
        color: "emerald",
      },
      {
        id: "kidron_lantern",
        emoji: "🏮",
        label: "ĐÈN DẦU",
        current: Math.round(this.lanternEnergy),
        total: 100,
        suffix: "%",
        color: "amber",
      },
    ]);
  }

  private buildKidronValley() {
    this.add.tileSprite(0, 0, W, H, "dark_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    // Winding valley path
    this.add.tileSprite(256, 80, 128, H - 80, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR).setTint(0x6b7280);

    // Kidron brook running across y = 180..228 with a stone plank bridge
    this.brook = this.add.tileSprite(0, 180, W, 48, "water_tile").setOrigin(0).setDepth(DEPTH.RUG).setTint(0x334155);
    this.time.addEvent({
      delay: 140,
      loop: true,
      callback: () => (this.brook.tilePositionX = (this.brook.tilePositionX + 1) % 16),
    });
    this.add.image(320, 204, "plank_bridge").setDepth(DEPTH.RUG + 1);
    this.block(120, 204, 240, 44);
    this.block(520, 204, 240, 44);

    this.edgeWalls(W, H);

    // Olive trees, rocks, and crescent moon
    for (const [x, y] of [
      [64, 130],
      [576, 130],
      [64, 340],
      [576, 340],
      [64, 460],
      [576, 460],
    ]) {
      this.prop(x, y, "olive", 16, 8);
    }
    this.add.image(550, 48, "moon").setDepth(DEPTH.FX - 3);

    // Deep night wash
    this.add.rectangle(0, 0, W, H, 0x050816, 0.45).setOrigin(0).setDepth(DEPTH.FX - 4);
  }

  private buildCharactersAndObjects() {
    // Jesus and Apostles waiting near the Gethsemane gate at top
    this.add.sprite(320, 118, "jesus_adult").setOrigin(0.5, 1).setDepth(118);
    this.hint(320, 84);
    this.add.sprite(260, 124, "peter").setOrigin(0.5, 1).setDepth(124);
    this.add.sprite(380, 124, "john_apostle").setOrigin(0.5, 1).setDepth(124);

    // Player's warm lantern glow
    this.lanternAura = this.add.image(320, 440, "glow_gold").setDepth(DEPTH.FX - 2).setAlpha(0.29);

    // 10 thorny brambles blocking the valley path
    const brambleCoords: [number, number][] = [
      [170, 430],
      [470, 430],
      [250, 385],
      [390, 385],
      [130, 330],
      [510, 330],
      [320, 330],
      [200, 275],
      [440, 275],
      [320, 250],
    ];
    for (const [x, y] of brambleCoords) {
      const glow = this.add.image(x, y - 8, "glow_small").setDepth(DEPTH.LIGHT).setAlpha(0.45);
      const sprite = this.add.image(x, y, "thorn").setOrigin(0.5, 1).setDepth(y);
      this.brambles.push({ sprite, glow, cleared: false });
    }

    // 6 floating fireflies drifting around the valley
    for (let i = 0; i < 6; i++) {
      this.spawnFirefly(130 + i * 76, 250 + (i % 2) * 110);
    }
  }

  private spawnFirefly(x: number, y: number) {
    const glow = this.add.image(x, y, "glow_small").setDepth(DEPTH.FX - 2).setAlpha(0.6);
    const sprite = this.add.image(x, y, "firefly_drop").setDepth(DEPTH.FX - 1);
    const vx = (Math.random() < 0.5 ? 1 : -1) * Phaser.Math.Between(24, 42);
    const vy = (Math.random() < 0.5 ? 1 : -1) * Phaser.Math.Between(18, 32);
    this.fireflies.push({ sprite, glow, vx, vy });
  }

  private defineInteractables() {
    this.interactables = [
      {
        at: () => [320, 112],
        r: 68,
        label: () =>
          this.clearedCount >= BRAMBLES_GOAL
            ? "[A] Cùng Chúa Giêsu bước vào Vườn Cây Dầu"
            : `[A] Chúa Giêsu (Đã dọn ${this.clearedCount}/${BRAMBLES_GOAL} bụi gai)`,
        active: () => !this.finished,
        act: () => this.reachGethsemane(),
      },
    ];
  }

  private reachGethsemane() {
    if (this.clearedCount < BRAMBLES_GOAL) {
      this.talk("Chúa Giêsu", "🏮", [
        `Đường đêm còn vướng gai nhọn. Con hãy dùng ánh đèn dọn hết ${BRAMBLES_GOAL} Bụi Gai (${this.clearedCount}/${BRAMBLES_GOAL}) để các môn đệ đi qua an toàn nhé.`,
      ]);
      return;
    }

    this.finished = true;
    this.dropItem();
    audio.sfx("bless");
    this.sparkleBurst(320, 118);

    this.time.delayedCall(400, () =>
      this.completeInterlude(
        "CẦU NỐI MÙA A2",
        "Đêm Vượt Suối Kidron (Ga 18, 1)",
        "Giữ ngọn đèn đức tin và lòng mến luôn cháy sáng để đồng hành với Chúa trong những lúc gian nan.",
        "Con đường qua suối Kidron đã quang đãng. Giờ đây chúng ta bước vào Năm Sự Thương cùng Chúa Giêsu trong Vườn Cây Dầu!"
      )
    );
  }

  update() {
    super.update();
    if (this.finished || !this.player) return;
    const delta = this.game.loop.delta;

    // Lantern glow follows player and dims quickly (floor 8% so it never goes fully black)
    this.lanternEnergy = Math.max(8, this.lanternEnergy - (delta / 1000) * 6);
    this.lanternAura
      .setPosition(Math.round(this.player.x), Math.round(this.player.y))
      .setAlpha(0.1 + (this.lanternEnergy / 100) * 0.75);

    // Move fireflies & collect on touch
    for (const f of this.fireflies) {
      f.sprite.x = Math.round(f.sprite.x + (f.vx * delta) / 1000);
      f.sprite.y = Math.round(f.sprite.y + (f.vy * delta) / 1000);
      if (f.sprite.x < 90 || f.sprite.x > W - 90) f.vx = -f.vx;
      if (f.sprite.y < 235 || f.sprite.y > H - 50) f.vy = -f.vy;
      f.glow.setPosition(f.sprite.x, f.sprite.y);

      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, f.sprite.x, f.sprite.y) < 28) {
        audio.sfx("chime");
        this.lanternEnergy = 100;
        // Respawn firefly at another spot so there's always plenty of light
        f.sprite.setPosition(Phaser.Math.Between(120, W - 120), Phaser.Math.Between(250, H - 70));
        f.glow.setPosition(f.sprite.x, f.sprite.y);
      }
    }

    // Clear brambles when player walks over them with the lit lantern
    for (const b of this.brambles) {
      if (b.cleared) continue;
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, b.sprite.x, b.sprite.y) < 28) {
        b.cleared = true;
        audio.sfx("pickup");
        this.sparkleBurst(b.sprite.x, b.sprite.y - 6);
        b.sprite.destroy();
        b.glow.destroy();
        this.clearedCount++;
      }
    }

    this.syncProgress();
  }
}
