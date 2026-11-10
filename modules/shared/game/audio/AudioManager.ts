import EventBus from "@/modules/shared/game/EventBus";
import { TRACKS, ambientForScene, surfaceForScene, trackForScene, type Ambient, type Surface, type Track, type Wave } from "@/modules/shared/game/audio/tracks";

/**
 * All sound is synthesized with WebAudio (square / triangle / noise): no asset files.
 * Plain singleton, no Phaser dependency. Call audio.init() once on the client.
 */

const MUTE_KEY = "rosary-muted";
const SFX_VOL = 0.5;
const MUSIC_VOL = 0.22;
const AMBIENT_VOL = 0.6;
const LOOKAHEAD = 0.3; // seconds of music scheduled ahead

const midiFreq = (m: number) => 440 * 2 ** ((m - 69) / 12);

type SfxName =
  | "step" | "blip" | "select" | "talk" | "pickup" | "chime" | "wrong"
  | "door" | "bead" | "angel" | "bless" | "complete" | "whoosh" | "menu";

class AudioManager {
  private ctx?: AudioContext;
  private master?: GainNode;
  private sfxBus?: GainNode;
  private musicBus?: GainNode;
  private pulse = new Map<number, PeriodicWave>();
  private inited = false;
  private _muted = false;
  private music?: { id: string; gain: GainNode; timer: number };
  private wantedTrack?: string;
  private wantedAmbient: Ambient[] = [];
  private ambientBus?: GainNode;
  private ambient?: { layer: GainNode; stops: (() => void)[] };
  private lastBlip = 0;
  private surface: Surface = "stone";

  get muted() {
    return this._muted;
  }

  private listeners = new Set<() => void>();
  /** For useSyncExternalStore. */
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => void this.listeners.delete(fn);
  };

  init() {
    if (this.inited || typeof window === "undefined") return;
    this.inited = true;
    this._muted = localStorage.getItem(MUTE_KEY) === "1";
    this.listeners.forEach((f) => f());

    // Browsers (iOS especially) only allow sound after a user gesture.
    // iOS Safari only counts touchend/click/keydown as activation (not pointerdown/touchstart),
    // so listen to those and keep listening until the context is really running.
    const events = ["touchend", "click", "keydown"] as const;
    const unlock = () => {
      // iOS 17+: "playback" ignores the ring/silent switch (Web Audio is muted by it otherwise)
      const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
      if (session) session.type = "playback";
      const ctx = this.ensureCtx();
      // resume() is async: only start music once the context is actually running
      void ctx?.resume().then(() => {
        if (ctx.state !== "running") return;
        events.forEach((e) => window.removeEventListener(e, unlock));
        if (this.wantedTrack !== undefined) this.playMusic(this.wantedTrack);
        this.playAmbient(this.wantedAmbient);
      });
    };
    events.forEach((e) => window.addEventListener(e, unlock));

    EventBus.on("scene-ready", ({ sceneKey }) => {
      const id = trackForScene(sceneKey);
      if (id !== undefined) this.playMusic(id);
      this.surface = surfaceForScene(sceneKey);
      const amb = ambientForScene(sceneKey);
      if (amb) this.playAmbient(amb);
    });
    EventBus.on("dialogue-open", () => this.sfx("talk"));
    EventBus.on("bead-lit", ({ mysteryIndex }) => this.sfx("bead", mysteryIndex % 5));
    EventBus.on("mystery-completed", () => this.sfx("complete"));
    EventBus.on("scene-change-request", () => this.sfx("whoosh"));
  }

  setMuted(m: boolean) {
    this._muted = m;
    localStorage.setItem(MUTE_KEY, m ? "1" : "0");
    this.listeners.forEach((f) => f());
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 1, this.ctx.currentTime, 0.05);
  }

  // ---------- context ----------

  private ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return undefined;
      const ctx = new AC();
      this.ctx = ctx;
      this.master = ctx.createGain();
      this.master.gain.value = this._muted ? 0 : 1;
      this.master.connect(ctx.destination);
      this.sfxBus = ctx.createGain();
      this.sfxBus.gain.value = SFX_VOL;
      this.sfxBus.connect(this.master);
      this.musicBus = ctx.createGain();
      this.musicBus.gain.value = MUSIC_VOL;
      this.musicBus.connect(this.master);
      this.ambientBus = ctx.createGain();
      this.ambientBus.gain.value = AMBIENT_VOL;
      this.ambientBus.connect(this.master);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  /** Context only once the user has interacted; never creates it early (autoplay policy). */
  private live() {
    return this.ctx && this.ctx.state === "running" ? this.ctx : undefined;
  }

  // ---------- synth primitives ----------

  private wave(ctx: AudioContext, osc: OscillatorNode, w: Wave) {
    if (typeof w === "number") {
      let pw = this.pulse.get(w);
      if (!pw) {
        const n = 24;
        const real = new Float32Array(n);
        const imag = new Float32Array(n);
        for (let k = 1; k < n; k++) real[k] = (2 * Math.sin(k * Math.PI * w)) / (k * Math.PI);
        pw = ctx.createPeriodicWave(real, imag);
        this.pulse.set(w, pw);
      }
      osc.setPeriodicWave(pw);
    } else osc.type = w;
  }

  private tone(
    bus: GainNode, w: Wave, freq: number, at: number, dur: number, vol: number, slideTo?: number
  ) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    this.wave(ctx, osc, w);
    osc.frequency.setValueAtTime(freq, at);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, at + dur);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(vol, at + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(g).connect(bus);
    osc.start(at);
    osc.stop(at + dur + 0.02);
  }

  private noise(at: number, dur: number, vol: number, f0: number, f1 = f0, out: GainNode = this.sfxBus!) {
    const ctx = this.ctx!;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = "bandpass";
    filt.frequency.setValueAtTime(f0, at);
    filt.frequency.exponentialRampToValueAtTime(f1, at + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    src.connect(filt).connect(g).connect(out);
    src.start(at);
  }

  /** Notes (midi) played in a row on the sfx bus. */
  private arp(w: Wave, notes: number[], gap: number, len: number, vol: number) {
    const t = this.ctx!.currentTime;
    notes.forEach((m, i) => this.tone(this.sfxBus!, w, midiFreq(m), t + i * gap, len, vol));
  }

  // ---------- sound effects ----------

  /** `arg` = pitch seed for blip, bead index (0-4) for bead. */
  sfx(name: SfxName, arg = 0) {
    const ctx = this.live();
    if (!ctx || this._muted) return;
    const t = ctx.currentTime;
    const bus = this.sfxBus!;
    switch (name) {
      case "step": {
        const v = 0.85 + Math.random() * 0.3; // slight variation so steps don't machine-gun
        if (this.surface === "grass") this.noise(t, 0.07, 0.12 * v, 1500, 700);
        else if (this.surface === "sand") this.noise(t, 0.1, 0.12 * v, 4000, 2500);
        else if (this.surface === "wood") {
          this.noise(t, 0.04, 0.2 * v, 700, 300);
          this.tone(bus, "triangle", 150 * v, t, 0.07, 0.25, 90);
        } else {
          this.noise(t, 0.03, 0.3 * v, 2500 * v, 1200);
          this.tone(bus, "square", 900 * v, t, 0.015, 0.05);
        }
        break;
      }
      case "blip": {
        if (t - this.lastBlip < 0.05) return; // never stack blips
        this.lastBlip = t;
        const base = [60, 64, 67, 71, 72][arg % 5];
        this.tone(bus, "square", midiFreq(base + Math.floor(Math.random() * 3)), t, 0.05, 0.1);
        break;
      }
      case "select":
        this.arp("square", [72, 79], 0.06, 0.08, 0.12);
        break;
      case "menu":
        this.arp("triangle", [67, 74], 0.05, 0.1, 0.2);
        break;
      case "talk":
        this.arp("triangle", [69, 76], 0.05, 0.09, 0.2);
        break;
      case "pickup":
        this.arp("square", [76, 80, 83], 0.06, 0.1, 0.12);
        this.noise(t + 0.15, 0.08, 0.05, 6000, 3000);
        break;
      case "chime":
        this.arp(0.25, [79, 83, 86, 91], 0.07, 0.35, 0.12);
        break;
      case "wrong":
        this.tone(bus, "triangle", 200, t, 0.22, 0.3, 120);
        break;
      case "door":
        this.noise(t, 0.35, 0.35, 300, 140);
        this.tone(bus, "triangle", 110, t + 0.3, 0.12, 0.35, 70);
        break;
      case "bead": // pitch climbs with the bead's place in the decade
        this.tone(bus, "sine", midiFreq(84 + arg * 2), t, 0.6, 0.35);
        this.tone(bus, "sine", midiFreq(96 + arg * 2), t, 0.4, 0.12);
        break;
      case "angel":
        this.arp("sine", [72, 76, 79, 84, 88], 0.09, 0.7, 0.18);
        break;
      case "bless":
        this.arp("triangle", [60, 64, 67, 72, 76, 79, 84], 0.12, 0.8, 0.2);
        break;
      case "complete":
        this.arp(0.25, [72, 76, 79, 84, 79, 84], 0.14, 0.4, 0.14);
        break;
      case "whoosh":
        this.noise(t, 0.5, 0.25, 300, 3000);
        break;
    }
  }

  /** Footstep with a built-in cadence limiter; call every frame while walking. */
  private lastStep = 0;
  footstep() {
    const now = performance.now();
    if (now - this.lastStep < 280) return;
    this.lastStep = now;
    this.sfx("step");
  }

  /** Typewriter blip: call per character; plays every 3rd non-space one. */
  private blipCount = 0;
  typeBlip(speaker: string) {
    if (++this.blipCount % 3) return;
    let h = 0;
    for (const c of speaker) h = (h * 31 + c.charCodeAt(0)) | 0;
    this.sfx("blip", Math.abs(h));
  }

  // ---------- ambience ----------

  /** Looping layers (wind, crowd) plus random one-shots (birds, crickets, fire crackle). */
  playAmbient(kinds: Ambient[]) {
    this.wantedAmbient = kinds;
    const ctx = this.live();
    if (!ctx) return;
    const same = this.ambient && kinds.join() === this.ambientKinds;
    if (same) return;
    this.stopAmbient();
    this.ambientKinds = kinds.join();
    if (!kinds.length) return;

    const layer = ctx.createGain();
    layer.gain.setValueAtTime(0, ctx.currentTime);
    layer.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5);
    layer.connect(this.ambientBus!);
    const stops: (() => void)[] = [];
    // randomly timed one-shots
    const every = (min: number, max: number, fn: (t: number) => void) => {
      let id = 0;
      const loop = () => {
        fn(ctx.currentTime + 0.02);
        id = window.setTimeout(loop, min + Math.random() * (max - min));
      };
      id = window.setTimeout(loop, min);
      stops.push(() => clearTimeout(id));
    };
    // endless noise bed with a slow volume wobble
    const bed = (freq: number, q: number, vol: number, lfoHz: number) => {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = freq;
      f.Q.value = q;
      const g = ctx.createGain();
      g.gain.value = vol;
      const lfo = ctx.createOscillator();
      const depth = ctx.createGain();
      lfo.frequency.value = lfoHz;
      depth.gain.value = vol * 0.6;
      lfo.connect(depth).connect(g.gain);
      src.connect(f).connect(g).connect(layer);
      src.start();
      lfo.start();
      stops.push(() => { src.stop(); lfo.stop(); });
    };

    for (const k of kinds) {
      if (k === "wind") bed(350, 0.6, 0.3, 0.12);
      else if (k === "crowd") bed(550, 0.9, 0.14, 0.35);
      else if (k === "birds")
        every(1500, 5000, (t) => {
          const base = 2800 + Math.random() * 1500;
          for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++)
            this.tone(layer, "sine", base, t + i * 0.09, 0.07, 0.12, base * (i % 2 ? 0.8 : 1.25));
        });
      else if (k === "crickets")
        every(700, 1100, (t) => {
          for (let i = 0; i < 4; i++) this.tone(layer, "sine", 4300, t + i * 0.06, 0.04, 0.06);
        });
      else if (k === "fire") every(90, 350, (t) => this.noise(t, 0.03, 0.2, 2200 + Math.random() * 1500, 1500, layer));
    }
    this.ambient = { layer, stops };
  }

  private ambientKinds = "";

  private stopAmbient() {
    const a = this.ambient;
    if (!a) return;
    this.ambient = undefined;
    const ctx = this.ctx!;
    a.layer.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    a.stops.forEach((s) => s());
    setTimeout(() => a.layer.disconnect(), 2000);
  }

  // ---------- music ----------

  /** id: track name, or "" for silence. */
  playMusic(id: string) {
    this.wantedTrack = id;
    const ctx = this.live();
    if (!ctx) return; // not unlocked yet; unlock() replays wantedTrack
    if (this.music?.id === id) return;

    if (this.music) {
      const old = this.music;
      old.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
      clearInterval(old.timer);
      setTimeout(() => old.gain.disconnect(), 1500);
      this.music = undefined;
    }
    const track = TRACKS[id];
    if (!track) return;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1);
    gain.connect(this.musicBus!);
    const stepLen = 60 / track.bpm / 2; // one step = an eighth note
    let step = 0;
    let next = ctx.currentTime + 0.1;
    const timer = window.setInterval(() => {
      while (next < ctx.currentTime + LOOKAHEAD) {
        this.scheduleStep(gain, track, step, next, stepLen);
        step = (step + 1) % track.length;
        next += stepLen;
      }
    }, 80);
    this.music = { id, gain, timer };
  }

  private scheduleStep(bus: GainNode, tr: Track, step: number, at: number, stepLen: number) {
    const lead = tr.lead[step];
    if (lead) this.tone(bus, tr.leadWave, midiFreq(lead.midi), at, lead.len * stepLen * 0.92, tr.leadVol);
    const bass = tr.bass[step];
    if (bass) this.tone(bus, tr.bassWave, midiFreq(bass.midi), at, bass.len * stepLen * 0.95, tr.bassVol);
  }
}

export const audio = new AudioManager();
export default audio;
