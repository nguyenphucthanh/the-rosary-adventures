"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { CharacterCustomization } from "@/modules/shared/types";
import { DavidSaveData, createInitialSaveData } from "@/modules/king-david/types/game";
import { loadGame, saveGame } from "@/modules/king-david/utils/saveManager";
import DavidHUD from "@/modules/king-david/components/DavidHUD";
import VirtualController from "@/modules/shared/components/VirtualController";
import DesktopControlHint from "@/modules/shared/components/DesktopControlHint";
import CharacterCreationModal from "@/modules/shared/components/CharacterCreationModal";
import DialogueBox from "@/modules/shared/components/DialogueBox";
import EventBus from "@/modules/shared/game/EventBus";
import { useT } from "@/modules/shared/i18n";
import LoadingEngine from "@/modules/shared/components/LoadingEngine";
import audio from "@/modules/shared/game/audio/AudioManager";

const GameContainer = dynamic(() => import("@/modules/king-david/components/GameContainer"), {
  ssr: false,
  loading: () => <LoadingEngine />,
});

export default function KingDavid() {
  const t = useT();
  const [saveInfo, setSaveInfo] = useState<DavidSaveData | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [hasExistingSave, setHasExistingSave] = useState(false);
  const muted = useSyncExternalStore(audio.subscribe, () => audio.muted, () => false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const syncTouch = () => setIsTouchDevice(coarse.matches);
    syncTouch();
    coarse.addEventListener("change", syncTouch);

    // localStorage only exists on the client, so the save is read once after mount.
    const existing = loadGame();
    /* eslint-disable react-hooks/set-state-in-effect */
    setSaveInfo(existing ?? createInitialSaveData());
    setHasExistingSave(!!existing);
    setShowCharacterModal(!existing); // new player: create a character first
    /* eslint-enable react-hooks/set-state-in-effect */

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
    const updated: DavidSaveData = { ...base, player: { ...base.player, customization } };
    saveGame(updated);
    setSaveInfo(updated);
    setHasExistingSave(true);
    setShowCharacterModal(false);
    EventBus.emit("character-updated", { customization });
  };

  return (
    <main className="fixed inset-0 w-screen h-dvh overflow-hidden bg-slate-950 select-none">
      <GameContainer />

      <header className="pointer-events-none fixed top-0 inset-x-0 z-30 flex items-center justify-between p-2 sm:p-4">
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            title={t("Về trang chủ", "Back to home")}
            aria-label={t("Về trang chủ", "Back to home")}
            className="retro-btn px-3 py-1.5 flex items-center justify-center text-[16px] leading-none text-amber-300"
          >
            🏠
          </Link>
          {saveInfo && (
            <button
              type="button"
              onClick={() => setShowCharacterModal(true)}
              title={t("Nhấn để đổi diện mạo", "Tap to change your look or language")}
              className="retro-btn-gold px-3 py-1.5 flex items-center gap-2 active:translate-y-0.5"
            >
              <span className="text-[16px] leading-none">{saveInfo.player.customization.gender === "girl" ? "👧" : "👦"}</span>
              <span className="font-pixel text-[13px] sm:text-[14px] text-amber-100">{saveInfo.player.customization.name}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => EventBus.emit("checkpoint-retry")}
            title={t("Thử lại từ Checkpoint gần nhất", "Retry from the last checkpoint")}
            className="retro-btn px-3 py-1.5 font-pixel text-[13px] sm:text-[14px] text-amber-300"
          >
            ↺ {t("THỬ LẠI", "RETRY")}
          </button>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => audio.setMuted(!muted)}
            title={muted ? t("Bật âm thanh", "Sound on") : t("Tắt âm thanh", "Sound off")}
            className="retro-btn px-3 py-1.5 text-[12px] sm:text-[13px] text-amber-300"
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </header>

      <DavidHUD saveData={saveInfo} />

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
