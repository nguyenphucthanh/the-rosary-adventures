import * as Phaser from "phaser";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAnnunciationTextures } from "@/modules/the-rosary-adventures/game/utils/npcTextureGenerator";
import { registerVisitationTextures } from "@/modules/the-rosary-adventures/game/utils/visitationTextureGenerator";
import { registerInfancyTextures } from "@/modules/the-rosary-adventures/game/utils/infancyTextureGenerator";
import { t as tx } from "@/modules/shared/i18n";

const W = 800;
const H = 600;
const WALL = 48;
const CAP = 16;
const PERCHES: [number, number][] = [[150, 340], [650, 350], [240, 540], [610, 530], [90, 220], [720, 230]];
const JOSEPH_AT: [number, number] = [230, 430];
const MARY_AT: [number, number] = [362, 500];
const SIMEON_AT: [number, number] = [400, 214];
const ANNA_AT: [number, number] = [520, 250];

export class Joyful04PresentationScene extends InteractiveScene {
  private dove!: Phaser.GameObjects.Sprite;
  private doveGlow!: Phaser.GameObjects.Image;
  private baby!: Phaser.GameObjects.Image;
  private joseph!: Phaser.GameObjects.Sprite;
  private mary!: Phaser.GameObjects.Sprite;
  private anna!: Phaser.GameObjects.Sprite;

  private perch = 0;
  private flees = 0;
  private hasDove = false;
  private doveDelivered = false;
  private hasBaby = false;
  private finished = false;

  constructor() {
    super("Joyful04PresentationScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAnnunciationTextures(this);
    registerVisitationTextures(this);
    registerInfancyTextures(this);
    this.perch = this.flees = 0;
    this.hasDove = this.doveDelivered = this.hasBaby = this.finished = false;
    this.walkers = [];

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildHall();
    this.buildProps();
    this.buildCharacters();
    this.buildLight();
    this.defineInteractables();

    this.begin("vui_04_dang_chua", [400, 560], {
      speaker: tx("Đền Thờ Giê-ru-sa-lem", "The Temple in Jerusalem"),
      emoji: "🏛️",
      lines: [
        tx("Mầu Nhiệm Thứ Tư: Đức Bà Dâng Đức Chúa Giêsu Vào Đền Thánh (Lc 2, 22-40).", "Fourth Mystery: The Presentation of Jesus in the Temple (Lk 2:22-40)."),
        tx("Theo luật Môsê, cha mẹ đem con đầu lòng lên dâng Chúa. Nhà nghèo thì dâng một đôi bồ câu non.", "By the Law of Moses, parents bring their firstborn to present to the Lord. A poor family offers a pair of young doves."),
        tx("Chú bồ câu của Thánh Giuse đã sổng mất! Hãy tìm và bắt lại chú bồ câu trắng nhé.", "Joseph's dove has escaped! Find and catch the white dove."),
      ],
    });
  }

  // ---------- world ----------

  private buildHall() {
    this.add.tileSprite(0, WALL, W, H - WALL, "floor_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 0, W, WALL, "wall_face").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 0, CAP, H, "wall_cap").setOrigin(0).setDepth(DEPTH.WALL);
    this.add.tileSprite(W - CAP, 0, CAP, H, "wall_cap").setOrigin(0).setDepth(DEPTH.WALL);
    this.add.tileSprite(0, H - CAP, W, CAP, "wall_cap").setOrigin(0).setDepth(DEPTH.WALL);

    // red processional rug with gold edging
    this.add.tileSprite(352, 180, 96, H - CAP - 180, "rug_tile").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(350, 180, 2, H - CAP - 180, 0xfbbf24).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(448, 180, 2, H - CAP - 180, 0xfbbf24).setOrigin(0).setDepth(DEPTH.RUG);

    // wall decor: windows, veils, shelf
    for (const x of [140, 400, 660]) this.add.image(x, 8, "window_arch").setOrigin(0.5, 0).setDepth(DEPTH.FLOOR);
    for (const x of [270, 530]) this.add.image(x, 0, "temple_veil").setOrigin(0.5, 0).setDepth(DEPTH.FLOOR);
    this.add.image(40, 14, "wall_shelf").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.image(720, 14, "wall_shelf").setOrigin(0).setDepth(DEPTH.FLOOR);

    this.edgeWalls(W, H);
    this.block(W / 2, WALL / 2, W, WALL + 16);
  }

  private buildProps() {
    this.prop(400, 170, "temple_altar", 56, 12);
    for (const dx of [-27, 27]) {
      if (!this.anims.exists("temple_flame_burn"))
        this.anims.create({ key: "temple_flame_burn", frames: this.anims.generateFrameNumbers("temple_flame", { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
      this.add.sprite(400 + dx, 134, "temple_flame").setOrigin(0.5, 1).setDepth(171).play("temple_flame_burn");
    }
    for (const x of [270, 530]) {
      this.prop(x, 160, "menorah", 20, 8);
      const g = this.add.image(x, 124, "glow_small").setDepth(DEPTH.FX - 1).setAlpha(0.5);
      this.tweens.add({ targets: g, alpha: 0.8, duration: 900, yoyo: true, repeat: -1 });
    }
    for (const [x, y] of [[150, 260], [650, 260], [150, 470], [650, 470]]) this.prop(x, y, "temple_pillar", 18, 10);
    for (const [x, y] of [[44, 120], [756, 120], [44, 560], [756, 560]]) this.prop(x, y, "olive_pot", 14, 8);
    this.prop(320, 330, "clay_jar", 12, 8);
    this.prop(480, 340, "clay_jar", 12, 8);
  }

  private buildCharacters() {
    this.add.sprite(...SIMEON_AT, "simeon").setOrigin(0.5, 1).setDepth(SIMEON_AT[1]);
    this.anna = this.add.sprite(...ANNA_AT, "anna").setOrigin(0.5, 1).setDepth(ANNA_AT[1]);
    this.joseph = this.add.sprite(...JOSEPH_AT, "joseph").setOrigin(0.5, 1).setDepth(JOSEPH_AT[1]);
    this.mary = this.add.sprite(...MARY_AT, "mary_praying").setOrigin(0.5, 1).setDepth(MARY_AT[1]);
    this.add.image(JOSEPH_AT[0] + 26, JOSEPH_AT[1], "bird_cage").setOrigin(0.5, 1).setDepth(JOSEPH_AT[1]);
    this.hint(SIMEON_AT[0], SIMEON_AT[1] - 36);
    this.hint(JOSEPH_AT[0], JOSEPH_AT[1] - 36);

    this.baby = this.add.image(0, 0, "baby").setOrigin(0.5, 1).setVisible(false);

    // the runaway dove
    if (!this.anims.exists("dove_flap"))
      this.anims.create({ key: "dove_flap", frames: this.anims.generateFrameNumbers("holy_spirit_dove", { start: 0, end: 1 }), frameRate: 8, repeat: -1 });
    const [px, py] = PERCHES[0];
    this.doveGlow = this.add.image(px, py - 8, "glow_small").setDepth(py - 1).setAlpha(0.6);
    this.tweens.add({ targets: this.doveGlow, alpha: 0.9, duration: 700, yoyo: true, repeat: -1 });
    this.dove = this.add.sprite(px, py, "holy_spirit_dove", 0).setOrigin(0.5, 1).setDepth(py);
    this.walkers.push(this.dove);
  }

  private buildLight() {
    const g = this.add.graphics().setDepth(3).fillStyle(0xfef08a, 0.09);
    for (const x of [140, 400, 660])
      g.fillPoints([{ x: x - 10, y: 40 }, { x: x + 10, y: 40 }, { x: x + 46, y: 320 }, { x: x - 34, y: 320 }], true);
  }

  // ---------- interaction ----------

  private defineInteractables() {
    this.interactables = [
      {
        at: () => [this.dove.x, this.dove.y],
        r: 40,
        label: () => tx("[A] Bắt chú bồ câu", "[A] Catch the dove"),
        active: () => !this.hasDove && this.flees >= 2,
        act: () => this.catchDove(),
      },
      {
        at: () => JOSEPH_AT,
        r: 44,
        label: () => (this.hasDove && !this.doveDelivered ? tx("[A] Đưa bồ câu cho Thánh Giuse", "[A] Give the dove to Saint Joseph") : tx("[A] Trò chuyện với Thánh Giuse", "[A] Talk to Saint Joseph")),
        active: () => !this.finished,
        act: () => (this.hasDove && !this.doveDelivered ? this.deliverDove() : this.talkToJoseph()),
      },
      {
        at: () => MARY_AT,
        r: 44,
        label: () => (this.doveDelivered && !this.hasBaby ? tx("[A] Bế Hài Nhi Giêsu", "[A] Carry the Baby Jesus") : tx("[A] Trò chuyện với Đức Mẹ", "[A] Talk to Mary")),
        active: () => !this.finished,
        act: () => (this.doveDelivered && !this.hasBaby ? this.takeBaby() : this.talkToMary()),
      },
      {
        at: () => SIMEON_AT,
        r: 52,
        label: () => (this.hasBaby ? tx("[A] Trao Hài Nhi cho cụ Simêon", "[A] Hand the Baby to Simeon") : tx("[A] Chào cụ Simêon", "[A] Greet Simeon")),
        active: () => !this.finished,
        act: () => (this.hasBaby ? this.simeonBlesses() : this.talkToSimeon()),
      },
      {
        at: () => ANNA_AT,
        r: 44,
        label: () => tx("[A] Chào bà Anna", "[A] Greet Anna"),
        active: () => !this.finished,
        act: () =>
          this.talk(tx("Bà Anna", "Anna"), "👵", [
            tx("Bà Anna là nữ ngôn sứ, đã 84 tuổi. Bà ngày đêm ở trong Đền Thờ, ăn chay và cầu nguyện. (Lc 2, 36-37)", "Anna was a prophetess, 84 years old. She stayed in the Temple day and night, fasting and praying. (Lk 2:36-37)"),
            tx("Bà mỉm cười: 'Chúa sắp cho chúng ta thấy điều kỳ diệu đấy, cháu ạ!'", "She smiles: ‘The Lord is about to show us something wonderful, dear child!’"),
          ]),
      },
    ];
  }

  update() {
    super.update();
    this.doveGlow.setPosition(this.dove.x, this.dove.y - 8).setDepth(this.dove.y - 1).setVisible(!this.hasDove);
    if (this.hasBaby && !this.finished && this.player) this.baby.setPosition(this.player.x, this.player.y - 12).setDepth(this.player.y + 17);

    // the dove startles twice, then tires and lets the child catch it
    if (!this.hasDove && this.flees < 2 && !this.dove.getData("flying") && this.player) {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.dove.x, this.dove.y) < 50) this.fleeDove();
    }
  }

  private fleeDove() {
    this.flees++;
    this.perch = (this.perch + 2) % PERCHES.length;
    const [x, y] = PERCHES[this.perch];
    this.dove.setData("flying", true).play("dove_flap");
    this.tweens.add({
      targets: this.dove,
      x,
      y,
      duration: 900,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.dove.stop().setFrame(0).setData("flying", false);
        if (this.flees === 2) this.hint(x, y - 22);
      },
    });
  }

  private catchDove() {
    this.hasDove = true;
    this.dove.setVisible(false);
    this.sparkleBurst(this.dove.x, this.dove.y - 8);
    this.talk(tx("Chú Bồ Câu", "The Dove"), "🕊️", [tx("Bạn nhẹ nhàng ôm lấy chú bồ câu trắng. Chú hiền lành nằm gọn trong tay bạn.", "You gently hold the white dove. It rests calmly in your hands."), tx("Hãy mang chú đến cho Thánh Giuse.", "Take it to Saint Joseph.")]);
  }

  private talkToJoseph() {
    this.talk(tx("Thánh Giuse", "Saint Joseph"), "🧔", [
      this.doveDelivered
        ? tx("Đôi bồ câu đã sẵn sàng. Con thật tốt bụng! Hãy giúp Mẹ đưa Hài Nhi đến cụ Simêon nhé.", "The pair of doves is ready. You are so kind! Help me bring the Baby to Simeon.")
        : tx("Luật Môsê dạy người nghèo dâng một đôi chim gáy hoặc đôi bồ câu non. (Lc 2, 24)", "The Law of Moses taught the poor to offer a pair of turtledoves or two young pigeons. (Lk 2:24)"),
      ...(this.doveDelivered ? [] : [tx("Chú bồ câu thứ hai của ta vừa sổng khỏi lồng. Con tìm giúp ta với!", "My second dove just slipped out of its cage. Please help me find it!"), tx("Chú sợ người lạ, có lẽ phải lại gần vài lần thì chú mới chịu đậu.", "It's afraid of strangers; you may need to approach a few times before it will perch.")]),
    ]);
  }

  private deliverDove() {
    this.doveDelivered = true;
    this.add.sprite(JOSEPH_AT[0] + 26, JOSEPH_AT[1] - 8, "holy_spirit_dove", 1).setOrigin(0.5, 1).setDepth(JOSEPH_AT[1] + 1);
    this.sparkleBurst(JOSEPH_AT[0] + 26, JOSEPH_AT[1] - 14);
    this.talk(tx("Thánh Giuse", "Saint Joseph"), "🧔", [tx("Chú bồ câu đã vào lồng an toàn rồi. Cảm ơn con!", "The dove is safe in its cage now. Thank you!"), tx("Giờ lễ vật đã đủ. Con ra gặp Đức Mẹ, Mẹ đang bế Hài Nhi Giêsu nhé.", "Now the offering is complete. Go to Mary, who is carrying the Baby Jesus.")]);
  }

  private talkToMary() {
    this.talk(tx("Đức Mẹ Maria", "Mother Mary"), "💙", [
      this.doveDelivered
        ? tx("Con bế giúp Mẹ Hài Nhi nhé. Cụ Simêon đang đợi ở trước bàn thờ, con cẩn thận nha.", "Please carry the Baby for me. Simeon is waiting in front of the altar. Be careful!")
        : tx("Mẹ đem Con đầu lòng lên Đền Thờ để dâng cho Chúa, đúng như luật đã dạy.", "I bring my firstborn to the Temple to present Him to the Lord, as the Law teaches."),
      ...(this.doveDelivered ? [] : [tx("Khi lễ vật của Thánh Giuse đủ, Mẹ sẽ nhờ con đưa Hài Nhi đến cụ Simêon.", "When Joseph's offering is complete, I'll ask you to take the Baby to Simeon.")]),
    ]);
  }

  private takeBaby() {
    this.hasBaby = true;
    this.baby.setVisible(true);
    this.talk(tx("Đức Mẹ Maria", "Mother Mary"), "💙", [tx("Mẹ tin con. Con hãy bế Hài Nhi thật nhẹ nhàng nhé.", "I trust you. Carry the Baby very gently."), tx("Hãy đưa Hài Nhi đến cụ Simêon, cụ ở cạnh bàn thờ.", "Take the Baby to Simeon. He is beside the altar.")]);
  }

  private talkToSimeon() {
    this.talk(tx("Cụ Simêon", "Simeon"), "👴", [
      tx("Ta là Simêon, một người công chính và đạo đức. Thánh Thần đã báo trước ta sẽ không chết trước khi thấy Đấng Kitô của Chúa. (Lc 2, 25-26)", "I am Simeon, a righteous and devout man. The Holy Spirit revealed to me that I would not die before seeing the Lord's Messiah. (Lk 2:25-26)"),
      tx("Hôm nay Thánh Thần thúc giục ta lên Đền Thờ. Ta đang chờ một điều gì đó...", "Today the Spirit moved me to come to the Temple. I am waiting for something..."),
    ]);
  }

  private simeonBlesses() {
    this.finished = true;
    this.hasBaby = false;
    this.baby.setPosition(SIMEON_AT[0] + 10, SIMEON_AT[1] - 12).setDepth(SIMEON_AT[1] + 1);
    this.sparkleBurst(SIMEON_AT[0], SIMEON_AT[1] - 20);
    // Mary, Joseph and Anna gather round Simeon and the baby; dialogue starts once Mary arrives
    this.walkers.push(this.joseph, this.mary, this.anna);
    this.walk(this.joseph, [[SIMEON_AT[0] + 40, SIMEON_AT[1] + 34]]);
    this.walk(this.anna, [[SIMEON_AT[0] + 56, SIMEON_AT[1] + 6]]);
    this.walk(this.mary, [[SIMEON_AT[0] - 34, SIMEON_AT[1] + 34]], () => this.simeonSpeaks());
  }

  private simeonSpeaks() {
    this.talk(
      tx("Cụ Simêon", "Simeon"),
      "👴",
      [
        tx("Cụ run run đón lấy Hài Nhi trong vòng tay và cất lời ca ngợi Thiên Chúa:", "He trembles as he takes the Baby into his arms and praises God:"),
        tx("'Muôn lạy Chúa, giờ đây xin để tôi tớ này được an bình ra đi, vì chính mắt con đã thấy ơn cứu độ.' (Lc 2, 29-30)", "‘Master, now let Your servant go in peace, for my eyes have seen Your salvation.’ (Lk 2:29-30)"),
        tx("Rồi cụ quay sang Đức Mẹ: 'Một lưỡi gươm sẽ đâm thấu tâm hồn Bà.' (Lc 2, 35)", "Then he turns to Mary: ‘And you yourself a sword will pierce.’ (Lk 2:35)"),
      ],
      () =>
        this.talk(
          tx("Bà Anna", "Anna"),
          "👵",
          [tx("Bà Anna tiến lại, dâng lời tạ ơn Thiên Chúa và nói về Hài Nhi cho mọi người đang mong đợi ơn cứu độ. (Lc 2, 38)", "Anna comes forward, gives thanks to God and speaks about the Child to all who are awaiting redemption. (Lk 2:38)")],
          () =>
            this.time.delayedCall(400, () =>
              this.complete(
                4,
                tx("Năm Sự Vui", "Joyful"),
                tx("Đức Bà Dâng Đức Chúa Giêsu Vào Đền Thánh", "The Presentation of Jesus in the Temple"),
                tx("Tinh thần vâng giữ lề luật và sẵn sàng hy sinh hiến tế cho Chúa.", "A spirit of obeying the Law and being ready to sacrifice and offer to God."),
                tx("Đức Mẹ dâng Con yêu quý cho Chúa. Hãy dâng cho Chúa những điều nhỏ bé của con mỗi ngày nhé!", "Mary offers her beloved Son to the Lord. Offer the Lord the little things of each day!"),
                ["find_dove", "present_child", "simeon_canticle"]
              )
            )
        )
    );
  }
}
