import * as Phaser from "phaser";
import audio from "@/modules/shared/game/audio/AudioManager";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAllForGlory } from "@/modules/the-rosary-adventures/game/utils/gloryTextureGenerator";
import { loadGame } from "@/modules/the-rosary-adventures/utils/saveManager";
import { t as tx } from "@/modules/shared/i18n";

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
      speaker: tx("Thiên Cung", "The Heavenly Palace"),
      emoji: "👑",
      lines: [
        tx("Mầu Nhiệm Thứ Năm Năm Sự Mừng: Đức Chúa Trời Thưởng Đức Mẹ Trên Trời (Kh 12, 1-2).", "Fifth Glorious Mystery: The Coronation of Mary in Heaven (Rev 12:1-2)."),
        tx("Thiên cung rực rỡ ánh sáng. Ba Ngôi Chí Thánh và triều đình thiên quốc cùng ca hát vang dội.", "The heavenly palace shines with light. The Holy Trinity and the heavenly court sing together in joy."),
        tx("Hãy đặt 19 hạt mầu nhiệm bạn đã thu thập vào vòng triều thiên, rồi nhặt hạt thứ 20 đặt lên đỉnh nhé.", "Place the 19 mystery beads you collected onto the crown, then pick up the 20th and set it on top."),
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
        label: () => (!this.ringFilled ? tx("[A] Đặt 19 hạt vào vòng triều thiên", "[A] Place the 19 beads on the crown") : this.held ? tx("[A] Đặt hạt thứ 20 lên đỉnh", "[A] Place the 20th bead on top") : tx("Vòng triều thiên", "The crown")),
        active: () => !this.crowned,
        act: () => this.ring(),
      },
      {
        at: () => BEAD20_AT,
        r: 34,
        label: () => tx("[A] Nhặt hạt Mân Côi thứ 20", "[A] Pick up the 20th Rosary bead"),
        active: () => !this.crowned && this.lootActive("bead20"),
        act: () => this.takeLoot("bead20"),
      },
      {
        at: () => [this.mary.x, this.mary.y],
        r: 46,
        label: () => tx("[A] Đức Mẹ Maria", "[A] Mother Mary"),
        active: () => !this.done,
        act: () =>
          this.talk(tx("Đức Mẹ Maria", "Mother Mary"), "💙", [
            tx("Con ơi, Mẹ vui lắm khi thấy con lần hạt Mân Côi mỗi ngày.", "My child, I am so happy to see you pray the Rosary every day."),
            tx("Mẹ luôn cầu bầu cho con trước mặt Chúa. Hãy hoàn tất chuỗi hạt nhé.", "I always intercede for you before God. Finish the Rosary now."),
          ]),
      },
      {
        at: () => [this.father.x, this.father.y],
        r: 46,
        label: () => tx("[A] Chúa Cha", "[A] God the Father"),
        active: () => !this.done,
        act: () => this.talk(tx("Chúa Cha", "God the Father"), "🌟", [tx("Đây là Con yêu dấu của Ta. Ta rất hài lòng về Con. (Mt 3, 17)", "This is my beloved Son. With Him I am well pleased. (Mt 3:17)"), tx("Ta đã chuẩn bị triều thiên cho Mẹ của Con.", "I have prepared a crown for the Mother of My Son.")]),
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
      this.talk(tx("Vòng triều thiên", "The crown"), "👑", [tx("Còn một chỗ trống trên đỉnh vòng. Hãy nhặt hạt Mân Côi thứ 20 trong thiên cung nhé.", "One place is still empty at the top of the crown. Pick up the 20th Rosary bead in the heavenly palace.")]);
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
      this.talk(tx("Chuỗi Mân Côi", "The Rosary"), "📿", [
        tx(`19 hạt mầu nhiệm xoay thành vòng: ${Math.max(have, 15)} hạt đã thắp sáng trong hành trình của bạn.`, `19 mystery beads swirl into a ring: ${Math.max(have, 15)} beads lit during your journey.`),
        tx("Còn một chỗ trống ở đỉnh vòng. Hãy nhặt hạt thứ 20 đặt lên đó.", "One place is still empty at the top of the ring. Pick up the 20th bead and set it there."),
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
        tx("Thiên Cung", "The Heavenly Palace"),
        "👑",
        [
          tx("Chúa Cha và Chúa Con đội triều thiên mười hai ngôi sao lên đầu Mẹ Maria. (Kh 12, 1)", "The Father and the Son place a crown of twelve stars on Mary's head. (Rev 12:1)"),
          tx("Mẹ là Nữ Vương Thiên Đàng, áo mặc mặt trời, vầng trăng dưới chân.", "She is the Queen of Heaven, clothed with the sun, the moon under her feet."),
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
        tx("Chúa Giêsu", "Jesus"),
        "✝️",
        [
          tx("Chúa Giêsu mỉm cười, xoa đầu con.", "Jesus smiles and pats your head."),
          tx("'Con đã hoàn thành cuộc hành trình đức tin. Hãy giữ vững lời dạy này trong trái tim con và mang tình yêu thương ấy về trần gian mỗi ngày.'", "‘You have finished your journey of faith. Hold these teachings firmly in your heart and bring that love back to the world every day.’"),
        ],
        () => this.finish()
      );
  }

  private finish() {
    this.time.delayedCall(300, () =>
      this.complete(
        5,
        tx("Năm Sự Mừng", "Glorious"),
        tx("Đức Chúa Trời Thưởng Đức Mẹ Trên Trời", "The Coronation of Mary in Heaven"),
        tx("Trọn niềm cậy trông vào vinh phúc Nước Trời và tôn kính Mẹ là Nữ Vương Thiên Đàng.", "Full hope in the happiness of God's Kingdom and honor to Mary, Queen of Heaven."),
        tx("Bạn đã hoàn tất chuỗi Mân Côi 20 mầu nhiệm! Hãy tiếp tục lần hạt mỗi ngày với Mẹ Maria nhé.", "You finished the 20-mystery Rosary! Keep praying the Rosary every day with Mother Mary."),
        ["twenty_beads", "crown_of_twelve_stars", "jesus_blessing"]
      )
    );
  }
}
