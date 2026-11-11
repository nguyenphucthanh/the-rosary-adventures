import * as Phaser from "phaser";
import { BaseExodusScene, DEPTH } from "@/modules/moses-the-exodus/game/scenes/BaseExodusScene";
import { registerSiteTextures } from "@/modules/moses-the-exodus/game/utils/siteTextures";
import { registerPrologueTextures } from "@/modules/moses-the-exodus/game/utils/prologueTextures";
import { registerEpilogueTextures } from "@/modules/moses-the-exodus/game/utils/epilogueTextures";
import { EPILOGUE, tr, type L } from "@/modules/moses-the-exodus/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const ROOM_W = 320;
const ROOM_H = 240;
const WALL = 48;
const WINDOW: [number, number] = [76, 4];
const DESK: [number, number] = [200, 90];
const ALTAR: [number, number] = [276, 84];
// The three bridges: Red Sea corner (left), study desk (middle), prayer corner (right)
const SPOTS: [number, number][] = [[52, 120], [DESK[0] + 8, DESK[1] - 2], [ALTAR[0], ALTAR[1] + 4]];

type Q = { q: L; a: { label: L; right: boolean }[] };

/** Epilogue: the Holy Spirit asks three questions that join the Exodus (Red Sea, manna, tablets) to Jesus. */
export class EpilogueScene extends BaseExodusScene {
  private bridge = 0;
  private busy = true;
  private glows: Phaser.GameObjects.Image[] = [];
  private label?: Phaser.GameObjects.Text;
  private dove?: Phaser.GameObjects.Sprite;

  constructor() {
    super("EpilogueScene");
    this.worldWidth = ROOM_W;
    this.worldHeight = ROOM_H;
    this.stageKey = "epilogue_vuot_qua_moi";
    this.spawn = [160, 190];
  }

  create() {
    this.bridge = 0;
    this.busy = true;
    this.glows = [];
    this.intro = { illustration: "end", speaker: tx("Cuốn Sách Xuất Hành", "The Book of Exodus"), lines: EPILOGUE.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerPrologueTextures(this); // floor_wood, wall_paper, bookshelf, desk, home_altar, book_open, map_done, rosary_lit
    registerSiteTextures(this); // site_jar
    registerEpilogueTextures(this);
    this.add.tileSprite(0, WALL, ROOM_W, ROOM_H - WALL, "floor_wood").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 0, ROOM_W, WALL, "wall_paper").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, WALL, ROOM_W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.block(ROOM_W / 2, (WALL + 6) / 2, ROOM_W, WALL + 6);
    this.block(8, ROOM_H / 2, 16, ROOM_H);
    this.block(ROOM_W - 8, ROOM_H / 2, 16, ROOM_H);
    this.block(ROOM_W / 2, ROOM_H - 8, ROOM_W, 16);

    // dawn window (2-frame loop) + a warm sunbeam on the floor
    if (!this.anims.exists("ep_dawn_window")) this.anims.create({ key: "ep_dawn_window", frames: this.anims.generateFrameNumbers("ep_dawn_window", { start: 0, end: 1 }), frameRate: 1, repeat: -1 });
    this.add.sprite(WINDOW[0], WINDOW[1], "ep_dawn_window").setOrigin(0.5, 0).setDepth(DEPTH.FLOOR).play("ep_dawn_window");
    this.add.graphics().setDepth(DEPTH.LIGHT).fillStyle(0xfde68a, 0.14).fillPoints([{ x: 56, y: 44 }, { x: 98, y: 44 }, { x: 150, y: 190 }, { x: 80, y: 190 }], true);

    // warm rug under the three stations
    const g = this.add.graphics().setDepth(DEPTH.RUG);
    const r = (x: number, y: number, w: number, h: number, c: number) => g.fillStyle(c, 1).fillRect(104 + x, 150 + y, w, h);
    r(0, 0, 112, 60, 0x92400e); r(4, 4, 104, 52, 0xa16207); r(8, 8, 96, 2, 0xfef08a); r(8, 50, 96, 2, 0xfef08a); r(50, 24, 12, 12, 0xfef08a); r(53, 27, 6, 6, 0x92400e);

    // props: shelf, desk with open book + manna + water jar, altar, Passover door + lamb + the Red Sea map pinned on the wall
    this.prop(140, 66, "bookshelf", 28, 8);
    this.prop(DESK[0], DESK[1], "desk", 40, 10);
    this.prop(ALTAR[0], ALTAR[1], "home_altar", 32, 10);
    this.prop(40, 210, "schoolbag", 12, 6);
    this.add.image(DESK[0] - 14, DESK[1] - 14, "book_open").setOrigin(0.5, 1).setDepth(DESK[1] + 1);
    this.add.image(DESK[0] + 8, DESK[1] - 14, "exodus_manna").setOrigin(0.5, 1).setDepth(DESK[1] + 1);
    this.add.image(DESK[0] + 26, DESK[1] - 12, "site_jar").setOrigin(0.5, 1).setDepth(DESK[1] + 1);
    this.add.image(34, 50, "map_done").setOrigin(0.5, 1).setDepth(DEPTH.RUG + 1);
    this.prop(36, 112, "ep_door", 14, 6);
    this.add.image(64, 128, "exodus_lamb").setOrigin(0.5, 1).setDepth(128);
    this.add.image(ALTAR[0] - 18, ALTAR[1] - 4, "exodus_staff").setOrigin(0.5, 1).setDepth(ALTAR[1] + 1);

    // station glows (current one pulses brightly)
    SPOTS.forEach(([x, y], i) => {
      const glow = this.add.image(x, y - 10, "exodus_glow_gold").setDepth(DEPTH.LIGHT).setAlpha(0.2);
      this.glows.push(glow);
      this.interactables.push({ x, y, r: 36, label: () => tr(EPILOGUE.spots[i]), active: () => !this.busy && this.bridge <= 2, act: () => this.station(i) });
    });
    this.label = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
  }

  protected onStageStart() {
    this.dove = this.spawnDove(150, 168);
    this.sparkleBurst(150, 160, 10);
    audio.sfx("bless");
    this.talk(EPILOGUE.speaker, EPILOGUE.start.map(tr), () => { this.busy = false; this.highlight(); });
  }

  private highlight() {
    this.glows.forEach((gl, i) => {
      this.tweens.killTweensOf(gl);
      const cur = i === this.bridge;
      gl.setAlpha(i < this.bridge ? 0.7 : cur ? 0.5 : 0.15);
      if (cur) this.tweens.add({ targets: gl, alpha: 0.95, duration: 800, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    });
  }

  private station(i: number) {
    if (i !== this.bridge) {
      audio.sfx("wrong");
      this.busy = true;
      this.talk(EPILOGUE.speaker, i < this.bridge ? [tr(EPILOGUE.right[i])] : [tr(EPILOGUE.order)], () => { this.busy = false; });
      return;
    }
    const q: Q = [{ q: EPILOGUE.q1, a: EPILOGUE.a1 }, { q: EPILOGUE.q2, a: EPILOGUE.a2 }, { q: EPILOGUE.q3, a: EPILOGUE.a3 }][i];
    this.busy = true;
    this.talk(EPILOGUE.speaker, [tr(q.q)], undefined, q.a.map((o) => ({
      label: tr(o.label),
      onSelect: () => {
        if (o.right) { audio.sfx("chime"); this.correct(i); return; }
        audio.sfx("wrong");
        this.talk(EPILOGUE.speaker, EPILOGUE.wrong.map(tr), () => { this.busy = false; });
      },
    })));
  }

  private correct(i: number) {
    this.bridge = i + 1;
    this.sparkleBurst(SPOTS[i][0], SPOTS[i][1] - 12, 10);
    this.highlight();
    this.talk(EPILOGUE.speaker, [tr(EPILOGUE.right[i])], () => {
      if (this.bridge >= 3) this.finale(); else this.busy = false;
    });
  }

  /** The Journey Tablets, Genesis scroll, Noah's chart and the Rosary come together at the prayer corner. */
  private finale() {
    audio.sfx("bless");
    this.cameras.main.flash(600, 255, 244, 200);
    const [ax, ay] = ALTAR;
    const items: [string, number, number][] = [["exodus_tablets", ax - 62, ay + 30], ["ep_scroll", ax - 38, ay + 32], ["ep_chart", ax - 14, ay + 32], ["rosary_lit", ax + 10, ay + 32]];
    items.forEach(([k, x, y], n) => {
      const glow = this.add.image(x, y - 8, "exodus_glow_gold").setDepth(y - 1).setAlpha(0);
      const img = this.add.image(x, y, k).setOrigin(0.5, 1).setDepth(y).setAlpha(0);
      this.tweens.add({ targets: [img, glow], alpha: { from: 0, to: 1 }, duration: 500, delay: 250 * n, ease: "Stepped", easeParams: [4] });
      this.tweens.add({ targets: glow, alpha: 0.55, duration: 900, delay: 250 * n + 600, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    });
    this.sparkleBurst(ax, ay + 10, 14);
    this.time.delayedCall(1400, () => this.talk(EPILOGUE.speaker, EPILOGUE.finale.map(tr), () => {
      audio.sfx("complete");
      this.completeStage();
      this.talk(tx("Suy niệm", "Reflection"), [tr(EPILOGUE.lesson)], () => this.theEnd());
    }));
  }

  private theEnd() {
    this.talk(tx("Hoàn thành hành trình", "Journey complete"), EPILOGUE.theEnd.map(tr), undefined, [
      { label: tx("Về trang chủ", "Back to home"), onSelect: () => window.location.assign(window.location.origin) },
      { label: tx("Chơi lại từ đầu", "Play again from the start"), onSelect: () => { const cam = this.cameras.main; cam.fadeOut(600, 0, 0, 0); cam.once("camerafadeoutcomplete", () => this.scene.start("PrologueScene")); } },
    ]);
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    const view = this.cameras.main.worldView;
    this.label?.setPosition(Math.round(view.centerX), Math.round(view.y + this.safeInsetTop() + 4)).setText(`${tr(EPILOGUE.bridgeHud)} ${Math.min(this.bridge, 3)}/3`);
  }
}
