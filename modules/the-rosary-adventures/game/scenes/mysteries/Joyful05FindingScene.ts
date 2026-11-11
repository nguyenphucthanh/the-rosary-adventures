import * as Phaser from "phaser";
import audio from "@/modules/shared/game/audio/AudioManager";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAnnunciationTextures } from "@/modules/the-rosary-adventures/game/utils/npcTextureGenerator";
import { registerVisitationTextures } from "@/modules/the-rosary-adventures/game/utils/visitationTextureGenerator";
import { registerInfancyTextures } from "@/modules/the-rosary-adventures/game/utils/infancyTextureGenerator";
import { t as tx } from "@/modules/shared/i18n";

const W = 800;
const H = 600;
const STREET_Y = 174; // parapet line; porch above, street below
const GATE: [number, number] = [400, STREET_Y];
const MERCHANT_AT: [number, number] = [250, 360];
const SWEEPER_AT: [number, number] = [560, 460];
const MARY_AT: [number, number] = [340, 540];
const JOSEPH_AT: [number, number] = [462, 540];
const JESUS_AT: [number, number] = [400, 104];

export class Joyful05FindingScene extends InteractiveScene {
  private mary!: Phaser.GameObjects.Sprite;
  private joseph!: Phaser.GameObjects.Sprite;
  private gate!: Phaser.GameObjects.Image;
  private gateBlock!: Phaser.GameObjects.Rectangle;
  private porch: Phaser.GameObjects.Sprite[] = [];

  private askedMerchant = false;
  private askedSweeper = false;
  private gateOpen = false;
  private maryArrived = false;
  private finished = false;

  constructor() {
    super("Joyful05FindingScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAnnunciationTextures(this);
    registerVisitationTextures(this);
    registerInfancyTextures(this);
    this.askedMerchant = this.askedSweeper = this.gateOpen = this.maryArrived = this.finished = false;
    this.walkers = [];
    this.porch = [];

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildTown();
    this.buildProps();
    this.buildCharacters();
    this.buildLight();
    this.defineInteractables();

    this.begin("vui_05_tim_chua", [400, 500], {
      speaker: tx("Phố Giê-ru-sa-lem", "The Streets of Jerusalem"),
      emoji: "🏙️",
      lines: [
        tx("Mầu Nhiệm Thứ Năm: Đức Bà Tìm Được Đức Chúa Giêsu Trong Đền Thờ (Lc 2, 41-52).", "Fifth Mystery: The Finding of Jesus in the Temple (Lk 2:41-52)."),
        tx("Dịp lễ Vượt Qua, phố xá đông nghẹt. Đức Mẹ và Thánh Giuse đã đi cả ngày đường mới nhận ra Chúa Giêsu không đi cùng đoàn.", "At the Passover feast the streets are packed. Mary and Joseph traveled a whole day before realizing Jesus was not with the caravan."),
        tx("Hãy hỏi thăm người trong phố, rồi tìm cuộn sách đúng để mở cổng Đền Thờ nhé!", "Ask the people in the street, then find the right scroll to open the Temple gate!"),
      ],
    });
  }

  // ---------- world ----------

  private buildTown() {
    this.add.tileSprite(0, STREET_Y, W, H - STREET_Y, "cobble_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    // porch behind the gate: wall, floor, rug
    this.add.tileSprite(0, 0, W, 48, "stone_wall").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 48, W, STREET_Y - 48, "floor_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(352, 60, 96, 90, "rug_tile").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(0, STREET_Y - 12, W, 24, "parapet").setOrigin(0).setDepth(STREET_Y - 1);
    for (const x of [140, 660]) this.add.image(x, 8, "window_arch").setOrigin(0.5, 0).setDepth(DEPTH.FLOOR);
    // street steps up to the gate
    this.add.image(400, STREET_Y + 28, "temple_steps").setOrigin(0.5, 1).setDepth(DEPTH.RUG);

    // side houses: sandstone facades with a roof edge
    for (const x of [0, 736]) {
      this.add.tileSprite(x, 250, 64, 270, "stone_wall").setOrigin(0).setDepth(DEPTH.FLOOR);
      this.add.rectangle(x, 246, 64, 6, 0xa68f66).setOrigin(0).setDepth(DEPTH.FLOOR);
      this.block(x + 32, 385, 64, 270);
    }

    this.edgeWalls(W, H);
    this.block(182, STREET_Y - 4, 364, 24);
    this.block(618, STREET_Y - 4, 364, 24);
    this.gateBlock = this.add.rectangle(GATE[0], STREET_Y - 4, 72, 24);
    this.obstacles.add(this.gateBlock);
  }

  private buildProps() {
    this.gate = this.add.image(GATE[0], STREET_Y + 2, "temple_gate").setOrigin(0.5, 1).setDepth(STREET_Y + 3);
    for (const x of [300, 500]) this.add.image(x, STREET_Y + 2, "temple_pillar").setOrigin(0.5, 1).setDepth(STREET_Y + 3);

    this.prop(190, 330, "market_stall", 56, 14);
    this.prop(620, 320, "market_stall", 56, 14);
    for (const [x, y] of [[130, 352], [150, 360], [690, 342], [300, 300], [510, 390]]) this.prop(x, y, "crate", 16, 10);
    for (const [x, y] of [[300, 372], [520, 330], [420, 440], [330, 460]]) this.prop(x, y, "clay_jar", 12, 8);
    for (const [x, y] of [[100, 215], [700, 215]]) this.prop(x, y, "olive_pot", 14, 8);
    for (const [x, y] of [[120, 560], [690, 560]]) this.prop(x, y, "hill_tree", 10, 8);
  }

  private buildCharacters() {
    const person = (key: string, [x, y]: [number, number]) => this.add.sprite(x, y, key).setOrigin(0.5, 1).setDepth(y);
    person("merchant", MERCHANT_AT);
    person("sweeper", SWEEPER_AT);
    this.hint(MERCHANT_AT[0], MERCHANT_AT[1] - 34);
    this.hint(SWEEPER_AT[0], SWEEPER_AT[1] - 34);
    this.mary = person("mary_praying", MARY_AT);
    this.joseph = person("joseph", JOSEPH_AT);
    this.walkers.push(this.mary, this.joseph);

    // pilgrims strolling to and fro (festival crowd)
    ([["shepherd", 80, 230, 420], ["scribe", 90, 280, 610]] as const).forEach(([key, x, y, to], i) => {
      const s = person(key, [x + i * 300, y + i * 140]);
      this.walkers.push(s);
      this.tweens.add({ targets: s, x: to, duration: 5000 + i * 1500, yoyo: true, repeat: -1, ease: "Linear" });
    });

    // hidden until the gate opens: Jesus among the teachers
    for (const [key, x, y] of [["jesus12", ...JESUS_AT], ["scribe", 346, 96], ["scribe", 454, 96], ["scribe", 400, 74]] as const)
      this.porch.push(person(key, [x, y]).setVisible(false));
  }

  private buildLight() {
    const g = this.add.graphics().setDepth(3).fillStyle(0xfef08a, 0.09);
    g.fillPoints([{ x: 60, y: STREET_Y }, { x: 120, y: STREET_Y }, { x: 330, y: 560 }, { x: 240, y: 560 }], true);
    g.fillPoints([{ x: 560, y: STREET_Y }, { x: 610, y: STREET_Y }, { x: 760, y: 520 }, { x: 690, y: 520 }], true);
    for (const x of [346, 454]) {
      const torch = this.add.image(x, STREET_Y - 18, "glow_small").setDepth(DEPTH.FX - 1).setAlpha(0.5);
      this.tweens.add({ targets: torch, alpha: 0.8, duration: 800, yoyo: true, repeat: -1 });
    }
  }

  // ---------- interaction ----------

  private defineInteractables() {
    this.interactables = [
      {
        at: () => MERCHANT_AT,
        r: 46,
        label: () => tx("[A] Hỏi thương nhân", "[A] Ask the merchant"),
        active: () => true,
        act: () => this.askMerchant(),
      },
      {
        at: () => SWEEPER_AT,
        r: 46,
        label: () => tx("[A] Hỏi người quét sân", "[A] Ask the sweeper"),
        active: () => true,
        act: () => this.askSweeper(),
      },
      {
        at: () => [this.mary.x, this.mary.y],
        r: 44,
        label: () => tx("[A] Trò chuyện với Đức Mẹ", "[A] Talk to Mary"),
        active: () => !this.finished,
        act: () => this.talkToParents(tx("Đức Mẹ Maria", "Mother Mary"), "💙", tx("Con ơi, con đang ở đâu? Mẹ lo lắm! Xin con giúp Mẹ hỏi thăm khắp phố nhé.", "My child, where are you? I'm so worried! Please help me ask around the whole street.")),
      },
      {
        at: () => [this.joseph.x, this.joseph.y],
        r: 44,
        label: () => tx("[A] Trò chuyện với Thánh Giuse", "[A] Talk to Saint Joseph"),
        active: () => !this.finished,
        act: () => this.talkToParents(tx("Thánh Giuse", "Saint Joseph"), "🧔", tx("Đã ba ngày tìm kiếm rồi. Hãy hỏi những người buôn bán và quét dọn, họ để ý mọi chuyện trong phố.", "Three days of searching already. Ask the merchants and the sweepers; they notice everything in the street.")),
      },
      {
        at: () => [GATE[0], GATE[1] + 26],
        r: 50,
        label: () => tx("[A] Gõ cổng Đền Thờ", "[A] Knock on the Temple gate"),
        active: () => !this.gateOpen,
        act: () => this.knockGate(),
      },
      {
        at: () => JESUS_AT,
        r: 60,
        label: () => tx("[A] Nói chuyện với Chúa Giêsu", "[A] Talk to Jesus"),
        active: () => this.gateOpen && !this.finished,
        act: () => (this.maryArrived ? this.climax() : this.talk(tx("Cổng Đền Thờ", "Temple Gate"), "🏛️", [tx("Hãy đợi Đức Mẹ và Thánh Giuse vào cùng nhé.", "Wait for Mary and Joseph to come in with you.")])),
      },
    ];
  }

  private talkToParents(speaker: string, emoji: string, line: string) {
    this.talk(speaker, emoji, this.gateOpen ? [tx("Chúa Giêsu đây rồi! Cảm tạ Chúa!", "Here is Jesus! Thanks be to God!")] : [line]);
  }

  private askMerchant() {
    this.askedMerchant = true;
    this.talk(tx("Thương Nhân", "Merchant"), "🧑‍🌾", [
      tx("(Bạn hỏi:) Chú ơi, chú có thấy một cậu bé thông thái không ạ?", "(You ask:) Sir, have you seen a very wise boy?"),
      tx("À, cậu bé 12 tuổi, nói chuyện đĩnh đạc lắm phải không? Chú thấy cậu ấy đi về phía Đền Thờ đằng kia.", "Ah, a 12-year-old boy who speaks with such dignity? I saw him heading toward the Temple over there."),
      tx("Chú nghe nói các kinh sư ngồi ở thềm Đền Thờ. Cứ đến gõ cổng xem sao!", "I heard the scribes sit on the Temple steps. Go knock on the gate and see!"),
    ]);
  }

  private askSweeper() {
    this.askedSweeper = true;
    this.talk(tx("Người Quét Sân", "Sweeper"), "🧹", [
      tx("(Bạn hỏi:) Bác ơi, bác có thấy một cậu bé thông thái không ạ?", "(You ask:) Sir, have you seen a very wise boy?"),
      tx("Có đấy! Cậu bé vào thư phòng Kinh Luật, ngồi nghe và hỏi các kinh sư. Ai cũng ngạc nhiên! (Lc 2, 46-47)", "Yes! The boy went into the Law study room, sitting and listening and questioning the scribes. Everyone was amazed! (Lk 2:46-47)"),
      tx("Nhưng các ông ấy chỉ mở cổng cho ai biết đúng Lời Chúa trong cuộn sách thôi.", "But those men only open the gate to someone who knows the right Word of God in the scroll."),
    ]);
  }

  private knockGate() {
    if (!this.askedMerchant || !this.askedSweeper) {
      this.talk(tx("Cổng Đền Thờ", "Temple Gate"), "🚪", [
        tx("Cổng Đền Thờ đóng im ỉm. Bạn chưa biết gõ ở đâu, hỏi ai.", "The Temple gate stays shut. You don't yet know where to knock or whom to ask."),
        tx(`Hãy hỏi thăm trong phố trước đã (${Number(this.askedMerchant) + Number(this.askedSweeper)}/2): thương nhân và người quét sân.`, `Ask around the street first (${Number(this.askedMerchant) + Number(this.askedSweeper)}/2): the merchant and the sweeper.`),
      ]);
      return;
    }
    const correct = {
      label: tx("Cuộn ngôn sứ Mica: 'Hỡi Bê-lem, từ ngươi sẽ xuất hiện Đấng cai trị Ít-ra-en.' (Mk 5, 1)", "Scroll of the Prophet Micah: ‘But you, Bethlehem, from you shall come forth the ruler of Israel.’ (Mic 5:1)"),
      onSelect: () => this.openGate(),
    };
    const wrongA = { label: tx("Cuộn sổ ghi giá bánh và dầu ở chợ.", "A scroll listing the prices of bread and oil at the market."), onSelect: () => this.wrongScroll() };
    const wrongB = { label: tx("Cuộn bản đồ đường đi đến Rô-ma.", "A map scroll of the road to Rome."), onSelect: () => this.wrongScroll() };
    this.talk(
      tx("Các Kinh Sư", "The Scribes"),
      "📜",
      [
        tx("Sau cổng vọng ra tiếng các kinh sư: 'Ai biết Đấng Cứu Thế sẽ sinh ra ở đâu?'", "From behind the gate come the scribes' voices: ‘Who knows where the Messiah will be born?’"),
        tx("Bạn nhìn xuống ba cuộn sách trong tay. Hãy chọn cuộn sách đúng!", "You look down at the three scrolls in your hands. Choose the right scroll!"),
      ],
      undefined,
      [wrongA, correct, wrongB]
    );
  }

  private wrongScroll() {
    audio.sfx("wrong");
    this.talk(
      tx("Các Kinh Sư", "The Scribes"),
      "📜",
      [tx("Cuộn sách ấy không nói về Đấng Cứu Thế. Hãy nhớ lại lời ngôn sứ về thành Bê-lem...", "That scroll isn't about the Savior. Remember the prophet's words about the town of Bethlehem...")],
      undefined,
      [{ label: tx("Cuộn ngôn sứ Mica: 'Hỡi Bê-lem, từ ngươi sẽ xuất hiện Đấng cai trị Ít-ra-en.' (Mk 5, 1)", "Scroll of the Prophet Micah: ‘But you, Bethlehem, from you shall come forth the ruler of Israel.’ (Mic 5:1)"), onSelect: () => this.openGate() }]
    );
  }

  private openGate() {
    this.gateOpen = true;
    this.obstacles.remove(this.gateBlock, true, true);
    this.tweens.add({ targets: this.gate, alpha: 0, duration: 600, onComplete: () => this.gate.destroy() });
    this.porch.forEach((s) => s.setVisible(true));
    this.sparkleBurst(GATE[0], GATE[1] - 30);
    this.talk(
      tx("Các Kinh Sư", "The Scribes"),
      "📜",
      [
        tx("Đúng rồi! Cổng Đền Thờ từ từ mở ra.", "Right! The Temple gate slowly opens."),
        tx("Bên trong, giữa các bậc thầy luật, một cậu bé đang ngồi nghe và đặt câu hỏi. Ai nấy đều ngạc nhiên về trí hiểu biết của Cậu. (Lc 2, 47)", "Inside, among the teachers of the Law, a boy sits listening and asking questions. Everyone is amazed at His understanding. (Lk 2:47)"),
      ],
      () => {
        this.walk(this.mary, [[400, 290], [400, 200], [366, 128]], () => (this.maryArrived = true));
        this.walk(this.joseph, [[430, 300], [430, 200], [436, 128]]);
      }
    );
  }

  private climax() {
    this.finished = true;
    this.sparkleBurst(JESUS_AT[0], JESUS_AT[1] - 20);
    this.talk(
      tx("Đức Mẹ Maria", "Mother Mary"),
      "💙",
      [tx("Mẹ bước tới, nghẹn ngào: 'Con ơi, sao con làm cho cha mẹ phải vất vả thế này? Cha con và mẹ đây đã phải cực lòng tìm con!' (Lc 2, 48)", "Mary steps forward, choking with emotion: ‘Son, why have You done this to us? Your father and I have been looking for You in great anguish!’ (Lk 2:48)")],
      () =>
        this.talk(
          tx("Chúa Giêsu", "Jesus"),
          "✨",
          [tx("'Sao cha mẹ lại tìm con? Cha mẹ không biết là con phải lo việc của Cha con sao?' (Lc 2, 49)", "‘Why were you looking for me? Did you not know that I must be in my Father's house?’ (Lk 2:49)")],
          () =>
            this.talk(
              tx("Lời Chúa", "The Word of God"),
              "📖",
              [
                tx("Rồi Người cùng cha mẹ trở về Nadarét và hằng vâng phục các ngài. (Lc 2, 51)", "Then He went down with them and came to Nazareth, and was obedient to them. (Lk 2:51)"),
                tx("Còn Mẹ Người thì ghi nhớ tất cả những điều ấy trong lòng. (Lc 2, 51)", "His mother kept all these things in her heart. (Lk 2:51)"),
              ],
              () =>
                this.time.delayedCall(400, () =>
                  this.complete(
                    5,
                    tx("Năm Sự Vui", "Joyful"),
                    tx("Đức Bà Tìm Được Đức Chúa Giêsu Trong Đền Thờ", "The Finding of Jesus in the Temple"),
                    tx("Luôn tha thiết tìm kiếm Chúa và đặt việc Chúa lên trên hết.", "Always seek the Lord earnestly and put the Lord's work above everything."),
                    tx("Đức Mẹ không bỏ cuộc cho đến khi tìm thấy Chúa. Hãy luôn tìm kiếm Chúa mỗi ngày nhé!", "Mary did not give up until she found Jesus. Seek the Lord every day!"),
                    ["ask_merchant", "ask_sweeper", "choose_scroll", "find_jesus"]
                  )
                )
            )
        )
    );
  }
}
