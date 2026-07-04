// src/theme/colors.ts

export const vieloraColors = {
  background: "#2D2C42",

  ink: "#181825",
  parchment: "#FFF48C",
  roseRed: "#FF1D57",
  coral: "#FB8082",
  aqua: "#3FD7BC",

  violet: "#8E48D8",
  deepBlue: "#161687",
  skyBlue: "#19C3FB",
  royalBlue: "#2D38A5",
} as const;

export type VieloraColorName = keyof typeof vieloraColors;

export const codexCategoryColors = {
  creatures: vieloraColors.skyBlue,
  characters: vieloraColors.violet,
  locations: vieloraColors.aqua,
  items: vieloraColors.parchment,
  spells: vieloraColors.roseRed,
  races: vieloraColors.coral,
  lore: vieloraColors.royalBlue,
  dark: vieloraColors.ink,
} as const;

export const vieloraGradients = {
  blueVertical: `linear-gradient(360deg, ${vieloraColors.skyBlue} 0%, ${vieloraColors.royalBlue} 50%, rgba(0, 0, 0, 0) 80%)`,

  violetVertical: `linear-gradient(360deg, ${vieloraColors.violet} 0%, ${vieloraColors.deepBlue} 50%, rgba(0, 0, 0, 0) 80%)`,

  aquaVertical: `linear-gradient(360deg, ${vieloraColors.aqua} 0%, ${vieloraColors.royalBlue} 50%, rgba(0, 0, 0, 0) 80%)`,

  roseVertical: `linear-gradient(360deg, ${vieloraColors.roseRed} 0%, ${vieloraColors.royalBlue} 50%, rgba(0, 0, 0, 0) 80%)`,

  coralVertical: `linear-gradient(360deg, ${vieloraColors.coral} 0%, ${vieloraColors.royalBlue} 50%, rgba(0, 0, 0, 0) 80%)`,
} as const;