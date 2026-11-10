import * as Phaser from "phaser";
import audio from "@/modules/shared/game/audio/AudioManager";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAllForGlory } from "@/modules/the-rosary-adventures/game/utils/gloryTextureGenerator";
import { registerInterludeTextures } from "@/modules/the-rosary-adventures/game/utils/interludeTextureGenerator";

const W = 640;
const H = 520;
const GRACE_GOAL = 6;
const WITNESS_GOAL = 3;

interface GraceSpark {
  sprite: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Image;
  collected: boolean;
}

interface WaitingVillager {
  sprite: Phaser.GameObjects.Sprite;
  glow: Phaser.GameObjects.Image;
  name: string;
  x: number;
  y: number;
  blessed: boolean;
}

/**
 * Mid-Stage B6 (After Glorious 3 -> Before Glorious 4):
 * "Phép Lạ Cửa Đẹp & Chứng Nhân Tin Mừng" (Cv 3, 1-10).
 * Action: Outside the Temple's Beautiful Gate after Pentecost with Peter and John:
 * 1) Collect 6 Sparks/Doves of Grace (🕊️ 0/6 ƠN THÁNH)
 * 2) Share them (2 Grace Sparks each) with 3 waiting villagers (🙌 0/3 CHỨNG NHÂN)
 *    so they leap for joy and praise God!
 */
export class InterludeB6BeautifulGateScene extends InteractiveScene {
  private sparks: GraceSpark[] = [];
  private villagers: WaitingVillager[] = [];
  private graceCount = 0;
  private witnessCount = 0;
  private finished = false;

  constructor() {
    super("InterludeB6BeautifulGateScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAllForGlory(this);
    registerInterludeTextures(this);

    this.sparks = [];
    this.villagers = [];
    this.walkers = [];
    this.graceCount = 0;
    this.witnessCount = 0;
    this.finished = false;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildBeautifulGatePlaza();
    this.buildApostlesAndVillagers();
    this.defineInteractables();

    this.begin("mid_b6_cua_dep", [320, 440], {
      speaker: "Thánh Phê-rô & Gio-an",
      emoji: "🕊️",
      lines: [
        "Chặng Đệm Hành Động: Phép Lạ Cửa Đẹp & Chứng Nhân Tin Mừng (Cv 3, 1-10).",
        "Đầy tràn Chúa Thánh Thần, Phê-rô nói với người què ở Cửa Đẹp: “Vàng bạc thì tôi không có; nhưng cái tôi có, tôi cho anh đây: nhân danh Đức Giêsu Kitô, anh hãy đứng dậy mà đi!” (Cv 3, 6)",
        "Hãy thu thập 6 Ơn Thánh Thần (🕊️) quanh sân Đền Thờ và đến chia sẻ [A] cho 3 người đang mong đợi (mỗi người cần 2 Ơn Thánh) để họ nhảy mừng ca tụng Chúa nhé!",
      ],
    });
    this.syncProgress();
  }

  private syncProgress() {
    this.emitInterludeProgress([
      {
        id: "grace_sparks",
        emoji: "🕊️",
        label: "ƠN THÁNH",
        current: this.graceCount,
        total: GRACE_GOAL,
        color: "sky",
      },
      {
        id: "witnesses",
        emoji: "🙌",
        label: "CHỨNG NHÂN",
        current: this.witnessCount,
        total: WITNESS_GOAL,
        color: "emerald",
      },
    ]);
  }

  private buildBeautifulGatePlaza() {
    // Temple outer courtyard cobblestones + royal carpet path up to the Beautiful Gate
    this.add.tileSprite(0, 0, W, H, "cobble_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(264, 128, 112, H - 180, "rug_tile").setOrigin(0).setDepth(DEPTH.RUG);
    this.edgeWalls(W, H);

    // Temple wall header & Beautiful Gate at north
    for (let x = 16; x < W; x += 32) {
      this.add.image(x, 68, "stone_wall").setOrigin(0.5, 1).setDepth(68);
    }
    this.block(W / 2, 36, W, 72);

    this.add.image(320, 124, "temple_steps").setOrigin(0.5, 1).setDepth(DEPTH.RUG + 1);
    this.prop(320, 108, "temple_gate", 64, 18);

    // Columns, menorahs, and Resurrection banners around the plaza
    for (const [x, y] of [
      [140, 140],
      [500, 140],
      [100, 320],
      [540, 320],
    ]) {
      this.prop(x, y, "temple_pillar", 22, 14);
    }
    for (const [x, y] of [
      [215, 134],
      [425, 134],
    ]) {
      this.prop(x, y, "menorah", 20, 10);
    }
    for (const [x, y] of [
      [84, 195],
      [556, 195],
    ]) {
      this.prop(x, y, "banner", 14, 10);
    }

    // Holy Spirit Dove soaring above the Beautiful Gate
    const dove = this.add.sprite(320, 56, "holy_spirit_dove").setDepth(DEPTH.FX);
    dove.play("spirit_flap");
    this.tweens.add({
      targets: dove,
      x: { from: 220, to: 420 },
      duration: 3600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  private buildApostlesAndVillagers() {
    // Peter and John standing before the Beautiful Gate
    this.add.sprite(282, 136, "peter").setOrigin(0.5, 1).setDepth(136);
    this.add.sprite(358, 136, "john_apostle").setOrigin(0.5, 1).setDepth(136);
    this.hint(320, 100);

    // 3 Waiting villagers who need healing & Good News
    const villagerDefs: [string, string, number, number][] = [
      ["mourner", "Người Què Ở Cửa Đẹp", 175, 250],
      ["hungry", "Người Đói Khát Lời Chúa", 465, 250],
      ["prisoner", "Người Buồn Phiền", 320, 355],
    ];
    for (const [key, name, x, y] of villagerDefs) {
      const glow = this.add.image(x, y - 10, "glow_small").setDepth(DEPTH.LIGHT).setAlpha(0.45);
      const sprite = this.add.sprite(x, y, key).setOrigin(0.5, 1).setDepth(y);
      this.hint(x, y - 34);
      this.villagers.push({ sprite, glow, name, x, y, blessed: false });
    }

    // 6 Sparks/Doves of Grace scattered around the Temple courtyard
    const sparkSpots: [number, number][] = [
      [115, 215],
      [525, 215],
      [250, 295],
      [390, 295],
      [155, 415],
      [485, 415],
    ];
    sparkSpots.forEach(([x, y], i) => {
      const glow = this.add.image(x, y, "glow_small").setDepth(y - 1).setAlpha(0.55);
      this.tweens.add({ targets: glow, alpha: 0.85, duration: 900, yoyo: true, repeat: -1 });
      const tex = i % 2 === 0 ? "icon_peace" : "fire_tongue";
      const sprite = this.add.image(x, y, tex).setDepth(y);
      this.tweens.add({
        targets: sprite,
        y: y - 3,
        duration: 1100,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      this.sparks.push({ sprite, glow, collected: false });
    });
  }

  private defineInteractables() {
    const villagerInteractables = this.villagers.map((v, idx) => ({
      // Place at() 18px above foot so prompt at y-36 is at footY-54 (well above the 32px sprite head)
      at: () => [v.x, v.y - 18] as [number, number],
      r: 56,
      label: () => {
        const needed = (this.witnessCount + 1) * 2;
        return this.graceCount >= needed
          ? `[A] Trao Ơn Thánh cho ${v.name}!`
          : `[A] ${v.name} (Cần ${needed} Ơn Thánh — hiện có ${this.graceCount}/${GRACE_GOAL})`;
      },
      active: () => !this.finished && !v.blessed,
      act: () => this.blessVillager(idx),
    }));

    this.interactables = [
      ...villagerInteractables,
      {
        at: () => [320, 118],
        r: 64,
        label: () =>
          this.witnessCount >= WITNESS_GOAL
            ? "[A] Cùng Thánh Phê-rô & Gio-an ca tụng Chúa!"
            : `[A] Thánh Phê-rô & Gio-an (${this.graceCount}/${GRACE_GOAL} Ơn Thánh · ${this.witnessCount}/${WITNESS_GOAL} Chứng Nhân)`,
        active: () => !this.finished,
        act: () => this.talkToApostles(),
      },
    ];
  }

  private blessVillager(idx: number) {
    const v = this.villagers[idx];
    if (!v || v.blessed || this.finished) return;

    const needed = (this.witnessCount + 1) * 2;
    if (this.graceCount < needed) {
      this.talk(v.name, "🙏", [
        `Xin hãy thu thập thêm Ơn Thánh Thần quanh sân Đền Thờ (${this.graceCount}/${needed} Ơn Thánh cần cho phép lạ này) rồi quay lại giúp tôi nhé!`,
      ]);
      return;
    }

    v.blessed = true;
    this.witnessCount++;
    this.syncProgress();

    audio.sfx("bless");
    this.sparkleBurst(v.x, v.y - 14);
    v.glow.setTexture("glow_gold").setAlpha(0.85);

    // Villager leaps for joy!
    this.tweens.add({
      targets: v.sprite,
      y: v.y - 6,
      duration: 320,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeOut",
    });

    const quotes = [
      "Anh đứng phắt dậy, bước đi được; rồi cùng hai ông tiến vào Đền Thờ, vừa đi vừa nhảy nhót và ca tụng Thiên Chúa! (Cv 3, 8)",
      "Tạ ơn Chúa Giêsu Phục Sinh! Lời Chúa đã lấp đầy tâm hồn con bằng niềm vui và bình an!",
      "Alleluia! Nhờ quyền năng Chúa Thánh Thần, con đã được chữa lành để làm chứng nhân Tin Mừng!",
    ];

    this.talk(v.name, "🙌", [quotes[idx] ?? quotes[0]], () => {
      if (this.witnessCount >= WITNESS_GOAL && this.graceCount >= GRACE_GOAL) {
        this.finishStage();
      }
    });
  }

  private talkToApostles() {
    if (this.witnessCount < WITNESS_GOAL || this.graceCount < GRACE_GOAL) {
      this.talk("Thánh Phê-rô & Gio-an", "🕊️", [
        "“Vàng bạc thì tôi không có; nhưng cái tôi có, tôi cho anh đây: nhân danh Đức Giêsu Kitô người Na-da-rét, anh hãy đứng dậy mà đi!” (Cv 3, 6)",
        `Con hãy thu thập đủ ${GRACE_GOAL} Ơn Thánh (${this.graceCount}/${GRACE_GOAL}) và trao cho cả ${WITNESS_GOAL} người đang đợi (${this.witnessCount}/${WITNESS_GOAL}) nhé!`,
      ]);
      return;
    }
    this.finishStage();
  }

  private finishStage() {
    if (this.finished) return;
    this.finished = true;
    audio.sfx("angel");
    this.sparkleBurst(320, 128);
    this.time.delayedCall(400, () =>
      this.completeInterlude(
        "CHẶNG ĐỆM B6",
        "Phép Lạ Cửa Đẹp & Chứng Nhân Tin Mừng (Cv 3, 1-10)",
        "Can đảm chia sẻ niềm vui và tình thương của Chúa Giêsu cho mọi người xung quanh.",
        "Khắp sân Đền Thờ vang dội tiếng ca khen Thiên Chúa! Giờ đây chúng ta cùng bước vào Chặng 19 chiêm ngắm Đức Mẹ Lên Trời nhé!"
      )
    );
  }

  update() {
    super.update();
    if (this.finished || !this.player) return;

    // Collect Grace Sparks on touch
    for (const s of this.sparks) {
      if (s.collected) continue;
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, s.sprite.x, s.sprite.y) < 28) {
        s.collected = true;
        audio.sfx("pickup");
        this.sparkleBurst(s.sprite.x, s.sprite.y);
        s.sprite.destroy();
        s.glow.destroy();
        this.graceCount++;
        this.syncProgress();
      }
    }
  }
}
