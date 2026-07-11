// src/theme/colors.ts

export const vieloraColors = {
  background: "#2D2C42",

  ink: "#181825",
  parchment: "#FFF48C",
  roseRed: "#FF1D57",
  coral: "#FB8082",
  aqua: "#3FD7BC",
  blue: "#3547D8",

  violet: "#8E48D8",
  deepBlue: "#161687",
  skyBlue: "#19C3FB",
  royalBlue: "#2D38A5",
} as const;

export const VieloraColorstreeBranches: Record<string, string> = {
  "path-blue": vieloraColors.blue,
  "path-violet": vieloraColors.violet,
  "path-aqua": vieloraColors.aqua,
  "path-rose": vieloraColors.roseRed,
  "path-coral": vieloraColors.coral,
  "path-yellow": vieloraColors.parchment,
};

export const vieloraGradients = {
  blueVertical: `linear-gradient(360deg, ${vieloraColors.skyBlue} 0%, ${vieloraColors.royalBlue} 50%, rgba(0, 0, 0, 0) 80%)`,

  violetVertical: `linear-gradient(360deg, ${vieloraColors.violet} 0%, ${vieloraColors.deepBlue} 50%, rgba(0, 0, 0, 0) 80%)`,

  aquaVertical: `linear-gradient(360deg, ${vieloraColors.aqua} 0%, ${vieloraColors.royalBlue} 50%, rgba(0, 0, 0, 0) 80%)`,

  roseVertical: `linear-gradient(360deg, ${vieloraColors.roseRed} 0%, ${vieloraColors.royalBlue} 50%, rgba(0, 0, 0, 0) 80%)`,

  coralVertical: `linear-gradient(360deg, ${vieloraColors.coral} 0%, ${vieloraColors.royalBlue} 50%, rgba(0, 0, 0, 0) 80%)`,
} as const;

export const vieloraHoverGradients: Record<keyof typeof vieloraGradients, string> = {
  blueVertical:
    "linear-gradient(360deg, #31D6FF 0%, #3547D8 62%, rgba(0, 0, 0, 0) 95%)",

  violetVertical:
    "linear-gradient(360deg, #A65CFF 0%, #2525B8 62%, rgba(0, 0, 0, 0) 95%)",

  aquaVertical:
    "linear-gradient(360deg, #58F5DA 0%, #3547D8 62%, rgba(0, 0, 0, 0) 95%)",

  roseVertical:
    "linear-gradient(360deg, #FF3B72 0%, #3547D8 62%, rgba(0, 0, 0, 0) 95%)",

  coralVertical:
    "linear-gradient(360deg, #FF999B 0%, #3547D8 62%, rgba(0, 0, 0, 0) 95%)",
};

export const vieloraHorizontalGradients = {
  skyBlueHorizontal: `linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, ${vieloraColors.royalBlue} 35%, ${vieloraColors.skyBlue} 100%)`,

  royalBlueHorizontal: `linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, ${vieloraColors.deepBlue} 35%, ${vieloraColors.royalBlue} 100%)`,

  violetHorizontal: `linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, ${vieloraColors.deepBlue} 35%, ${vieloraColors.violet} 100%)`,

  aquaHorizontal: `linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, ${vieloraColors.royalBlue} 35%, ${vieloraColors.aqua} 100%)`,

  parchmentHorizontal: `linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, ${vieloraColors.coral} 30%, ${vieloraColors.parchment} 100%)`,

  coralHorizontal: `linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, ${vieloraColors.royalBlue} 35%, ${vieloraColors.coral} 100%)`,

  roseHorizontal: `linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, ${vieloraColors.royalBlue} 35%, ${vieloraColors.roseRed} 100%)`,
} as const;

export const vieloraHorizontalHoverGradients: Record<
  keyof typeof vieloraHorizontalGradients,
  string
> = {
  skyBlueHorizontal:
    "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #3547D8 35%, #31D6FF 100%)",

  royalBlueHorizontal:
    "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #2525B8 35%, #3547D8 100%)",

  violetHorizontal:
    "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #2525B8 35%, #A65CFF 100%)",

  aquaHorizontal:
    "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #3547D8 35%, #58F5DA 100%)",

  parchmentHorizontal:
    "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #FF999B 30%, #FFF9A8 100%)",

  coralHorizontal:
    "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #3547D8 35%, #FF999B 100%)",

  roseHorizontal:
    "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #3547D8 35%, #FF3B72 100%)",
};

export type VieloraHorizontalGradient =
  keyof typeof vieloraHorizontalGradients;