import * as Phaser from "phaser";
import { Player } from "@/modules/shared/game/entities/Player";
import { CharacterCustomization, DEFAULT_CHARACTER } from "@/modules/shared/types";
import { JOSEPH_STAGE_KEYS, JosephSaveData } from "@/modules/joseph-coat-of-the-sun/types/game";
import { JOSEPH_STAGES, nextSceneAfter } from "@/modules/joseph-coat-of-the-sun/data/stagesData";
import { loadGame, updateSave } from "@/modules/joseph-coat-of-the-sun/utils/saveManager";
import { PAL } from "@/modules/shared/game/utils/pixelArt";
import { tr, type L } from "@/modules/joseph-coat-of-the-sun/data/dialogues";
import EventBus from "@/modules/shared/game/EventBus";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

/** Depth layers. World objects use their foot y (y-sorting) between RUG and WALL. */
export const DEPTH = { FLOOR: 0, RUG: 1, LIGHT: 2, WALL: 2000, FX: 5000, UI: 9000, INTRO: 20000 };

export interface StageIntro {
  illustration: string; // id registered in /games/joseph-coat-of-the-sun/intro/<id>.png ("default" if unknown)
  speaker: string;
  lines: string[]; // Lời Chúa chủ đề + dẫn nhập
}

interface Checkpoint {
  id: string;
  state: unknown;
  x: number;
  y: number;
}

export interface Interactable {
  x: number;
  y: number;
  r: number; // reach radius (px)
  label: string | (() => string);
  active?: () => boolean;
  act: () => void;
}

export class BaseJosephScene extends Phaser.Scene {
  protected player!: Player;
  protected obstacles!: Phaser.Physics.Arcade.StaticGroup;
  protected worldWidth = 640;
  protected worldHeight = 480;
  /** Player start; defaults to the map centre. */
  protected spawn?: [number, number];

  /** Save key of the running stage ("" = not a resumable stage). Subclasses set it. */
  protected stageKey = "";
  /** Set by subclasses: shown as the storybook picture + dialogue before the map is revealed. */
  protected intro?: StageIntro;

  constructor(key: string) {
    super({ key });
  }

  // ---------------------------------------------------------------- lifecycle

  create() {
    this.interactables = []; // scene instances are reused on restart
    this.hintText = undefined;
    this.bannerText = undefined;
    this.bannerValue = "";
    this.companion = undefined;
    this.carryImg = undefined;
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.obstacles = this.physics.add.staticGroup();
    this.buildWorld();
    this.createPlayerAt(...(this.spawn ?? [this.worldWidth / 2, this.worldHeight / 2]));
    this.setupCamera();
    this.setupActionListeners();
    this.setupCheckpointListener();
    this.beginStage();
    EventBus.emit("scene-ready", { sceneKey: this.scene.key });
    if (this.intro) this.playIntro(this.intro);
    else this.onStageStart();
  }

  /** Hook: dress the map (floor, walls, props). Runs before the player exists. */
  protected buildWorld() {}
  /** Hook: the map is visible and the player is free — start the gameplay. */
  protected onStageStart() {}
  /** Hook: A / Space pressed with no dialogue open. Default: act on the nearest interactable in reach. */
  protected handleActionTrigger() {
    const it = this.nearest();
    if (it) it.act();
  }
  /** Hook: scene was soft-reset; restore the puzzle to the checkpoint's state. */
  protected onCheckpointRestore(id: string, state: unknown): void { void id; void state; }

  update(time?: number, delta = 16) {
    void time; void delta;
    this.player.update();
    this.player.setDepth(this.player.y + 16); // y-sort by feet
    this.updateHint();
    this.updateBanner();
    this.updateCompanion(delta);
    this.carryImg?.setPosition(Math.round(this.player.x), Math.round(this.player.y - 26)).setDepth(this.player.y + 20);
  }

  // ---------------------------------------------------------------- HUD banner, companion, collision mask

  private bannerText?: Phaser.GameObjects.Text;
  protected bannerValue = "";

  /** One-line HUD text pinned to the camera's safe top (never the map): goal / counters. "" hides it. */
  protected setBanner(text: string) {
    this.bannerValue = text;
  }

  private updateBanner() {
    if (!this.bannerText) {
      this.bannerText = this.add
        .text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 })
        .setOrigin(0.5, 0)
        .setDepth(DEPTH.UI);
    }
    const v = this.cameras.main.worldView;
    this.bannerText.setVisible(!!this.bannerValue && !this.introActive);
    this.bannerText.setText(this.bannerValue).setPosition(Math.round(v.centerX), Math.round(v.top + this.safeInsetTop() + 4));
  }

  private carryImg?: Phaser.GameObjects.Image;

  /** Show an item held above the player's head (null = drop it). One carried item at a time. */
  protected setCarry(key: string | null) {
    this.carryImg?.destroy();
    this.carryImg = key ? this.add.image(0, 0, key).setOrigin(0.5, 1) : undefined;
  }

  protected companion?: Phaser.GameObjects.Image;

  /** Joseph walks beside the player (texture key, e.g. "joseph_sun"). */
  protected setCompanion(key: string) {
    if (this.companion) this.companion.setTexture(key);
    else this.companion = this.add.image(this.player.x - 18, this.player.y + 14, key).setOrigin(0.5, 1);
  }

  private updateCompanion(delta: number) {
    const c = this.companion;
    if (!c || !c.visible) return;
    const tx2 = this.player.x - 18, ty = this.player.y + 14;
    const d = Phaser.Math.Distance.Between(c.x, c.y, tx2, ty);
    if (d > 3) {
      const step = Math.min(d, (110 * delta) / 1000);
      const a = Math.atan2(ty - c.y, tx2 - c.x);
      c.setPosition(Math.round(c.x + Math.cos(a) * step), Math.round(c.y + Math.sin(a) * step));
    }
    c.setDepth(c.y);
  }

  /**
   * Fill the world with solid tiles wherever `walkable(cx, cy)` is false (cells are 16px) and merge
   * each row's solid runs into a few static colliders. Gives maze-like maps without hand-placed walls.
   */
  protected blockMask(walkable: (cx: number, cy: number) => boolean, tile: string, x0 = 0, y0 = 0, w = this.worldWidth, h = this.worldHeight) {
    const cols = Math.ceil(w / 16), rows = Math.ceil(h / 16);
    for (let cy = 0; cy < rows; cy++) {
      let run = -1;
      for (let cx = 0; cx <= cols; cx++) {
        const solid = cx < cols && !walkable(cx, cy);
        if (solid && run < 0) run = cx;
        if (!solid && run >= 0) {
          const rw = (cx - run) * 16;
          this.add.tileSprite(x0 + run * 16, y0 + cy * 16, rw, 16, tile).setOrigin(0).setDepth(DEPTH.RUG);
          this.block(x0 + run * 16 + rw / 2, y0 + cy * 16 + 8, rw, 16);
          run = -1;
        }
      }
    }
  }

  // ---------------------------------------------------------------- interactables, dialogue, effects

  protected interactables: Interactable[] = [];
  private hintText?: Phaser.GameObjects.Text;

  private nearest(): Interactable | undefined {
    if (this.introActive || this.dialogueOpen) return undefined;
    let best: Interactable | undefined;
    let bd = Infinity;
    for (const it of this.interactables) {
      if (it.active && !it.active()) continue;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, it.x, it.y);
      if (d <= it.r && d < bd) {
        best = it;
        bd = d;
      }
    }
    return best;
  }

  private updateHint() {
    this.hintText ??= this.add
      .text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 })
      .setOrigin(0.5, 1)
      .setDepth(DEPTH.FX);
    const it = this.nearest();
    this.hintText.setVisible(!!it);
    if (!it) return;
    this.hintText.setText(typeof it.label === "function" ? it.label() : it.label);
    this.hintText.setPosition(Math.round(it.x), Math.round(it.y - 14));
  }

  protected talk(speaker: string, lines: string[], onComplete?: () => void, options?: { label: string; onSelect: () => void }[]) {
    EventBus.emit("dialogue-open", { speaker, lines, onComplete, options });
  }

  /** Glow + twinkling sparkle above an interactable NPC or prop so it reads at a glance. */
  protected litGlow(x: number, y: number, h = 16, glowKey = "joseph_glow_gold") {
    const glow = this.add.image(x, y - h / 2, glowKey).setDepth(y - 1).setAlpha(0.65);
    const sp = this.add.image(x + 6, y - h - 2, "sparkle").setDepth(y + 1);
    this.tweens.add({ targets: glow, alpha: 0.9, duration: 900, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    this.tweens.add({ targets: sp, alpha: { from: 0.25, to: 1 }, duration: 600, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2] });
    return { glow, sp };
  }

  /** Item with a gold glow and a gentle stepped bob — reads as "pick me up" at a glance. */
  protected pickup(x: number, y: number, key: string) {
    const glow = this.add.image(x, y - 6, "joseph_glow_gold").setDepth(y - 1).setAlpha(0.6);
    const img = this.add.image(x, y, key).setOrigin(0.5, 1).setDepth(y).setData("glow", glow);
    this.tweens.add({ targets: img, y: y - 3, duration: 700, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    this.tweens.add({ targets: glow, alpha: 0.9, duration: 900, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    return img;
  }

  protected removePickup(img: Phaser.GameObjects.Image) {
    this.tweens.killTweensOf(img);
    const glow = img.getData("glow") as Phaser.GameObjects.Image;
    this.tweens.killTweensOf(glow);
    glow.destroy();
    img.destroy();
  }

  protected sparkleBurst(x: number, y: number, n = 10) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const sp = this.add.image(x, y, "sparkle").setDepth(DEPTH.FX);
      this.tweens.add({
        targets: sp, x: Math.round(x + Math.cos(a) * 22), y: Math.round(y + Math.sin(a) * 22), alpha: 0, duration: 700,
        ease: "Stepped", easeParams: [5], onComplete: () => sp.destroy(),
      });
    }
  }

  /** The Holy Spirit as a flapping dove with a pixel glow that follows it. */
  protected spawnDove(x: number, y: number) {
    if (!this.anims.exists("joseph_dove")) this.anims.create({ key: "joseph_dove", frames: this.anims.generateFrameNumbers("joseph_dove", { start: 0, end: 1 }), frameRate: 3, repeat: -1 });
    const glow = this.add.image(x, y - 8, "joseph_glow_gold").setDepth(y + 1).setAlpha(0.7);
    const dove = this.add.sprite(x, y, "joseph_dove").setOrigin(0.5, 1).setDepth(y + 2).play("joseph_dove");
    const follow = () => glow.setPosition(Math.round(dove.x), Math.round(dove.y - 8)).setDepth(dove.y + 1);
    this.events.on("update", follow);
    this.events.once("shutdown", () => this.events.off("update", follow));
    return dove;
  }

  /** Slide a sprite to (x, y). */
  protected glideTo(o: Phaser.GameObjects.Sprite, x: number, y: number, ms = 1400) {
    this.tweens.add({ targets: o, x, y, duration: ms, ease: "Sine.easeInOut", onUpdate: () => o.setDepth(o.y + 2) });
  }

  /** Stage cleared: light the sunray, then outro + lesson dialogue, then on to the next stage. */
  protected finishStage(text: { outro: L[]; lesson: L }) {
    const info = JOSEPH_STAGES.find((g) => g.key === this.stageKey);
    audio.sfx("complete");
    this.completeStage();
    this.talk(info ? tx(`Tia nắng thứ ${info.index + 1}`, `Sunray ${info.index + 1}`) : tx("Suy niệm", "Reflection"), text.outro.map(tr), () =>
      this.talk(tx("Suy niệm", "Reflection"), [tr(text.lesson)], () => this.goToNextStage())
    );
  }

  /** Fade out and go to the next built stage; stays put (with a note) when none exists yet. */
  protected goToNextStage() {
    const next = nextSceneAfter(this.stageKey);
    if (!next) {
      this.talk(tx("Chiếc Áo Mặt Trời", "The Coat of the Sun"), [tx("Những chặng tiếp theo của hành trình Giuse đang được hoàn thiện... Hãy quay lại sau nhé!", "The next stages of Joseph's journey are still being built... Come back soon!")]);
      return;
    }
    const cam = this.cameras.main;
    cam.fadeOut(600, 0, 0, 0);
    cam.once("camerafadeoutcomplete", () => this.scene.start(next));
  }

  // ---------------------------------------------------------------- player, camera, input

  protected createPlayerAt(x: number, y: number, custom?: CharacterCustomization) {
    this.player = new Player(this, x, y, custom ?? loadGame()?.player.customization ?? DEFAULT_CHARACTER);
    this.player.setSize(12, 8).setOffset(10, 21);
    this.physics.add.collider(this.player, this.obstacles);
  }

  /** Invisible static collider (centre-origin). */
  protected block(x: number, y: number, w: number, h: number) {
    this.obstacles.add(this.add.rectangle(x, y, w, h));
  }

  /** Gate: closed = visible + solid, open = hidden + passable. */
  protected door(x: number, y: number, w: number, h: number, key: string, closed = true) {
    const vis = this.add.tileSprite(x, y, w, h, key).setDepth(y + h / 2);
    const body = this.add.rectangle(x, y, w, h);
    this.obstacles.add(body);
    let state = closed;
    const set = (v: boolean) => {
      state = v;
      vis.setVisible(v);
      (body.body as Phaser.Physics.Arcade.StaticBody).enable = v;
    };
    set(closed);
    return { set, isClosed: () => state };
  }

  /** Foot-anchored prop with a feet-sized collider; depth = foot y. */
  protected prop(x: number, y: number, key: string, colW: number, colH: number) {
    const img = this.add.image(x, y, key).setOrigin(0.5, 1).setDepth(y);
    this.block(x, y - colH / 2, colW, colH);
    return img;
  }

  private steerKeys?: { c: Phaser.Types.Input.Keyboard.CursorKeys; w: Record<"up" | "down" | "left" | "right", Phaser.Input.Keyboard.Key> };
  private steerDir = "idle";
  private steerStick = { x: 0, y: 0 };

  /** Raw steering (-1..1 per axis) for scenes that drive a vehicle/cursor instead of the walking Player. */
  protected readSteer(): { x: number; y: number } {
    const kb = this.input.keyboard;
    if (!this.steerKeys && kb) {
      const K = Phaser.Input.Keyboard.KeyCodes;
      this.steerKeys = { c: kb.createCursorKeys(), w: { up: kb.addKey(K.W), down: kb.addKey(K.S), left: kb.addKey(K.A), right: kb.addKey(K.D) } };
      const onDir = (d: { direction: string }) => (this.steerDir = d.direction);
      const onStick = (d: { x: number; y: number }) => (this.steerStick = d);
      EventBus.on("input-direction", onDir);
      EventBus.on("input-move", onStick);
      this.events.once("shutdown", () => { EventBus.off("input-direction", onDir); EventBus.off("input-move", onStick); this.steerKeys = undefined; this.steerDir = "idle"; this.steerStick = { x: 0, y: 0 }; });
    }
    const k = this.steerKeys;
    const d = this.steerDir;
    const x = (k?.c.right.isDown || k?.w.right.isDown || d === "right" ? 1 : 0) - (k?.c.left.isDown || k?.w.left.isDown || d === "left" ? 1 : 0);
    const y = (k?.c.down.isDown || k?.w.down.isDown || d === "down" ? 1 : 0) - (k?.c.up.isDown || k?.w.up.isDown || d === "up" ? 1 : 0);
    if (this.steerStick.x || this.steerStick.y) return { ...this.steerStick };
    const n = x && y ? Math.SQRT1_2 : 1;
    return { x: x * n, y: y * n };
  }

  protected setupCamera() {
    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.worldWidth, this.worldHeight);
    cam.startFollow(this.player, true, 0.08, 0.08);
    const applyZoom = () => {
      const { width, height } = this.scale.gameSize;
      const z = Math.max(2, Math.round(Math.min(width, height) / 280));
      cam.setZoom(z);
      const w = Math.min(width, this.worldWidth * z), h = Math.min(height, this.worldHeight * z);
      cam.setViewport(Math.floor((width - w) / 2), Math.floor((height - h) / 2), w, h);
    };
    applyZoom();
    cam.centerOn(this.player.x, this.player.y); // start on the player instead of gliding in from the map corner
    this.scale.on("resize", applyZoom);
    this.events.once("shutdown", () => this.scale.off("resize", applyZoom));
  }

  /** Screen px covered by the top bar + HUD buttons / by the D-pad + A-B row. */
  protected static readonly SAFE_TOP_PX = 108;
  protected static readonly SAFE_BOTTOM_PX = 200;

  protected safeInsetTop(): number {
    const cam = this.cameras.main;
    return Math.ceil(Math.max(0, BaseJosephScene.SAFE_TOP_PX - cam.y) / cam.zoom);
  }

  protected safeInsetBottom(): number {
    const cam = this.cameras.main;
    const bottomGap = this.scale.gameSize.height - (cam.y + cam.height);
    return Math.ceil(Math.max(0, BaseJosephScene.SAFE_BOTTOM_PX - bottomGap) / cam.zoom);
  }

  protected dialogueOpen = false;
  private dialogueClosedAt = 0;

  protected setupActionListeners() {
    const kb = this.input.keyboard;
    const act = () => this.triggerAction();
    kb?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on("down", act);
    kb?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on("down", act);

    const onAction = (d: { action: "A" | "B" | "MENU" }) => d.action === "A" && act();
    const onOpen = () => (this.dialogueOpen = true);
    const onClose = () => {
      this.dialogueOpen = false;
      this.dialogueClosedAt = performance.now();
    };
    EventBus.on("input-action", onAction);
    EventBus.on("dialogue-open", onOpen);
    EventBus.on("dialogue-close", onClose);
    const cleanup = () => {
      EventBus.off("input-action", onAction);
      EventBus.off("dialogue-open", onOpen);
      EventBus.off("dialogue-close", onClose);
      EventBus.emit("grace-update", { current: 0, max: 0 });
    };
    this.events.once("shutdown", cleanup);
    this.events.once("destroy", cleanup);
  }

  private triggerAction() {
    if (this.introActive || this.dialogueOpen || performance.now() - this.dialogueClosedAt < 300) return;
    this.handleActionTrigger();
  }

  // ---------------------------------------------------------------- intro pixel illustration

  protected introActive = false;

  /** Storybook picture (own camera) + dialogue, then a stepped fade into the map. */
  protected playIntro(intro: StageIntro) {
    this.introActive = true;
    this.player.setMovementLock(true);
    const reqKey = `intro-${intro.illustration}`;
    this.showIntro(intro, this.textures.exists(reqKey) ? reqKey : "intro-default");
  }

  private showIntro(intro: StageIntro, key: string) {
    const items: Phaser.GameObjects.GameObject[] = [];
    const add = <T extends Phaser.GameObjects.GameObject>(o: T) => (items.push(o), o);
    const cam = this.cameras.add(0, 0, this.scale.width, this.scale.height).setName("intro");
    const bg = add(this.add.rectangle(0, 0, 8192, 8192, 0x05060d).setOrigin(0).setDepth(DEPTH.INTRO).setScrollFactor(0));
    const frame = add(this.add.graphics().setDepth(DEPTH.INTRO + 1));
    const pic = add(this.add.image(0, 0, key).setOrigin(0).setDepth(DEPTH.INTRO + 2)) as Phaser.GameObjects.Image;
    this.textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR);
    const INTRO_W = pic.width || 320, INTRO_H = pic.height || 200;

    const layout = () => {
      const { width: w, height: h } = this.scale;
      cam.setSize(w, h);
      const s = Math.min((w - 32) / INTRO_W, (h * 0.58) / INTRO_H);
      const pw = Math.floor(INTRO_W * s), ph = Math.floor(INTRO_H * s);
      const px = Math.floor((w - pw) / 2), py = Math.max(24, Math.floor((h * 0.62 - ph) / 2));
      pic.setPosition(px, py).setScale(s);
      frame.clear();
      const b = 6;
      frame.fillStyle(Phaser.Display.Color.HexStringToColor(PAL.Y).color).fillRect(px - b, py - b, pw + 2 * b, ph + 2 * b);
      frame.fillStyle(Phaser.Display.Color.HexStringToColor(PAL.O).color).fillRect(px - b + 2, py - b + 2, pw + 2 * (b - 2), ph + 2 * (b - 2));
    };
    layout();
    this.scale.on("resize", layout);

    this.cameras.main.ignore(items);

    const finish = () => {
      this.scale.off("resize", layout);
      this.tweens.add({
        targets: items.filter((o) => o !== bg).concat(bg),
        alpha: 0, duration: 600, ease: "Stepped", easeParams: [5],
        onComplete: () => {
          items.forEach((o) => { this.tweens.killTweensOf(o); o.destroy(); });
          this.cameras.remove(cam);
          this.introActive = false;
          this.player.setMovementLock(false);
          this.onStageStart();
        },
      });
    };
    EventBus.emit("dialogue-open", { speaker: intro.speaker, lines: intro.lines, onComplete: finish });
  }

  // ---------------------------------------------------------------- checkpoint / soft reset

  private checkpoint?: Checkpoint;
  protected attempts = 0;

  protected saveCheckpoint(id: string, state: unknown = null, x = this.player.x, y = this.player.y) {
    this.checkpoint = { id, state, x, y };
  }

  protected resetToCheckpoint() {
    const cp = this.checkpoint;
    if (!cp || this.introActive) return;
    this.attempts++;
    this.cameras.main.flash(250, 255, 244, 200);
    audio.sfx("chime");
    this.player.setVelocity(0, 0);
    this.player.setPosition(cp.x, cp.y);
    this.refillGrace();
    this.onCheckpointRestore(cp.id, cp.state);
  }

  private setupCheckpointListener() {
    const retry = () => this.resetToCheckpoint();
    const jump = (d: { targetSceneKey: string }) => this.scene.start(d.targetSceneKey);
    EventBus.on("checkpoint-retry", retry);
    EventBus.on("scene-change-request", jump);
    const off = () => { EventBus.off("checkpoint-retry", retry); EventBus.off("scene-change-request", jump); };
    this.events.once("shutdown", off);
    this.events.once("destroy", off);
  }

  // ---------------------------------------------------------------- grace pips (action stages)

  private grace = { current: 0, max: 0 };

  protected initGrace(max: number) {
    this.grace = { current: max, max };
    EventBus.emit("grace-update", { ...this.grace });
  }

  private refillGrace() {
    if (!this.grace.max) return;
    this.grace.current = this.grace.max;
    EventBus.emit("grace-update", { ...this.grace });
  }

  protected loseGrace(): boolean {
    if (!this.grace.max) return false;
    this.grace.current = Math.max(0, this.grace.current - 1);
    EventBus.emit("grace-update", { ...this.grace });
    audio.sfx("wrong");
    this.cameras.main.shake(120, 0.004);
    if (this.grace.current > 0) return false;
    this.resetToCheckpoint();
    return true;
  }

  // ---------------------------------------------------------------- save

  protected autosave(mutate: (save: JosephSaveData) => void) {
    EventBus.emit("game-saved", { success: updateSave(mutate) !== null, timestamp: Date.now() });
  }

  private beginStage() {
    const idx = (JOSEPH_STAGE_KEYS as readonly string[]).indexOf(this.stageKey);
    if (idx < 0) return;
    this.autosave((s) => {
      const stageIdx = JOSEPH_STAGES.findIndex((g) => g.key === this.stageKey);
      if (stageIdx >= s.currentStageIndex || stageIdx < 0) {
        s.currentStageKey = this.stageKey as JosephSaveData["currentStageKey"];
        if (stageIdx >= 0) s.currentStageIndex = stageIdx;
      }
    });
  }

  protected completeStage() {
    const info = JOSEPH_STAGES.find((g) => g.key === this.stageKey);
    if (!info) {
      this.autosave((s) => {
        s.stagesProgress[this.stageKey as JosephSaveData["currentStageKey"]] = { completed: true, rayLit: false };
        if (this.stageKey === JOSEPH_STAGE_KEYS[0]) {
          s.currentStageKey = JOSEPH_STAGE_KEYS[1];
          s.currentStageIndex = 0;
        }
      });
      return;
    }
    const attempts = this.attempts + 1;
    let first = false;
    this.autosave((s) => {
      const prev = s.stagesProgress[info.key];
      first = !prev?.completed;
      s.stagesProgress[info.key] = { completed: true, rayLit: true, bestAttempts: Math.min(prev?.bestAttempts ?? attempts, attempts) };
      const next = JOSEPH_STAGES[info.index + 1];
      if (next && s.currentStageIndex <= info.index) {
        s.currentStageKey = next.key;
        s.currentStageIndex = next.index;
      } else if (!next) s.currentStageKey = JOSEPH_STAGE_KEYS[JOSEPH_STAGE_KEYS.length - 1];
    });
    EventBus.emit("mystery-completed", { mysteryKey: info.key, mysteryIndex: info.index });
    if (first) EventBus.emit("bead-lit", { mysteryIndex: info.index });
  }
}
