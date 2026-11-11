import { BedroomScene, SPOT } from "@/modules/the-rosary-adventures/game/scenes/BedroomScene";
import { MYSTERY_KEYS } from "@/modules/the-rosary-adventures/types/game";
import { t as tx } from "@/modules/shared/i18n";

const PORTAL_AT: [number, number] = [160, 160];

/** Prologue: tidy up for evening prayer, find the rosary, light the candle, the Holy Spirit opens the way. */
export class PrologueScene extends BedroomScene {
  private hasRosary = false;
  private lit = false;
  private portalOpen = false;
  private leaving = false;

  constructor() {
    super("PrologueScene");
  }

  create() {
    this.hasRosary = this.lit = this.portalOpen = this.leaving = false;
    this.buildRoom();
    this.placeCandles();
    this.defineInteractables();
    this.hint(SPOT.bed[0], SPOT.bed[1] - 44);

    this.begin("", [SPOT.spawn[0], SPOT.spawn[1]], {
      speaker: tx("Giờ Kinh Tối", "Evening Prayer Time"),
      emoji: "🕯️",
      lines: [
        tx("“Thần Khí cũng đến giúp đỡ sự yếu đuối của chúng ta, vì chúng ta không biết cầu nguyện thế nào cho phải.” (Rm 8, 26)", "“The Spirit too comes to the aid of our weakness; for we do not know how to pray as we ought.” (Rom 8:26)"),
        tx("Trời đã tối. Căn phòng còn hơi bừa bộn sau một ngày đi học: sách vở còn mở, cặp sách dưới sàn.", "It is dark. The room is a little messy after a day at school: books still open, schoolbag on the floor."),
        tx("Em muốn đọc kinh tối như lời Mẹ dặn, nhưng quên mất để chuỗi Mân Côi ở đâu. Chuỗi hạt hiện còn 0/20 hạt sáng.", "You want to say your evening prayers as Mom taught you, but you forgot where you left your Rosary. The Rosary has 0/20 beads lit."),
        tx("Dùng mũi tên / D-pad để đi, nhấn Space hoặc nút A để xem xét. Hãy tìm chuỗi Mân Côi nhé!", "Use the arrows / D-pad to move and press Space or A to interact. Find the Rosary!"),
      ],
    });
  }

  private defineInteractables() {
    const near = (p: readonly [number, number], dy = -10) => () => [p[0], p[1] + dy] as [number, number];
    this.interactables = [
      {
        at: near(SPOT.desk),
        r: 36,
        label: () => tx("[A] Bàn học", "[A] Study desk"),
        active: () => !this.portalOpen,
        act: () => this.talk(tx("Bàn học", "Study desk"), "📚", [tx("Sách vở còn mở trên bàn, nhưng không thấy chuỗi hạt ở đây.", "Books are still open on the desk, but there is no Rosary here.")]),
      },
      {
        at: near(SPOT.shelf),
        r: 34,
        label: () => tx("[A] Kệ sách", "[A] Bookshelf"),
        active: () => !this.portalOpen,
        act: () => this.talk(tx("Kệ sách", "Bookshelf"), "📖", [tx("Truyện tranh, sách học và vài cuốn sách thánh… nhưng không có chuỗi hạt.", "Comic books, school books and a few holy books… but no Rosary.")]),
      },
      {
        at: near(SPOT.bed, -4),
        r: 42,
        label: () => (this.hasRosary ? tx("Giường", "Bed") : tx("[A] Đầu giường", "[A] Bedside")),
        active: () => !this.portalOpen,
        act: () => {
          if (this.hasRosary) return this.talk(tx("Giường", "Bed"), "🛏️", [tx("Em đã tìm thấy chuỗi hạt rồi. Giờ hãy đến Góc Cầu Nguyện nhé.", "You found the Rosary. Now go to the Prayer Corner.")]);
          this.hasRosary = true;
          this.holdItem("rosary_item");
          this.talk(tx("Đầu giường", "Bedside"), "📿", [
            tx("Đây rồi! Chuỗi Mân Côi nằm dưới gối.", "Here it is! The Rosary was under the pillow."),
            tx("Chuỗi hạt chưa có hạt nào sáng (0/20). Hãy mang đến Góc Cầu Nguyện và thắp nến nhé.", "The Rosary has no beads lit yet (0/20). Bring it to the Prayer Corner and light the candle."),
          ]);
        },
      },
      {
        at: near(SPOT.bag),
        r: 26,
        label: () => tx("[A] Cặp sách", "[A] Schoolbag"),
        active: () => !this.portalOpen,
        act: () => this.talk(tx("Cặp sách", "Schoolbag"), "🎒", [tx("Cặp sách của em, mai còn phải đi học. Chuỗi hạt không ở trong này.", "Your schoolbag, you still have school tomorrow. The Rosary isn't in here.")]),
      },
      {
        at: near(SPOT.altar, 6),
        r: 42,
        label: () => (this.hasRosary ? tx("[A] Thắp nến Góc Cầu Nguyện", "[A] Light the Prayer Corner candle") : tx("[A] Góc Cầu Nguyện", "[A] Prayer Corner")),
        active: () => !this.lit,
        act: () => this.altar(),
      },
      {
        at: () => PORTAL_AT,
        r: 28,
        label: () => tx("[A] Bước vào luồng sáng", "[A] Step into the light"),
        active: () => this.portalOpen && !this.leaving,
        act: () => this.enterPortal(),
      },
    ];
  }

  private altar() {
    if (!this.hasRosary) {
      this.talk(tx("Góc Cầu Nguyện", "Prayer Corner"), "🕯️", [tx("Em chưa có chuỗi Mân Côi. Hãy tìm quanh phòng trước nhé: bàn học, kệ sách, đầu giường.", "You don't have the Rosary yet. Look around the room first: the desk, the bookshelf, the bedside.")]);
      return;
    }
    this.lit = true;
    this.dropItem();
    const [ax, ay] = SPOT.altar;
    this.add.image(ax, ay - 8, "rosary_item").setOrigin(0.5, 1).setDepth(ay + 1);
    this.lightCandles();
    this.time.delayedCall(500, () =>
      this.talk(
        "Em",
        "🙏",
        [tx("Em thắp nến và thầm thì:", "You light the candle and whisper:"), tx("“Lạy Chúa, con muốn lần hạt Mân Côi mà nhiều khi con chẳng hình dung được các Mầu Nhiệm là gì…”", "“Lord, I want to pray the Rosary but often I can't imagine what the Mysteries are…”")],
        () => this.doveArrives()
      )
    );
  }

  private dove?: Phaser.GameObjects.Sprite;

  private doveArrives() {
    this.cameras.main.flash(500, 255, 244, 180);
    const [wx, wy] = SPOT.window;
    const dove = (this.dove = this.spawnDove(wx, wy + 40));
    this.sparkleBurst(wx, wy + 32);
    this.walk(dove, [[SPOT.altar[0] - 28, SPOT.altar[1] + 26]]);
    this.time.delayedCall(1700, () =>
      this.talk(
        tx("Chúa Thánh Thần", "Holy Spirit"),
        "🕊️",
        [
          tx("Một làn gió nhẹ thổi qua khung cửa sổ. Chim Bồ Câu trắng tỏa sáng bay vào, đậu bên bàn thờ nhỏ.", "A gentle breeze blows through the window. A shining white Dove flies in and perches by the little altar."),
          tx("“Đừng lo, con yêu dấu! Ta là Đấng Bảo Trợ. Hãy nắm lấy Chuỗi Mân Côi và bước vào luồng sáng này, Ta sẽ đưa con đi gặp Mẹ Maria và Chúa Giêsu qua từng biến cố cứu độ!”", "“Do not worry, dear child! I am the Advocate. Take the Rosary and step into this light, and I will lead you to meet Mother Mary and Jesus through every event of salvation!”"),
          tx("Hãy làm dấu Thánh Giá để bắt đầu hành trình.", "Make the Sign of the Cross to begin the journey."),
        ],
        undefined,
        [{ label: tx("✝️ Nhân danh Cha và Con và Thánh Thần. Amen.", "✝️ In the name of the Father, and of the Son, and of the Holy Spirit. Amen."), onSelect: () => this.openPortal() }]
      )
    );
  }

  private openPortal() {
    this.portalOpen = true;
    const [x, y] = PORTAL_AT;
    this.add.image(x, y, "glow_gold").setDepth(y - 1).setAlpha(0.7);
    const ring = this.add.image(x, y, "portal_ring").setDepth(y);
    this.tweens.add({ targets: ring, alpha: 0.6, duration: 700, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    this.hint(x, y - 22);
    this.sparkleBurst(x, y);
    // the Spirit leads the way: hover above the portal (feet 30px up, clear of the hint sparkle)
    if (this.dove) this.walk(this.dove, [[x, y - 30]]);
    this.holdItem("rosary_item");
  }

  private enterPortal() {
    if (this.leaving) return;
    this.leaving = true;
    this.player.setMovementLock(true);
    const cam = this.cameras.main;
    cam.flash(500, 255, 255, 255);
    cam.fadeOut(900, 255, 255, 255);
    cam.once("camerafadeoutcomplete", () => this.scene.start("StageTransitionScene", { toKey: MYSTERY_KEYS[0] }));
  }
}
