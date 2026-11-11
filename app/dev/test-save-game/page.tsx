"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { DEFAULT_CHARACTER } from "@/modules/shared/types";
import { EXODUS_STAGE_KEYS, type ExodusSaveData, type ExodusStageKey, type StageProgress, createInitialSaveData } from "@/modules/moses-the-exodus/types/game";
import { EXODUS_STAGES } from "@/modules/moses-the-exodus/data/stagesData";
import { STORAGE_KEY, loadGame, validateSaveData } from "@/modules/moses-the-exodus/utils/saveManager";

const STAGE_LABEL: Record<string, string> = {
  prologue_cay_gay_nguoi_muc_tu: "Prologue: Bản đồ sa mạc & cây gậy",
  epilogue_vuot_qua_moi: "Epilogue: Cuộc Vượt Qua Mới",
  ...Object.fromEntries(EXODUS_STAGES.map((s) => [s.key, `Stage ${s.index + 1}: ${s.titleVi}`])),
};

/** Every stage done and sealed; the resume pointer is where the game will start next. */
function buildCompletedSave(resumeAt: ExodusStageKey, keepCharacter: boolean): ExodusSaveData {
  const existing = keepCharacter ? loadGame() : null;
  const save = createInitialSaveData(existing?.player.customization ?? DEFAULT_CHARACTER);
  const progress: Partial<Record<ExodusStageKey, StageProgress>> = {};
  for (const key of EXODUS_STAGE_KEYS) {
    const isStage = EXODUS_STAGES.some((s) => s.key === key);
    progress[key] = { completed: true, tabletLit: isStage, ...(isStage ? { bestAttempts: 1 } : {}) };
  }
  const stage = EXODUS_STAGES.find((s) => s.key === resumeAt);
  return {
    ...save,
    currentStageKey: resumeAt,
    currentStageIndex: stage ? stage.index : resumeAt === "epilogue_vuot_qua_moi" ? EXODUS_STAGES.length - 1 : 0,
    stagesProgress: progress,
  };
}

function subscribeStorage(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function readRaw(): string | null {
  try { return window.localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

export default function TestSaveGamePage() {
  const [resumeAt, setResumeAt] = useState<ExodusStageKey>("stage_01_thung_coi_song_nin");
  const [keepCharacter, setKeepCharacter] = useState(true);
  const [message, setMessage] = useState("");
  const [, setTick] = useState(0);
  const raw = useSyncExternalStore(subscribeStorage, readRaw, () => null);
  const refresh = () => setTick((t) => t + 1);

  const write = (json: string, note: string) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, json);
      setMessage(note);
    } catch (e) {
      setMessage(`Không ghi được localStorage: ${String(e)}`);
    }
    refresh();
  };

  const writeCompleted = () => write(JSON.stringify(buildCompletedSave(resumeAt, keepCharacter)), `Đã ghi save hoàn thành 15/15 chặng. Game sẽ mở tại: ${STAGE_LABEL[resumeAt]}.`);

  const clear = () => {
    try { window.localStorage.removeItem(STORAGE_KEY); setMessage("Đã xoá save (game sẽ bắt đầu mới)."); } catch (e) { setMessage(String(e)); }
    refresh();
  };

  const writeRaw = (text: string) => {
    try {
      if (!validateSaveData(JSON.parse(text))) { setMessage("JSON không hợp lệ với schema save của Moses (kiểm tra version, player, stagesProgress...)."); return; }
    } catch { setMessage("Không đọc được JSON."); return; }
    write(text, "Đã ghi JSON tuỳ chỉnh.");
  };

  let parsed: ExodusSaveData | null = null;
  try { const p: unknown = raw ? JSON.parse(raw) : null; parsed = validateSaveData(p) ? p : null; } catch { parsed = null; }
  const done = parsed ? EXODUS_STAGE_KEYS.filter((k) => parsed.stagesProgress[k]?.completed).length : 0;

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4 font-mono text-sm text-slate-100">
      <header className="space-y-1">
        <Link href="/" className="text-amber-300 underline">← Trang chủ</Link>
        <h1 className="text-xl font-bold text-amber-300">Dev: ghi save hoàn thành (Moses – The Exodus)</h1>
        <p className="text-slate-400">Ghi vào localStorage key <code className="text-amber-200">{STORAGE_KEY}</code> một save đã hoàn thành mọi chặng. Mở game, bấm “Hai Bia Đá” rồi “▶ CHƠI LẠI” ở bất kỳ chặng nào để kiểm tra nhanh.</p>
      </header>

      <section className="space-y-3 rounded border border-slate-700 bg-slate-900 p-4">
        <label className="block space-y-1">
          <span className="text-slate-300">Game mở tại chặng</span>
          <select value={resumeAt} onChange={(e) => setResumeAt(e.target.value as ExodusStageKey)} className="w-full rounded border border-slate-600 bg-slate-800 p-2">
            {EXODUS_STAGE_KEYS.map((k) => <option key={k} value={k}>{STAGE_LABEL[k]}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={keepCharacter} onChange={(e) => setKeepCharacter(e.target.checked)} />
          <span>Giữ nhân vật hiện có (nếu đã có save)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={writeCompleted} className="rounded border-2 border-amber-500 bg-amber-900/60 px-3 py-2 text-amber-200 hover:bg-amber-800/60">Ghi save hoàn thành</button>
          <button type="button" onClick={clear} className="rounded border-2 border-red-500 bg-red-950/60 px-3 py-2 text-red-200 hover:bg-red-900/60">Xoá save</button>
          <button type="button" onClick={refresh} className="rounded border-2 border-slate-500 px-3 py-2 hover:bg-slate-800">Tải lại</button>
          <Link href="/moses-the-exodus" className="rounded border-2 border-emerald-500 bg-emerald-950/60 px-3 py-2 text-emerald-200 hover:bg-emerald-900/60">▶ Mở game</Link>
        </div>
        {message && <p role="status" className="text-emerald-300">{message}</p>}
      </section>

      <section className="space-y-2 rounded border border-slate-700 bg-slate-900 p-4">
        <h2 className="font-bold text-slate-200">Save hiện tại</h2>
        {!raw && <p className="text-slate-400">Chưa có save.</p>}
        {raw && !parsed && <p className="text-red-300">Có dữ liệu nhưng không hợp lệ (game sẽ bỏ qua và tạo save mới).</p>}
        {parsed && (
          <>
            <p>Mở tại: <b className="text-amber-200">{STAGE_LABEL[parsed.currentStageKey] ?? parsed.currentStageKey}</b> · Hoàn thành {done}/{EXODUS_STAGE_KEYS.length} · Nhân vật: {parsed.player.customization.name}</p>
            <ul className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              {EXODUS_STAGE_KEYS.map((k) => (
                <li key={k} className={parsed.stagesProgress[k]?.completed ? "text-emerald-300" : "text-slate-500"}>
                  {parsed.stagesProgress[k]?.completed ? "✔" : "○"} {STAGE_LABEL[k]}
                </li>
              ))}
            </ul>
          </>
        )}
        <details>
          <summary className="cursor-pointer text-slate-300">JSON thô (sửa rồi ghi)</summary>
          <RawEditor key={raw ?? "empty"} initial={raw ?? ""} onWrite={writeRaw} />
        </details>
      </section>
    </main>
  );
}

function RawEditor({ initial, onWrite }: { initial: string; onWrite: (t: string) => void }) {
  const [text, setText] = useState(initial ? safePretty(initial) : "");
  return (
    <div className="mt-2 space-y-2">
      <textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} rows={14} className="w-full rounded border border-slate-600 bg-slate-950 p-2 text-xs" />
      <button type="button" onClick={() => onWrite(text)} className="rounded border-2 border-amber-500 px-3 py-1 text-amber-200 hover:bg-amber-900/40">Ghi JSON này</button>
    </div>
  );
}

function safePretty(s: string) {
  try { return JSON.stringify(JSON.parse(s), null, 2); } catch { return s; }
}
