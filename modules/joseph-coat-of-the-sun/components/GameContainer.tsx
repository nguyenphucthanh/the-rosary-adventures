"use client";

import React, { useEffect, useRef } from "react";
import * as Phaser from "phaser";
import { createGameConfig } from "@/modules/joseph-coat-of-the-sun/game/config";
import audio from "@/modules/shared/game/audio/AudioManager";

export default function GameContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;
    audio.init();
    gameRef.current = new Phaser.Game(createGameConfig(containerRef.current));
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="phaser-game-container" ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950" />;
}
