// src/lib/new-entry-format.ts

import { vieloraGradients } from "@/theme/colors";
import { rarities, ranks, locations, dangerLevels, tameabilities, spellSchools, magicStats, techniqueSchools, mineralTypes } from "./codex-options";
import { racesOriginsList } from "./race-origins";


const raceImageFolder = ({
  slug,
}: {
  slug: string;
  fields: Record<string, EntryFieldValue>;
}) => `/images/races/${slug}`;

export type NewEntryType =
  | "codex.creature"
  | "codex.spell"
  | "codex.technique"
  | "codex.flora"
  | "codex.mineral"
  | "codex.potion"
  | "codex.item"
  | "codex.rune"
  | "race"
  | "lore.character"
  | "lore.timeline"
  | "lore.extra"
  | "lore.legend"
  | "world-information"
  | "location.entry";

export type EntryFieldKind =
  | "text"
  | "textarea"
  | "select"
  | "number"
  | "boolean"
  | "list"
  | "stats"
  | "yaml";

export type EntryFieldValue =
  | string
  | number
  | boolean
  | string[]
  | Record<string, number>;

export type EntryFieldConfig = {
  name: string;
  label: string;
  kind: EntryFieldKind;
  required?: boolean;
  defaultValue?: EntryFieldValue;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  min?: number;
  max?: number;
};

// this function allows us to configure each entry type with its own settings, including the content folder, image folder, and any fixed fields that should be included in the entry record. It also allows us to specify which fields are required and what their default values should be.

export type EntryFormatConfig = {
  entryType: NewEntryType;
  label: string;
  group: string;

  contentFolder: string;

  imageFolder: (input: {
    slug: string;
    fields: Record<string, EntryFieldValue>;
  }) => string;

  requiresAuthor?: boolean;
  usesMainImage?: boolean;
  mainImageRequired?: boolean;
  usesMarkdown?: boolean;

  fixedFields?: Record<string, EntryFieldValue>;

    usesGalleryImages?: boolean;
  galleryFrontmatterField?: string;

  fields: EntryFieldConfig[];

  
};

const codexImageFolder = (category: string) => {
  return ({ slug }: { slug: string; fields: Record<string, EntryFieldValue> }) =>
    `/images/codex/${category}/${slug}`;
};

const loreImageFolder = (folder: string) => {
  return ({ slug }: { slug: string; fields: Record<string, EntryFieldValue> }) =>
    `/images/lore/${folder}/${slug}`;
};

const commonCodexSettings = {
  requiresAuthor: true,
  usesMainImage: true,
  mainImageRequired: true,
  usesMarkdown: true,
} satisfies Partial<EntryFormatConfig>;

const spellLikeFields: EntryFieldConfig[] = [
  {
    name: "stat",
    label: "Stat",
    kind: "select",
    required: true,
    defaultValue: "Magic",
    options: magicStats,
  },
  {
    name: "rank",
    label: "Rank",
    kind: "select",
    required: true,
    defaultValue: "E",
    options: ranks,
  },
  {
    name: "caliber",
    label: "Caliber",
    kind: "text",
    required: true,
    defaultValue: "Unknown",
  },
  {
    name: "costs",
    label: "Costs",
    kind: "list",
    defaultValue: ["None"],
    placeholder: "Separate each cost with a comma",
  },
  {
    name: "downsides",
    label: "Downsides",
    kind: "list",
    defaultValue: ["None"],
    placeholder: "Separate each downside with a comma",
  },
  {
    name: "cooldowns",
    label: "Cooldowns",
    kind: "list",
    defaultValue: ["None"],
    placeholder: "Separate each cooldown with a comma",
  },
  {
    name: "requirements",
    label: "Requirements",
    kind: "list",
    defaultValue: ["None"],
    placeholder: "Separate each requirement with a comma",
  },
];

export const newEntryFormats: EntryFormatConfig[] = [
  {
    entryType: "codex.creature",
    label: "Creature",
    group: "Codex",
    contentFolder: "content/codex/creatures",
    imageFolder: codexImageFolder("creatures"),
    fixedFields: {
      category: "creatures",
    },
    ...commonCodexSettings,
    fields: [
      {
        name: "location",
        label: "Location",
        kind: "select",
        required: true,
        defaultValue: "Anywhere",
        options: locations,
      },
      {
        name: "rarity",
        label: "Rarity",
        kind: "select",
        required: true,
        defaultValue: "Special",
        options: rarities,
      },
      {
        name: "tameability",
        label: "Tameability",
        kind: "select",
        required: true,
        defaultValue: "Untameable",
        options: tameabilities,
      },
      {
        name: "rank",
        label: "Rank",
        kind: "select",
        required: true,
        defaultValue: "E",
        options: ranks,
      },
      {
        name: "dangerLevel",
        label: "Danger Level",
        kind: "select",
        required: true,
        defaultValue: "All",
        options: dangerLevels,
      },
      {
        name: "aspects",
        label: "Aspects",
        kind: "list",
        defaultValue: ["None"],
      },
      {
        name: "loot",
        label: "Loot",
        kind: "list",
        defaultValue: ["None"],
      },
      {
        name: "abilities",
        label: "Abilities",
        kind: "list",
        defaultValue: ["None"],
      },
      {
        name: "stats",
        label: "Stats",
        kind: "stats",
        defaultValue: {
          strength: 1,
          speed: 1,
          durability: 1,
          magic: 1,
          intellect: 1,
          senses: 1,
        },
      },
    ],
  },

  {
    entryType: "codex.spell",
    label: "Spell",
    group: "Codex",
    contentFolder: "content/codex/spells",
    imageFolder: codexImageFolder("spells"),
    fixedFields: {
      category: "spells",
    },
    ...commonCodexSettings,
    fields: [{    name: "school",
    label: "School",
    kind: "select",
    required: true,
    defaultValue: "Unknown",
    options: spellSchools,},
    ...spellLikeFields,], 
  },

  {
    entryType: "codex.technique",
    label: "Technique",
    group: "Codex",
    contentFolder: "content/codex/techniques",
    imageFolder: codexImageFolder("techniques"),
    fixedFields: {
      category: "techniques",
    },
    ...commonCodexSettings,
    fields: [{    name: "school",
    label: "School",
    kind: "select",
    required: true,
    defaultValue: "Unknown",
    options: techniqueSchools,},
    ...spellLikeFields,], 
  },

  {
    entryType: "codex.flora",
    label: "Flora",
    group: "Codex",
    contentFolder: "content/codex/flora",
    imageFolder: codexImageFolder("flora"),
    fixedFields: {
      category: "flora",
    },
    ...commonCodexSettings,
    fields: [
      {
        name: "origin",
        label: "Origin",
        kind: "text",
        required: true,
        defaultValue: "Unknown",
      },
      {
        name: "location",
        label: "Location",
        kind: "select",
        required: true,
        defaultValue: "Unknown",
        options: locations,
      },
      {
        name: "rarity",
        label: "Rarity",
        kind: "select",
        required: true,
        defaultValue: "Common",
        options: rarities,
      },
      {
        name: "cost",
        label: "Cost",
        kind: "list",
        defaultValue: ["None"],
      },
      {
        name: "Consumption",
        label: "Consumption",
        kind: "list",
        defaultValue: ["None"],
        helpText:
          "This field is capitalized because the current schema expects Consumption.",
      },
      {
        name: "properties",
        label: "Properties",
        kind: "list",
        defaultValue: ["None"],
      },
    ],
  },

  {
    entryType: "codex.mineral",
    label: "Mineral",
    group: "Codex",
    contentFolder: "content/codex/minerals",
    imageFolder: codexImageFolder("minerals"),
    fixedFields: {
      category: "minerals",
    },
    ...commonCodexSettings,
    fields: [
      {
        name: "location",
        label: "Location",
        kind: "select",
        required: true,
        defaultValue: "Unknown",
        options: locations,
      },
      {
        name: "rarity",
        label: "Rarity",
        kind: "select",
        required: true,
        defaultValue: "Common",
        options: rarities,
      },
      {
        name: "mineralType",
        label: "Mineral Type",
        kind: "select",
        required: true,
        defaultValue: "Unknown",
        options: mineralTypes,
      },
      {
        name: "density",
        label: "Density",
        kind: "text",
        required: true,
        defaultValue: "Unknown",
      },
      {
        name: "hardness",
        label: "Hardness",
        kind: "text",
        required: true,
        defaultValue: "Unknown",
      },
      {
        name: "solubility",
        label: "Solubility",
        kind: "text",
        required: true,
        defaultValue: "Unknown",
      },
      {
        name: "reactivity",
        label: "Reactivity",
        kind: "text",
        required: true,
        defaultValue: "Unknown",
      },
      {
        name: "magicalReactivity",
        label: "Magical Reactivity",
        kind: "text",
        required: true,
        defaultValue: "Unknown",
      },
      {
        name: "meltingPoint",
        label: "Melting Point",
        kind: "text",
        required: true,
        defaultValue: "Unknown",
      },
      {
        name: "cost",
        label: "Cost",
        kind: "list",
        defaultValue: ["None"],
      },
      {
        name: "properties",
        label: "Properties",
        kind: "list",
        defaultValue: ["None"],
      },
    ],
  },

  {
    entryType: "codex.potion",
    label: "Potion",
    group: "Codex",
    contentFolder: "content/codex/potions",
    imageFolder: codexImageFolder("potions"),
    fixedFields: {
      category: "potions",
    },
    ...commonCodexSettings,
    fields: [
      {
        name: "availability",
        label: "Availability",
        kind: "text",
        required: true,
        defaultValue: "Unknown",
      },
      {
        name: "rarity",
        label: "Rarity",
        kind: "select",
        required: true,
        defaultValue: "Common",
        options: rarities,
      },
      {
        name: "craftability",
        label: "Craftability",
        kind: "list",
        defaultValue: ["None"],
      },
      {
        name: "cost",
        label: "Cost",
        kind: "list",
        defaultValue: ["None"],
      },
      {
        name: "downsides",
        label: "Downsides",
        kind: "list",
        defaultValue: ["None"],
      },
      {
        name: "cooldowns",
        label: "Cooldowns",
        kind: "list",
        defaultValue: ["None"],
      },
      {
        name: "requirements",
        label: "Requirements",
        kind: "list",
        defaultValue: ["None"],
      },
    ],
  },

  {
    entryType: "codex.item",
    label: "Item",
    group: "Codex",
    contentFolder: "content/codex/items",
    imageFolder: codexImageFolder("items"),
    fixedFields: {
      category: "items",
    },
    ...commonCodexSettings,
    fields: [
      {
        name: "rarity",
        label: "Rarity",
        kind: "select",
        required: true,
        defaultValue: "Common",
        options: rarities,
      },
      {
        name: "location",
        label: "Location",
        kind: "select",
        required: true,
        defaultValue: "Unknown",
        options: locations,
      },
      {
        name: "availability",
        label: "Availability",
        kind: "text",
        required: true,
        defaultValue: "Unknown",
      },
      {
        name: "Cost",
        label: "Cost",
        kind: "list",
        defaultValue: ["None"],
        
      },
      {
        name: "craftability",
        label: "Craftability",
        kind: "list",
        defaultValue: ["None"],
      },
    ],
  },

  {
    entryType: "codex.rune",
    label: "Rune",
    group: "Codex",
    contentFolder: "content/codex/runes",
    imageFolder: codexImageFolder("runes"),
    fixedFields: {
      category: "runes",
      school: "Runic"
    },
    ...commonCodexSettings,
    fields: [
      ...spellLikeFields,
      {
        name: "duration",
        label: "Duration",
        kind: "text",
        required: true,
        defaultValue: "Unknown",
      },
      {
        name: "placement",
        label: "Placement",
        kind: "text",
        required: true,
        defaultValue: "Unknown",
      },
    ],
  },

  {
    entryType: "race",
  label: "Race",
  group: "Races",

  contentFolder: "content/races",
  imageFolder: raceImageFolder,

  usesMainImage: true,
  mainImageRequired: true,
  usesMarkdown: true,

  usesGalleryImages: true,
  galleryFrontmatterField: "galleryImages",

  fields: [
    {
      name: "origin",
      label: "Origin",
      kind: "text",
      required: true,
      defaultValue: "Unknown",
    },
    {
      name: "size",
      label: "Size",
      kind: "text",
      defaultValue: "Unknown",
    },
    {
      name: "lifespan",
      label: "Lifespan",
      kind: "text",
      defaultValue: "Unknown",
    },
    {
      name: "summary",
      label: "Summary",
      kind: "textarea",
      defaultValue: "",
    },
    {
      name: "description",
      label: "Description",
      kind: "textarea",
      required: true,
      defaultValue: "",
    },
    {
      name: "weaknesses",
      label: "Weaknesses YAML",
      kind: "yaml",
      defaultValue: `- id: weakness-id
  title: "Weakness title"
  description: >-
    Weakness description.`,
    },
    {
      name: "history",
      label: "History",
      kind: "textarea",
      defaultValue: "",
    },
    {
      name: "galleryImages",
      label: "Gallery Images YAML",
      kind: "yaml",
      defaultValue: "[]",
    },
    {
      name: "abilityTree",
      label: "Ability Tree YAML",
      kind: "yaml",
      required: true,
      defaultValue: `levels:
  - id: base
    label: "Base Racials"

abilities:
  - id: ability-id
    name: "Ability Name"
    level: base
    branch:
      - path-yellow
    order: 1
    requires: []
    requiresMode: all
    follows: []
    description: >-
      Ability description.`,
    },
  ],
},

  {
    entryType: "lore.character",
    label: "Character",
    group: "Lore",
    contentFolder: "content/lore/characters",
    imageFolder: loreImageFolder("characters"),
    usesMainImage: true,
    mainImageRequired: true,
    usesMarkdown: true,
      usesGalleryImages: true,
  galleryFrontmatterField: "galleryImages",
    fields: [
      {
        name: "name",
        label: "Name",
        kind: "text",
        required: true,
        defaultValue: "",
        helpText: "Usually this is the same as the title.",
      },
      {
        name: "age",
        label: "Age",
        kind: "text",
        required: true,
        defaultValue: "Unknown",
      },
      {
        name: "race",
        label: "Race",
        kind: "text",
        required: true,
        defaultValue: "Unknown",
      },
      {
        name: "gender",
        label: "Gender",
        kind: "text",
        required: true,
        defaultValue: "Unknown",
      },
      {
        name: "occupation",
        label: "Occupation",
        kind: "text",
        required: true,
        defaultValue: "Unknown",
      },
      {
        name: "affiliations",
        label: "Affiliations",
        kind: "list",
        defaultValue: [],
      },
      {
        name: "description",
        label: "Description",
        kind: "textarea",
        required: true,
        defaultValue: "",
      },
      {
        name: "galleryImages",
        label: "Gallery Images YAML",
        kind: "yaml",
        defaultValue: "[]",
      },
      {
        name: "frame",
        label: "Frame",
        kind: "text",
        defaultValue: "/images/characters/frame.png",
      },
      {
        name: "locked",
        label: "Locked",
        kind: "boolean",
        defaultValue: false,
      },
    ],
  },

  {
    entryType: "lore.timeline",
    label: "Timeline Entry",
    group: "Lore",
    contentFolder: "content/lore/timeline",
    imageFolder: loreImageFolder("timeline"),
    usesMainImage: true,
    mainImageRequired: true,
    usesMarkdown: true,
    fixedFields: {
      kind: "timeline",
    },
    fields: [
      {
        name: "section",
        label: "Section",
        kind: "text",
        defaultValue: "Entries",
      },
      {
        name: "summary",
        label: "Summary",
        kind: "textarea",
        required: true,
        defaultValue: "",
      },
      {
        name: "variant",
        label: "Card Variant",
        kind: "select",
        defaultValue: "purple",
        options: ["cyan", "purple", "red", "blue", "coral", "aqua"],
      },
      {
        name: "order",
        label: "Order",
        kind: "number",
        defaultValue: 999,
      },
    ],
  },

  {
    entryType: "lore.extra",
    label: "Extra Lore Entry",
    group: "Lore",
    contentFolder: "content/lore/extras",
    imageFolder: loreImageFolder("extras"),
    usesMainImage: true,
    mainImageRequired: true,
    usesMarkdown: true,
    fixedFields: {
      kind: "extras",
    },
    fields: [
      {
        name: "section",
        label: "Section",
        kind: "text",
        defaultValue: "Entries",
      },
      {
        name: "summary",
        label: "Summary",
        kind: "textarea",
        required: true,
        defaultValue: "",
      },
      {
        name: "variant",
        label: "Card Variant",
        kind: "select",
        defaultValue: "purple",
        options: ["cyan", "purple", "red", "blue", "coral", "aqua"],
      },
      {
        name: "order",
        label: "Order",
        kind: "number",
        defaultValue: 999,
      },
    ],
  },

  {
    entryType: "lore.legend",
    label: "Legend / Folklore Entry",
    group: "Lore",
    contentFolder: "content/lore/legends-and-folklore",
    imageFolder: loreImageFolder("legends-and-folklore"),
    usesMainImage: true,
    mainImageRequired: true,
    usesMarkdown: true,
    fixedFields: {
      kind: "legends-and-folklore",
    },
    fields: [
      {
        name: "section",
        label: "Section",
        kind: "text",
        defaultValue: "Entries",
      },
      {
        name: "summary",
        label: "Summary",
        kind: "textarea",
        required: true,
        defaultValue: "",
      },
      {
        name: "variant",
        label: "Card Variant",
        kind: "select",
        defaultValue: "purple",
        options: ["cyan", "purple", "red", "blue", "coral", "aqua"],
      },
      {
        name: "order",
        label: "Order",
        kind: "number",
        defaultValue: 999,
      },
    ],
  },

  {
    entryType: "world-information",
    label: "World Information",
    group: "World",
    contentFolder: "content/world-information",
    imageFolder: ({ slug }) => `/images/world-information/${slug}`,
    usesMainImage: true,
    mainImageRequired: true,
    usesMarkdown: true,
    fields: [
      {
        name: "section",
        label: "Section",
        kind: "text",
        defaultValue: "General",
      },
      {
        name: "summary",
        label: "Summary",
        kind: "textarea",
        defaultValue: "",
      },
      {
        name: "gradient",
        label: "Button Gradient",
        kind: "select",
        defaultValue: "blueVertical",
        options: Object.keys(vieloraGradients),
      },
      {
        name: "order",
        label: "Order",
        kind: "number",
        defaultValue: 999,
      },
      {
        name: "href",
        label: "pageHref",
        kind: "text",
        defaultValue: "",
        helpText:
          "Optional. If empty, the entry will use /world-information/[slug].",
      },
    ],
  },

  {
    entryType: "location.entry",
    label: "Location Entry",
    group: "Locations",
    contentFolder: "content/locations/[location]",
    imageFolder: ({ slug, fields }) => {
      const location = String(fields.location ?? "unknown-location");
      return `/images/locations/${location}/${slug}`;
    },
    usesMainImage: true,
    mainImageRequired: false,
    usesMarkdown: true,
    fields: [
      {
        name: "location",
        label: "Parent Location",
        kind: "text",
        required: true,
        defaultValue: "the-ruins",
        helpText:
          "This must match the folder in content/locations/[location].",
      },
      {
        name: "summary",
        label: "Summary",
        kind: "textarea",
        defaultValue: "",
      },
      {
        name: "order",
        label: "Order",
        kind: "number",
        defaultValue: 999,
      },
    ],
  },
];

export function getEntryFormat(entryType: NewEntryType) {
  const format = newEntryFormats.find((item) => item.entryType === entryType);

  if (!format) {
    throw new Error(`Unknown entry type: ${entryType}`);
  }

  return format;
}

export function getInitialFieldValues(format: EntryFormatConfig) {
  const values: Record<string, EntryFieldValue> = {};

  for (const field of format.fields) {
    if (field.defaultValue !== undefined) {
      values[field.name] = field.defaultValue;
      continue;
    }

    if (field.kind === "number") {
      values[field.name] = 0;
    } else if (field.kind === "boolean") {
      values[field.name] = false;
    } else if (field.kind === "list") {
      values[field.name] = [];
    } else if (field.kind === "stats") {
      values[field.name] = {
        strength: 1,
        speed: 1,
        durability: 1,
        magic: 1,
        intellect: 1,
        senses: 1,
      };
    } else {
      values[field.name] = "";
    }
  }

  return values;
}



export function getEntryImageFolder(input: {
  entryType: NewEntryType;
  slug: string;
  fields: Record<string, EntryFieldValue>;
}) {
  const format = getEntryFormat(input.entryType);

  return format.imageFolder({
    slug: input.slug,
    fields: input.fields,
  });
}

export function getEntryContentFolder(input: {
  entryType: NewEntryType;
  fields: Record<string, EntryFieldValue>;
}) {
  const format = getEntryFormat(input.entryType);

  if (input.entryType === "location.entry") {
    const location = String(input.fields.location ?? "unknown-location");
    return `content/locations/${location}`;
  }

  return format.contentFolder;
}

export function getEntryFixedFields(entryType: NewEntryType) {
  return getEntryFormat(entryType).fixedFields ?? {};
}

