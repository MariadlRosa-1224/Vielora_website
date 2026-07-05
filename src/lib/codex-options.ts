// Generals

export const categories = [
  "All",
  "Creatures",
  "Flora",
  "Spells",
  "Techniques",
  "Runes",
  "Items",
  "Potions",
];


export const rarities = [
  "All",
  "Common",
  "Uncommon",
  "Rare",
  "Special",
  "Legendary",
  "Mythical",
];

export const locations = [
  "Anywhere",
  "Plains",
  "Caves",
  "Desert",
  "Forest",
  "Mountains",
  "Ocean",
  "Ruins",
  "Sky",
];
export const ranks = ["All", "D", "C", "B", "A", "S"];

//Creatures

export const dangerLevels = [
  "All",
  ...Array.from({ length: 16 }, (_, index) => String(index)),
];


export const tameabilities = [
  "All",
  "Easy",
  "Medium",
  "Hard",
  "Untameable",
];

// Spells

export const spellSchools = [
  "All",
  "Elemental",
  "Mana",
  "Augmentation",
  "Mental",
  "Phonic",
  "Restoration",
  "Summoning",
  "Runic",
  "Mixed",
  "Relayed",
  "Necromancy",
  "Unique"
];


// Techniques

export const techniqueStats = [
  "All",
  "Strength",
  "Speed",
  "Durability",
  "Magic",
  "Intellect",
  "Senses",
];

export const techniqueSchools = [
  "Offensive",
  "Blitz",
  "Stallwart",
  "Attrition",
  "Willpower"
];