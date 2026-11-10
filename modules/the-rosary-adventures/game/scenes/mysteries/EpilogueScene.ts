import { BedroomScene, SPOT } from "@/modules/the-rosary-adventures/game/scenes/BedroomScene";
import audio from "@/modules/shared/game/audio/AudioManager";
import EventBus from "@/modules/shared/game/EventBus";

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
      speaker: "Trở Về Đời Thường",
      emoji: "🌙",
      lines: [
        "“Đấng Bảo Trợ là Thánh Thần Chúa Cha sẽ sai đến nhân danh Thầy, Đấng ấy sẽ dạy anh em mọi điều và làm cho anh em nhớ lại mọi điều Thầy đã nói với anh em.” (Ga 14, 26)",
        "Ánh sáng thiên quốc mờ dần… Em đang ở trong căn phòng nhỏ của mình, tay vẫn cầm chuỗi Mân Côi vừa lần xong.",
        "Cả hành trình 20 mầu nhiệm là một giờ cầu nguyện sâu lắng trước khi đi ngủ. Chúa Thánh Thần đang đậu bên cửa sổ, hãy đến trò chuyện nhé.",
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
        label: () => "[A] Chúa Thánh Thần",
        active: () => !this.sleeping,
        act: () =>
          this.talk("Chúa Thánh Thần", "🕊️", [
            "Đi qua 20 Mầu Nhiệm không chỉ để ngắm nhìn trong giờ suy niệm, nhưng là để mang tình yêu của Chúa Giêsu và Mẹ Maria vào chính ngày mai của con.",
            this.left() > 0 ? `Còn ${this.left()} bài học thực hành: Bàn học, Cặp sách và Góc Cầu Nguyện.` : "Con đã làm hết rồi. Hãy đi ngủ trong bình an nhé!",
          ]),
      },
      {
        at: near(SPOT.desk),
        r: 36,
        label: () => (this.done.desk ? "Bàn học" : "[A] Bàn học: Vâng Phục"),
        active: () => !this.sleeping && !this.done.desk,
        act: () => this.lesson(
          "Bàn học",
          "📚",
          ["Em xếp sách vở gọn gàng và mở cuốn Sổ Tay Đức Tin.", "Chúa Thánh Thần hỏi: “Khi ngày mai đi học gặp bài khó hoặc việc vất vả, con nhớ gương ai ở Nazareth?”"],
          ["Thưa Xin Vâng và chăm chỉ như Chúa Giêsu và Mẹ Maria", "Bỏ dở, để mai tính", "Nhờ bạn làm giúp"],
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
        label: () => (this.done.bag ? "Cặp sách" : "[A] Cặp sách: Yêu Thương"),
        active: () => !this.sleeping && !this.done.bag,
        act: () => this.lesson(
          "Cặp sách",
          "🎒",
          ["Em chuẩn bị một tấm thiệp sẻ chia cho người bạn ở trường rồi cất vào cặp.", "Chúa Thánh Thần nhắc lại bài học dưới chân Thập Giá: “Nếu ngày mai có bạn làm con buồn, con sẽ làm gì?”"],
          ["Biết tha thứ, nhẫn nại và cầu nguyện cho bạn như Chúa trên Thập Giá", "Giận bạn thật lâu", "Không nói chuyện với bạn nữa"],
          () => {
            this.done.bag = true;
            this.sparkleBurst(SPOT.bag[0], SPOT.bag[1] - 8);
          }
        ),
      },
      {
        at: near(SPOT.altar, 6),
        r: 42,
        label: () => (this.done.altar ? "Góc Cầu Nguyện" : "[A] Góc Cầu Nguyện: Hy Vọng"),
        active: () => !this.sleeping && !this.done.altar,
        act: () => this.altarLesson(),
      },
      {
        at: near(SPOT.bed, -4),
        r: 42,
        label: () => (this.blessed ? "[A] Đi ngủ" : "Giường"),
        active: () => !this.sleeping,
        act: () => (this.blessed ? this.sleep() : this.talk("Giường", "🛏️", [`Chưa buồn ngủ đâu. Em còn ${this.left()} bài học nữa với Chúa Thánh Thần.`])),
      },
    ];
  }

  /** Story lines, then a 3-way question; only the right answer completes the lesson. */
  private lesson(speaker: string, emoji: string, lines: string[], answers: string[], onRight: () => void) {
    const opt = (label: string, right: boolean) => ({
      label,
      onSelect: () =>
        right
          ? (onRight(), this.talk("Chúa Thánh Thần", "🕊️", ["Đúng rồi! Con đã mang hoa trái Mân Côi vào đời sống."], () => this.maybeBless()))
          : (audio.sfx("wrong"), this.talk("Chúa Thánh Thần", "🕊️", ["Hãy nhớ lại các mầu nhiệm con vừa đi qua và thử lại nhé."])),
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
        "Góc Cầu Nguyện",
        "🕯️",
        ["Em đặt chuỗi Mân Côi 20 hạt sáng lấp lánh lên bàn thờ nhỏ và thắp nến cầu nguyện cho gia đình: Cha Mẹ, ông bà.", "Hy vọng và chứng nhân: mỗi ngày em sẽ sống như một người con của Chúa."],
        () => this.maybeBless()
      )
    );
  }

  private maybeBless() {
    if (this.left() > 0) return;
    this.blessed = true;
    this.cameras.main.flash(700, 255, 244, 180);
    this.time.delayedCall(600, () =>
      this.talk("Chúa Thánh Thần", "🕊️", [
        "Chúa Thánh Thần bay đến, tỏa ánh sáng ấm áp bao quanh em và trao tặng Hoa Trái Thánh Thần: Bác ái, Hoan lạc, Bình an. (Gl 5, 22)",
        "“Con yêu dấu, mỗi khi con lần hạt Mân Côi, Ta luôn ở đây để dẫn con đến với Chúa Giêsu và Mẹ Maria. Bây giờ, hãy ngủ thật ngon trong bình an của Chúa nhé!”",
      ])
    );
  }

  private sleep() {
    this.sleeping = true;
    this.player.setMovementLock(true);
    const cam = this.cameras.main;
    cam.fadeOut(1400, 0, 0, 0);
    cam.once("camerafadeoutcomplete", () => EventBus.emit("game-complete"));
  }
}
