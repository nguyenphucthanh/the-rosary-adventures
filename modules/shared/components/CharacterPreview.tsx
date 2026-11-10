"use client";

import React from "react";
import { CharacterCustomization } from "@/modules/shared/types";

export interface CharacterPreviewProps {
  customization: CharacterCustomization;
  size?: number;
  className?: string;
  animate?: boolean;
}

export default function CharacterPreview({
  customization,
  size = 140,
  className = "",
  animate = true,
}: CharacterPreviewProps) {
  const { gender, skinTone, hairStyle, hairColor, outfitColor, accessory } =
    customization;

  // Pixel grid size: 16x16
  // Rendered with SVG crispEdges for classic retro look
  return (
    <div
      className={`relative flex items-center justify-center p-2 retro-frame bg-slate-950 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Halo / Aura glow behind character */}
      <div className="absolute inset-4 rounded-full bg-amber-400/10 blur-md pointer-events-none" />

      <svg
        viewBox="0 0 16 16"
        className={`w-full h-full drop-shadow-md ${animate ? "animate-pulse" : ""}`}
        style={{
          shapeRendering: "geometricPrecision",
        }}
      >
        {/* Hair - Back layer (for ponytail / long wavy hair) */}
        {hairStyle === "ponytail" && (
          <>
            <rect x="3" y="4" width="2" height="6" fill={hairColor} />
            <rect x="2" y="7" width="2" height="4" fill={hairColor} />
          </>
        )}
        {hairStyle === "wavy" && (
          <>
            <rect x="3" y="4" width="2" height="7" fill={hairColor} />
            <rect x="11" y="4" width="2" height="7" fill={hairColor} />
          </>
        )}

        {/* Head Base (Skin) */}
        <rect x="5" y="3" width="6" height="5" fill={skinTone} />
        {/* Ears */}
        <rect x="4" y="5" width="1" height="2" fill={skinTone} />
        <rect x="11" y="5" width="1" height="2" fill={skinTone} />

        {/* Eyes */}
        <rect x="6" y="5" width="1" height="1.5" fill="#1e293b" />
        <rect x="9" y="5" width="1" height="1.5" fill="#1e293b" />
        {/* Cheeks / Blush */}
        <rect x="5" y="6" width="1" height="1" fill="#f43f5e" opacity="0.4" />
        <rect x="10" y="6" width="1" height="1" fill="#f43f5e" opacity="0.4" />
        {/* Mouth */}
        <rect x="7" y="7" width="2" height="0.6" fill="#881337" opacity="0.6" />

        {/* Hair - Front / Top layer */}
        {hairStyle === "short" && (
          <>
            <rect x="5" y="2" width="6" height="2" fill={hairColor} />
            <rect x="4" y="3" width="2" height="2" fill={hairColor} />
            <rect x="10" y="3" width="2" height="2" fill={hairColor} />
            <rect x="6" y="3" width="2" height="1" fill={hairColor} />
          </>
        )}
        {hairStyle === "ponytail" && (
          <>
            <rect x="5" y="2" width="6" height="2" fill={hairColor} />
            <rect x="4" y="3" width="2" height="2" fill={hairColor} />
            <rect x="10" y="3" width="2" height="2" fill={hairColor} />
            {/* Hair ribbon */}
            <rect x="3" y="3" width="2" height="1.5" fill="#ef4444" />
          </>
        )}
        {hairStyle === "curly" && (
          <>
            <rect x="4" y="1" width="8" height="2" fill={hairColor} />
            <rect x="3" y="2" width="2" height="4" fill={hairColor} />
            <rect x="11" y="2" width="2" height="4" fill={hairColor} />
            <rect x="5" y="3" width="2" height="1" fill={hairColor} />
            <rect x="9" y="3" width="2" height="1" fill={hairColor} />
          </>
        )}
        {hairStyle === "wavy" && (
          <>
            <rect x="5" y="2" width="6" height="2" fill={hairColor} />
            <rect x="4" y="3" width="2" height="3" fill={hairColor} />
            <rect x="10" y="3" width="2" height="3" fill={hairColor} />
          </>
        )}

        {/* Neck */}
        <rect x="7" y="8" width="2" height="1" fill={skinTone} />

        {/* Torso & Robe / Cloak (Outfit) */}
        <rect x="5" y="9" width="6" height="4" fill={outfitColor} />
        {/* Sleeves / Arms */}
        <rect x="4" y="9" width="1" height="3" fill={outfitColor} />
        <rect x="11" y="9" width="1" height="3" fill={outfitColor} />
        {/* Hands */}
        <rect x="4" y="12" width="1" height="1" fill={skinTone} />
        <rect x="11" y="12" width="1" height="1" fill={skinTone} />

        {/* Belt / Sash */}
        <rect x="5" y="11" width="6" height="1" fill="#451a03" opacity="0.6" />

        {/* Robe Hem (Bottom skirt or tunic) */}
        <rect x="5" y="13" width="6" height="1" fill={outfitColor} />
        <rect
          x="5"
          y="13"
          width="6"
          height="1"
          fill="#000000"
          opacity="0.15"
        />

        {/* Shoes / Sandals */}
        <rect x="5" y="14" width="2" height="1" fill="#78350f" />
        <rect x="9" y="14" width="2" height="1" fill="#78350f" />

        {/* Accessories */}
        {accessory === "rosary_beads" && (
          <>
            {/* Rosary beads loop around neck */}
            <rect x="7" y="9" width="1" height="1" fill="#fbbf24" />
            <rect x="8" y="9" width="1" height="1" fill="#fbbf24" />
            <rect x="7.5" y="10" width="1" height="1.5" fill="#f59e0b" />
            {/* Tiny Cross */}
            <rect x="7" y="11.5" width="2" height="0.6" fill="#ffd700" />
            <rect x="7.7" y="11" width="0.6" height="1.8" fill="#ffd700" />
          </>
        )}
        {accessory === "cross_pendant" && (
          <>
            {/* Golden cross pendant */}
            <rect x="7.5" y="9" width="1" height="1" fill="#94a3b8" />
            <rect x="7" y="10.5" width="2" height="0.6" fill="#ffd700" />
            <rect x="7.7" y="10" width="0.6" height="1.8" fill="#ffd700" />
          </>
        )}
        {accessory === "cloak" && (
          <>
            {/* Traveler's Shoulder Cape */}
            <rect x="4" y="8" width="8" height="1.5" fill="#92400e" />
            <rect x="4" y="9.5" width="1" height="2" fill="#92400e" />
            <rect x="11" y="9.5" width="1" height="2" fill="#92400e" />
          </>
        )}
      </svg>
    </div>
  );
}
