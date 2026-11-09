/**
 * Chiptune loops as note strings. One token = one eighth-note step.
 * Note name (C4, F#5, Bb3), "." = rest, "-" = hold previous note. "|" is ignored (bar lines).
 * Wave: oscillator type, or a number = pulse-wave duty (0.25 = classic NES lead).
 */

export type Wave = OscillatorType | number;

export interface Note {
  midi: number;
  len: number; // in steps
}

export interface Track {
  bpm: number;
  length: number; // steps in the loop
  lead: (Note | undefined)[];
  bass: (Note | undefined)[];
  leadWave: Wave;
  bassWave: Wave;
  leadVol: number;
  bassVol: number;
}

const SEMI: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function parse(src: string): (Note | undefined)[] {
  const out: (Note | undefined)[] = [];
  let last: Note | undefined;
  for (const tok of src.split(/\s+/)) {
    if (!tok || tok === "|") continue;
    if (tok === "-") {
      if (last) last.len++;
      out.push(undefined);
    } else if (tok === ".") {
      last = undefined;
      out.push(undefined);
    } else {
      const m = /^([A-G])([#b]?)(\d)$/.exec(tok);
      if (!m) throw new Error(`bad note "${tok}"`);
      const midi = 12 * (Number(m[3]) + 1) + SEMI[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
      last = { midi, len: 1 };
      out.push(last);
    }
  }
  return out;
}

function track(
  bpm: number, leadWave: Wave, bassWave: Wave, leadVol: number, bassVol: number, lead: string, bass: string
): Track {
  const l = parse(lead);
  const b = parse(bass);
  if (l.length !== b.length) throw new Error(`lead ${l.length} / bass ${b.length} steps differ`);
  return { bpm, length: l.length, lead: l, bass: b, leadWave, bassWave, leadVol, bassVol };
}

export const TRACKS: Record<string, Track> = {
  // Bedroom / title: music-box lullaby, C major
  lullaby: track(70, "triangle", "sine", 0.5, 0.45,
    `E5 - G5 - E5 - C5 - | D5 - F5 - D5 - B4 - | C5 - E5 - G5 - E5 - | D5 - - - C5 - - -`,
    `C3 - - - G3 - - - | G2 - - - D3 - - - | C3 - - - E3 - - - | G2 - - - C3 - - -`),

  // Joyful: bright and bouncy, C major
  joyful: track(104, "square", "triangle", 0.22, 0.5,
    `C5 E5 G5 E5 C5 E5 G5 - | A4 C5 F5 C5 A4 C5 F5 - | G4 B4 D5 B4 G4 B4 D5 - | E5 D5 C5 D5 E5 - C5 -`,
    `C3 . G3 . C3 . G3 . | F3 . C3 . F3 . C3 . | G3 . D3 . G3 . D3 . | C3 . G3 . C3 . . .`),

  // Luminous: open and pastoral, D major, thin pulse lead
  luminous: track(100, 0.25, "triangle", 0.2, 0.5,
    `D5 F#5 A5 F#5 D5 F#5 A5 - | B4 D5 F#5 D5 B4 D5 F#5 - | G4 B4 D5 B4 A4 C#5 E5 - | F#5 E5 D5 E5 F#5 - D5 -`,
    `D3 . A3 . D3 . A3 . | B2 . F#3 . B2 . F#3 . | G2 . D3 . A2 . E3 . | D3 . A3 . D3 . . .`),

  // Sorrowful: slow, tender, sparse, A minor. No drums.
  sorrowful: track(56, "triangle", "sine", 0.45, 0.5,
    `E5 - - - D5 - C5 - | B4 - - - A4 - - - | C5 - - - B4 - A4 - | G#4 - - - A4 - - -`,
    `A2 - - - - - - - | E2 - - - - - - - | F2 - - - - - - - | E2 - - - A2 - - -`),

  // Glorious: triumphant, fast arpeggios, C major, pulse lead
  glorious: track(116, 0.25, "square", 0.22, 0.2,
    `G4 C5 E5 G5 E5 C5 E5 G5 | A4 C5 F5 A5 F5 C5 F5 A5 | G4 B4 D5 G5 D5 B4 D5 G5 | C5 E5 G5 C6 G5 E5 C5 -`,
    `C3 . C3 . G2 . G2 . | F2 . F2 . C3 . C3 . | G2 . G2 . D3 . D3 . | C3 . G2 . C3 . . .`),
};

/** Scene key -> track id. undefined = keep whatever is playing (transitions, loading). */
export function trackForScene(key: string): string | undefined {
  if (key === "TitleScene" || key === "PrologueScene" || key === "EpilogueScene") return "lullaby";
  if (key.startsWith("Joyful")) return "joyful";
  if (key.startsWith("Luminous")) return "luminous";
  if (key.startsWith("Sorrowful")) return "sorrowful";
  if (key.startsWith("Glorious")) return "glorious";
  return undefined;
}

export type Ambient = "birds" | "crickets" | "wind" | "crowd" | "fire";

const AMBIENT: Record<string, Ambient[]> = {
  Joyful02VisitationScene: ["birds"],
  Joyful03NativityScene: ["crickets"],
  Joyful05FindingScene: ["crowd"],
  Luminous01BaptismScene: ["birds", "wind"],
  Luminous02CanaScene: ["crowd"],
  Luminous03BeatitudesScene: ["birds", "wind"],
  Luminous04TransfigurationScene: ["wind"],
  Sorrowful01GardenScene: ["crickets"],
  Sorrowful02PraetoriumScene: ["crowd"],
  Sorrowful03ThornsScene: ["crowd"],
  Sorrowful04CrossScene: ["crowd"],
  Sorrowful05CalvaryScene: ["wind"],
  Glorious01ResurrectionScene: ["birds"],
  Glorious02AscensionScene: ["wind"],
  Glorious03PentecostScene: ["fire"],
  Glorious04AssumptionScene: ["birds"],
  PrologueScene: ["crickets"],
  EpilogueScene: ["crickets"],
};

/** Scene key -> ambient layers. [] = silence; undefined = keep (transitions, loading). */
export function ambientForScene(key: string): Ambient[] | undefined {
  if (AMBIENT[key]) return AMBIENT[key];
  return trackForScene(key) !== undefined ? [] : undefined;
}

export type Surface = "grass" | "stone" | "wood" | "sand";

const SURFACE: Record<string, Surface> = {
  Joyful02VisitationScene: "grass",
  Joyful03NativityScene: "sand", // straw and dirt
  Luminous01BaptismScene: "grass",
  Luminous03BeatitudesScene: "grass",
  Luminous05EucharistScene: "wood",
  Sorrowful01GardenScene: "grass",
  Sorrowful04CrossScene: "sand",
  Sorrowful05CalvaryScene: "sand",
  Glorious01ResurrectionScene: "grass",
  Glorious02AscensionScene: "grass",
  Glorious03PentecostScene: "wood",
  Glorious04AssumptionScene: "grass",
  Glorious05CoronationScene: "grass",
  PrologueScene: "wood",
  EpilogueScene: "wood",
};

/** Floor sound for a scene; stone unless listed. */
export const surfaceForScene = (key: string): Surface => SURFACE[key] ?? "stone";
