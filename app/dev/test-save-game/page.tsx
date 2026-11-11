"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { GAMES, DEFAULT_CHARACTER, type GameCfg } from "./games";

function subscribeStorage(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

export default function TestSaveGamePage() {
  const [gameId, setGameId] = useState(GAMES[0].id);
  const game = GAMES.find((g) => g.id === gameId) ?? GAMES[0];
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4 font-mono text-sm text-slate-100">
      <header className="space-y-1">
        <Link href="/" className="text-amber-300 underline">← Trang chủ</Link>
        <h1 className="text-xl font-bold text-amber-300">Dev: ghi đè save game</h1>
        <p className="text-slate-400">Chọn game, tick các chặng muốn đánh dấu hoàn thành, chọn chặng game mở tại, rồi ghi đè save trong localStorage.</p>
      </header>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Chọn game">
        {GAMES.map((g) => (
          <button key={g.id} type="button" role="tab" aria-selected={g.id === gameId} onClick={() => setGameId(g.id)}
            className={`rounded border-2 px-3 py-2 ${g.id === gameId ? "border-amber-400 bg-amber-900/60 text-amber-200" : "border-slate-600 text-slate-300 hover:bg-slate-800"}`}>
            {g.title}
          </button>
        ))}
      </div>
      <GameEditor key={game.id} game={game} />
    </main>
  );
}

function GameEditor({ game }: { game: GameCfg }) {
  const [sel, setSel] = useState<Set<string>>(() => new Set(game.stages.map((s) => s.key)));
  const [resume, setResume] = useState(game.stages[0].key);
  const [keepCharacter, setKeepCharacter] = useState(true);
  const [message, setMessage] = useState("");
  const [, setTick] = useState(0);
  const raw = useSyncExternalStore(subscribeStorage, () => { try { return window.localStorage.getItem(game.storageKey); } catch { return null; } }, () => null);
  const refresh = () => setTick((t) => t + 1);

  let view: ReturnType<GameCfg["read"]> = null;
  try { view = raw ? game.read(JSON.parse(raw)) : null; } catch { view = null; }

  const toggle = (k: string) => setSel((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const write = (json: string, note: string) => {
    try { window.localStorage.setItem(game.storageKey, json); setMessage(note); } catch (e) { setMessage(`Không ghi được localStorage: ${String(e)}`); }
    refresh();
  };
  const overwrite = () => write(JSON.stringify(game.build(sel, resume, (keepCharacter ? view?.character : null) ?? DEFAULT_CHARACTER)), `Đã ghi đè save ${game.title}: ${sel.size}/${game.stages.length} chặng hoàn thành, mở tại "${game.stages.find((s) => s.key === resume)?.label}".`);
  const clear = () => { try { window.localStorage.removeItem(game.storageKey); setMessage("Đã xoá save."); } catch (e) { setMessage(String(e)); } refresh(); };
  const loadFromCurrent = () => { if (view) { setSel(new Set(view.done)); setResume(view.resume); setMessage("Đã nạp lựa chọn từ save hiện tại."); } };
  const btn = "rounded border-2 px-3 py-2";

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded border border-slate-700 bg-slate-900 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold text-slate-200">Chặng hoàn thành ({sel.size}/{game.stages.length})</h2>
          <div className="flex gap-2">
            <button type="button" onClick={() => setSel(new Set(game.stages.map((s) => s.key)))} className="rounded border border-slate-500 px-2 py-1 hover:bg-slate-800">Chọn tất cả</button>
            <button type="button" onClick={() => setSel(new Set())} className="rounded border border-slate-500 px-2 py-1 hover:bg-slate-800">Bỏ chọn</button>
            <button type="button" onClick={loadFromCurrent} disabled={!view} className="rounded border border-slate-500 px-2 py-1 hover:bg-slate-800 disabled:opacity-40">Nạp từ save</button>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
          {game.stages.map((s) => (
            <li key={s.key}>
              <label className="flex cursor-pointer items-start gap-2">
                <input type="checkbox" checked={sel.has(s.key)} onChange={() => toggle(s.key)} className="mt-1" />
                <span className={sel.has(s.key) ? "text-emerald-300" : "text-slate-400"}>{s.label}</span>
              </label>
            </li>
          ))}
        </ul>
        <label className="block space-y-1">
          <span className="text-slate-300">Game mở tại chặng</span>
          <select value={resume} onChange={(e) => setResume(e.target.value)} className="w-full rounded border border-slate-600 bg-slate-800 p-2">
            {game.stages.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={keepCharacter} onChange={(e) => setKeepCharacter(e.target.checked)} />
          <span>Giữ nhân vật hiện có (nếu đã có save)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={overwrite} className={`${btn} border-amber-500 bg-amber-900/60 text-amber-200 hover:bg-amber-800/60`}>Ghi đè save</button>
          <button type="button" onClick={clear} className={`${btn} border-red-500 bg-red-950/60 text-red-200 hover:bg-red-900/60`}>Xoá save</button>
          <button type="button" onClick={refresh} className={`${btn} border-slate-500 hover:bg-slate-800`}>Tải lại</button>
          <Link href={game.route} className={`${btn} border-emerald-500 bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/60`}>▶ Mở game</Link>
        </div>
        {message && <p role="status" className="text-emerald-300">{message}</p>}
      </section>

      <section className="space-y-2 rounded border border-slate-700 bg-slate-900 p-4">
        <h2 className="font-bold text-slate-200">Save hiện tại <code className="text-xs text-slate-400">{game.storageKey}</code></h2>
        {!raw && <p className="text-slate-400">Chưa có save.</p>}
        {raw && !view && <p className="text-red-300">Có dữ liệu nhưng không hợp lệ (game sẽ bỏ qua và tạo save mới).</p>}
        {view && (
          <p>Mở tại: <b className="text-amber-200">{game.stages.find((s) => s.key === view.resume)?.label ?? view.resume}</b> · Hoàn thành {view.done.size}/{game.stages.length} · Nhân vật: {view.name}</p>
        )}
      </section>
    </div>
  );
}
