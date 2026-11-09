"use client";

import React, { useState, useEffect, useCallback } from "react";
import EventBus from "@/game/EventBus";

export interface DialogueOption {
  label: string;
  onSelect: () => void;
}

export interface DialogueData {
  speaker: string;
  avatarUrl?: string;
  avatarEmoji?: string;
  lines: string[];
  options?: DialogueOption[];
  onComplete?: () => void;
}

export default function DialogueBox() {
  const [dialogue, setDialogue] = useState<DialogueData | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Typewriter effect
  useEffect(() => {
    if (!dialogue || currentLineIndex >= dialogue.lines.length) return;

    const fullText = dialogue.lines[currentLineIndex];
    let currentIndex = 0;
    setDisplayedText("");
    setIsTyping(true);

    const interval = setInterval(() => {
      currentIndex++;
      setDisplayedText(fullText.slice(0, currentIndex));
      if (currentIndex >= fullText.length) {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [dialogue, currentLineIndex]);

  const hasOptions =
    !!dialogue?.options &&
    dialogue.options.length > 0 &&
    currentLineIndex === dialogue.lines.length - 1;

  const advanceDialogue = useCallback(() => {
    if (!dialogue) return;

    // If still typing, immediately complete the line
    if (isTyping) {
      setDisplayedText(dialogue.lines[currentLineIndex]);
      setIsTyping(false);
      return;
    }

    // If options are showing on the last line, do not auto advance without selecting
    if (hasOptions) {
      return;
    }

    // Move to next line or close
    if (currentLineIndex < dialogue.lines.length - 1) {
      setCurrentLineIndex((prev) => prev + 1);
    } else {
      // Finished all lines
      const done = dialogue.onComplete;
      setDialogue(null);
      setCurrentLineIndex(0);
      EventBus.emit("dialogue-close");
      done?.(); // after close, so a follow-up dialogue-open isn't wiped
    }
  }, [dialogue, isTyping, currentLineIndex, hasOptions]);

  const handleSelectOption = (option: DialogueOption) => {
    setDialogue(null);
    setCurrentLineIndex(0);
    EventBus.emit("dialogue-close");
    option.onSelect();
  };

  useEffect(() => {
    const handleOpen = (data: DialogueData) => {
      setDialogue(data);
      setCurrentLineIndex(0);
      setDisplayedText("");
    };

    const handleClose = () => {
      setDialogue(null);
      setCurrentLineIndex(0);
    };

    const handleAction = (data: { action: "A" | "B" | "MENU" }) => {
      if (data.action === "A") {
        advanceDialogue();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys 1-9 for dialogue options
      if (dialogue?.options && currentLineIndex === dialogue.lines.length - 1 && !isTyping) {
        const num = parseInt(e.key, 10);
        if (!isNaN(num) && num >= 1 && num <= dialogue.options.length) {
          e.preventDefault();
          handleSelectOption(dialogue.options[num - 1]);
          return;
        }
      }

      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        advanceDialogue();
      }
    };

    EventBus.on("dialogue-open", handleOpen);
    EventBus.on("dialogue-close", handleClose);
    EventBus.on("input-action", handleAction);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      EventBus.off("dialogue-open", handleOpen);
      EventBus.off("dialogue-close", handleClose);
      EventBus.off("input-action", handleAction);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [advanceDialogue, dialogue, currentLineIndex, isTyping]);

  if (!dialogue) return null;

  return (
    <div
      onClick={advanceDialogue}
      className="fixed inset-x-0 bottom-6 sm:bottom-10 z-50 flex justify-center px-4 cursor-pointer select-none"
    >
      <div className="relative w-full max-w-2xl retro-frame-gold p-5 sm:p-6 shadow-2xl">
        {/* Speaker Name Plaque */}
        <div className="absolute -top-5 left-4 px-3.5 py-1 bg-amber-600 border-2 border-black text-amber-100 font-pixel text-[14px] sm:text-[15px] tracking-wider uppercase shadow-md flex items-center gap-2">
          <span className="text-amber-200">
            {dialogue.avatarEmoji || "★"}
          </span>
          <span>{dialogue.speaker}</span>
          <span className="text-amber-200">★</span>
        </div>

        {/* Dialogue Text in Retro Font */}
        <div className="mt-2 min-h-[5rem] font-retro text-2xl sm:text-3xl text-amber-50 leading-relaxed tracking-wide drop-shadow-sm">
          {displayedText}
        </div>

        {/* Multiple Choice Options (when reached final line and typing done) */}
        {hasOptions && !isTyping && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-4 pt-3 border-t-2 border-amber-600/60 flex flex-col gap-2.5"
          >
            <div className="font-pixel text-xs sm:text-sm text-amber-300">
              CHỌN CÂU TRẢ LỜI CỦA BẠN:
            </div>
            {dialogue.options!.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className="retro-btn-gold w-full text-left px-4 py-2 text-sm sm:text-base font-retro text-amber-100 flex items-center gap-3 transition-transform active:translate-y-0.5 hover:bg-amber-700/80"
              >
                <span className="px-1.5 py-0.5 bg-black text-amber-300 text-xs font-pixel rounded border border-amber-500">
                  {idx + 1}
                </span>
                <span className="flex-1">{opt.label}</span>
                <span className="text-amber-300 font-pixel text-xs">▶</span>
              </button>
            ))}
          </div>
        )}

        {/* Footer Guidance */}
        <div className="mt-3 flex items-center justify-between border-t border-slate-700/80 pt-2 font-pixel text-[13px] sm:text-[14px] text-amber-300">
          <span className="text-slate-400">
            TRANG {currentLineIndex + 1}/{dialogue.lines.length}
          </span>
          {!hasOptions && (
            <span className="flex items-center gap-2 animate-pulse text-amber-400">
              <span>[ CHẠM HOẶC NHẤN A / SPACE ]</span>
              <span className="text-amber-300 text-sm font-bold">▼</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
