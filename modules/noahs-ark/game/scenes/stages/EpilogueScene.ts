import { BaseNoahScene, DEPTH } from "@/modules/noahs-ark/game/scenes/BaseNoahScene";
import { registerPrologueTextures } from "@/modules/noahs-ark/game/utils/prologueTextures";
import { registerVoyageTextures } from "@/modules/noahs-ark/game/utils/voyageTextures";
import { NOAH_TEXT } from "@/modules/noahs-ark/data/stageText";
import { tr, type L } from "@/modules/noahs-ark/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import EventBus from "@/modules/shared/game/EventBus";
import { resetProgress } from "@/modules/noahs-ark/utils/saveManager";
import { FIRST_SCENE } from "@/modules/noahs-ark/game/scenes/PreloadScene";

const ROOM_W = 320;
const ROOM_H = 240;
const WALL = 48;
const WINDOW: [number, number] = [76, 4];
const DESK: [number, number] = [200, 90];
const ALTAR: [number, number] = [276, 84];

interface Quiz { q: L; right: L; wrong: L[]; options: L[] }

/** Epilogue: back in the little room after the rain. Three corners, three promises of the Sailor of Faith. */
export class EpilogueScene extends BaseNoahScene {
  private done = [false, false, false];
  private finished = false;

  constructor() {
    super("EpilogueScene");
    this.worldWidth = ROOM_W;
    this.worldHeight = ROOM_H;
    this.stageKey = "epilogue_con_tau_hoi_thanh";
    this.spawn = [160, 200];
  }

  create() {
    this.done = [false, false, false];
    this.finished = false;
    this.intro = { illustration: "epilogue", speaker: NOAH_TEXT.epilogue.speaker, lines: NOAH_TEXT.epilogue.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerPrologueTextures(this);
    registerVoyageTextures(this);
    this.add.tileSprite(0, WALL, ROOM_W, ROOM_H - WALL, "floor_wood").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 0, ROOM_W, WALL, "wall_paper").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, WALL, ROOM_W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.block(ROOM_W / 2, (WALL + 6) / 2, ROOM_W, WALL + 6);
    this.block(8, ROOM_H / 2, 16, ROOM_H);
    this.block(ROOM_W - 8, ROOM_H / 2, 16, ROOM_H);
    this.block(ROOM_W / 2, ROOM_H - 8, ROOM_W, 16);

    // open window with the rainbow, and a warm sunbeam across the floor
    this.add.image(WINDOW[0], WINDOW[1], "rainbow_window").setOrigin(0.5, 0).setDepth(DEPTH.FLOOR);
    this.add.graphics().setDepth(DEPTH.LIGHT).fillStyle(0xfef08a, 0.2).fillPoints([{ x: 56, y: 44 }, { x: 98, y: 44 }, { x: 150, y: 190 }, { x: 80, y: 190 }], true);
    this.add.rectangle(0, 0, ROOM_W, ROOM_H, 0xfde68a, 0.08).setOrigin(0).setDepth(DEPTH.LIGHT);
    const g = this.add.graphics().setDepth(DEPTH.RUG);
    const r = (x: number, y: number, w: number, h: number, c: number) => g.fillStyle(c, 1).fillRect(104 + x, 130 + y, w, h);
    r(0, 0, 112, 72, 0x1e3a8a); r(4, 4, 104, 64, 0x1d4ed8); r(8, 8, 96, 2, 0xfef08a); r(8, 62, 96, 2, 0xfef08a); r(50, 30, 12, 12, 0xfef08a); r(53, 33, 6, 6, 0x1e3a8a);

    this.prop(140, 66, "bookshelf", 28, 8);
    this.prop(DESK[0], DESK[1], "desk", 40, 10);
    this.prop(ALTAR[0], ALTAR[1], "home_altar", 32, 10);
    this.prop(40, 210, "schoolbag", 12, 6);
    this.add.image(DESK[0] + 8, DESK[1] - 14, "ark_model_done").setOrigin(0.5, 1).setDepth(DESK[1] + 1); // the finished ark
    this.add.image(DESK[0] - 12, DESK[1] - 14, "book_open").setOrigin(0.5, 1).setDepth(DESK[1] + 1);
    this.add.image(ALTAR[0] - 18, ALTAR[1] - 4, "noah_olive").setOrigin(0.5, 1).setDepth(ALTAR[1] + 1);
    const lamp = this.add.image(DESK[0] + 22, DESK[1] - 12, "noah_glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.3);
    this.tweens.add({ targets: lamp, alpha: 0.5, duration: 1800, yoyo: true, repeat: -1 });

    this.interactables = [
      { x: DESK[0], y: DESK[1] - 4, r: 38, label: "[A] Mô hình Con Tàu Gỗ", act: () => this.ask(0, NOAH_TEXT.epilogue.ark) },
      { x: WINDOW[0], y: WALL + 8, r: 34, label: "[A] Cửa sổ Cầu Vồng", act: () => this.window() },
      { x: ALTAR[0], y: ALTAR[1] + 4, r: 36, label: "[A] Góc Cầu Nguyện", act: () => this.ask(2, NOAH_TEXT.epilogue.prayer) },
    ];
  }

  protected onStageStart() {
    this.spawnDove(170, 150); // the Holy Spirit keeps the child company
  }

  private ask(i: 0 | 2, quiz: Quiz) {
    const right = tr(quiz.right);
    this.talk("Chúa Thánh Thần", [tr(quiz.q)], undefined, quiz.options.map((o) => ({
      label: tr(o),
      onSelect: () => {
        if (tr(o) !== right) {
          audio.sfx("wrong");
          this.talk("Chúa Thánh Thần", quiz.wrong.map(tr));
          return;
        }
        audio.sfx("chime");
        this.talk("Em", [right], () => this.mark(i));
      },
    })));
  }

  private window() {
    audio.sfx("bless");
    this.sparkleBurst(WINDOW[0], WINDOW[1] + 24);
    this.talk("Chúa Thánh Thần", NOAH_TEXT.epilogue.window.map(tr), () => this.mark(1));
  }

  private mark(i: number) {
    this.done[i] = true;
    const left = this.done.filter((d) => !d).length;
    if (left) return this.talk("Hải Đồ Giao Ước", [tr(NOAH_TEXT.epilogue.left).replace("{n}", String(left))]);
    if (this.finished) return;
    this.finished = true;
    this.cameras.main.flash(500, 255, 244, 180);
    this.finishStage({ outro: NOAH_TEXT.epilogue.done, lesson: NOAH_TEXT.epilogue.lesson });
  }

  /** Last scene of the journey: "THE END" banner, thank-you, then stay or replay from the start. */
  protected goToNextStage() {
    audio.sfx("complete");
    [[80, 80], [160, 60], [240, 80]].forEach(([x, y], i) => this.time.delayedCall(i * 300, () => this.sparkleBurst(x, y, 14)));
    const banner = this.add
      .text(ROOM_W / 2, 120, "HẾT · THE END", { fontFamily: "Dearpix, monospace", fontSize: "20px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 8, y: 4 }, resolution: 4 })
      .setOrigin(0.5).setDepth(DEPTH.UI);
    this.tweens.add({ targets: banner, y: 116, duration: 600, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2] });
    this.talk("Hải Đồ Giao Ước", NOAH_TEXT.epilogue.end.map(tr), undefined, [
      { label: "🏠 Ở lại căn phòng", onSelect: () => banner.destroy() },
      { label: "🔄 Chơi lại từ đầu", onSelect: () => this.replay() },
    ]);
  }

  private replay() {
    resetProgress(); // keeps the character
    EventBus.emit("game-restart"); // HUD re-reads the wiped save
    const cam = this.cameras.main;
    cam.fadeOut(600, 0, 0, 0);
    cam.once("camerafadeoutcomplete", () => this.scene.start(FIRST_SCENE));
  }
}
