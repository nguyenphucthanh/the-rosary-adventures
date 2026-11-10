import { BedroomScene, SPOT } from "@/modules/the-rosary-adventures/game/scenes/BedroomScene";
import { MYSTERY_KEYS } from "@/modules/the-rosary-adventures/types/game";

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
      speaker: "Giờ Kinh Tối",
      emoji: "🕯️",
      lines: [
        "“Thần Khí cũng đến giúp đỡ sự yếu đuối của chúng ta, vì chúng ta không biết cầu nguyện thế nào cho phải.” (Rm 8, 26)",
        "Trời đã tối. Căn phòng còn hơi bừa bộn sau một ngày đi học: sách vở còn mở, cặp sách dưới sàn.",
        "Em muốn đọc kinh tối như lời Mẹ dặn, nhưng quên mất để chuỗi Mân Côi ở đâu. Chuỗi hạt hiện còn 0/20 hạt sáng.",
        "Dùng mũi tên / D-pad để đi, nhấn Space hoặc nút A để xem xét. Hãy tìm chuỗi Mân Côi nhé!",
      ],
    });
  }

  private defineInteractables() {
    const near = (p: readonly [number, number], dy = -10) => () => [p[0], p[1] + dy] as [number, number];
    this.interactables = [
      {
        at: near(SPOT.desk),
        r: 36,
        label: () => "[A] Bàn học",
        active: () => !this.portalOpen,
        act: () => this.talk("Bàn học", "📚", ["Sách vở còn mở trên bàn, nhưng không thấy chuỗi hạt ở đây."]),
      },
      {
        at: near(SPOT.shelf),
        r: 34,
        label: () => "[A] Kệ sách",
        active: () => !this.portalOpen,
        act: () => this.talk("Kệ sách", "📖", ["Truyện tranh, sách học và vài cuốn sách thánh… nhưng không có chuỗi hạt."]),
      },
      {
        at: near(SPOT.bed, -4),
        r: 42,
        label: () => (this.hasRosary ? "Giường" : "[A] Đầu giường"),
        active: () => !this.portalOpen,
        act: () => {
          if (this.hasRosary) return this.talk("Giường", "🛏️", ["Em đã tìm thấy chuỗi hạt rồi. Giờ hãy đến Góc Cầu Nguyện nhé."]);
          this.hasRosary = true;
          this.holdItem("rosary_item");
          this.talk("Đầu giường", "📿", [
            "Đây rồi! Chuỗi Mân Côi nằm dưới gối.",
            "Chuỗi hạt chưa có hạt nào sáng (0/20). Hãy mang đến Góc Cầu Nguyện và thắp nến nhé.",
          ]);
        },
      },
      {
        at: near(SPOT.bag),
        r: 26,
        label: () => "[A] Cặp sách",
        active: () => !this.portalOpen,
        act: () => this.talk("Cặp sách", "🎒", ["Cặp sách của em, mai còn phải đi học. Chuỗi hạt không ở trong này."]),
      },
      {
        at: near(SPOT.altar, 6),
        r: 42,
        label: () => (this.hasRosary ? "[A] Thắp nến Góc Cầu Nguyện" : "[A] Góc Cầu Nguyện"),
        active: () => !this.lit,
        act: () => this.altar(),
      },
      {
        at: () => PORTAL_AT,
        r: 28,
        label: () => "[A] Bước vào luồng sáng",
        active: () => this.portalOpen && !this.leaving,
        act: () => this.enterPortal(),
      },
    ];
  }

  private altar() {
    if (!this.hasRosary) {
      this.talk("Góc Cầu Nguyện", "🕯️", ["Em chưa có chuỗi Mân Côi. Hãy tìm quanh phòng trước nhé: bàn học, kệ sách, đầu giường."]);
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
        ["Em thắp nến và thầm thì:", "“Lạy Chúa, con muốn lần hạt Mân Côi mà nhiều khi con chẳng hình dung được các Mầu Nhiệm là gì…”"],
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
        "Chúa Thánh Thần",
        "🕊️",
        [
          "Một làn gió nhẹ thổi qua khung cửa sổ. Chim Bồ Câu trắng tỏa sáng bay vào, đậu bên bàn thờ nhỏ.",
          "“Đừng lo, con yêu dấu! Ta là Đấng Bảo Trợ. Hãy nắm lấy Chuỗi Mân Côi và bước vào luồng sáng này, Ta sẽ đưa con đi gặp Mẹ Maria và Chúa Giêsu qua từng biến cố cứu độ!”",
          "Hãy làm dấu Thánh Giá để bắt đầu hành trình.",
        ],
        undefined,
        [{ label: "✝️ Nhân danh Cha và Con và Thánh Thần. Amen.", onSelect: () => this.openPortal() }]
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
