import { CharacterCustomization } from "@/types/game";

/**
 * Generates an in-memory 128x128 canvas containing a 4x4 spritesheet (32x32 per frame)
 * corresponding to the player's custom appearance:
 * Row 0: Facing Down (Idle, Step 1, Idle, Step 2)
 * Row 1: Facing Left (Idle, Step 1, Idle, Step 2)
 * Row 2: Facing Right (Idle, Step 1, Idle, Step 2)
 * Row 3: Facing Up (Idle, Step 1, Idle, Step 2)
 */
export function generatePlayerSpriteCanvas(
  custom: CharacterCustomization
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = false;

  const { skinTone, hairColor, hairStyle, outfitColor, accessory } = custom;

  // Directions: 0 = Down, 1 = Left, 2 = Right, 3 = Up
  // Steps: 0 = Idle, 1 = Left Foot forward, 2 = Idle, 3 = Right Foot forward
  for (let dir = 0; dir < 4; dir++) {
    for (let step = 0; step < 4; step++) {
      const offsetX = step * 32;
      const offsetY = dir * 32;

      drawCharacterFrame(
        ctx,
        offsetX,
        offsetY,
        dir,
        step,
        skinTone,
        hairColor,
        hairStyle,
        outfitColor,
        accessory
      );
    }
  }

  return canvas;
}

function drawCharacterFrame(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  dir: number, // 0: Down, 1: Left, 2: Right, 3: Up
  step: number, // 0..3
  skin: string,
  hairColor: string,
  hairStyle: string,
  outfit: string,
  accessory?: string
) {
  // Bobbing / Walk bounce
  const bounce = step === 1 || step === 3 ? -1 : 0;
  const legOffset = step === 1 ? -2 : step === 3 ? 2 : 0;

  // Shadow under character
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(ox + 10, oy + 27, 12, 1);
  ctx.fillRect(ox + 9, oy + 28, 14, 1);
  ctx.fillRect(ox + 11, oy + 29, 10, 1);

  // 1. Back hair (if visible from front/side/back)
  if (dir === 3 || hairStyle === "ponytail" || hairStyle === "wavy") {
    ctx.fillStyle = hairColor;
    if (dir === 3) {
      // Facing Up: full back hair
      ctx.fillRect(ox + 10, oy + 8 + bounce, 12, 10);
    } else if (hairStyle === "ponytail") {
      ctx.fillRect(ox + 7, oy + 10 + bounce, 3, 6);
    }
  }

  // 2. Head / Face base
  ctx.fillStyle = skin;
  ctx.fillRect(ox + 11, oy + 8 + bounce, 10, 8);

  // 3. Facial details based on direction
  if (dir === 0) {
    // Facing Down: Eyes & Smile
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(ox + 13, oy + 12 + bounce, 2, 2);
    ctx.fillRect(ox + 17, oy + 12 + bounce, 2, 2);

    // Cheeks
    ctx.fillStyle = "rgba(244, 63, 94, 0.4)";
    ctx.fillRect(ox + 11, oy + 14 + bounce, 2, 1);
    ctx.fillRect(ox + 19, oy + 14 + bounce, 2, 1);
  } else if (dir === 1) {
    // Facing Left: Profile eye
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(ox + 12, oy + 12 + bounce, 2, 2);
  } else if (dir === 2) {
    // Facing Right: Profile eye
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(ox + 18, oy + 12 + bounce, 2, 2);
  }

  // 4. Hair (Front & Top)
  ctx.fillStyle = hairColor;
  if (dir === 0) {
    // Facing Down
    ctx.fillRect(ox + 10, oy + 6 + bounce, 12, 4);
    ctx.fillRect(ox + 9, oy + 8 + bounce, 2, 4);
    ctx.fillRect(ox + 21, oy + 8 + bounce, 2, 4);
    if (hairStyle === "curly") {
      ctx.fillRect(ox + 9, oy + 5 + bounce, 14, 3);
    }
  } else if (dir === 1) {
    // Facing Left
    ctx.fillRect(ox + 10, oy + 6 + bounce, 12, 4);
    ctx.fillRect(ox + 17, oy + 8 + bounce, 4, 6);
  } else if (dir === 2) {
    // Facing Right
    ctx.fillRect(ox + 10, oy + 6 + bounce, 12, 4);
    ctx.fillRect(ox + 11, oy + 8 + bounce, 4, 6);
  } else if (dir === 3) {
    // Facing Up (Back of head)
    ctx.fillRect(ox + 10, oy + 6 + bounce, 12, 10);
  }

  // 5. Body / Outfit Robe
  ctx.fillStyle = outfit;
  ctx.fillRect(ox + 11, oy + 17 + bounce, 10, 8);

  // Arms / Sleeves
  if (dir === 0) {
    ctx.fillRect(ox + 9, oy + 17 + bounce, 2, 5);
    ctx.fillRect(ox + 21, oy + 17 + bounce, 2, 5);
    // Hands
    ctx.fillStyle = skin;
    ctx.fillRect(ox + 9, oy + 22 + bounce, 2, 2);
    ctx.fillRect(ox + 21, oy + 22 + bounce, 2, 2);
  } else if (dir === 1) {
    ctx.fillRect(ox + 13 - legOffset, oy + 17 + bounce, 4, 5);
    ctx.fillStyle = skin;
    ctx.fillRect(ox + 13 - legOffset, oy + 22 + bounce, 2, 2);
  } else if (dir === 2) {
    ctx.fillRect(ox + 15 + legOffset, oy + 17 + bounce, 4, 5);
    ctx.fillStyle = skin;
    ctx.fillRect(ox + 17 + legOffset, oy + 22 + bounce, 2, 2);
  } else {
    ctx.fillRect(ox + 9, oy + 17 + bounce, 2, 5);
    ctx.fillRect(ox + 21, oy + 17 + bounce, 2, 5);
  }

  // Belt / Cord
  ctx.fillStyle = "#451a03";
  ctx.fillRect(ox + 11, oy + 20 + bounce, 10, 2);

  // 6. Feet / Sandals
  ctx.fillStyle = "#78350f";
  if (dir === 0 || dir === 3) {
    ctx.fillRect(ox + 12, oy + 25 + (step === 1 ? -1 : 0), 3, 3);
    ctx.fillRect(ox + 17, oy + 25 + (step === 3 ? -1 : 0), 3, 3);
  } else if (dir === 1) {
    ctx.fillRect(ox + 13 + legOffset, oy + 25, 4, 3);
  } else if (dir === 2) {
    ctx.fillRect(ox + 15 + legOffset, oy + 25, 4, 3);
  }

  // 7. Accessory (Rosary, Cross, Cloak)
  if (accessory === "rosary_beads" && (dir === 0 || dir === 1 || dir === 2)) {
    // Golden beads hanging
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(ox + 15, oy + 18 + bounce, 2, 2);
    ctx.fillRect(ox + 15, oy + 21 + bounce, 2, 2);
    // Mini Cross
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(ox + 14, oy + 23 + bounce, 4, 1);
    ctx.fillRect(ox + 15, oy + 22 + bounce, 2, 3);
  } else if (accessory === "cross_pendant" && dir === 0) {
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(ox + 14, oy + 19 + bounce, 4, 1);
    ctx.fillRect(ox + 15, oy + 18 + bounce, 2, 3);
  }
}
