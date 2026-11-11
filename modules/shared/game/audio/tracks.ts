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

  // Crafting / workshop: industrious, cheerful bounce, G major
  crafting: track(108, 0.25, "triangle", 0.22, 0.45,
    `G4 B4 D5 D5 E5 D5 B4 G4 | A4 C5 E5 - D5 C5 B4 A4 | B4 D5 G5 G5 A5 G5 E5 D5 | C5 B4 A4 D5 G4 - - -`,
    `G2 . D3 . G2 . D3 . | C3 . G2 . D3 . F#2 . | G2 . D3 . C3 . E3 . | D3 . D3 . G2 . . .`),

  // Animal march: playful hop, F major, two-by-two
  animals: track(112, "square", "triangle", 0.2, 0.45,
    `F4 A4 C5 F5 E5 D5 C5 - | D5 F5 Bb5 - A5 G5 F5 - | G4 Bb4 D5 G5 F5 E5 D5 E5 | F5 C5 A4 G4 F4 - - -`,
    `F2 . C3 . F2 . A2 . | Bb2 . F2 . Bb2 . D3 . | C3 . G2 . C3 . E3 . | F2 . C3 . F2 . . .`),

  // Deluge / storm: fast, urgent, driving rain in D minor
  storm: track(124, 0.25, "square", 0.22, 0.22,
    `D5 A4 F4 A4 D5 E5 F5 G5 | A5 F5 D5 F5 E5 - D5 C#5 | D5 F5 A5 D6 C6 Bb5 A5 G5 | F5 D5 E5 C#5 D5 - - -`,
    `D3 D3 A2 D3 D3 D3 A2 D3 | Bb2 Bb2 F2 Bb2 A2 A2 E2 A2 | D3 D3 A2 D3 G2 G2 D3 G2 | A2 A2 A2 A2 D3 . . .`),

  // Ocean voyage: rolling gentle swells, vast waters, G major
  voyage: track(84, "triangle", "sine", 0.45, 0.45,
    `D5 - - B4 C5 - D5 - | E5 - - G5 D5 - - - | C5 - D5 E5 B4 - C5 D5 | A4 - - B4 G4 - - -`,
    `G2 - - - C3 - - - | C3 - - - G2 - - - | A2 - - - B2 - - - | D3 - - - G2 - - -`),

  // Creation dawn: crystalline, celestial fifths, E minor / G major
  creation: track(92, 0.25, "sine", 0.22, 0.45,
    `E5 - B4 - G5 - E5 - | F#5 - D5 - A5 - F#5 - | G5 - E5 - B5 - G5 - | A5 G5 F#5 D5 E5 - - -`,
    `E3 - - - B2 - - - | D3 - - - A2 - - - | C3 - - - G2 - - - | B2 - - - E2 - - -`),

  // Eden paradise: idyllic pastoral lilt, cascading streams, F major
  eden: track(96, "triangle", "triangle", 0.4, 0.4,
    `C5 - A4 - F5 - E5 D5 | C5 - - D5 A4 - - - | Bb4 - D5 - G5 - F5 E5 | F5 - - G5 F5 - - -`,
    `F2 - . C3 F2 - . C3 | A2 - . E3 F2 - . C3 | Bb2 - . F2 C3 - . G2 | F2 - . C3 F2 - - -`),

  // Serpent & temptation: sneaky, chromatic, cautious tension, C minor
  serpent: track(88, "square", "triangle", 0.2, 0.45,
    `C5 - Eb5 - D5 - Db5 - | C5 - - - G4 - Bb4 - | Ab4 - C5 - B4 - Bb4 - | A4 - Ab4 - G4 - - -`,
    `C3 . . . C3 . . . | Eb2 . . . G2 . . . | Ab2 . . . F2 . . . | G2 . . . C3 - - -`),

  // Sabbath: meditative tranquility, holy stillness, G major
  sabbath: track(64, "sine", "sine", 0.5, 0.45,
    `G4 - B4 - D5 - - - | C5 - E5 - D5 - - - | B4 - D5 - C5 - A4 - | G4 - A4 - G4 - - -`,
    `G2 - - - B2 - - - | C3 - - - G2 - - - | E2 - - - F#2 - - - | D3 - - - G2 - - -`),

  // Promise of salvation: solemn pilgrimage with sunrise warmth, D minor
  promise: track(80, "triangle", "triangle", 0.45, 0.4,
    `D5 - F5 - A5 - G5 F5 | E5 - G5 - F5 - E5 - | D5 - F5 - Bb5 - A5 G5 | A5 - C#5 - D5 - - -`,
    `D3 - - - F3 - - - | C3 - - - A2 - - - | Bb2 - - - G2 - - - | A2 - - - D3 - - -`),

  // Nile & Papyrus Basket: tender, flowing river lullaby, D minor / F major
  nile: track(80, "triangle", "sine", 0.45, 0.45,
    `D5 - F5 - A5 - - G5 | F5 - E5 - D5 - - - | F5 - G5 - A5 - C6 - | A5 - G5 - F5 - - -`,
    `D3 - - - F3 - - - | A2 - - - D3 - - - | F3 - - - C3 - - - | G2 - - - D3 - - -`),

  // Exodus & Red Sea: epic, driving heroic march, D minor
  exodus: track(126, 0.25, "square", 0.22, 0.22,
    `D5 D5 A4 D5 F5 - E5 D5 | G5 F5 E5 D5 C#5 - - - | D5 F5 A5 D6 C6 - Bb5 A5 | Bb5 A5 G5 F5 E5 - D5 -`,
    `D3 . D3 . D3 . D3 . | G2 . G2 . A2 . A2 . | Bb2 . Bb2 . F2 . F2 . | G2 . G2 . A2 . D3 .`),

  // Miriam's Tambourine: festive Middle-Eastern praise dance, D Dorian
  miriam: track(116, "square", "triangle", 0.2, 0.45,
    `D5 - F5 G5 A5 A5 G5 F5 | E5 - G5 - F5 E5 D5 - | A5 - D6 - C6 B4 A5 G5 | F5 G5 A5 E5 D5 - - -`,
    `D3 . A2 . D3 . F3 . | C3 . G2 . D3 . A2 . | F3 . C3 . G2 . C3 . | A2 . E3 . D3 . . .`),

  // Mount Sinai & Ten Commandments: majestic trumpet fanfare, C major
  sinai: track(104, 0.25, "triangle", 0.22, 0.45,
    `C5 - G4 - C5 - E5 - | G5 - - - E5 - G5 - | A5 - F5 - G5 - E5 - | D5 - - - C5 - - -`,
    `C3 . G2 . C3 . E3 . | G2 . D3 . G2 . B2 . | F2 . C3 . E2 . B2 . | G2 . G2 . C3 - - -`),

  // Manna & Wilderness: gentle morning dew, peaceful desert gathering, F major
  wilderness: track(90, 0.25, "sine", 0.22, 0.45,
    `A4 C5 F5 - G5 F5 E5 D5 | C5 - - D5 A4 - - - | D5 F5 Bb5 - A5 G5 F5 - | G5 - E5 - F5 - - -`,
    `F2 - - - C3 - - - | A2 - - - F2 - - - | Bb2 - - - D3 - - - | C3 - - - F2 - - -`),

  // Tabernacle & Glory: splendid sacred sanctuary hymn, G major
  tabernacle: track(96, "triangle", "triangle", 0.4, 0.4,
    `D5 - G5 - B5 - A5 G5 | E5 - - - G5 - - - | C5 - E5 - D5 - B4 - | A4 - - B4 G4 - - -`,
    `G2 - - - B2 - - - | C3 - - - E3 - - - | A2 - - - B2 - - - | D3 - - - G2 - - -`),
};

const SCENE_TRACKS: Record<string, string> = {
  // Noah's Ark
  Stage01RighteousScene: "sorrowful",
  Stage02BlueprintScene: "crafting",
  Stage03AnimalPairsScene: "animals",
  Stage04FloodScene: "storm",
  Stage05ArkVoyageScene: "voyage",
  Stage06AraratWindScene: "luminous",
  Stage07OliveDoveScene: "luminous",
  Stage08RainbowCovenantScene: "glorious",

  // The Garden of Eden
  Stage01LightScene: "creation",
  Stage02SkyScene: "luminous",
  Stage03LandScene: "joyful",
  Stage04StarsScene: "creation",
  Stage05SeaBirdsScene: "animals",
  Stage06AnimalsManScene: "joyful",
  Stage07SabbathScene: "sabbath",
  Stage08EdenRiversScene: "eden",
  Stage09EveCoopScene: "eden",
  Stage10SerpentScene: "serpent",
  Stage11HidingScene: "sorrowful",
  Stage12PromiseScene: "promise",

  // Moses the Exodus
  Stage01NileBasketScene: "nile",
  Stage02PrinceChoiceScene: "crafting",
  Stage03BurningBushScene: "sabbath",
  Stage04PharaohPlaguesScene: "serpent",
  Stage05GoshenLightScene: "creation",
  Stage06PassoverNightScene: "sorrowful",
  Stage07RedSeaCrossingScene: "exodus",
  Stage08MiriamMaraScene: "miriam",
  Stage09MannaQuailScene: "wilderness",
  Stage10RephidimHandsScene: "exodus",
  Stage11SinaiCommandmentsScene: "sinai",
  Stage12GoldenCalfMercyScene: "sorrowful",
  Stage13TabernacleGloryScene: "tabernacle",
};

/** Scene key -> track id. undefined = keep whatever is playing (transitions, loading). */
export function trackForScene(key: string): string | undefined {
  if (SCENE_TRACKS[key]) return SCENE_TRACKS[key];
  if (key === "TitleScene" || key === "PrologueScene" || key === "EpilogueScene") return "lullaby";
  if (key.startsWith("Joyful") || key === "InterludeB1ThreeKingsScene" || key === "InterludeA1WorkshopScene") return "joyful";
  if (key.startsWith("Luminous") || key === "InterludeB2MiraculousCatchScene" || key === "InterludeB3CalmingStormScene") return "luminous";
  if (key.startsWith("Sorrowful") || key === "InterludeA2KidronValleyScene" || key === "InterludeB4CarryCrossScene") return "sorrowful";
  if (
    key.startsWith("Glorious") ||
    key === "InterludeA3DawnRollStoneScene" ||
    key === "InterludeB5EmmausRoadScene" ||
    key === "InterludeB6BeautifulGateScene"
  )
    return "glorious";
  return undefined;
}

export type Ambient = "birds" | "crickets" | "wind" | "crowd" | "fire";

const AMBIENT: Record<string, Ambient[]> = {
  // Rosary Adventures
  Joyful02VisitationScene: ["birds"],
  Joyful03NativityScene: ["crickets"],
  InterludeB1ThreeKingsScene: ["crickets", "wind"],
  Joyful05FindingScene: ["crowd"],
  InterludeA1WorkshopScene: ["birds"],
  Luminous01BaptismScene: ["birds", "wind"],
  InterludeB2MiraculousCatchScene: ["birds", "wind"],
  Luminous02CanaScene: ["crowd"],
  Luminous03BeatitudesScene: ["birds", "wind"],
  InterludeB3CalmingStormScene: ["wind"],
  Luminous04TransfigurationScene: ["wind"],
  InterludeA2KidronValleyScene: ["crickets", "wind"],
  Sorrowful01GardenScene: ["crickets"],
  Sorrowful02PraetoriumScene: ["crowd"],
  Sorrowful03ThornsScene: ["crowd"],
  InterludeB4CarryCrossScene: ["wind"],
  Sorrowful04CrossScene: ["crowd"],
  Sorrowful05CalvaryScene: ["wind"],
  InterludeA3DawnRollStoneScene: ["birds", "wind"],
  Glorious01ResurrectionScene: ["birds"],
  InterludeB5EmmausRoadScene: ["birds", "wind"],
  Glorious02AscensionScene: ["wind"],
  Glorious03PentecostScene: ["fire"],
  InterludeB6BeautifulGateScene: ["crowd", "birds"],
  Glorious04AssumptionScene: ["birds"],
  PrologueScene: ["crickets"],
  EpilogueScene: ["crickets"],

  // Noah's Ark
  Stage01RighteousScene: ["wind", "crickets"],
  Stage02BlueprintScene: ["wind"],
  Stage03AnimalPairsScene: ["crowd", "birds"],
  Stage04FloodScene: ["wind"],
  Stage05ArkVoyageScene: ["wind"],
  Stage06AraratWindScene: ["wind"],
  Stage07OliveDoveScene: ["birds", "wind"],
  Stage08RainbowCovenantScene: ["birds", "wind"],

  // The Garden of Eden
  Stage01LightScene: [],
  Stage02SkyScene: ["wind"],
  Stage03LandScene: ["birds", "wind"],
  Stage04StarsScene: ["crickets"],
  Stage05SeaBirdsScene: ["birds", "wind"],
  Stage06AnimalsManScene: ["birds"],
  Stage07SabbathScene: ["birds"],
  Stage08EdenRiversScene: ["birds", "wind"],
  Stage09EveCoopScene: ["birds"],
  Stage10SerpentScene: ["crickets", "wind"],
  Stage11HidingScene: ["wind", "crickets"],
  Stage12PromiseScene: ["fire", "wind"],

  // Moses the Exodus
  Stage01NileBasketScene: ["wind", "birds"],
  Stage02PrinceChoiceScene: ["wind"],
  Stage03BurningBushScene: ["fire", "wind"],
  Stage04PharaohPlaguesScene: ["wind", "crowd"],
  Stage05GoshenLightScene: ["wind"],
  Stage06PassoverNightScene: ["crickets"],
  Stage07RedSeaCrossingScene: ["wind"],
  Stage08MiriamMaraScene: ["crowd", "birds"],
  Stage09MannaQuailScene: ["birds", "wind"],
  Stage10RephidimHandsScene: ["wind"],
  Stage11SinaiCommandmentsScene: ["wind"],
  Stage12GoldenCalfMercyScene: ["fire", "wind"],
  Stage13TabernacleGloryScene: ["crowd", "wind"],
};

/** Scene key -> ambient layers. [] = silence; undefined = keep (transitions, loading). */
export function ambientForScene(key: string): Ambient[] | undefined {
  if (AMBIENT[key]) return AMBIENT[key];
  return trackForScene(key) !== undefined ? [] : undefined;
}

export type Surface = "grass" | "stone" | "wood" | "sand";

const SURFACE: Record<string, Surface> = {
  // Rosary Adventures
  Joyful02VisitationScene: "grass",
  Joyful03NativityScene: "sand", // straw and dirt
  InterludeB1ThreeKingsScene: "sand",
  InterludeA1WorkshopScene: "wood",
  Luminous01BaptismScene: "grass",
  InterludeB2MiraculousCatchScene: "wood",
  Luminous03BeatitudesScene: "grass",
  InterludeB3CalmingStormScene: "sand",
  Luminous05EucharistScene: "wood",
  InterludeA2KidronValleyScene: "grass",
  Sorrowful01GardenScene: ["grass"][0] as Surface,
  InterludeB4CarryCrossScene: "stone",
  Sorrowful04CrossScene: "sand",
  Sorrowful05CalvaryScene: "sand",
  InterludeA3DawnRollStoneScene: "grass",
  Glorious01ResurrectionScene: "grass",
  InterludeB5EmmausRoadScene: "grass",
  Glorious02AscensionScene: "grass",
  Glorious03PentecostScene: "wood",
  InterludeB6BeautifulGateScene: "stone",
  Glorious04AssumptionScene: "grass",
  Glorious05CoronationScene: "grass",
  PrologueScene: "wood",
  EpilogueScene: "wood",

  // Noah's Ark
  Stage01RighteousScene: "sand",
  Stage02BlueprintScene: "wood",
  Stage03AnimalPairsScene: "wood",
  Stage04FloodScene: "wood",
  Stage05ArkVoyageScene: "wood",
  Stage06AraratWindScene: "stone",
  Stage07OliveDoveScene: "grass",
  Stage08RainbowCovenantScene: "stone",

  // The Garden of Eden
  Stage01LightScene: "stone",
  Stage02SkyScene: "grass",
  Stage03LandScene: "grass",
  Stage04StarsScene: "grass",
  Stage05SeaBirdsScene: "grass",
  Stage06AnimalsManScene: "grass",
  Stage07SabbathScene: "grass",
  Stage08EdenRiversScene: "grass",
  Stage09EveCoopScene: "grass",
  Stage10SerpentScene: "grass",
  Stage11HidingScene: "grass",
  Stage12PromiseScene: "sand",

  // Moses the Exodus
  Stage01NileBasketScene: "grass",
  Stage02PrinceChoiceScene: "sand",
  Stage03BurningBushScene: "sand",
  Stage04PharaohPlaguesScene: "stone",
  Stage05GoshenLightScene: "sand",
  Stage06PassoverNightScene: "wood",
  Stage07RedSeaCrossingScene: "sand",
  Stage08MiriamMaraScene: "sand",
  Stage09MannaQuailScene: "sand",
  Stage10RephidimHandsScene: "stone",
  Stage11SinaiCommandmentsScene: "stone",
  Stage12GoldenCalfMercyScene: "sand",
  Stage13TabernacleGloryScene: "stone",
};

/** Floor sound for a scene; stone unless listed. */
export const surfaceForScene = (key: string): Surface => SURFACE[key] ?? "stone";
