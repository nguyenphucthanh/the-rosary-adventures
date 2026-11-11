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
import { registerGloryTextures } from "@/modules/the-rosary-adventures/game/utils/gloryTextureGenerator";
import { registerInterludeTextures } from "@/modules/the-rosary-adventures/game/utils/interludeTextureGenerator";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 540;
const STEP_GOAL = 6;
const FLOWER_GOAL = 4;

interface GoldenStep {
  sprite: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Image;
  stepped: boolean;
}

interface RollingThorn {
  sprite: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Image;
  baseX: number;
  y: number;
  vx: number;
  transformed: boolean;
}

interface WindStreak {
  sprite: Phaser.GameObjects.Image;
  vx: number;
}

/**
 * Mid-Stage B4 (After Sorrowful 3 -> Before Sorrowful 4):
 * "Vác Thập Giá Nhỏ Theo Chúa" (Lc 9, 23).
 * Combined Action:
 * 1) Hold your small wooden cross and walk in 6 Glowing Golden Footsteps of Jesus up the stone road.
 * 2) Approach the 4 rolling thorny stones and press [A] to raise your little cross as a shield of love,
 *    transforming each thorn/stone into a blooming flower of sacrifice while bracing against gentle gusts!
 */
export class InterludeB4CarryCrossScene extends InteractiveScene {
  private steps: GoldenStep[] = [];
  private thorns: RollingThorn[] = [];
  private winds: WindStreak[] = [];
  private stepCount = 0;
  private flowerCount = 0;
  private finished = false;
  private windCooldown = 0;

  constructor() {
    super("InterludeB4CarryCrossScene");
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
    registerGloryTextures(this);
    registerInterludeTextures(this);

    this.steps = [];
    this.thorns = [];
    this.winds = [];
    this.walkers = [];
    this.stepCount = 0;
    this.flowerCount = 0;
    this.finished = false;
    this.windCooldown = 0;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildViaDolorosaRoad();
    this.buildCharactersAndQuests();
    this.defineInteractables();

    this.begin("mid_b4_vac_thap_gia_nho", [320, 470], {
      speaker: tx("Chúa Giêsu", "Jesus"),
      emoji: "✝️",
      lines: [
        tx("Chặng Đệm Hành Động: Vác Thập Giá Nhỏ Theo Chúa (Lc 9, 23).", "Action Mid-Stage: Carrying Our Little Cross with Jesus (Lk 9:23)."),
        tx("“Ai muốn theo Tôi, phải từ bỏ chính mình, vác thập giá mình hằng ngày mà theo.” (Lc 9, 23)", "“Whoever wishes to come after me must deny himself, take up his cross daily and follow me.” (Lk 9:23)"),
        tx("Con đang vác cây Thập Giá Nhỏ trên vai! Hãy bước theo 6 Dấu Chân Vàng của Chúa trên dốc đá, và đến gần 4 bụi gai/đá lăn bấm [A] giơ Thập Giá hóa chúng thành Hoa Hy Sinh nhé!", "You carry the Little Cross on your shoulder! Follow the 6 Golden Footprints of the Lord up the rocky slope, and near the 4 thorn bushes / rolling rocks press [A] to hold up the Cross and turn them into Flowers of Sacrifice!"),
      ],
    });

    // Equip the child's small wooden cross right away
    this.holdItem("small_cross", "small_cross");
    this.syncProgress();
  }

  private syncProgress() {
    this.emitInterludeProgress([
      {
        id: "footsteps",
        emoji: "👣",
        label: tx("BƯỚC CHÂN", "FOOTSTEPS"),
        current: this.stepCount,
        total: STEP_GOAL,
        color: "amber",
      },
      {
        id: "sacrifices",
        emoji: "🌸",
        label: "HY SINH",
        current: this.flowerCount,
        total: FLOWER_GOAL,
        color: "rose",
      },
    ]);
  }

  private buildViaDolorosaRoad() {
    // Dark grass borders + Calvary stone road ascending from south to north
    this.add.tileSprite(0, 0, W, H, "dark_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(128, 64, W - 256, H - 64, "calvary_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(168, 80, W - 336, H - 80, "cobble_tile").setOrigin(0).setDepth(DEPTH.RUG);
    this.edgeWalls(W, H);

    // Somber twilight sky header at top of Calvary slope
    this.add.rectangle(0, 0, W, 68, 0x1e1b2e).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.block(W / 2, 34, W, 68);

    // Jerusalem stone walls & olive trees framing the road
    for (const [x, y] of [
      [64, 150],
      [576, 150],
      [64, 310],
      [576, 310],
    ]) {
      this.prop(x, y, "house_front", 76, 22);
    }
    for (const [x, y] of [
      [72, 440],
      [568, 440],
    ]) {
      this.prop(x, y, "olive", 28, 14);
    }
    for (const [x, y] of [
      [120, 230],
      [520, 230],
      [120, 390],
      [520, 390],
    ]) {
      this.prop(x, y, "boulder", 24, 10);
    }

    // Gentle dusk passion tint
    this.add.rectangle(0, 0, W, H, 0x1e1b2e, 0.22).setOrigin(0).setDepth(DEPTH.FX - 4);
  }

  private buildCharactersAndQuests() {
    // Jesus carrying the Cross ahead on the road, with Mother Mary and Simon encouraging the child
    this.add.sprite(320, 118, "jesus_carry").setOrigin(0.5, 1).setDepth(118);
    this.hint(320, 84);
    this.add.sprite(230, 128, "mary_sorrow").setOrigin(0.5, 1).setDepth(128);
    this.add.sprite(410, 128, "simon").setOrigin(0.5, 1).setDepth(128);

    // 6 Glowing Golden Footsteps ascending the Via Dolorosa
    const stepCoords: [number, number][] = [
      [260, 420],
      [380, 375],
      [250, 320],
      [390, 270],
      [265, 215],
      [365, 168],
    ];
    for (const [x, y] of stepCoords) {
      const glow = this.add.image(x, y, "glow_small").setDepth(DEPTH.LIGHT).setAlpha(0.65);
      const sprite = this.add.image(x, y, "golden_footstep").setDepth(DEPTH.RUG + 2);
      this.tweens.add({
        targets: glow,
        alpha: { from: 0.4, to: 0.85 },
        duration: 700,
        yoyo: true,
        repeat: -1,
      });
      this.steps.push({ sprite, glow, stepped: false });
    }

    // 4 Rolling Thorny Stones across the road that can be transformed into Flowers of Sacrifice with [A]
    const thornConfigs = [
      { x: 220, y: 395, vx: 38 },
      { x: 420, y: 340, vx: -42 },
      { x: 230, y: 250, vx: 44 },
      { x: 400, y: 190, vx: -36 },
    ];
    for (const cfg of thornConfigs) {
      const glow = this.add.image(cfg.x, cfg.y - 6, "glow_small").setDepth(DEPTH.LIGHT).setAlpha(0.5);
      const sprite = this.add
        .image(cfg.x, cfg.y, "thorn")
        .setOrigin(0.5, 1)
        .setDepth(cfg.y);
      this.thorns.push({
        sprite,
        glow,
        baseX: cfg.x,
        y: cfg.y,
        vx: cfg.vx,
        transformed: false,
      });
    }

    // 2 visual wind streaks drifting across the road
    for (const [x, y, vx] of [
      [200, 295, 95],
      [440, 220, -90],
    ] as [number, number, number][]) {
      const sprite = this.add.image(x, y, "wind_gust").setDepth(DEPTH.FX - 2).setAlpha(0.75);
      this.winds.push({ sprite, vx });
    }
  }

  private defineInteractables() {
    const thornInteractables = this.thorns.map((t, idx) => ({
      // Place at() 18px above the thorn so the prompt at y-36 never covers the player's face
      at: () => [t.sprite.x, t.y - 18] as [number, number],
      r: 56,
      label: () => tx("[A] Giơ Thập Giá Nhỏ — Hóa gai nhọn thành Hoa Hy Sinh!", "[A] Hold up the Little Cross — Turn sharp thorns into Flowers of Sacrifice!"),
      active: () => !this.finished && !t.transformed,
      act: () => this.transformThorn(idx),
    }));

    this.interactables = [
      ...thornInteractables,
      {
        // Jesus foot is 118 -> at y=100 puts prompt at y=64, well above Jesus' halo & face
        at: () => [320, 100],
        r: 64,
        label: () =>
          this.stepCount >= STEP_GOAL && this.flowerCount >= FLOWER_GOAL
            ? tx("[A] Dâng Thập Giá Nhỏ lên Chúa Giêsu", "[A] Offer the Little Cross to Jesus")
            : tx(`[A] Chúa Giêsu (${this.stepCount}/${STEP_GOAL} Bước Chân · ${this.flowerCount}/${FLOWER_GOAL} Hoa Hy Sinh)`, `[A] Jesus (${this.stepCount}/${STEP_GOAL} Footsteps · ${this.flowerCount}/${FLOWER_GOAL} Flowers of Sacrifice)`),
        active: () => !this.finished,
        act: () => this.talkToJesus(),
      },
    ];
  }

  private transformThorn(idx: number) {
    const t = this.thorns[idx];
    if (!t || t.transformed || this.finished) return;
    t.transformed = true;
    t.vx = 0;

    audio.sfx("bless");
    this.sparkleBurst(t.sprite.x, t.y - 8);
    t.sprite.setTexture(idx % 2 === 0 ? "flower_p" : "flower_w");
    t.glow.setAlpha(0.9);

    this.flowerCount++;
    this.syncProgress();
    this.checkAutoComplete();
  }

  private checkAutoComplete() {
    if (this.stepCount >= STEP_GOAL && this.flowerCount >= FLOWER_GOAL && !this.finished) {
      audio.sfx("angel");
      this.sparkleBurst(320, 118);
    }
  }

  private talkToJesus() {
    if (this.stepCount < STEP_GOAL || this.flowerCount < FLOWER_GOAL) {
      this.talk(tx("Chúa Giêsu", "Jesus"), "✝️", [
        tx("Cảm ơn con đã cùng vác thập giá nhỏ đi bên Thầy!", "Thank you for carrying a little cross beside Me!"),
        tx(`Con hãy bước đủ ${STEP_GOAL} Dấu Chân Vàng (${this.stepCount}/${STEP_GOAL}) và hóa phép đủ ${FLOWER_GOAL} Hoa Hy Sinh (${this.flowerCount}/${FLOWER_GOAL}) trên đường nhé!`, `Walk all ${STEP_GOAL} Golden Footprints (${this.stepCount}/${STEP_GOAL}) and work the wonder on ${FLOWER_GOAL} Flowers of Sacrifice (${this.flowerCount}/${FLOWER_GOAL}) along the way!`),
      ]);
      return;
    }

    this.finished = true;
    audio.sfx("angel");
    this.sparkleBurst(320, 112);
    this.talk(
      tx("Chúa Giêsu", "Jesus"),
      "🌸",
      [
        tx("Mỗi việc thiện nhỏ bé, mỗi lời vâng phục cha mẹ và mỗi hy sinh âm thầm của con đều làm nhẹ bớt Thập Giá của Thầy!", "Every small good deed, every act of obedience to your parents and every quiet sacrifice makes My Cross lighter!"),
        tx("“Ai muốn theo Tôi, phải từ bỏ chính mình, vác thập giá mình hằng ngày mà theo.” (Lc 9, 23)", "“Whoever wishes to come after me must deny himself, take up his cross daily and follow me.” (Lk 9:23)"),
      ],
      () =>
        this.completeInterlude(
          tx("CHẶNG ĐỆM B4", "MID-STAGE B4"),
          tx("Vác Thập Giá Nhỏ Theo Chúa (Lc 9, 23)", "Carrying Our Little Cross with Jesus (Lk 9:23)"),
          tx("Biến những hy sinh nhỏ bé hằng ngày thành những bông hoa yêu thương dâng Chúa.", "Turn small daily sacrifices into flowers of love offered to the Lord."),
          tx("Con đường gai nhọn đã nở đầy hoa hy sinh! Giờ đây chúng ta cùng bước tiếp lên Đồi Can-vê với Chúa Giêsu nhé!", "The thorny path has bloomed with flowers of sacrifice! Now let's go on to Calvary with Jesus!")
        )
    );
  }

  update() {
    super.update();
    if (this.finished || !this.player) return;
    const delta = this.game.loop.delta;

    if (this.windCooldown > 0) this.windCooldown -= delta;

    // 1. Check stepping on Golden Footsteps
    for (const s of this.steps) {
      if (s.stepped) continue;
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, s.sprite.x, s.sprite.y) < 28) {
        s.stepped = true;
        audio.sfx("pickup");
        this.sparkleBurst(s.sprite.x, s.sprite.y);
        s.sprite.setAlpha(1);
        s.glow.setTexture("glow_gold").setAlpha(0.85);
        this.stepCount++;
        this.syncProgress();
        this.checkAutoComplete();
      }
    }

    // 2. Move untransformed rolling thorns back and forth along the road
    for (const t of this.thorns) {
      if (t.transformed) continue;
      t.sprite.x = Math.round(t.sprite.x + (t.vx * delta) / 1000);
      t.glow.x = t.sprite.x;
      if (t.sprite.x < 185) {
        t.sprite.x = 185;
        t.vx = Math.abs(t.vx);
      } else if (t.sprite.x > W - 185) {
        t.sprite.x = W - 185;
        t.vx = -Math.abs(t.vx);
      }
    }

    // 3. Move wind gusts across the road (gentle 8px pushback if touched)
    for (const w of this.winds) {
      w.sprite.x = Math.round(w.sprite.x + (w.vx * delta) / 1000);
      if (w.sprite.x > W - 140) w.sprite.x = 140;
      if (w.sprite.x < 140) w.sprite.x = W - 140;

      if (
        this.windCooldown <= 0 &&
        Phaser.Math.Distance.Between(this.player.x, this.player.y, w.sprite.x, w.sprite.y) < 22
      ) {
        this.windCooldown = 750;
        this.player.y = Math.min(H - 54, Math.round(this.player.y + 10));
      }
    }
  }
}
