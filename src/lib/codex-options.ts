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

export const dangerLevels = [
  "All",
  ...Array.from({ length: 16 }, (_, index) => String(index)),
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

export const tameabilities = [
  "All",
  "Easy",
  "Medium",
  "Hard",
  "Untameable",
];

export const ranks = ["All", "D", "C", "B", "A", "S"];

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