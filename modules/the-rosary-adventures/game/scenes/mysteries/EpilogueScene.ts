import { BedroomScene, SPOT } from "@/modules/the-rosary-adventures/game/scenes/BedroomScene";
import audio from "@/modules/shared/game/audio/AudioManager";
import EventBus from "@/modules/shared/game/EventBus";
import { t as tx } from "@/modules/shared/i18n";

/** Epilogue: back in the bedroom, the Holy Spirit helps the child carry the rosary into daily life. */
export class EpilogueScene extends BedroomScene {
  private done = { desk: false, bag: false, altar: false };
  private blessed = false;
  private sleeping = false;

  constructor() {
    super("EpilogueScene");
  }

  create() {
    this.done = { desk: false, bag: false, altar: false };
    this.blessed = this.sleeping = false;
    this.buildRoom();
    this.placeCandles();
    this.add.sprite(SPOT.bag[0] + 24, SPOT.bag[1] - 2, "card_gift").setOrigin(0.5, 1).setDepth(SPOT.bag[1]);
    const dove = this.spawnDove(SPOT.window[0], SPOT.window[1] + 46);
    this.hint(dove.x, dove.y - 22);
    this.defineInteractables(dove.x, dove.y);

    this.begin("", [SPOT.spawn[0], SPOT.spawn[1]], {
      speaker: tx("Trở Về Đời Thường", "Back to Everyday Life"),
      emoji: "🌙",
      lines: [
        tx("“Đấng Bảo Trợ là Thánh Thần Chúa Cha sẽ sai đến nhân danh Thầy, Đấng ấy sẽ dạy anh em mọi điều và làm cho anh em nhớ lại mọi điều Thầy đã nói với anh em.” (Ga 14, 26)", "“The Advocate, the Holy Spirit that the Father will send in my name, will teach you everything and remind you of all that I told you.” (Jn 14:26)"),
        tx("Ánh sáng thiên quốc mờ dần… Em đang ở trong căn phòng nhỏ của mình, tay vẫn cầm chuỗi Mân Côi vừa lần xong.", "The heavenly light fades… You are in your little room, still holding the Rosary you just finished praying."),
        tx("Cả hành trình 20 mầu nhiệm là một giờ cầu nguyện sâu lắng trước khi đi ngủ. Chúa Thánh Thần đang đậu bên cửa sổ, hãy đến trò chuyện nhé.", "The whole journey through the 20 mysteries was a deep hour of prayer before bedtime. The Holy Spirit is perched by the window. Go and talk with Him."),
      ],
    });
    this.holdItem("rosary_lit");
  }

  private left() {
    return 3 - Object.values(this.done).filter(Boolean).length;
  }

  private defineInteractables(dx: number, dy: number) {
    const near = (p: readonly [number, number], d = -10) => () => [p[0], p[1] + d] as [number, number];
    this.interactables = [
      {
        at: () => [dx, dy],
        r: 44,
        label: () => tx("[A] Chúa Thánh Thần", "[A] Holy Spirit"),
        active: () => !this.sleeping,
        act: () =>
          this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), "🕊️", [
            tx("Đi qua 20 Mầu Nhiệm không chỉ để ngắm nhìn trong giờ suy niệm, nhưng là để mang tình yêu của Chúa Giêsu và Mẹ Maria vào chính ngày mai của con.", "Walking through the 20 Mysteries is not only for gazing at during meditation, but for bringing the love of Jesus and Mary into your tomorrow."),
            this.left() > 0 ? tx(`Còn ${this.left()} bài học thực hành: Bàn học, Cặp sách và Góc Cầu Nguyện.`, `${this.left()} practice lessons left: the Study Desk, the Schoolbag and the Prayer Corner.`) : tx("Con đã làm hết rồi. Hãy đi ngủ trong bình an nhé!", "You have done them all. Go to sleep in peace!"),
          ]),
      },
      {
        at: near(SPOT.desk),
        r: 36,
        label: () => (this.done.desk ? tx("Bàn học", "Study desk") : tx("[A] Bàn học: Vâng Phục", "[A] Study desk: Obedience")),
        active: () => !this.sleeping && !this.done.desk,
        act: () => this.lesson(
          tx("Bàn học", "Study desk"),
          "📚",
          [tx("Em xếp sách vở gọn gàng và mở cuốn Sổ Tay Đức Tin.", "You tidy your books and open your Notebook of Faith."), tx("Chúa Thánh Thần hỏi: “Khi ngày mai đi học gặp bài khó hoặc việc vất vả, con nhớ gương ai ở Nazareth?”", "The Holy Spirit asks: “When you meet a hard lesson or a tiring chore tomorrow, whose example at Nazareth will you remember?”")],
          [tx("Thưa Xin Vâng và chăm chỉ như Chúa Giêsu và Mẹ Maria", "Say “Yes” and work hard, like Jesus and Mary"), tx("Bỏ dở, để mai tính", "Give up and leave it for tomorrow"), tx("Nhờ bạn làm giúp", "Ask someone else to do it")],
          () => {
            this.done.desk = true;
            this.bookSprite.setTexture("book_closed");
            this.sparkleBurst(SPOT.desk[0], SPOT.desk[1] - 14);
          }
        ),
      },
      {
        at: near(SPOT.bag),
        r: 30,
        label: () => (this.done.bag ? tx("Cặp sách", "Schoolbag") : tx("[A] Cặp sách: Yêu Thương", "[A] Schoolbag: Love")),
        active: () => !this.sleeping && !this.done.bag,
        act: () => this.lesson(
          tx("Cặp sách", "Schoolbag"),
          "🎒",
          [tx("Em chuẩn bị một tấm thiệp sẻ chia cho người bạn ở trường rồi cất vào cặp.", "You prepare a card to share with a friend at school and tuck it into your bag."), tx("Chúa Thánh Thần nhắc lại bài học dưới chân Thập Giá: “Nếu ngày mai có bạn làm con buồn, con sẽ làm gì?”", "The Holy Spirit recalls the lesson at the foot of the Cross: “If a friend makes you sad tomorrow, what will you do?”")],
          [tx("Biết tha thứ, nhẫn nại và cầu nguyện cho bạn như Chúa trên Thập Giá", "Forgive, be patient and pray for your friend, like the Lord on the Cross"), tx("Giận bạn thật lâu", "Stay angry at your friend for a long time"), tx("Không nói chuyện với bạn nữa", "Stop talking to your friend")],
          () => {
            this.done.bag = true;
            this.sparkleBurst(SPOT.bag[0], SPOT.bag[1] - 8);
          }
        ),
      },
      {
        at: near(SPOT.altar, 6),
        r: 42,
        label: () => (this.done.altar ? tx("Góc Cầu Nguyện", "Prayer Corner") : tx("[A] Góc Cầu Nguyện: Hy Vọng", "[A] Prayer Corner: Hope")),
        active: () => !this.sleeping && !this.done.altar,
        act: () => this.altarLesson(),
      },
      {
        at: near(SPOT.bed, -4),
        r: 42,
        label: () => (this.blessed ? tx("[A] Đi ngủ", "[A] Go to sleep") : tx("Giường", "Bed")),
        active: () => !this.sleeping,
        act: () => (this.blessed ? this.sleep() : this.talk(tx("Giường", "Bed"), "🛏️", [tx(`Chưa buồn ngủ đâu. Em còn ${this.left()} bài học nữa với Chúa Thánh Thần.`, `Not sleepy yet. You still have ${this.left()} lessons left with the Holy Spirit.`)])),
      },
    ];
  }

  /** Story lines, then a 3-way question; only the right answer completes the lesson. */
  private lesson(speaker: string, emoji: string, lines: string[], answers: string[], onRight: () => void) {
    const opt = (label: string, right: boolean) => ({
      label,
      onSelect: () =>
        right
          ? (onRight(), this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), "🕊️", [tx("Đúng rồi! Con đã mang hoa trái Mân Côi vào đời sống.", "Right! You have brought the fruits of the Rosary into your life.")], () => this.maybeBless()))
          : (audio.sfx("wrong"), this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), "🕊️", [tx("Hãy nhớ lại các mầu nhiệm con vừa đi qua và thử lại nhé.", "Remember the mysteries you just walked through and try again.")])),
    });
    this.talk(speaker, emoji, lines, undefined, [opt(answers[0], true), opt(answers[1], false), opt(answers[2], false)]);
  }

  private altarLesson() {
    this.done.altar = true;
    this.dropItem();
    const [ax, ay] = SPOT.altar;
    this.add.image(ax, ay - 8, "rosary_lit").setOrigin(0.5, 1).setDepth(ay + 1);
    this.lightCandles();
    this.sparkleBurst(ax, ay - 20);
    this.time.delayedCall(500, () =>
      this.talk(
        tx("Góc Cầu Nguyện", "Prayer Corner"),
        "🕯️",
        [tx("Em đặt chuỗi Mân Côi 20 hạt sáng lấp lánh lên bàn thờ nhỏ và thắp nến cầu nguyện cho gia đình: Cha Mẹ, ông bà.", "You place the sparkling 20-bead Rosary on the little altar and light a candle to pray for your family: Dad, Mom, grandparents."), tx("Hy vọng và chứng nhân: mỗi ngày em sẽ sống như một người con của Chúa.", "Hope and witness: every day you will live as a child of God.")],
        () => this.maybeBless()
      )
    );
  }

  private maybeBless() {
    if (this.left() > 0) return;
    this.blessed = true;
    this.cameras.main.flash(700, 255, 244, 180);
    this.time.delayedCall(600, () =>
      this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), "🕊️", [
        tx("Chúa Thánh Thần bay đến, tỏa ánh sáng ấm áp bao quanh em và trao tặng Hoa Trái Thánh Thần: Bác ái, Hoan lạc, Bình an. (Gl 5, 22)", "The Holy Spirit flies to you, wraps you in warm light and gives you the Fruits of the Holy Spirit: Charity, Joy, Peace. (Gal 5:22)"),
        tx("“Con yêu dấu, mỗi khi con lần hạt Mân Côi, Ta luôn ở đây để dẫn con đến với Chúa Giêsu và Mẹ Maria. Bây giờ, hãy ngủ thật ngon trong bình an của Chúa nhé!”", "“Dear child, every time you pray the Rosary, I am here to lead you to Jesus and Mary. Now sleep well in the Lord's peace!”"),
      ], () => EventBus.emit("game-complete")) // all dialogs done: React overlay offers stay / home
    );
  }

  private sleep() {
    EventBus.emit("game-complete"); // reopen the stay / home choice
  }
}
