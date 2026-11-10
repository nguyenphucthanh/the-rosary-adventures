import * as Phaser from "phaser";
import { Player } from "@/modules/shared/game/entities/Player";
import { CharacterCustomization, DEFAULT_CHARACTER } from "@/modules/shared/types";
import { GENESIS_STAGE_KEYS, GenesisSaveData } from "@/modules/the-garden-of-eden/types/game";
import { GENESIS_STAGES, nextSceneAfter } from "@/modules/the-garden-of-eden/data/stagesData";
import { loadGame, updateSave } from "@/modules/the-garden-of-eden/utils/saveManager";
import { INTRO_H, INTRO_W, ensureIntroTexture } from "@/modules/the-garden-of-eden/game/utils/introIllustrations";
import { PAL } from "@/modules/shared/game/utils/pixelArt";
import "@/modules/the-garden-of-eden/game/utils/storybookArt"; // registers every storybook picture
import { tr, type L } from "@/modules/the-garden-of-eden/data/dialogues";
import EventBus from "@/modules/shared/game/EventBus";
import audio from "@/modules/shared/game/audio/AudioManager";

/** Depth layers. World objects use their foot y (y-sorting) between RUG and WALL. */
export const DEPTH = { FLOOR: 0, RUG: 1, LIGHT: 2, WALL: 2000, FX: 5000, UI: 9000, INTRO: 20000 };

export interface StageIntro {
  illustration: string; // id registered in introIllustrations.ts ("default" if unknown)
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

export class BaseGenesisScene extends Phaser.Scene {
  protected player!: Player;
  protected obstacles!: Phaser.Physics.Arcade.StaticGroup;
  protected worldWidth = 640;
  protected worldHeight = 480;
  /** Player start; defaults to the map centre. */
  protected spawn?: [number, number];

  /** Genesis save key of the running stage ("" = not a resumable stage). Subclasses set it. */
  protected stageKey = "";
  /** Set by subclasses: shown as the storybook picture + dialogue before the map is revealed. */
  protected intro?: StageIntro;

  constructor(key: string) {
    super({ key });
  }

  // ---------------------------------------------------------------- lifecycle

  create() {
    this.interactables = []; // scene instances are reused on restart
    this.hintText = undefined; // old Text was destroyed with the previous run (null canvas -> drawImage error)
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
    this.nearest()?.act();
  }
  /** Hook: scene was soft-reset; restore the puzzle to the checkpoint's state. */
  protected onCheckpointRestore(id: string, state: unknown): void { void id; void state; }

  update(time?: number, delta = 16) {
    void time; void delta;
    for (const p of this.chars) {
      p.update();
      p.setDepth(p.y + 16); // y-sort by feet
    }
    this.updateHint();
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

  /** Item with a gold glow and a gentle stepped bob — reads as "pick me up" at a glance. */
  protected pickup(x: number, y: number, key: string) {
    const glow = this.add.image(x, y - 6, "gen_glow_gold").setDepth(y - 1).setAlpha(0.6);
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
    if (!this.anims.exists("gen_dove")) this.anims.create({ key: "gen_dove", frames: this.anims.generateFrameNumbers("gen_dove", { start: 0, end: 1 }), frameRate: 3, repeat: -1 });
    const glow = this.add.image(x, y - 8, "gen_glow_gold").setDepth(y + 1).setAlpha(0.7);
    const dove = this.add.sprite(x, y, "gen_dove").setOrigin(0.5, 1).setDepth(y + 2).play("gen_dove");
    const follow = () => glow.setPosition(Math.round(dove.x), Math.round(dove.y - 8)).setDepth(dove.y + 1);
    this.events.on("update", follow);
    this.events.once("shutdown", () => this.events.off("update", follow));
    return dove;
  }

  /** Slide a sprite to (x, y). */
  protected glideTo(o: Phaser.GameObjects.Sprite, x: number, y: number, ms = 1400) {
    this.tweens.add({ targets: o, x, y, duration: ms, ease: "Sine.easeInOut", onUpdate: () => o.setDepth(o.y + 2) });
  }

  /** Stage cleared: light the seal, then outro + lesson dialogue, then on to the next stage. */
  protected finishStage(text: { outro: L[]; lesson: L }) {
    const info = GENESIS_STAGES.find((g) => g.key === this.stageKey);
    audio.sfx("complete");
    this.completeStage();
    this.talk(info ? `Ấn Dấu thứ ${info.index + 1}` : "Suy niệm", text.outro.map(tr), () =>
      this.talk("Suy niệm", [tr(text.lesson)], () => this.goToNextStage())
    );
  }

  /** Fade out and go to the next built stage; stays put (with a note) when none exists yet. */
  protected goToNextStage() {
    const next = nextSceneAfter(this.stageKey);
    if (!next) {
      this.talk("Cuộn Sách Sáng Thế", ["Những trang tiếp theo của Sách Sáng Thế đang được viết... Hãy quay lại sau nhé!"]);
      return;
    }
    const cam = this.cameras.main;
    cam.fadeOut(600, 0, 0, 0);
    cam.once("camerafadeoutcomplete", () => this.scene.start(next));
  }

  // ---------------------------------------------------------------- player, camera, input

  protected chars: Player[] = [];

  protected createPlayerAt(x: number, y: number, custom?: CharacterCustomization) {
    this.player = new Player(this, x, y, custom ?? loadGame()?.player.customization ?? DEFAULT_CHARACTER);
    this.player.setSize(12, 8).setOffset(10, 21); // feet-only box, same centre: fits 16px tile gaps with 4px slack
    this.chars = [this.player];
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

  protected setupCamera() {
    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.worldWidth, this.worldHeight);
    cam.startFollow(this.player, true, 0.08, 0.08);
    // Integer zoom only — fractional zoom makes pixels uneven
    const applyZoom = () => {
      const { width, height } = this.scale.gameSize;
      const z = Math.max(2, Math.round(Math.min(width, height) / 280));
      cam.setZoom(z);
      // small worlds: shrink the viewport to the map and centre it on screen
      const w = Math.min(width, this.worldWidth * z), h = Math.min(height, this.worldHeight * z);
      cam.setViewport(Math.floor((width - w) / 2), Math.floor((height - h) / 2), w, h);
    };
    applyZoom();
    this.scale.on("resize", applyZoom);
    this.events.once("shutdown", () => this.scale.off("resize", applyZoom));
  }

  protected dialogueOpen = false;
  private dialogueClosedAt = 0;

  protected setupActionListeners() {
    const kb = this.input.keyboard;
    const act = () => this.triggerAction();
    kb?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on("down", act);
    kb?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on("down", act);
    // [B] swaps the controlled character in dual-character stages (no-op otherwise)
    kb?.addKey(Phaser.Input.Keyboard.KeyCodes.B).on("down", () => this.switchCharacter());

    const onAction = (d: { action: "A" | "B" | "MENU" }) => (d.action === "A" ? act() : d.action === "B" && this.switchCharacter()); // virtual B = swap (dual stages)
    // Same press that closes a dialogue must not also fire a world interaction.
    const onOpen = () => (this.dialogueOpen = true);
    const onClose = () => {
      this.dialogueOpen = false;
      this.dialogueClosedAt = performance.now();
      this.relockInactive(); // Player unlocks everyone on dialogue-close; keep the partner parked
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

  /** Storybook picture (own camera, integer scale) + dialogue, then a stepped fade into the map. */
  protected playIntro(intro: StageIntro) {
    this.introActive = true;
    this.player.setMovementLock(true);
    const { key } = ensureIntroTexture(this, intro.illustration);

    const items: Phaser.GameObjects.GameObject[] = [];
    const add = <T extends Phaser.GameObjects.GameObject>(o: T) => (items.push(o), o);
    const cam = this.cameras.add(0, 0, this.scale.width, this.scale.height).setName("intro");
    const bg = add(this.add.rectangle(0, 0, 8192, 8192, 0x05060d).setOrigin(0).setDepth(DEPTH.INTRO).setScrollFactor(0));
    const frame = add(this.add.graphics().setDepth(DEPTH.INTRO + 1));
    const pic = add(this.add.sprite(0, 0, key).setOrigin(0).setDepth(DEPTH.INTRO + 2)) as Phaser.GameObjects.Sprite;
    pic.play(key);

    // Layout: picture in the upper area (dialogue box sits at the bottom). Integer scale only.
    const layout = () => {
      const { width: w, height: h } = this.scale;
      cam.setSize(w, h);
      const s = Math.max(1, Math.floor(Math.min((w - 32) / INTRO_W, (h * 0.58) / INTRO_H)));
      const pw = INTRO_W * s, ph = INTRO_H * s;
      const px = Math.floor((w - pw) / 2), py = Math.max(24, Math.floor((h * 0.62 - ph) / 2));
      pic.setPosition(px, py).setScale(s); // integer nearest-neighbour upscale of a whole picture
      frame.clear();
      const b = 3 * s;
      frame.fillStyle(Phaser.Display.Color.HexStringToColor(PAL.Y).color).fillRect(px - b, py - b, pw + 2 * b, ph + 2 * b);
      frame.fillStyle(Phaser.Display.Color.HexStringToColor(PAL.O).color).fillRect(px - b + s, py - b + s, pw + 2 * (b - s), ph + 2 * (b - s));
    };
    layout();
    this.scale.on("resize", layout);

    // The map camera must not render the overlay
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

  /** Remember puzzle `state` and where to put the character on retry. Call at the start of each section. */
  protected saveCheckpoint(id: string, state: unknown = null, x = this.player.x, y = this.player.y) {
    this.checkpoint = { id, state, x, y };
  }

  /** Gentle soft reset: flash, chime, character back to the checkpoint, puzzle restores via onCheckpointRestore. */
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
    const jump = (d: { targetSceneKey: string }) => this.scene.start(d.targetSceneKey); // HUD replay of a finished stage
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

  /** Lose one pip (hazard hit). At zero the stage soft-resets to its checkpoint. Returns true when it reset. */
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

  // ---------------------------------------------------------------- dual-character switch (Stage 9)

  /** Add a second controllable character; [B] swaps which one moves and the camera follows. */
  protected enableDualCharacters(partner: CharacterCustomization, x: number, y: number) {
    const p = new Player(this, x, y, partner);
    p.setSize(12, 8).setOffset(10, 21);
    this.physics.add.collider(p, this.obstacles);
    this.chars = [this.player, p];
    p.setMovementLock(true);
  }

  protected switchCharacter() {
    if (this.chars.length < 2 || this.dialogueOpen || this.introActive) return;
    this.chars.reverse(); // chars[0] is always the active one
    this.player = this.chars[0];
    this.relockInactive();
    this.player.setMovementLock(false);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    audio.sfx("select");
  }

  private relockInactive() {
    this.chars.slice(1).forEach((p) => p.setMovementLock(true));
  }

  // ---------------------------------------------------------------- save

  protected autosave(mutate: (save: GenesisSaveData) => void) {
    EventBus.emit("game-saved", { success: updateSave(mutate) !== null, timestamp: Date.now() });
  }

  /** Remember this stage as "where to resume". */
  private beginStage() {
    const idx = (GENESIS_STAGE_KEYS as readonly string[]).indexOf(this.stageKey);
    if (idx < 0) return;
    this.autosave((s) => {
      const stageIdx = GENESIS_STAGES.findIndex((g) => g.key === this.stageKey);
      if (stageIdx >= s.currentStageIndex || stageIdx < 0) {
        s.currentStageKey = this.stageKey as GenesisSaveData["currentStageKey"];
        if (stageIdx >= 0) s.currentStageIndex = stageIdx;
      }
    });
  }

  /** Light this stage's Ấn Dấu, advance the resume pointer, tell the HUD. */
  protected completeStage() {
    const info = GENESIS_STAGES.find((g) => g.key === this.stageKey);
    if (!info) {
      // Prologue / Epilogue: no seal; finishing the Prologue points the resume at Stage 1
      this.autosave((s) => {
        s.stagesProgress[this.stageKey as GenesisSaveData["currentStageKey"]] = { completed: true, sealLit: false };
        if (this.stageKey === GENESIS_STAGE_KEYS[0]) {
          s.currentStageKey = GENESIS_STAGE_KEYS[1];
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
      s.stagesProgress[info.key] = { completed: true, sealLit: true, bestAttempts: Math.min(prev?.bestAttempts ?? attempts, attempts) };
      const next = GENESIS_STAGES[info.index + 1];
      if (next && s.currentStageIndex <= info.index) {
        s.currentStageKey = next.key;
        s.currentStageIndex = next.index;
      } else if (!next) s.currentStageKey = GENESIS_STAGE_KEYS[GENESIS_STAGE_KEYS.length - 1]; // Stage 12 done: resume at the Epilogue
    });
    EventBus.emit("mystery-completed", { mysteryKey: info.key, mysteryIndex: info.index });
    if (first) EventBus.emit("bead-lit", { mysteryIndex: info.index });
  }
}
