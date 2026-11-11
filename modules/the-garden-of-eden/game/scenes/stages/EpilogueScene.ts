import * as Phaser from "phaser";
import { BaseGenesisScene, DEPTH } from "@/modules/the-garden-of-eden/game/scenes/BaseGenesisScene";
import { registerPrologueTextures } from "@/modules/the-garden-of-eden/game/utils/prologueTextures";
import { STAGE_TEXT } from "@/modules/the-garden-of-eden/data/stageText";
import { GENESIS_STAGE_KEYS } from "@/modules/the-garden-of-eden/types/game";
import { tr, type L } from "@/modules/the-garden-of-eden/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 320;
const H = 240;
const WALL = 48;
const PLANT: [number, number] = [76, 74];
const DESK: [number, number] = [200, 90];
const ALTAR: [number, number] = [276, 84];
type Vow = { q: L; ok: L; bad: L[]; done: L };

/** Epilogue: back in the little room, make the Three Promises of the Little Steward (window, desk, prayer corner). */
export class EpilogueScene extends BaseGenesisScene {
  private done = [false, false, false]; // window, desk, altar
  private ended = false;

  constructor() {
    super("EpilogueScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "epilogue_khu_vuon_tam_hon";
    this.spawn = [160, 200];
  }

  create() {
    this.done = [false, false, false];
    this.ended = false;
    this.intro = { illustration: "epilogue", speaker: STAGE_TEXT.s13.speaker, lines: STAGE_TEXT.s13.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerPrologueTextures(this);
    this.add.tileSprite(0, WALL, W, H - WALL, "floor_wood").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 0, W, WALL, "wall_paper").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, WALL, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.block(W / 2, (WALL + 6) / 2, W, WALL + 6); this.block(8, H / 2, 16, H); this.block(W - 8, H / 2, 16, H); this.block(W / 2, H - 8, W, 16);

    // noon window + warm floor light
    this.add.image(76, 4, "morning_window").setOrigin(0.5, 0).setDepth(DEPTH.FLOOR);
    this.add.graphics().setDepth(DEPTH.LIGHT).fillStyle(0xfef9c3, 0.2).fillPoints([{ x: 56, y: 44 }, { x: 98, y: 44 }, { x: 120, y: 170 }, { x: 60, y: 170 }], true);
    const g = this.add.graphics().setDepth(DEPTH.RUG);
    const r = (x: number, y: number, w: number, h: number, c: number) => g.fillStyle(c, 1).fillRect(104 + x, 130 + y, w, h);
    r(0, 0, 112, 72, 0x7f1d1d); r(4, 4, 104, 64, 0xb91c1c); r(8, 8, 96, 2, 0xfef08a); r(8, 62, 96, 2, 0xfef08a); r(50, 30, 12, 12, 0xfef08a); r(53, 33, 6, 6, 0x7f1d1d);

    const plant = this.prop(PLANT[0], PLANT[1], "plant_bloom", 12, 6);
    this.tweens.add({ targets: plant, y: PLANT[1] - 1, duration: 1200, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2] }); // sways in the sun
    this.prop(140, 66, "bookshelf", 28, 8);
    this.prop(DESK[0], DESK[1], "desk", 40, 10);
    this.add.image(DESK[0] - 6, DESK[1] - 14, "book_open").setOrigin(0.5, 1).setDepth(DESK[1] + 1);
    this.prop(ALTAR[0], ALTAR[1], "home_altar", 32, 10);
    this.add.image(ALTAR[0], ALTAR[1] - 8, "rosary_item").setOrigin(0.5, 1).setDepth(ALTAR[1] + 1);
    const lamp = this.add.image(DESK[0] + 14, DESK[1] - 12, "gen_glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.3);
    this.tweens.add({ targets: lamp, alpha: 0.45, duration: 1800, yoyo: true, repeat: -1 });
    this.spawnDove(WALL + 26, 40); // the Spirit perched at the window, watching over
  }

  protected onStageStart() {
    const t = STAGE_TEXT.s13;
    const spot = (i: number, x: number, y: number, r: number, label: string, act: () => void) => ({ x, y: y - 6, r, label, active: () => !this.done[i], act });
    this.interactables = [
      spot(0, PLANT[0], PLANT[1], 34, tx("[A] Cửa sổ & chậu hoa", "[A] Window & flower pot"), () => this.vow(0, tx("Chúa Thánh Thần", "Holy Spirit"), t.window)),
      spot(1, DESK[0], DESK[1], 38, tx("[A] Bàn học", "[A] Study desk"), () => this.vow(1, tx("Chúa Thánh Thần", "Holy Spirit"), t.desk)),
      spot(2, ALTAR[0], ALTAR[1], 38, tx("[A] Góc cầu nguyện", "[A] Prayer corner"), () => this.altar()),
    ];
  }

  /** Pick the answer that lives God's Word; a wrong pick is just a gentle "think again". */
  private vow(i: number, who: string, v: Vow) {
    const opts = Phaser.Utils.Array.Shuffle([v.ok, ...v.bad]);
    this.talk(who, [tr(v.q)], undefined, opts.map((o) => ({
      label: tr(o),
      onSelect: () => {
        if (o !== v.ok) {
          audio.sfx("wrong");
          return this.talk(who, [tx("Hãy nghĩ lại nhé. Điều nào giống Chúa Giêsu và Mẹ Maria vâng phục Chúa hơn?", "Think again. Which is more like Jesus and Mary obeying God?")]);
        }
        this.done[i] = true;
        audio.sfx("bless");
        this.sparkleBurst(this.player.x, this.player.y - 12);
        this.talk(who, [tr(v.done)]);
      },
    })));
  }

  private altar() {
    const t = STAGE_TEXT.s13;
    if (!this.done[0] || !this.done[1]) return this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), [tr(t.notYet)]);
    this.done[2] = true;
    audio.sfx("bless");
    this.cameras.main.flash(500, 255, 244, 180);
    this.sparkleBurst(ALTAR[0], ALTAR[1] - 14, 14);
    this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), t.altar.map(tr), () => this.finish());
  }

  private finish() {
    if (this.ended) return;
    this.ended = true;
    const t = STAGE_TEXT.s13;
    audio.sfx("complete");
    this.completeStage();
    this.talk(tx("Người Quản Gia Nhỏ", "The Little Steward"), t.outro.map(tr), () => this.talk(tx("Suy niệm", "Reflection"), [tr(t.lesson)], () => this.theEnd()));
  }

  /** Banner + choice: replay from the Prologue (character kept, progress cleared) or stay in the room. */
  private theEnd() {
    const cx = this.cameras.main.midPoint.x;
    const banner = this.add.text(cx, 30, tx("★ HOÀN THÀNH ★", "★ COMPLETE ★"), { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 4, y: 2 }, resolution: 4 }).setOrigin(0.5).setDepth(DEPTH.FX);
    this.tweens.add({ targets: banner, alpha: 0.6, duration: 700, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2] });
    this.talk(tx("Cuộn Sách Sáng Thế", "The Genesis Scroll"), [tx("Chúc mừng em đã hoàn thành hành trình Sáng Thế! Em muốn làm gì tiếp theo?", "Congratulations on finishing the Genesis journey! What would you like to do next?")], undefined, [
      { label: tx("▶ Chơi lại từ đầu", "▶ Play again from the start"), onSelect: () => this.restartJourney() },
      { label: tx("Ở lại căn phòng nhỏ", "Stay in the little room"), onSelect: () => {} },
    ]);
  }

  private restartJourney() {
    this.autosave((s) => {
      s.stagesProgress = {};
      s.currentStageKey = GENESIS_STAGE_KEYS[0];
      s.currentStageIndex = 0;
    });
    const cam = this.cameras.main;
    cam.fadeOut(600, 0, 0, 0);
    cam.once("camerafadeoutcomplete", () => this.scene.start("PrologueScene"));
  }
}
