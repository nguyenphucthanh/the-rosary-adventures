import * as Phaser from "phaser";
import { DEPTH } from "@/modules/the-rosary-adventures/game/scenes/BaseMysteryScene";
import { InteractiveScene, type Pickup } from "@/modules/the-rosary-adventures/game/scenes/InteractiveScene";
import { registerAnnunciationTextures } from "@/modules/the-rosary-adventures/game/utils/npcTextureGenerator";
import { registerVisitationTextures } from "@/modules/the-rosary-adventures/game/utils/visitationTextureGenerator";
import { registerInfancyTextures } from "@/modules/the-rosary-adventures/game/utils/infancyTextureGenerator";
import { t as tx } from "@/modules/shared/i18n";

const W = 800;
const H = 600;
const CX = 400;
const CAVE_Y = 250; // foot of the cave image (240x136)
const FLOOR_Y = 208; // top of the walkable floor band inside the cave
const HEARTH: [number, number] = [CX - 70, 242]; // front-left corner inside the cave
const WOOD_SPOTS: [number, number][] = [[150, 300], [620, 330], [250, 510]];
const FLINT_SPOT: [number, number] = [690, 540];
const SHEPHERD_SPOTS: [number, number][] = [[120, 440], [690, 400]];

export class Joyful03NativityScene extends InteractiveScene {
  private woodPickups: (Pickup | null)[] = [];
  private flintPickup: Pickup = [];
  private shepherds: Phaser.GameObjects.Sprite[] = [];
  private fire?: Phaser.GameObjects.Sprite;
  private hearthHints: Phaser.GameObjects.Image[] = [];

  private wood = 0;
  private hasFlint = false;
  private fireLit = false;
  private guided = [false, false];
  private finished = false;

  constructor() {
    super("Joyful03NativityScene");
    this.worldWidth = W;
    this.worldHeight = H;
  }

  create() {
    registerAnnunciationTextures(this);
    registerVisitationTextures(this);
    registerInfancyTextures(this);
    this.wood = 0;
    this.hasFlint = this.fireLit = this.finished = false;
    this.guided = [false, false];
    this.woodPickups = [];
    this.shepherds = [];
    this.walkers = [];
    this.fire = undefined;

    this.physics.world.setBounds(0, 0, W, H);
    this.obstacles = this.physics.add.staticGroup();

    this.buildLand();
    this.buildProps();
    this.buildCharacters();
    this.buildItems();
    this.buildLight();
    this.defineInteractables();

    this.begin("vui_03_sinh_chua", [CX, 540], {
      speaker: tx("Đêm Bê-lem", "Night in Bethlehem"),
      emoji: "⭐",
      lines: [
        tx("Mầu Nhiệm Thứ Ba: Đức Bà Sinh Đức Chúa Giêsu Nơi Hang Đá (Lc 2, 1-20).", "Third Mystery: The Birth of Jesus in the Stable (Lk 2:1-20)."),
        tx("Đêm đông lạnh giá. Hang đá chiên bò thật tối và vắng. Đức Mẹ và Thánh Giuse đang chờ giờ Chúa ra đời.", "A cold winter night. The stable is dark and empty. Mary and Joseph await the hour of the Lord's birth."),
        tx("Hãy nhặt 3 cành củi khô, tìm viên đá lửa để nhóm lửa sưởi ấm ở góc hang (nơi có mũi tên vàng), rồi dẫn các mục đồng lạc đường về hang nhé!", "Pick up 3 dry sticks, find a flint to light a fire to warm the corner of the cave (where the gold arrow is), then guide the lost shepherds to the stable!"),
      ],
    });
  }

  // ---------- world ----------

  private buildLand() {
    this.add.tileSprite(0, 0, W, H, "night_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    // dirt path from the south up to the cave mouth
    this.add.tileSprite(CX - 24, CAVE_Y, 48, H - CAVE_Y, "dirt_tile").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.edgeWalls(W, H);
  }

  private buildProps() {
    this.add.image(CX, CAVE_Y, "stable_cave").setOrigin(0.5, 1).setDepth(100);
    this.block(CX - 100, CAVE_Y - 68, 40, 136);
    this.block(CX + 100, CAVE_Y - 68, 40, 136);
    this.block(CX, (CAVE_Y - 136 + FLOOR_Y) / 2, 240, FLOOR_Y - (CAVE_Y - 136));

    // boulder rows along the top and bottom edges (gap for the path at the bottom)
    for (let k = 0; k < 25; k++) {
      const x = 16 + 32 * k;
      this.prop(x, 44, "boulder", 30, 10);
      if (Math.abs(x - CX) > 40) this.prop(x, 594, "boulder", 30, 10);
    }
    for (const [x, y] of [[60, 130], [740, 120], [200, 90], [610, 100], [50, 330], [760, 300], [110, 540], [700, 500], [280, 400], [530, 450], [240, 220], [570, 230]])
      this.prop(x, y, "hill_tree", 10, 8);
    this.prop(290, 262, "hay_bale", 26, 10);
    this.prop(520, 268, "hay_bale", 26, 10);
    this.prop(560, 300, "crate", 18, 10);

    // cold hearth: stone ring until the fire is lit
    for (const [dx, dy] of [[-8, 0], [8, 0], [0, -4], [0, 4]])
      this.add.rectangle(HEARTH[0] + dx, HEARTH[1] + dy - 2, 5, 3, 0x6b6f78).setDepth(HEARTH[1] - 1);

    // beacon over the cold hearth: bobbing arrow + pulsing glow, removed once lit
    const arrow = this.add.image(HEARTH[0], HEARTH[1] - 26, "arrow_down").setDepth(DEPTH.FX);
    const beacon = this.add.image(HEARTH[0], HEARTH[1] - 6, "glow_small").setDepth(HEARTH[1] - 2).setAlpha(0.35);
    this.tweens.add({ targets: arrow, y: HEARTH[1] - 31, duration: 500, yoyo: true, repeat: -1, ease: "Stepped" });
    this.tweens.add({ targets: beacon, alpha: 0.7, duration: 800, yoyo: true, repeat: -1 });
    this.hearthHints = [arrow, beacon];

    // flowers of the field: a few sleeping lilies near the path
    for (const [x, y] of [[352, 300], [446, 380], [350, 470], [452, 520]]) this.add.image(x, y, "flower_w").setOrigin(0.5, 1).setDepth(y);
  }

  private buildCharacters() {
    // Holy Family inside the cave mouth (no colliders on people so a child can never be trapped)
    this.add.sprite(CX - 34, 218, "mary_praying").setOrigin(0.5, 1).setDepth(218);
    this.add.sprite(CX + 34, 218, "joseph").setOrigin(0.5, 1).setDepth(218);
    this.prop(CX, 216, "manger", 40, 10);
    this.add.image(CX, 202, "baby").setOrigin(0.5, 1).setDepth(217);

    SHEPHERD_SPOTS.forEach(([x, y], i) => {
      const s = this.add.sprite(x, y, "shepherd").setOrigin(0.5, 1).setDepth(y);
      const sheep = this.add.sprite(x + (i ? -22 : 22), y + 2, "sheep").setOrigin(0.5, 1).setDepth(y);
      this.shepherds.push(s);
      this.walkers.push(s, sheep);
      s.setData({ sheep, hint: this.hint(x, y - 34) });
    });
  }

  private buildItems() {
    WOOD_SPOTS.forEach(([x, y]) => this.woodPickups.push(this.pickup(x, y, "firewood")));
    this.flintPickup = this.pickup(FLINT_SPOT[0], FLINT_SPOT[1], "flint");
  }

  private buildLight() {
    // the Bethlehem star + a flat beam down to the manger
    const star = this.add.image(CX, 76, "star_big").setDepth(DEPTH.FX);
    this.tweens.add({ targets: star, y: 72, duration: 1400, yoyo: true, repeat: -1, ease: "Stepped" });
    const halo = this.add.image(CX, 76, "glow_gold").setDepth(4600).setAlpha(0.5);
    this.tweens.add({ targets: halo, alpha: 0.8, duration: 1600, yoyo: true, repeat: -1 });
    this.add
      .graphics()
      .setDepth(3)
      .fillStyle(0xfef08a, 0.1)
      .fillPoints([{ x: CX - 8, y: 84 }, { x: CX + 8, y: 84 }, { x: CX + 40, y: CAVE_Y - 60 }, { x: CX - 40, y: CAVE_Y - 60 }], true);

    // glow from the Child (the real light of the cave)
    const babyGlow = this.add.image(CX, 198, "glow_gold").setDepth(4600).setAlpha(0.4);
    this.tweens.add({ targets: babyGlow, alpha: 0.65, duration: 1800, yoyo: true, repeat: -1 });

    // cold night, applied last so lights read through it
    this.add.rectangle(0, 0, W, H, 0x0b1030, 0.38).setOrigin(0).setDepth(4500);
  }

  // ---------- interaction ----------

  private defineInteractables() {
    WOOD_SPOTS.forEach(([x, y], i) =>
      this.interactables.push({
        at: () => [x, y],
        r: 36,
        label: () => tx("[A] Nhặt củi khô", "[A] Pick up dry sticks"),
        active: () => this.woodPickups[i] !== null,
        act: () => {
          this.vanish(this.woodPickups[i]!);
          this.woodPickups[i] = null;
          this.wood++;
          this.talk(tx("Cành Củi Khô", "Dry Stick"), "🪵", [
            this.wood < 3 ? tx(`Bạn nhặt được cành củi khô thứ ${this.wood}/3.`, `You picked up dry stick number ${this.wood}/3.`) : tx("Đủ 3 cành củi rồi! Hãy tìm viên đá lửa nhé.", "That's 3 sticks! Now find a flint."),
          ]);
        },
      })
    );

    this.interactables.push(
      {
        at: () => FLINT_SPOT,
        r: 36,
        label: () => tx("[A] Nhặt đá lửa", "[A] Pick up the flint"),
        active: () => !this.hasFlint,
        act: () => {
          this.hasFlint = true;
          this.vanish(this.flintPickup);
          this.talk(tx("Viên Đá Lửa", "Flint"), "🪨", [tx("Bạn nhặt được viên đá lửa. Cộc cộc... có tia lửa nhỏ lóe lên!", "You picked up a flint. Tap tap... a little spark flashes!"), tx("Hãy mang đến bếp lửa trước cửa hang.", "Bring it to the fireplace at the cave entrance.")]);
        },
      },
      {
        at: () => HEARTH,
        r: 44,
        label: () => (this.wood >= 3 && this.hasFlint ? tx("[A] Nhóm lửa", "[A] Light the fire") : tx("[A] Xem bếp lửa", "[A] Look at the fireplace")),
        active: () => !this.fireLit,
        act: () => (this.wood >= 3 && this.hasFlint ? this.lightFire() : this.hearthHint()),
      }
    );

    this.shepherds.forEach((s, i) =>
      this.interactables.push({
        at: () => [s.x, s.y],
        r: 44,
        label: () => tx("[A] Chỉ đường cho mục đồng", "[A] Show the shepherds the way"),
        active: () => !this.guided[i],
        act: () => this.guideShepherd(i),
      })
    );

    this.interactables.push(
      {
        at: () => [CX - 32, 218 + 14],
        r: 26,
        label: () => tx("[A] Trò chuyện với Đức Mẹ", "[A] Talk to Mary"),
        active: () => !this.finished,
        act: () =>
          this.talk(tx("Đức Mẹ Maria", "Mother Mary"), "💙", [
            tx("Con ơi, đêm nay lạnh quá, nhưng lòng Mẹ ấm áp lạ lùng.", "My child, tonight is so cold, but my heart is wonderfully warm."),
            tx("Hài Nhi của chúng ta nằm trong máng cỏ. Chúa đã chọn sự nghèo khó để đến với nhân loại.", "Our Little One lies in the manger. The Lord chose poverty to come to mankind."),
          ]),
      },
      {
        at: () => [CX + 34, 218 + 14],
        r: 26,
        label: () => tx("[A] Trò chuyện với Thánh Giuse", "[A] Talk to Saint Joseph"),
        active: () => !this.finished,
        act: () =>
          this.talk(tx("Thánh Giuse", "Saint Joseph"), "🧔", [
            tx("Không có chỗ trong nhà trọ, ta đành nghỉ trong hang chiên bò này.", "There was no room at the inn, so we rest in this stable."),
            tx("Nhưng có Chúa ở cùng, hang đá nghèo cũng thành cung điện.", "But with the Lord here, even a poor stable becomes a palace."),
            this.fireLit ? tx("Cảm ơn con đã nhóm lửa! Hài Nhi ấm hơn nhiều rồi.", "Thank you for lighting the fire! The Baby is much warmer now.") : tx("Giá mà có chút lửa sưởi ấm cho Hài Nhi...", "If only there were a little fire to warm the Baby..."),
          ]),
      },
      {
        at: () => [CX, 234],
        r: 34,
        label: () => tx("[A] Quỳ trước Hài Nhi", "[A] Kneel before the Baby"),
        active: () => !this.finished,
        act: () => this.kneel(),
      }
    );
  }

  private hearthHint() {
    const lines = [
      this.wood < 3 ? tx(`Bếp lửa còn trống. Cần thêm củi khô (${this.wood}/3).`, `The fireplace is empty. We need more dry sticks (${this.wood}/3).`) : tx("Đã đủ củi, nhưng còn thiếu thứ để đánh lửa.", "We have enough sticks, but we still need something to strike a fire."),
      this.hasFlint ? tx("Bạn đã có đá lửa.", "You already have the flint.") : tx("Hãy tìm viên đá lửa quanh đồi Bê-lem.", "Look for a flint around the hills of Bethlehem."),
    ];
    this.talk(tx("Bếp Lửa", "Fireplace"), "🔥", lines);
  }

  private lightFire() {
    this.fireLit = true;
    this.hearthHints.forEach((h) => h.destroy());
    if (!this.anims.exists("campfire_burn"))
      this.anims.create({ key: "campfire_burn", frames: this.anims.generateFrameNumbers("campfire", { start: 0, end: 1 }), frameRate: 5, repeat: -1 });
    this.fire = this.add.sprite(HEARTH[0], HEARTH[1], "campfire").setOrigin(0.5, 1).setDepth(HEARTH[1]).play("campfire_burn");
    const glow = this.add.image(HEARTH[0], HEARTH[1] - 8, "glow_gold").setDepth(4600).setAlpha(0.6);
    this.tweens.add({ targets: glow, alpha: 0.85, duration: 500, yoyo: true, repeat: -1 });
    this.sparkleBurst(HEARTH[0], HEARTH[1] - 12);
    this.talk(tx("Bếp Lửa", "Fireplace"), "🔥", [tx("Phựt! Ngọn lửa bừng lên, ấm áp cả góc hang.", "Whoosh! The flame bursts up and warms the whole corner of the cave."), tx("Ánh lửa sáng sẽ giúp các mục đồng lạc đường nhìn thấy hang đá.", "The bright firelight will help the lost shepherds see the stable.")]);
  }

  private guideShepherd(i: number) {
    this.guided[i] = true;
    const s = this.shepherds[i];
    const sheep = s.getData("sheep") as Phaser.GameObjects.Sprite;
    (s.getData("hint") as Phaser.GameObjects.Image).destroy();
    this.talk(
      tx("Mục Đồng", "Shepherd"),
      "🐑",
      [
        i ? tx("Tôi lạc mất đường trong đêm tối rồi...", "I've lost my way in the dark...") : tx("Đàn chiên của tôi sợ lắm, trời lạnh quá!", "My flock is so scared, and it's so cold!"),
        tx("Ô kìa, ngôi sao lạ trên kia! Có thiên thần báo tin vui: 'Hôm nay đã sinh ra cho anh em một Đấng Cứu Độ!' (Lc 2, 11)", "Oh look, a strange star up there! An angel brings good news: ‘Today a Savior is born to you!’ (Lk 2:11)"),
        tx("Cảm ơn bạn đã chỉ đường. Chúng tôi đi theo ánh sao đến hang đá ngay!", "Thank you for showing us the way. We'll follow the star to the stable right now!"),
      ],
      () => {
        const dx = i ? 26 : -26;
        this.walk(sheep, [[CX + dx * 2, 284]]);
        this.walk(s, [[CX + dx, 276]], () => this.sparkleBurst(s.x, s.y - 16));
      }
    );
  }

  private kneel() {
    if (!this.fireLit || !this.guided[0] || !this.guided[1]) {
      this.talk(tx("Hài Nhi Giêsu", "The Baby Jesus"), "👶", [
        !this.fireLit ? tx("Hang đá còn tối và lạnh. Hãy nhóm lửa sưởi ấm cho Hài Nhi trước nhé.", "The stable is still dark and cold. Light a fire to warm the Baby first.") : tx("Các mục đồng vẫn còn lạc đường ngoài đồi. Hãy dẫn họ về hang!", "The shepherds are still lost on the hills. Guide them to the stable!"),
      ]);
      return;
    }
    this.finished = true;
    this.sparkleBurst(CX, 194);
    this.sparkleBurst(CX - 30, 180);
    this.sparkleBurst(CX + 30, 180);
    this.talk(
      tx("Hài Nhi Giêsu", "The Baby Jesus"),
      "👶",
      [
        tx("Bạn quỳ gối thật khẽ trước máng cỏ. Có tiếng bò lừa thở nhẹ nhàng...", "You kneel very softly before the manger. You hear the gentle breathing of the ox and the donkey..."),
        tx("Từ trời cao vang tiếng hát thiên thần: 'Vinh danh Thiên Chúa trên trời, bình an dưới thế cho loài người Chúa thương.' (Lc 2, 14)", "From high above comes the angels' song: ‘Glory to God in the highest, and on earth peace to those on whom His favor rests.’ (Lk 2:14)"),
        tx("Các mục đồng cúi chào, còn Đức Mẹ thì ghi nhớ mọi điều ấy và suy niệm trong lòng. (Lc 2, 19)", "The shepherds bow, while Mary treasures all these things and ponders them in her heart. (Lk 2:19)"),
      ],
      () =>
        this.time.delayedCall(500, () =>
          this.complete(
            3,
            tx("Năm Sự Vui", "Joyful"),
            tx("Đức Bà Sinh Đức Chúa Giêsu Nơi Hang Đá", "The Birth of Jesus in the Stable"),
            tx("Tinh thần nghèo khó, đơn sơ và lòng yêu mến người nghèo hèn.", "A spirit of poverty, simplicity and love for the poor and lowly."),
            tx("Chúa Giêsu sinh ra trong hang đá nghèo. Hãy yêu mến sự đơn sơ và chia sẻ với người nghèo nhé!", "Jesus was born in a poor stable. Love simplicity and share with the poor!"),
            ["gather_wood", "light_fire", "guide_shepherds", "adore_child"]
          )
        )
    );
  }
}
