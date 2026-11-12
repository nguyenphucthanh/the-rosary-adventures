import * as Phaser from "phaser";
import { BaseDavidScene, DEPTH } from "@/modules/king-david/game/scenes/BaseDavidScene";
import { registerPrologueTextures } from "@/modules/king-david/game/utils/prologueTextures";
import { EPILOGUE, tr } from "@/modules/king-david/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const ROOM_W = 320;
const ROOM_H = 240;
const WALL = 48;
const WINDOW: [number, number] = [76, 4];
const DESK: [number, number] = [200, 90];
const ALTAR: [number, number] = [276, 84];
const RELIC_SPOTS: [number, number][] = [
  [84, 152],
  [236, 152],
];

/** Epilogue (Lc 1, 32-33; Ga 10, 11; Kh 22, 16): Connect King David's shepherd heart, Psalms, and Eternal Covenant with Jesus the Good Shepherd and King Forever. */
export class EpilogueScene extends BaseDavidScene {
  private relicsDone = [false, false];
  private finished = false;
  private label?: Phaser.GameObjects.Text;
  private crownOnAltar!: Phaser.GameObjects.Image;

  constructor() {
    super("EpilogueScene");
    this.worldWidth = ROOM_W;
    this.worldHeight = ROOM_H;
    this.stageKey = "epilogue_con_vua_davit";
    this.spawn = [160, 188];
  }

  create() {
    this.relicsDone = [false, false];
    this.finished = false;
    this.intro = { illustration: "end", speaker: EPILOGUE.speaker, lines: EPILOGUE.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerPrologueTextures(this);
    this.add.tileSprite(0, WALL, ROOM_W, ROOM_H - WALL, "floor_wood").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 0, ROOM_W, WALL, "wall_paper").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, WALL, ROOM_W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.block(ROOM_W / 2, (WALL + 6) / 2, ROOM_W, WALL + 6);
    this.block(8, ROOM_H / 2, 16, ROOM_H);
    this.block(ROOM_W - 8, ROOM_H / 2, 16, ROOM_H);
    this.block(ROOM_W / 2, ROOM_H - 8, ROOM_W, 16);

    // Dawn window + warm golden morning sunbeam on the floor
    this.add.sprite(WINDOW[0], WINDOW[1], "prologue_night_window").setOrigin(0.5, 0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(WINDOW[0], WINDOW[1] + 4, 28, 30, 0xfde68a, 0.45).setOrigin(0.5, 0).setDepth(DEPTH.FLOOR + 1);
    this.add
      .graphics()
      .setDepth(DEPTH.LIGHT)
      .fillStyle(0xfef08a, 0.18)
      .fillPoints(
        [
          { x: 56, y: 44 },
          { x: 98, y: 44 },
          { x: 140, y: 180 },
          { x: 64, y: 180 },
        ],
        true
      );

    // Royal blue-and-gold rug in the centre
    const g = this.add.graphics().setDepth(DEPTH.RUG);
    const r = (x: number, y: number, w: number, h: number, c: number) => g.fillStyle(c, 1).fillRect(104 + x, 130 + y, w, h);
    r(0, 0, 112, 72, 0x1e3a8a);
    r(4, 4, 104, 64, 0x1d4ed8);
    r(8, 8, 96, 2, 0xfbbf24);
    r(8, 62, 96, 2, 0xfbbf24);
    r(50, 30, 12, 12, 0xfbbf24);
    r(53, 33, 6, 6, 0x1e3a8a);

    this.prop(140, 66, "bookshelf", 28, 8);
    this.prop(DESK[0], DESK[1], "desk", 40, 10);
    this.prop(ALTAR[0], ALTAR[1], "home_altar", 32, 10);
    this.prop(40, 210, "schoolbag", 12, 6);

    this.add.image(DESK[0] + 6, DESK[1] - 14, "david_map_done").setOrigin(0.5, 1).setDepth(DESK[1] + 1);
    this.add.image(DESK[0] - 14, DESK[1] - 14, "book_open").setOrigin(0.5, 1).setDepth(DESK[1] + 1);
    this.add.image(DESK[0] + 24, DESK[1] - 12, "desk_lamp_on").setOrigin(0.5, 1).setDepth(DESK[1] + 1);
    this.add.image(ALTAR[0] - 18, ALTAR[1] - 4, "david_harp").setOrigin(0.5, 1).setDepth(ALTAR[1] + 1);
    this.crownOnAltar = this.add
      .image(ALTAR[0] + 12, ALTAR[1] - 16, "david_crown")
      .setOrigin(0.5, 1)
      .setDepth(ALTAR[1] + 2)
      .setVisible(false);

    // Holy Spirit dove hovering gently in the room
    this.spawnDove(160, 118);

    // 2 Reflection Relic pads in the room (1: Shepherd Staff & Sling, 2: Psalm Harp & Robe Corner)
    const relicIcons = ["david_sling", "david_harp"];
    RELIC_SPOTS.forEach(([rx, ry], i) => {
      this.add.image(rx, ry - 4, "david_glow_gold").setDepth(DEPTH.RUG + 1);
      this.add.image(rx, ry, "david_pad").setOrigin(0.5, 1).setDepth(DEPTH.RUG + 2);
      this.add.image(rx, ry - 6, relicIcons[i]).setOrigin(0.5, 1).setDepth(ry + 1);

      this.interactables.push({
        x: rx,
        y: ry - 4,
        r: 26,
        label: tr(EPILOGUE.relicHints[i]),
        active: () => !this.finished && !this.relicsDone[i],
        act: () => this.askReflection(i),
      });
    });

    this.interactables.push({
      x: ALTAR[0] - 8,
      y: ALTAR[1] + 4,
      r: 36,
      label: tr(EPILOGUE.deskHint),
      active: () => true,
      act: () => (this.finished ? this.showTheEnd() : this.placeHarpAndCrown()),
    });

    this.label = this.add
      .text(0, 0, "", {
        fontFamily: "Dearpix, monospace",
        fontSize: "10px",
        color: "#fde68a",
        backgroundColor: "#0f172acc",
        padding: { x: 3, y: 1 },
        resolution: 4,
      })
      .setOrigin(0.5, 0)
      .setDepth(DEPTH.UI);
  }

  protected onStageStart() {
    this.talk(EPILOGUE.speaker, EPILOGUE.welcome.map(tr));
  }

  private askReflection(i: number) {
    const item = EPILOGUE.relicQuestions[i];
    this.talk(
      EPILOGUE.speaker,
      [tr(item.q)],
      undefined,
      item.a.map((opt, idx) => ({
        label: tr(opt),
        onSelect: () => {
          if (idx === 0) {
            this.relicsDone[i] = true;
            audio.sfx("bless");
            const [rx, ry] = RELIC_SPOTS[i];
            this.sparkleBurst(rx, ry - 10, 10);
            this.talk(EPILOGUE.speaker, [tr(item.ok)]);
          } else {
            audio.sfx("wrong");
            this.talk(EPILOGUE.speaker, [tr(EPILOGUE.wrongChoice)]);
          }
        },
      }))
    );
  }

  private placeHarpAndCrown() {
    if (this.relicsDone.filter(Boolean).length < 2) {
      audio.sfx("wrong");
      this.talk(EPILOGUE.speaker, [tr(EPILOGUE.needRelicsFirst)]);
      return;
    }

    this.finished = true;
    this.crownOnAltar.setVisible(true);
    this.completeStage();
    audio.sfx("complete");
    this.cameras.main.flash(450, 255, 244, 180);
    this.sparkleBurst(ALTAR[0], ALTAR[1] - 16, 16);
    this.talk(EPILOGUE.speaker, EPILOGUE.finale.map(tr), () => this.showTheEnd());
  }

  private showTheEnd() {
    audio.sfx("complete");
    [[80, 80], [160, 64], [240, 80]].forEach(([x, y], i) =>
      this.time.delayedCall(i * 280, () => this.sparkleBurst(x, y, 14))
    );
    const banner = this.add
      .text(ROOM_W / 2, 120, "HẾT · THE END", {
        fontFamily: "Dearpix, monospace",
        fontSize: "20px",
        color: "#fde68a",
        backgroundColor: "#0f172acc",
        padding: { x: 8, y: 4 },
        resolution: 4,
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.UI);
    this.tweens.add({ targets: banner, y: 116, duration: 600, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2] });

    this.talk(
      tx("Hoàn thành hành trình", "Journey complete"),
      EPILOGUE.theEnd.map(tr),
      undefined,
      [
        {
          label: tx("Ở lại căn phòng", "Stay in the room"),
          onSelect: () => banner.destroy(),
        },
        {
          label: tx("Về trang chủ", "Return to home page"),
          onSelect: () => window.location.assign(window.location.origin),
        },
      ]
    );
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);

    const v = this.cameras.main.worldView;
    if (this.label) {
      const rCount = this.relicsDone.filter(Boolean).length;
      this.label
        .setText(tr(EPILOGUE.phase[0]).replace("{r}", String(rCount)))
        .setPosition(Math.round(v.centerX), Math.round(v.top + this.safeInsetTop() + 4));
    }
  }
}
