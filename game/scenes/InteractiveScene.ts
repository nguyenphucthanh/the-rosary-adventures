import * as Phaser from "phaser";
import { BaseMysteryScene, DEPTH } from "./BaseMysteryScene";
import EventBus from "../EventBus";
import type { DialogueOption } from "@/components/game/DialogueBox";

export interface Interactable {
  at: () => [number, number];
  r: number;
  label: () => string;
  active: () => boolean;
  act: () => void;
}

export type Pickup = Phaser.GameObjects.GameObject[];

/**
 * Shared plumbing for hand-built stages: proximity prompt + [A] interactables, pickups, scripted NPC walks.
 * Subclass: build the world in create(), fill `this.interactables`, then call `begin()`.
 */
export abstract class InteractiveScene extends BaseMysteryScene {
  protected interactables: Interactable[] = [];
  /** Sprites that y-sort every frame (NPCs that move). */
  protected walkers: Phaser.GameObjects.Sprite[] = [];
  private prompt!: Phaser.GameObjects.Text;

  protected talk(
    speaker: string,
    emoji: string,
    lines: string[],
    onComplete?: () => void,
    options?: DialogueOption[]
  ) {
    EventBus.emit("dialogue-open", { speaker, avatarEmoji: emoji, lines, onComplete, options });
  }

  /** Invisible world-edge colliders. */
  protected edgeWalls(w: number, h: number, thick = 16) {
    this.block(thick / 2, h / 2, thick, h);
    this.block(w - thick / 2, h / 2, thick, h);
    this.block(w / 2, thick / 2, w, thick);
    this.block(w / 2, h - thick / 2, w, thick);
  }

  /** Player, camera, input, prompt, save pointer, fade-in, intro dialogue. Call last in create(). */
  protected begin(
    mysteryKey: string,
    spawn: [number, number],
    intro: { speaker: string; emoji: string; lines: string[] }
  ) {
    this.createPlayerAt(spawn[0], spawn[1]);
    this.setupCamera();
    this.setupActionListeners();
    this.prompt = this.add
      .text(0, 0, "", {
        fontFamily: "'Dearpix', monospace",
        fontSize: "10px",
        color: "#fef08a",
        backgroundColor: "#1e1b4bee",
        padding: { x: 4, y: 2 },
        resolution: 4,
      })
      .setOrigin(0.5, 1)
      .setDepth(DEPTH.UI)
      .setVisible(false);

    this.beginStage(mysteryKey);
    this.cameras.main.fadeIn(500, 0, 0, 0);
    EventBus.emit("scene-ready", { sceneKey: this.scene.key });
    this.time.delayedCall(800, () => this.talk(intro.speaker, intro.emoji, intro.lines));
  }

  /** Bobbing sparkle marking someone to talk to. */
  protected hint(x: number, y: number) {
    const sp = this.add.image(x, y, "sparkle").setDepth(DEPTH.FX);
    this.tweens.add({ targets: sp, y: y - 3, alpha: 0.3, duration: 600, yoyo: true, repeat: -1, ease: "Stepped" });
    return sp;
  }

  protected pickup(x: number, y: number, key: string): Pickup {
    const glow = this.add.image(x, y, "glow_small").setDepth(y - 1).setAlpha(0.5);
    this.tweens.add({ targets: glow, alpha: 0.85, duration: 900, yoyo: true, repeat: -1 });
    const sprite = this.add.image(x, y, key).setDepth(y);
    this.tweens.add({ targets: sprite, y: y - 3, duration: 1100, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    const sp = this.add.image(x + 7, y - 8, "sparkle").setDepth(y + 1);
    this.tweens.add({ targets: sp, alpha: 0, duration: 500, yoyo: true, repeat: -1, delay: Math.random() * 600 });
    return [glow, sprite, sp];
  }

  protected vanish(items: Pickup) {
    this.tweens.add({ targets: items, alpha: 0, y: "-=12", duration: 350, onComplete: () => items.forEach((o) => o.destroy()) });
  }

  protected sparkleBurst(cx: number, cy: number) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const sp = this.add.image(cx, cy, "sparkle").setDepth(DEPTH.FX);
      this.tweens.add({
        targets: sp,
        x: cx + Math.round(Math.cos(a) * 28),
        y: cy + Math.round(Math.sin(a) * 28),
        alpha: 0,
        duration: 900,
        onComplete: () => sp.destroy(),
      });
    }
  }

  /** Walk a sprite through waypoints at 70px/s. */
  protected walk(sprite: Phaser.GameObjects.Sprite, points: [number, number][], then?: () => void) {
    const [next, ...rest] = points;
    if (!next) return then?.();
    const dist = Phaser.Math.Distance.Between(sprite.x, sprite.y, next[0], next[1]);
    this.tweens.add({
      targets: sprite,
      x: next[0],
      y: next[1],
      duration: (dist / 70) * 1000,
      onComplete: () => this.walk(sprite, rest, then),
    });
  }

  /** Lit-bead dialogue + stage save + move on. */
  protected complete(n: number, season: string, title: string, fruit: string, moral: string, quests: string[]) {
    this.saveStageComplete(quests);
    const ordinal = ["", "Nhất", "Hai", "Ba", "Bốn", "Năm"][n] ?? String(n);
    this.talk(
      `✨ HOÀN THÀNH MẦU NHIỆM THỨ ${ordinal.toUpperCase()} ✨`,
      "📿",
      [
        `CHÚC MỪNG BẠN ĐÃ THẮP SÁNG HẠT MÂN CÔI SỐ ${n}!`,
        `Mầu Nhiệm Thứ ${ordinal} ${season}: ${title}.`,
        `Hoa trái suy niệm: ${fruit}`,
        moral,
      ],
      () => this.goToNextStage()
    );
  }

  update() {
    super.update();
    for (const w of this.walkers) w.setDepth(w.y);
    if (!this.prompt) return;
    const hit = this.nearest();
    this.prompt.setVisible(!!hit);
    if (!hit) return;
    const [x, y] = hit.at();
    this.prompt.setPosition(x, y - 36).setText(hit.label());
  }

  private nearest() {
    if (!this.player) return undefined;
    return this.interactables.find((it) => {
      const [x, y] = it.at();
      return it.active() && Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y) < it.r;
    });
  }

  protected handleActionTrigger() {
    this.nearest()?.act();
  }
}
