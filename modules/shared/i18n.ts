import { useCallback, useEffect, useSyncExternalStore } from "react";

/** Languages supported by every game. Vietnamese is the default. */
export type Lang = "vi" | "en";

/** Bilingual line: both languages live side by side in the data files. */
export interface L {
  vi: string;
  en: string;
}

export const LANG_STORAGE_KEY = "rosary-adventures:lang";
export const LANGS: { value: Lang; label: string; flag: string }[] = [
  { value: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { value: "en", label: "English", flag: "🇬🇧" },
];

const listeners = new Set<() => void>();
let current: Lang | null = null;

function read(): Lang {
  if (typeof window === "undefined") return "vi";
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === "vi" || stored === "en") return stored;
  } catch {
    /* storage blocked: fall through to the default */
  }
  return "vi";
}

/** Current language. Safe to call from Phaser scenes (client only) and from React. */
export function getLang(): Lang {
  if (current === null) current = read();
  return current;
}

/**
 * Persist the language. Phaser scenes build their text once, so the page shells
 * reload after a change; `reload: false` is for callers that only want to store it.
 */
export function setLang(lang: Lang, opts: { reload?: boolean } = {}): void {
  if (lang === getLang()) return;
  current = lang;
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
  if (typeof document !== "undefined") document.documentElement.lang = lang;
  listeners.forEach((fn) => fn());
  if (opts.reload) window.location.reload();
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key === LANG_STORAGE_KEY) {
      current = read();
      fn();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

/** React hook: re-renders when the language changes (server render is always Vietnamese). */
export function useLang(): Lang {
  const lang = useSyncExternalStore(subscribe, getLang, () => "vi" as Lang);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return lang;
}

/**
 * Hydration-safe translator for React components: `const t = useT(); t("Xin chào", "Hello")`.
 * Prefer it over the global `t()` anywhere that is server-rendered.
 */
export function useT(): (vi: string, en: string) => string {
  const lang = useLang();
  return useCallback((vi: string, en: string) => (lang === "en" ? en : vi), [lang]);
}

/** Pick a string for the current language: `t("Xin chào", "Hello")` (client-only code such as Phaser scenes). */
export function t(vi: string, en: string): string {
  return getLang() === "en" ? en : vi;
}

/** Pick from a bilingual line. */
export function tr(l: L): string {
  return getLang() === "en" ? l.en : l.vi;
}

/** Pick from a bilingual line for an explicit language (React components using `useLang`). */
export function pick(l: L, lang: Lang): string {
  return lang === "en" ? l.en : l.vi;
}
