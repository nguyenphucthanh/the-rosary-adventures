export interface CharacterCustomization {
  name: string;
  gender: "boy" | "girl";
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfitColor: string;
  accessory?: string;
  spriteKey: string;
}

export const DEFAULT_CHARACTER: CharacterCustomization = {
  name: "Lữ Khách",
  gender: "boy",
  skinTone: "#f5d0a9",
  hairStyle: "short",
  hairColor: "#3d2314",
  outfitColor: "#2b5c8f",
  accessory: "rosary_beads",
  spriteKey: "player_boy_default",
};
