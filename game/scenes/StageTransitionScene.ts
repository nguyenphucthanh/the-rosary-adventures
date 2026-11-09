import * as Phaser from "phaser";
import EventBus from "../EventBus";
import { INTERLUDES_DATA, MYSTERIES_DATA, SEASONS } from "@/data/mysteries";
import { STAGE_SCENES } from "@/data/stages";
import { loadGame } from "@/utils/saveManager";
import { registerAnnunciationTextures } from "../utils/npcTextureGenerator";

const CX = 160;
const CY = 100;

/** Intro card between stages: "Chặng N", decade beads, title, scripture, fruit. Tap / Space to continue. */
export class StageTransitionScene extends Phaser.Scene {
  private toKey = "";
  private warped = false;
  private ready = false;
  private leaving = false;

  constructor() {
    super({ key: "StageTransitionScene" });
  }

  init(data: { toKey?: string; warped?: boolean }) {
    this.toKey = data.toKey ?? "";
    this.warped = !!data.warped;
  }

  create() {
    this.ready = false;
    this.leaving = false;
    registerAnnunciationTextures(this); // sparkle texture

    const info = MYSTERIES_DATA.find((m) => m.key === this.toKey);
    const interlude = INTERLUDES_DATA.find((it) => it.key === this.toKey);
    // first mystery of a new group of five: the Holy Spirit carries the player there first
    if (info && info.seasonIndex === 0 && info.index > 0 && !this.warped) {
      this.scene.start("SeasonWarpScene", { toKey: this.toKey });
      return;
    }
    const sceneKey = STAGE_SCENES[this.toKey];
    if (!info && !interlude) {
      this.scene.start("TitleScene");
      return;
    }
    const season = SEASONS[(info ?? interlude)!.season];
    const progress = loadGame()?.mysteriesProgress ?? {};

    this.add.rectangle(-200, -200, 720, 580, 0x0b1030).setOrigin(0);
    for (let i = 0; i < 40; i++) {
      this.add
        .rectangle(Phaser.Math.Between(-60, 380), Phaser.Math.Between(-40, 220), 1, 1, 0xf8fafc, Math.random() < 0.5 ? 0.9 : 0.4)
        .setOrigin(0);
    }
    for (let i = 0; i < 6; i++) {
      const sp = this.add.image(Phaser.Math.Between(30, 290), Phaser.Math.Between(10, 170), "sparkle");
      this.tweens.add({ targets: sp, alpha: 0, duration: 700 + i * 110, yoyo: true, repeat: -1, delay: i * 200 });
    }

    // visible logical width at the integer zoom; wrap text inside it so narrow phones never clip
    const zoomFor = () => {
      const { width, height } = this.scale.gameSize;
      return Math.max(1, Math.min(Math.floor(width / 160), Math.floor(height / 190), 3));
    };
    const safeW = Math.min(280, this.scale.gameSize.width / zoomFor() - 24);

    const text = (y: number, str: string, size: number, color: string, wrap = safeW) =>
      this.add
        .text(CX, y, str, {
          fontFamily: "'Dearpix', monospace",
          fontSize: `${size * 2}px`,
          color,
          align: "center",
          wordWrap: { width: wrap },
          resolution: 4,
        })
        .setOrigin(0.5);

    if (info) {
      text(22, `${season.labelVi} · CHẶNG ${info.seasonIndex + 1}`, 8, season.color);

      // The decade: five beads, lit = done, pulsing = this one
      const five = MYSTERIES_DATA.filter((m) => m.season === info.season);
      five.forEach((m, i) => {
        const x = CX - 32 + i * 16;
        const done = progress[m.key]?.completed;
        const current = m.key === this.toKey;
        const color = done ? 0xfef08a : current ? 0xfbbf24 : 0x334155;
        const bead = this.add.container(x, 44, [
          this.add.rectangle(0, 0, 8, 8, color),
          this.add.rectangle(-2, -2, 2, 2, 0xf8fafc, done || current ? 1 : 0.3),
        ]);
        if (current) this.tweens.add({ targets: bead, alpha: 0.4, duration: 450, yoyo: true, repeat: -1 });
      });
    } else if (interlude) {
      text(22, interlude.badgeVi, 8, interlude.kind === "bridge" ? "#38bdf8" : "#4ade80");
      // 3 action stars pulsing in place of beads
      [-18, 0, 18].forEach((dx, i) => {
        const st = this.add.image(CX + dx, 44, "sparkle");
        this.tweens.add({ targets: st, alpha: 0.35, duration: 380 + i * 90, yoyo: true, repeat: -1 });
      });
    }

    const activeItem = (info ?? interlude)!;
    const title = text(60, activeItem.titleVi.toUpperCase(), 12, "#fde68a").setOrigin(0.5, 0);
    title.setAlpha(0).y -= 6;
    this.tweens.add({ targets: title, alpha: 1, y: title.y + 6, duration: 500, delay: 250, ease: "Stepped" });

    // stack below the (possibly multi-line) title
    let y = 60 + title.height + 10;
    const stack = (str: string, color: string) => {
      const t = text(y, str, 8, color).setOrigin(0.5, 0);
      y += t.height + 8;
    };
    stack(activeItem.scriptureVi, "#e0e7ff");
    stack(
      sceneKey
        ? `${interlude ? "Bài học" : "Hoa trái"}: ${activeItem.fruitVi}`
        : "Chặng này sắp ra mắt. Hẹn gặp lại bạn nhé!",
      "#fbbf24"
    );

    const prompt = text(y + 6, "CHẠM HOẶC NHẤN SPACE", 8, "#fef08a");
    this.time.addEvent({ delay: 600, loop: true, callback: () => prompt.setVisible(!prompt.visible) });

    // camera: integer zoom only
    const cam = this.cameras.main;
    const apply = () => {
      cam.setZoom(zoomFor());
      cam.centerOn(CX, CY);
    };
    apply();
    this.scale.on("resize", apply);

    // input; short grace so the press that closed the last dialogue can't skip the card
    const go = () => this.ready && this.leave(sceneKey);
    this.input.on("pointerdown", go);
    this.input.keyboard?.on("keydown-SPACE", go);
    this.input.keyboard?.on("keydown-ENTER", go);
    EventBus.on("input-action", go);
    this.events.once("shutdown", () => {
      this.scale.off("resize", apply);
      EventBus.off("input-action", go);
    });
    this.time.delayedCall(900, () => (this.ready = true));
    this.time.delayedCall(9000, () => this.leave(sceneKey));

    cam.fadeIn(500, 0, 0, 0);
    EventBus.emit("scene-ready", { sceneKey: "StageTransitionScene" });
  }

  private leave(sceneKey?: string) {
    if (this.leaving) return;
    this.leaving = true;
    const cam = this.cameras.main;
    cam.fadeOut(400, 0, 0, 0);
    cam.once("camerafadeoutcomplete", () => this.scene.start(sceneKey ?? "TitleScene"));
  }
}
