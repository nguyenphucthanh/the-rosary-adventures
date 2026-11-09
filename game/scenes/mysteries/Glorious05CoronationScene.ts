import * as Phaser from "phaser";
import audio from "../../audio/AudioManager";
import { DEPTH } from "../BaseMysteryScene";
import { InteractiveScene } from "../InteractiveScene";
import { registerAllForGlory } from "../../utils/gloryTextureGenerator";
import { loadGame } from "@/utils/saveManager";

const W = 640;
const H = 600;
const MARY_AT: [number, number] = [320, 210];
const FATHER_AT: [number, number] = [240, 170];
const JESUS_AT: [number, number] = [400, 170];
const SPIRIT_AT: [number, number] = [320, 84];
const RING_AT: [number, number] = [320, 340]; // centre of the crown ring
const RING_R = 27;
const BEAD20_AT: [number, number] = [110, 500];

/** Slot i of 20 around the ring; slot 0 is the very top, reserved for the 20th bead. */
const slot = (i: number): [number, number] => {
  const a = (i / 20) * Math.PI * 2 - Math.PI / 2;
  return [Math.round(RING_AT[0] + Math.cos(a) * RING_R), Math.round(RING_AT[1] + Math.sin(a) * RING_R)];
};

export class Glorious05CoronationScene extends InteractiveScene {
  private ringFilled = false;
  private crowned = false;
  private done = false;
  private father!: Phaser.GameObjects.Sprite;
  private jesus!: Phaser.GameObjects.Sprite;
  private mary!: Phaser.GameObjects.Sprite;
  private dove!: Phaser.GameObjects.Sprite;
  private doveGlow!: Phaser.GameObjects.Image;
  private maryHint!: Phaser.GameObjects.Image;

  constructor() {
    super("Glorious05CoronationScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAllForGlory(this);
    this.resetCarry();
    this.walkers = [];
    this.ringFilled = this.crowned = this.done = false;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildHeaven();
    this.buildCourt();
    this.defineInteractables();

    this.begin("mung_05_doi_trieu_thien", [320, 540], {
      speaker: "Thiên Cung",
      emoji: "👑",
      lines: [
        "Mầu Nhiệm Thứ Năm Năm Sự Mừng: Đức Chúa Trời Thưởng Đức Mẹ Trên Trời (Kh 12, 1-2).",
        "Thiên cung rực rỡ ánh sáng. Ba Ngôi Chí Thánh và triều đình thiên quốc cùng ca hát vang dội.",
        "Hãy đặt 19 hạt mầu nhiệm bạn đã thu thập vào vòng triều thiên, rồi nhặt hạt thứ 20 đặt lên đỉnh nhé.",
      ],
    });
  }

  // ---------- world ----------

  private buildHeaven() {
    this.add.tileSprite(0, 0, W, H, "cloud_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(200, 130, 240, 400, "gold_tile").setOrigin(0).setDepth(DEPTH.RUG);
    this.edgeWalls(W, H);
    for (const x of [60, 580]) {
      for (const y of [120, 300, 480]) {
        this.prop(x, y, "temple_pillar", 14, 8).setTint(0xfef3c7);
      }
    }
    // the light of the heavenly court
    const halo = this.add.image(W / 2, 150, "glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.45);
    this.tweens.add({ targets: halo, alpha: 0.7, duration: 2000, yoyo: true, repeat: -1 });
    this.prop(RING_AT[0], RING_AT[1] + 48, "pedestal", 40, 10);
    this.add.image(RING_AT[0], RING_AT[1], "crown_ring").setDepth(RING_AT[1] + 48).setAlpha(0.9);
  }

  private buildCourt() {
    const person = (key: string, [x, y]: [number, number]) => {
      const s = this.add.sprite(x, y, key).setOrigin(0.5, 1).setDepth(y);
      this.block(x, y - 4, 14, 8);
      return s;
    };
    this.father = person("god_father", FATHER_AT);
    this.jesus = person("jesus_risen", JESUS_AT);
    this.mary = person("mary_glory", MARY_AT);
    const dove = (this.dove = this.add.sprite(SPIRIT_AT[0], SPIRIT_AT[1], "holy_spirit_dove").setDepth(DEPTH.FX).play("spirit_flap"));
    this.tweens.add({ targets: dove, originY: 0.5 + 4 / 32, duration: 800, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    this.doveGlow = this.add.image(SPIRIT_AT[0], SPIRIT_AT[1], "glow_gold").setDepth(DEPTH.FX - 1).setAlpha(0.5);
    // angel choir and saints
    [[130, 250], [510, 250], [150, 420], [490, 420], [100, 150], [540, 150]].forEach(([x, y], i) => {
      const a = this.add.sprite(x, y, "archangel_gabriel").setOrigin(0.5, 1).setDepth(y).play("angel_flap");
      this.tweens.add({ targets: a, y: y - 4, duration: 900, yoyo: true, repeat: -1, delay: i * 120, ease: "Stepped", easeParams: [3] });
    });
    [["peter", 170, 360], ["andrew", 470, 360], ["moses", 130, 330], ["elijah", 510, 330]].forEach(([k, x, y]) => {
      this.add.sprite(x as number, y as number, k as string).setOrigin(0.5, 1).setDepth(y as number);
    });
    this.maryHint = this.hint(MARY_AT[0], MARY_AT[1] - 38);
  }

  private defineInteractables() {
    this.spawnLoot("bead20", BEAD20_AT[0], BEAD20_AT[1], "bead_gold");
    this.interactables = [
      {
        at: () => [RING_AT[0], RING_AT[1] + 30],
        r: 50,
        label: () => (!this.ringFilled ? "[A] Đặt 19 hạt vào vòng triều thiên" : this.held ? "[A] Đặt hạt thứ 20 lên đỉnh" : "Vòng triều thiên"),
        active: () => !this.crowned,
        act: () => this.ring(),
      },
      {
        at: () => BEAD20_AT,
        r: 34,
        label: () => "[A] Nhặt hạt Mân Côi thứ 20",
        active: () => !this.crowned && this.lootActive("bead20"),
        act: () => this.takeLoot("bead20"),
      },
      {
        at: () => [this.mary.x, this.mary.y],
        r: 46,
        label: () => "[A] Đức Mẹ Maria",
        active: () => !this.done,
        act: () =>
          this.talk("Đức Mẹ Maria", "💙", [
            "Con ơi, Mẹ vui lắm khi thấy con lần hạt Mân Côi mỗi ngày.",
            "Mẹ luôn cầu bầu cho con trước mặt Chúa. Hãy hoàn tất chuỗi hạt nhé.",
          ]),
      },
      {
        at: () => [this.father.x, this.father.y],
        r: 46,
        label: () => "[A] Chúa Cha",
        active: () => !this.done,
        act: () => this.talk("Chúa Cha", "🌟", ["Đây là Con yêu dấu của Ta. Ta rất hài lòng về Con. (Mt 3, 17)", "Ta đã chuẩn bị triều thiên cho Mẹ của Con."]),
      },
    ];
  }

  // ---------- quest ----------

  private ring() {
    if (!this.ringFilled) {
      this.fillRing();
      return;
    }
    if (!this.held) {
      this.talk("Vòng triều thiên", "👑", ["Còn một chỗ trống trên đỉnh vòng. Hãy nhặt hạt Mân Côi thứ 20 trong thiên cung nhé."]);
      return;
    }
    this.crowned = true;
    this.dropItem();
    const [x, y] = slot(0);
    this.placeBead(0, x, y, "bead_gold", 0);
    this.time.delayedCall(700, () => this.stage());
  }

  private placeBead(i: number, x: number, y: number, key: string, delay: number) {
    const b = this.add.image(x, y - 16, key).setDepth(RING_AT[1] + 49).setAlpha(0);
    this.tweens.add({ targets: b, y, alpha: 1, duration: 260, delay, ease: "Stepped", easeParams: [4] });
    if (i % 5 === 0) this.time.delayedCall(delay, () => this.sparkleBurst(x, y));
  }

  private fillRing() {
    this.ringFilled = true;
    const done = loadGame()?.mysteriesProgress ?? {};
    const have = Object.values(done).filter((p) => p.beadLit).length;
    for (let i = 1; i < 20; i++) {
      const [x, y] = slot(i);
      this.placeBead(i, x, y, i % 5 === 0 ? "bead_gold" : "bead_white", i * 90);
    }
    this.time.delayedCall(19 * 90 + 500, () =>
      this.talk("Chuỗi Mân Côi", "📿", [
        `19 hạt mầu nhiệm xoay thành vòng: ${Math.max(have, 15)} hạt đã thắp sáng trong hành trình của bạn.`,
        "Còn một chỗ trống ở đỉnh vòng. Hãy nhặt hạt thứ 20 đặt lên đó.",
      ])
    );
  }

  /** Player steps down; the Holy Trinity court and Mary gather in the middle of the view. */
  private stage() {
    const p = this.player;
    p.setMovementLock(true);
    p.play(`player-walk-${p.x > 320 ? "left" : "right"}`, true);
    this.tweens.add({ targets: p, x: 320, y: 470, duration: 700, onComplete: () => p.play("player-idle-up", true) });
    const cam = this.cameras.main;
    cam.fadeOut(400, 255, 255, 255);
    cam.once("camerafadeoutcomplete", () => {
      this.maryHint.destroy();
      this.mary.setPosition(320, 412).setDepth(412);
      this.father.setPosition(250, 404);
      this.jesus.setPosition(390, 404);
      this.dove.setPosition(320, 350);
      this.doveGlow.setPosition(320, 350);
      cam.fadeIn(400, 255, 255, 255);
      this.time.delayedCall(900, () => this.crown());
    });
  }

  /** The Father and the Son step up to Mary and set the crown on her head. */
  private crown() {
    this.walkers.push(this.father, this.jesus);
    const y = this.mary.y - 6;
    this.walk(this.father, [[this.mary.x - 30, y]]);
    this.walk(this.jesus, [[this.mary.x + 30, y]], () => {
      const crown = this.add.image(this.mary.x, y - 52, "crown_small").setOrigin(0.5, 1).setDepth(DEPTH.FX).setAlpha(0);
      this.tweens.add({ targets: crown, alpha: 1, duration: 500 });
      this.tweens.add({
        targets: crown,
        y: this.mary.y - 30,
        duration: 900,
        delay: 700,
        ease: "Stepped",
        easeParams: [6],
        onComplete: () => this.glorify(),
      });
    });
  }

  private glorify() {
    const cam = this.cameras.main;
    cam.flash(900, 255, 255, 220);
    // twelve stars above Mary's head, the moon at her feet, the sun around her
    const sun = this.add.image(this.mary.x, this.mary.y - 20, "glow_gold").setDepth(this.mary.y - 1).setAlpha(0).setTint(0xfef08a);
    this.tweens.add({ targets: sun, alpha: 1, duration: 1400 });
    const moon = this.add.image(this.mary.x, this.mary.y + 2, "icon_west").setDepth(this.mary.y + 1).setAlpha(0);
    this.tweens.add({ targets: moon, alpha: 1, duration: 1400 });
    for (let i = 0; i < 12; i++) {
      const a = Math.PI + (i / 11) * Math.PI;
      const x = Math.round(this.mary.x + Math.cos(a) * 20);
      const y = Math.round(this.mary.y - 40 + Math.sin(a) * 14);
      const s = this.add.image(x, y, i % 3 === 0 ? "star_m" : "star_s").setDepth(DEPTH.FX).setAlpha(0);
      this.tweens.add({ targets: s, alpha: 1, duration: 400, delay: 500 + i * 140 });
      this.tweens.add({ targets: s, alpha: 0.5, duration: 700, yoyo: true, repeat: -1, delay: 2200 + i * 90 });
    }
    this.time.delayedCall(2600, () =>
      this.talk(
        "Thiên Cung",
        "👑",
        [
          "Chúa Cha và Chúa Con đội triều thiên mười hai ngôi sao lên đầu Mẹ Maria. (Kh 12, 1)",
          "Mẹ là Nữ Vương Thiên Đàng, áo mặc mặt trời, vầng trăng dưới chân.",
        ],
        () => this.jesusSpeaks()
      )
    );
  }

  private jesusSpeaks() {
    this.done = true;
    const jesus = this.jesus;
    // player and Jesus stand side by side in front of the crown to talk
    const p = this.player;
    const footY = p.y + 16; // player.y is the body centre
    this.walk(jesus, [[jesus.x, footY], [p.x + 32, footY]], () => this.blessPlayer());
  }

  private blessPlayer() {
    audio.sfx("bless");
    this.talk(
        "Chúa Giêsu",
        "✝️",
        [
          "Chúa Giêsu mỉm cười, xoa đầu con.",
          "'Con đã hoàn thành cuộc hành trình đức tin. Hãy giữ vững lời dạy này trong trái tim con và mang tình yêu thương ấy về trần gian mỗi ngày.'",
        ],
        () => this.finish()
      );
  }

  private finish() {
    this.time.delayedCall(300, () =>
      this.complete(
        5,
        "Năm Sự Mừng",
        "Đức Chúa Trời Thưởng Đức Mẹ Trên Trời",
        "Trọn niềm cậy trông vào vinh phúc Nước Trời và tôn kính Mẹ là Nữ Vương Thiên Đàng.",
        "Bạn đã hoàn tất chuỗi Mân Côi 20 mầu nhiệm! Hãy tiếp tục lần hạt mỗi ngày với Mẹ Maria nhé.",
        ["twenty_beads", "crown_of_twelve_stars", "jesus_blessing"]
      )
    );
  }
}
