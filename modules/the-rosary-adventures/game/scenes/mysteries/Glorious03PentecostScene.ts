import * as Phaser from "phaser";
import audio from "@/modules/shared/game/audio/AudioManager";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAllForGlory } from "@/modules/the-rosary-adventures/game/utils/gloryTextureGenerator";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 480;
const WALL_H = 64;
const MARY_AT: [number, number] = [320, 270];
const DOOR_AT: [number, number] = [320, H - 16];
const APOSTLES = ["peter", "andrew", "james", "john_apostle", "apostle_a", "apostle_b", "apostle_c", "apostle_d", "apostle_e", "apostle_f", "hungry", "prisoner"];

/** Seven candles = seven gifts of the Holy Spirit. */
const GIFTS = [
  { name: tx("Khôn ngoan", "Wisdom"), at: [110, 150], line: tx("Ơn Khôn ngoan giúp con yêu mến những điều của Thiên Chúa hơn mọi thứ trên đời.", "The gift of Wisdom helps you love the things of God above everything in the world.") },
  { name: tx("Thông hiểu", "Understanding"), at: [230, 128], line: tx("Ơn Thông hiểu giúp con hiểu Lời Chúa và những điều Chúa dạy.", "The gift of Understanding helps you grasp God's Word and what He teaches.") },
  { name: tx("Lo liệu", "Counsel"), at: [410, 128], line: tx("Ơn Lo liệu giúp con biết chọn điều tốt và làm đúng ý Chúa.", "The gift of Counsel helps you choose what is good and do what God wants.") },
  { name: tx("Sức mạnh", "Fortitude"), at: [530, 150], line: tx("Ơn Sức mạnh (Dũng cảm) giúp con can đảm làm điều tốt, dù khó khăn.", "The gift of Fortitude (Courage) helps you do good bravely, even when it is hard.") },
  { name: tx("Hiểu biết", "Knowledge"), at: [90, 330], line: tx("Ơn Hiểu biết giúp con nhận ra Chúa qua mọi người, mọi việc.", "The gift of Knowledge helps you recognize God through every person and every event.") },
  { name: tx("Đạo đức", "Piety"), at: [550, 330], line: tx("Ơn Đạo đức giúp con yêu mến Chúa Cha và siêng năng cầu nguyện.", "The gift of Piety helps you love God the Father and be faithful in prayer.") },
  { name: tx("Kính sợ", "Fear of the Lord"), at: [320, 380], line: tx("Ơn Kính sợ giúp con biết kính trọng Chúa và không muốn làm Người buồn.", "The gift of Fear of the Lord helps you respect God and never want to make Him sad.") },
] as { name: string; at: [number, number]; line: string }[];

export class Glorious03PentecostScene extends InteractiveScene {
  private lit = new Set<number>();
  private done = false;
  private shade!: Phaser.GameObjects.Rectangle;
  private people: Phaser.GameObjects.Sprite[] = [];

  constructor() {
    super("Glorious03PentecostScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAllForGlory(this);
    this.resetCarry();
    this.walkers = [];
    this.people = [];
    this.lit = new Set();
    this.done = false;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildRoom();
    this.buildPeople();
    this.defineInteractables();

    this.begin("mung_03_thanh_than_hien_xuong", [320, 430], {
      speaker: tx("Phòng Tiệc Ly", "The Upper Room"),
      emoji: "🔥",
      lines: [
        tx("Mầu Nhiệm Thứ Ba Năm Sự Mừng: Đức Chúa Thánh Thần Hiện Xuống Trên Các Tông Đồ (Cv 2, 1-13).", "Third Glorious Mystery: The Holy Spirit Descends on the Apostles (Acts 2:1-13)."),
        tx("Cửa phòng đóng kín vì sợ hãi. Đức Mẹ và các Tông đồ cùng nhau cầu nguyện, chờ Đấng Bảo Trợ.", "The doors are shut for fear. Our Lady and the Apostles pray together, waiting for the Advocate."),
        tx("Căn phòng còn tối và buồn. Hãy thắp bảy ngọn nến, tượng trưng cho bảy ơn Chúa Thánh Thần nhé.", "The room is still dark and sad. Light seven candles for the seven gifts of the Holy Spirit."),
      ],
    });
  }

  // ---------- world ----------

  private buildRoom() {
    this.add.tileSprite(0, 0, W, H, "floor_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(200, 180, 240, 200, "rug_tile").setOrigin(0).setDepth(DEPTH.RUG);
    this.edgeWalls(W, H);
    this.add.tileSprite(0, 0, W, WALL_H, "stone_wall").setOrigin(0).setDepth(DEPTH.WALL - 1);
    this.block(W / 2, WALL_H / 2, W, WALL_H);
    for (const x of [140, 500]) this.add.image(x, 6, "window_arch").setOrigin(0.5, 0).setDepth(DEPTH.WALL);
    // the closed door, bolted from inside
    this.door = this.add.rectangle(DOOR_AT[0], H - 4, 44, 36, 0x7a4a22).setOrigin(0.5, 1).setDepth(DEPTH.WALL);
    this.add.rectangle(DOOR_AT[0], H - 4, 44, 4, 0x5b2a0c).setOrigin(0.5, 1).setDepth(DEPTH.WALL + 1);
    this.doorBlock = this.add.rectangle(DOOR_AT[0], H - 16, 44, 16);
    this.obstacles.add(this.doorBlock);
    for (const [x, y] of [[40, 190], [600, 190], [40, 440], [600, 440]]) this.prop(x, y, "olive_pot", 14, 8);
    this.prop(60, 100, "menorah", 20, 8);
    this.prop(580, 100, "menorah", 20, 8);
    this.prop(200, 100, "clay_jar", 10, 6);
    this.prop(440, 100, "clay_jar", 10, 6);
    // gloomy until the candles are lit
    this.shade = this.add.rectangle(0, 0, W, H, 0x0b1020, 0.7).setOrigin(0).setDepth(DEPTH.FX - 5);
  }

  private door!: Phaser.GameObjects.Rectangle;
  private doorBlock!: Phaser.GameObjects.Rectangle;

  private buildPeople() {
    const mary = this.add.sprite(MARY_AT[0], MARY_AT[1], "mary_praying").setOrigin(0.5, 1).setDepth(MARY_AT[1]);
    this.people.push(mary);
    this.block(MARY_AT[0], MARY_AT[1] - 4, 14, 8);
    // eleven apostles + Matthias around Mary in a ring
    APOSTLES.forEach((k, i) => {
      const a = (i / APOSTLES.length) * Math.PI * 2 - Math.PI / 2;
      const x = Math.round(MARY_AT[0] + Math.cos(a) * 92);
      const y = Math.round(MARY_AT[1] - 8 + Math.sin(a) * 66);
      this.people.push(this.add.sprite(x, y, k).setOrigin(0.5, 1).setDepth(y));
      this.block(x, y - 4, 14, 8);
    });
    this.hint(MARY_AT[0], MARY_AT[1] - 38);
  }

  private defineInteractables() {
    for (const [i, g] of GIFTS.entries()) {
      this.add.image(g.at[0], g.at[1], "candle_holder").setOrigin(0.5, 1).setDepth(g.at[1]);
      this.add
        .text(g.at[0], g.at[1] + 4, g.name, { fontFamily: "'Dearpix', monospace", fontSize: "20px", color: "#fef08a", resolution: 4 })
        .setOrigin(0.5, 0)
        .setDepth(DEPTH.FX);
      this.interactables.push({
        at: () => [g.at[0], g.at[1] + 8],
        r: 32,
        label: () => tx(`[A] Thắp nến ơn ${g.name}`, `[A] Light the candle of ${g.name}`),
        active: () => !this.lit.has(i),
        act: () => this.light(i),
      });
    }
    this.interactables.push({
      at: () => MARY_AT,
      r: 44,
      label: () => tx("[A] Đức Mẹ Maria", "[A] Mother Mary"),
      active: () => !this.done,
      act: () =>
        this.talk(tx("Đức Mẹ Maria", "Mother Mary"), "💙", [
          tx("Mẹ cùng các Tông đồ chuyên cần cầu nguyện, chờ đợi Đấng Chúa Giêsu đã hứa. (Cv 1, 14)", "Mary and the Apostles pray constantly, waiting for the One Jesus promised. (Acts 1:14)"),
          tx(`Con đã thắp ${this.lit.size}/7 ngọn nến. Hãy thắp đủ bảy ơn Thánh Thần nhé.`, `You lit ${this.lit.size}/7 candles. Light all seven gifts of the Spirit.`),
        ]),
    });
  }

  // ---------- quest ----------

  private light(i: number) {
    const g = GIFTS[i];
    this.lit.add(i);
    const [x, y] = g.at;
    this.add.sprite(x, y - 8, "candle_flame").setOrigin(0.5, 1).setDepth(y + 1).play("candle_burn");
    const glow = this.add.image(x, y - 16, "glow_small").setDepth(DEPTH.LIGHT).setAlpha(0.7);
    this.tweens.add({ targets: glow, alpha: 0.4, duration: 600, yoyo: true, repeat: -1 });
    this.sparkleBurst(x, y - 18);
    this.shade.setAlpha(Math.max(0.1, 0.7 - this.lit.size * 0.08));
    const last = this.lit.size === GIFTS.length;
    this.talk(tx(`Ơn ${g.name}`, `Gift of ${g.name}`), "🕯️", [g.line], last ? () => this.pentecost() : undefined);
  }

  private pentecost() {
    this.done = true;
    const cam = this.cameras.main;
    cam.shake(1600, 0.004);
    // wind rushes through the room
    audio.sfx("whoosh");
    for (let i = 0; i < 8; i++) {
      const gust = this.add.image(-40, 90 + i * 44, "wind_gust").setDepth(DEPTH.FX - 3).setAlpha(0.8);
      this.tweens.add({ targets: gust, x: W + 40, duration: 1400, delay: i * 180, ease: "Stepped", easeParams: [12], repeat: 1 });
    }
    // tongues of fire settle on every head
    this.time.delayedCall(1200, () => {
      for (const p of this.people) {
        const f = this.add.image(p.x, p.y - 34, "fire_tongue").setOrigin(0.5, 1).setDepth(DEPTH.FX).setAlpha(0);
        this.tweens.add({ targets: f, alpha: 1, y: f.y - 3, duration: 600 });
        this.tweens.add({ targets: f, y: f.y - 4, duration: 500, yoyo: true, repeat: -1, delay: 700, ease: "Stepped", easeParams: [2] });
      }
      cam.flash(700, 255, 230, 140);
      this.shade.setAlpha(0);
    });
    this.time.delayedCall(2600, () =>
      this.talk(
        tx("Thánh Kinh", "Scripture"),
        "🔥",
        [
          tx("Bỗng có tiếng từ trời như tiếng gió mạnh ùa vào, và những hình lưỡi lửa đậu xuống trên từng người. (Cv 2, 2-3)", "Suddenly a sound came from heaven like a strong wind rushing in, and tongues of fire rested on each of them. (Acts 2:2-3)"),
          tx("Tất cả được đầy Thánh Thần và bắt đầu nói các thứ tiếng khác nhau.", "All were filled with the Holy Spirit and began to speak in different languages."),
          tx("Cửa phòng mở tung! Các Tông đồ mạnh dạn bước ra loan báo Tin Mừng.", "The doors fly open! The Apostles step out boldly to proclaim the Good News."),
        ],
        () => this.openDoor()
      )
    );
  }

  private openDoor() {
    this.door.setFillStyle(0x1e293b);
    audio.sfx("door");
    this.doorBlock.destroy();
    this.cameras.main.flash(400, 255, 255, 255);
    const out = this.people.slice(1);
    out.forEach((p, i) => this.time.delayedCall(i * 160, () => this.walk(p, [[DOOR_AT[0], H - 52], [DOOR_AT[0], H + 12]])));
    this.time.delayedCall(out.length * 160 + 1800, () =>
      this.talk(
        tx("Lữ khách từ muôn nơi", "Pilgrims from everywhere"),
        "🌍",
        [
          tx("Ai nấy đều nghe các Tông đồ nói bằng tiếng của xứ mình! 'Chúng ta nghe họ nói lên những kỳ công của Thiên Chúa.' (Cv 2, 11)", "Everyone heard the Apostles speaking in their own language! ‘We hear them proclaiming the mighty works of God.’ (Acts 2:11)"),
          tx("Chúa Thánh Thần ban cho chúng ta can đảm làm chứng cho đức tin.", "The Holy Spirit gives us courage to witness to our faith."),
        ],
        () => this.finish()
      )
    );
  }

  private finish() {
    this.time.delayedCall(300, () =>
      this.complete(
        3,
        tx("Năm Sự Mừng", "Glorious"),
        tx("Đức Chúa Thánh Thần Hiện Xuống Trên Các Tông Đồ", "The Holy Spirit Descends on the Apostles"),
        tx("Xin ơn Chúa Thánh Thần soi sáng và can đảm sống chứng nhân cho đức tin.", "Ask the Holy Spirit to enlighten you and give you the courage to live as a witness of faith."),
        tx("Chúa Thánh Thần ở trong con từ ngày con lãnh Phép Rửa. Hãy xin Người giúp con can đảm nói về Chúa Giêsu nhé!", "The Holy Spirit has been in you since your Baptism. Ask Him to help you bravely speak about Jesus!"),
        ["light_seven_gifts", "pentecost_fire"]
      )
    );
  }
}
