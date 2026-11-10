"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { CharacterCustomization } from "@/modules/shared/types";
import { GenesisSaveData, createInitialSaveData } from "@/modules/the-garden-of-eden/types/game";
import { loadGame, saveGame } from "@/modules/the-garden-of-eden/utils/saveManager";
import GenesisHUD from "@/modules/the-garden-of-eden/components/GenesisHUD";
import VirtualController from "@/modules/shared/components/VirtualController";
import DesktopControlHint from "@/modules/shared/components/DesktopControlHint";
import CharacterCreationModal from "@/modules/shared/components/CharacterCreationModal";
import DialogueBox from "@/modules/shared/components/DialogueBox";
import EventBus from "@/modules/shared/game/EventBus";
import audio from "@/modules/shared/game/audio/AudioManager";

const GameContainer = dynamic(() => import("@/modules/the-garden-of-eden/components/GameContainer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-slate-950 text-amber-400 font-mono text-[28px]">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <span>Đang nạp động cơ Phaser 3...</span>
      </div>
    </div>
  ),
});

export default function TheGardenOfEden() {
  const [saveInfo, setSaveInfo] = useState<GenesisSaveData | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [hasExistingSave, setHasExistingSave] = useState(false);
  const muted = useSyncExternalStore(audio.subscribe, () => audio.muted, () => false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const syncTouch = () => setIsTouchDevice(coarse.matches);
    syncTouch();
    coarse.addEventListener("change", syncTouch);

    const existing = loadGame();
    setSaveInfo(existing ?? createInitialSaveData());
    setHasExistingSave(!!existing);
    setShowCharacterModal(!existing); // new player: create a character first

    const refresh = () => {
      const cur = loadGame();
      if (cur) setSaveInfo(cur);
    };
    EventBus.on("mystery-completed", refresh);
    EventBus.on("game-restart", refresh);

    return () => {
      coarse.removeEventListener("change", syncTouch);
      EventBus.off("mystery-completed", refresh);
      EventBus.off("game-restart", refresh);
    };
  }, []);

  const handleSaveCharacter = (customization: CharacterCustomization) => {
    const base = loadGame() ?? saveInfo ?? createInitialSaveData();
    const updated: GenesisSaveData = { ...base, player: { ...base.player, customization } };
    saveGame(updated);
    setSaveInfo(updated);
    setHasExistingSave(true);
    setShowCharacterModal(false);
    EventBus.emit("character-updated", { customization });
  };


  const handleSceneReady = useCallback(() => {}, []); // ponytail: Phase 2 scenes will drive HUD visibility from this

  return (
    <main className="fixed inset-0 w-screen h-dvh overflow-hidden bg-slate-950 select-none">
      <GameContainer onSceneReady={handleSceneReady} />

      <header className="pointer-events-none fixed top-0 inset-x-0 z-30 flex items-center justify-between p-2 sm:p-4">
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            title="Về trang chủ"
            aria-label="Về trang chủ"
            className="retro-btn px-3 py-1.5 flex items-center justify-center text-[16px] leading-none text-amber-300"
          >
            🏠
          </Link>
          {saveInfo && (
            <button
              type="button"
              onClick={() => setShowCharacterModal(true)}
              title="Nhấn để đổi diện mạo"
              className="retro-btn-gold px-3 py-1.5 flex items-center gap-2 active:translate-y-0.5"
            >
              <span className="text-[16px] leading-none">{saveInfo.player.customization.gender === "girl" ? "👧" : "👦"}</span>
              <span className="font-pixel text-[13px] sm:text-[14px] text-amber-100">{saveInfo.player.customization.name}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => EventBus.emit("checkpoint-retry")}
            title="Thử lại từ Checkpoint gần nhất"
            className="retro-btn px-3 py-1.5 font-pixel text-[13px] sm:text-[14px] text-amber-300"
          >
            ↺ THỬ LẠI
          </button>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => audio.setMuted(!muted)}
            title={muted ? "Bật âm thanh" : "Tắt âm thanh"}
            className="retro-btn px-3 py-1.5 text-[12px] sm:text-[13px] text-amber-300"
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </header>

      <GenesisHUD saveData={saveInfo} />

      {isTouchDevice ? (
        <VirtualController />
      ) : (
        <footer className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
          <DesktopControlHint />
        </footer>
      )}

      <DialogueBox />

      {saveInfo && (
        <CharacterCreationModal
          isOpen={showCharacterModal}
          initialData={saveInfo.player.customization}
          canClose={hasExistingSave}
          onClose={() => setShowCharacterModal(false)}
          onSave={handleSaveCharacter}
        />
      )}
    </main>
  );
}
