import * as Phaser from "phaser";
import { CharacterCustomization } from "@/types/game";
import EventBus from "../EventBus";
import audio from "../audio/AudioManager";
import { generatePlayerSpriteCanvas } from "../utils/playerTextureGenerator";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private currentDirection: "up" | "down" | "left" | "right" = "down";
  private moveSpeed = 140;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys?: {
    up: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  private stick = { x: 0, y: 0 };
  private virtualDirection: "up" | "down" | "left" | "right" | "idle" = "idle";
  private isMovementLocked = false;
  private intent = { x: 0, y: 0 };
  private lastEmittedX = 0;
  private lastEmittedY = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    custom: CharacterCustomization
  ) {
    const textureKey = Player.ensureTexture(scene, custom);
    super(scene, x, y, textureKey, 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Hitbox tuning (fit feet for 2D top-down perspective)
    this.setSize(18, 14);
    this.setOffset(7, 18);
    this.setCollideWorldBounds(true);
    this.setDepth(10);

    this.setupAnimations(textureKey);
    this.setupKeyboardInput();
    this.setupEventBusListeners();
  }

  /**
   * Generates or refreshes the custom spritesheet texture in the Phaser TextureManager
   */
  public static ensureTexture(
    scene: Phaser.Scene,
    custom: CharacterCustomization,
    suffix = ""
  ): string {
    const key = `player_sprite_${custom.spriteKey || "default"}${suffix}`;
    if (scene.textures.exists(key)) {
      scene.textures.remove(key);
    }

    const canvas = generatePlayerSpriteCanvas(custom);
    scene.textures.addSpriteSheet(key, canvas as unknown as HTMLImageElement, {
      frameWidth: 32,
      frameHeight: 32,
    });

    return key;
  }

  public updateCustomization(custom: CharacterCustomization) {
    // Fresh key: removing the texture a live sprite still uses nulls its frame.
    const oldKey = this.texture.key;
    const key = Player.ensureTexture(this.scene, custom, `_${Date.now()}`);
    this.setTexture(key);
    this.setupAnimations(key);
    this.play(`player-idle-${this.currentDirection}`, true);
    if (oldKey !== key && this.scene.textures.exists(oldKey)) {
      this.scene.textures.remove(oldKey);
    }
  }

  private setupAnimations(textureKey: string) {
    const anims = this.scene.anims;

    const createAnim = (name: string, frames: number[], frameRate = 8) => {
      if (anims.exists(name)) anims.remove(name);
      anims.create({
        key: name,
        frames: anims.generateFrameNumbers(textureKey, { frames }),
        frameRate,
        repeat: -1,
      });
    };

    createAnim("player-walk-down", [0, 1, 2, 3]);
    createAnim("player-walk-left", [4, 5, 6, 7]);
    createAnim("player-walk-right", [8, 9, 10, 11]);
    createAnim("player-walk-up", [12, 13, 14, 15]);

    createAnim("player-idle-down", [0], 1);
    createAnim("player-idle-left", [4], 1);
    createAnim("player-idle-right", [8], 1);
    createAnim("player-idle-up", [12], 1);
  }

  private setupKeyboardInput() {
    if (!this.scene.input.keyboard) return;

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.wasdKeys = {
      up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  private setupEventBusListeners() {
    const handleVirtualDirection = (data: {
      direction: "up" | "down" | "left" | "right" | "idle";
    }) => {
      this.virtualDirection = data.direction;
    };

    const handleStickMove = (data: { x: number; y: number }) => {
      this.stick = data;
    };

    const handleCharacterUpdate = (data: { customization: CharacterCustomization }) => {
      this.updateCustomization(data.customization);
    };

    const handleDialogueOpen = () => {
      this.setMovementLock(true);
    };

    const handleDialogueClose = () => {
      this.setMovementLock(false);
    };

    EventBus.on("input-direction", handleVirtualDirection);
    EventBus.on("input-move", handleStickMove);
    EventBus.on("character-updated", handleCharacterUpdate);
    EventBus.on("dialogue-open", handleDialogueOpen);
    EventBus.on("dialogue-close", handleDialogueClose);

    this.on("destroy", () => {
      EventBus.off("input-direction", handleVirtualDirection);
      EventBus.off("input-move", handleStickMove);
      EventBus.off("character-updated", handleCharacterUpdate);
      EventBus.off("dialogue-open", handleDialogueOpen);
      EventBus.off("dialogue-close", handleDialogueClose);
    });
  }

  public setMovementLock(locked: boolean) {
    this.isMovementLocked = locked;
    if (locked) {
      this.setVelocity(0, 0);
      this.play(`player-idle-${this.currentDirection}`, true);
    }
  }

  /** Input direction (-1..1 per axis) from keyboard, d-pad or joystick; unaffected by collisions. */
  public getMoveIntent(): { x: number; y: number } {
    return this.isMovementLocked ? { x: 0, y: 0 } : this.intent;
  }

  public getDirection(): "up" | "down" | "left" | "right" {
    return this.currentDirection;
  }

  public update() {
    if (this.isMovementLocked) return;

    let vx = 0;
    let vy = 0;

    // Check keyboard inputs
    const keyLeft = this.cursors?.left.isDown || this.wasdKeys?.left.isDown;
    const keyRight = this.cursors?.right.isDown || this.wasdKeys?.right.isDown;
    const keyUp = this.cursors?.up.isDown || this.wasdKeys?.up.isDown;
    const keyDown = this.cursors?.down.isDown || this.wasdKeys?.down.isDown;

    // Combine Keyboard & Mobile Virtual D-Pad
    if (keyLeft || this.virtualDirection === "left") vx -= 1;
    if (keyRight || this.virtualDirection === "right") vx += 1;
    if (keyUp || this.virtualDirection === "up") vy -= 1;
    if (keyDown || this.virtualDirection === "down") vy += 1;

    // Normalize diagonal movement speed
    if (vx !== 0 && vy !== 0) {
      vx *= Math.SQRT1_2;
      vy *= Math.SQRT1_2;
    }

    // Analog joystick (mobile): overrides digital input while the thumb is on it
    if (this.stick.x !== 0 || this.stick.y !== 0) {
      vx = this.stick.x;
      vy = this.stick.y;
    }

    this.setVelocity(vx * this.moveSpeed, vy * this.moveSpeed);
    this.intent.x = vx;
    this.intent.y = vy;

    // Determine animation and direction
    if (vx !== 0 || vy !== 0) {
      if (Math.abs(vx) >= Math.abs(vy)) {
        this.currentDirection = vx < 0 ? "left" : "right";
      } else {
        this.currentDirection = vy < 0 ? "up" : "down";
      }
      this.play(`player-walk-${this.currentDirection}`, true);
      audio.footstep();

      // Throttled position update emit
      if (
        Math.abs(this.x - this.lastEmittedX) > 10 ||
        Math.abs(this.y - this.lastEmittedY) > 10
      ) {
        this.lastEmittedX = this.x;
        this.lastEmittedY = this.y;
        EventBus.emit("player-position-update", {
          x: Math.round(this.x),
          y: Math.round(this.y),
          direction: this.currentDirection,
        });
      }
    } else {
      this.play(`player-idle-${this.currentDirection}`, true);
    }
  }
}
