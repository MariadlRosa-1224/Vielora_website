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
  "Minerals",
];


export const rarities = [
  "All",
  "Common",
  "Uncommon",
  "Rare",
  "Special",
  "Legendary",
  "Mythical",
  "Varying",
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
  "Varying",
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

export const magicStats = [
  "All",
  "Strength",
  "Speed",
  "Durability",
  "Magic",
  "Intellect",
  "Senses",
  "Multiple"
];

export const techniqueSchools = [
  "All",
  "Offensive",
  "Blitz",
  "Stallwart",
  "Attrition",
  "Willpower"
];

// Minerals

export const mineralTypes = [
  "All",
  "Metal",
  "Gemstone",
  "Crystal",
  "Ore",
  "Stone",
  "Other"
];