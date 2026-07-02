"use client";

import {
  ranks,
  locations,
  dangerLevels,
  rarities,
  tameabilities,
} from "@/lib/codex-options";
import { useRef, useState } from "react";
import GeneralContentContainer from "@/components/GeneralContentContainer";

type EntryType = "codex" | "character";

type PendingImage = {
  file: File;
  publicPath: string;
};



export default function NewEntryForm() {
  const markdownRef = useRef<HTMLTextAreaElement | null>(null);

  const [entryType, setEntryType] = useState<EntryType>("codex");
  const [name, setName] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [markdownImages, setMarkdownImages] = useState<PendingImage[]>([]);

  const [tameability, setTameability] = useState("Untameable");
  const [rank, setRank] = useState("E");
  const [dangerLevel, setDangerLevel] = useState("All");
  const [rarity, setRarity] = useState("Special");
  const [location, setLocation] = useState("Anywhere");
  const [aspects, setAspects] = useState("");
  const [abilities, setAbilities] = useState("");
  const [loot, setLoot] = useState("");
  const [markdown, setMarkdown] = useState("");

  const [stats, setStats] = useState({
    strength: 1,
    speed: 1,
    durability: 1,
    magic: 1,
    intellect: 1,
    senses: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const slug = slugify(name || "new-entry");

const baseImageFolder =
  entryType === "codex"
    ? `/images/codex/creatures/${slug}`
    : `/images/lore/characters/${slug}`;

  const mainImagePath = mainImage
    ? `${baseImageFolder}/${sanitizeFileName(mainImage.name)}`
    : "";

  const handleMarkdownDrop = (event: React.DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();

    const imageFiles = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) return;

    const newPendingImages = imageFiles.map((file) => ({
      file,
      publicPath: `${baseImageFolder}/${sanitizeFileName(file.name)}`,
    }));

    setMarkdownImages((current) => [...current, ...newPendingImages]);

    const insertedMarkdown = newPendingImages
      .map((image) => {
        const alt = fileNameWithoutExtension(image.file.name);
        return `\n\n![${alt}](${image.publicPath})\n\n`;
      })
      .join("");

    insertTextInMarkdown(insertedMarkdown);
  };

  const insertTextInMarkdown = (text: string) => {
    const textarea = markdownRef.current;

    if (!textarea) {
      setMarkdown((current) => `${current}${text}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    setMarkdown((current) => {
      const before = current.slice(0, start);
      const after = current.slice(end);
      return `${before}${text}${after}`;
    });
  };

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  if (isSubmitting) return;

  if (!name.trim()) {
    alert("Entry name is required.");
    return;
  }

  if (!mainImage) {
    alert("Main image is required.");
    return;
  }

  const apiUrl = process.env.NEXT_PUBLIC_EDITOR_API_URL;

  if (!apiUrl) {
    alert("Missing NEXT_PUBLIC_EDITOR_API_URL.");
    return;
  }

  setIsSubmitting(true);
  setSubmitMessage(null);

  try {
    const mainImageBase64 = await fileToBase64(mainImage);

    const markdownImagesPayload = await Promise.all(
      markdownImages.map(async (image) => ({
        fileName: image.file.name,
        base64: await fileToBase64(image.file),
      })),
    );

    const payload =
      entryType === "codex"
        ? {
            entryType: "codex.creature",
            title: name,
            slug,
            mainImage: {
              fileName: mainImage.name,
              base64: mainImageBase64,
            },
            markdownImages: markdownImagesPayload,
            fields: {
              location,
              rarity,
              tameability,
              rank,
              dangerLevel,
              aspects: splitCommaList(aspects),
              abilities: splitCommaList(abilities),
              loot: splitCommaList(loot),
              stats,
            },
            markdown,
          }
        : {
            entryType: "lore.character",
            title: name,
            slug,
            mainImage: {
              fileName: mainImage.name,
              base64: mainImageBase64,
            },
            markdownImages: markdownImagesPayload,
            markdown,
          };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(result);
      setSubmitMessage(result.error ?? "Could not create entry.");
      alert(result.error ?? "Could not create entry.");
      return;
    }

    console.log(result);

    setSubmitMessage("Entry created successfully.");
    alert("Entry created successfully.");
  } catch (error) {
    console.error(error);
    setSubmitMessage("Unexpected error while creating entry.");
    alert("Unexpected error while creating entry.");
  } finally {
    setIsSubmitting(false);
  }
};




  const isCodex = entryType === "codex";

  const isCharacter = entryType === "character";

  

  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-6 py-24 text-white">
      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl space-y-6">
        <GeneralContentContainer>
          <h1 className="mb-8 font-serif text-3xl font-bold uppercase tracking-wider">
            New Entry
          </h1>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-5">
              <TextField label="Name" value={name} onChange={setName} />

              <SelectField
                label="Type of entry"
                value={entryType}
                onChange={(value) => setEntryType(value as EntryType)}
                options={[
                  { label: "Codex", value: "codex" },
                  { label: "Character", value: "character" },
                ]}
              />

              {isCodex && (
                <>


                  <SelectField
                    label="Category"
                    value="Creatures"
                    onChange={() => {}}
                    options={[{ label: "Creatures", value: "Creatures" }]}
                  />

                  <SelectField
                    label="Location"
                    value={location}
                    onChange={setLocation}
                    options={locations.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />

                  <SelectField
                    label="Rarity"
                    value={rarity}
                    onChange={setRarity}
                    options={rarities.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />

                  <SelectField
                    label="Tameability"
                    value={tameability}
                    onChange={setTameability}
                    options={tameabilities.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />

                  <SelectField
                    label="Rank"
                    value={rank}
                    onChange={setRank}
                    options={ranks.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />

                  <SelectField
                    label="Danger Level"
                    value={dangerLevel}
                    onChange={setDangerLevel}
                    options={dangerLevels.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />
                </>
              )}

              <ImageUploadField
                label="Image"
                file={mainImage}
                onChange={setMainImage}
              />

              {isCodex && (
                <div className="pt-4">
                  <h2 className="mb-4 border-b border-white/40 pb-2 font-serif text-xl font-bold uppercase tracking-wider">
                    Stats
                  </h2>

                  <div className="space-y-3">
                    {Object.entries(stats).map(([key, value]) => (
                      <NumberField
                        key={key}
                        label={capitalize(key)}
                        value={value}
                        onChange={(newValue) =>
                          setStats((current) => ({
                            ...current,
                            [key]: newValue,
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isCodex && (
              <div className="space-y-8">
                <TextareaField
                  label="Aspects"
                  placeholder="Separate each aspect with a comma"
                  value={aspects}
                  onChange={setAspects}
                />

                <TextareaField
                  label="Abilities"
                  placeholder="Separate each ability with a comma"
                  value={abilities}
                  onChange={setAbilities}
                />

                <TextareaField
                  label="Loot"
                  placeholder="Separate each loot item with a comma"
                  value={loot}
                  onChange={setLoot}
                />


              </div>
            )}
          </div>
        </GeneralContentContainer>

        <GeneralContentContainer>
          <h2 className="mb-6 font-serif text-2xl font-bold uppercase tracking-wider">
            Custom Markdown
          </h2>

          <textarea
            ref={markdownRef}
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            onDrop={handleMarkdownDrop}
            onDragOver={(event) => event.preventDefault()}
            placeholder="Write the free Markdown section here. You can drag images into this box."
            className="min-h-[360px] w-full rounded-md border border-[#fff48e]/80 bg-[#111120]/60 p-4 text-sm text-white outline-none placeholder:text-white/50 focus:border-[#fff48e]"
          />

          {markdownImages.length > 0 && (
            <div className="mt-4 text-sm text-white/70">
              <p className="mb-2 font-bold text-white">Pending markdown images:</p>

              <ul className="list-disc space-y-1 pl-6">
                {markdownImages.map((image) => (
                  <li key={image.publicPath}>
                    {image.file.name} →{" "}
                    <span className="text-[#fff48e]">{image.publicPath}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex justify-center">
<button
  type="submit"
  disabled={isSubmitting}
  className="w-full max-w-md rounded-md border-2 border-[#fff48e] px-8 py-3 font-serif text-lg uppercase tracking-wider transition hover:bg-[#fff48e] hover:text-[#111120] disabled:cursor-not-allowed disabled:opacity-50"
>
  {isSubmitting ? "Submitting..." : "Submit"}
</button>

  {submitMessage && (
    <p className="mt-4 text-center text-sm text-[#fff48e]">
      {submitMessage}
    </p>
  )}
          </div>
        </GeneralContentContainer>
      </form>
    </main>
  );
}

function buildCreatureMdx(input: {
  name: string;
  slug: string;
  imagePath: string;
  location: string;
  rarity: string;
  tameability: string;
  rank: string;
  dangerLevel: string;
  aspects: string;
  abilities: string;
loot: string;
  stats: Record<string, number>;
  markdown: string;
}) {
  const aspects = splitCommaList(input.aspects);
  const abilities = splitCommaList(input.abilities);
  const loot = splitCommaList(input.loot);

  return `---
title: ${yamlString(input.name)}
slug: ${yamlString(input.slug)}
category: creatures
tags:
  - Creature
  - ${yamlString(input.location)}
  - ${yamlString(input.rarity)}
  - ${yamlString(input.tameability)}
image: ${yamlString(input.imagePath)}
imageAlt: ${yamlString(input.name)}
location: ${yamlString(input.location)}
rarity: ${yamlString(input.rarity)}
tameability: ${yamlString(input.tameability)}
rank: ${yamlString(input.rank)}
dangerLevel: ${yamlString(input.dangerLevel)}
aspects:
${yamlList(aspects)}
loot:
${yamlList(loot)}
stats:
  strength: ${input.stats.strength}
  speed: ${input.stats.speed}
  durability: ${input.stats.durability}
  magic: ${input.stats.magic}
  intellect: ${input.stats.intellect}
  senses: ${input.stats.senses}
abilities:
${yamlList(abilities)}
draft: false
---


${input.markdown.trim()}
`;
}

function buildCharacterMdx(input: {
  name: string;
  slug: string;
  imagePath: string;
  markdown: string;
}) {
  return `---
title: ${yamlString(input.name)}
slug: ${yamlString(input.slug)}
image: ${yamlString(input.imagePath)}
imageAlt: ${yamlString(input.name)}
draft: false
---


![${input.name}](${input.imagePath})

${input.markdown.trim()}
`;
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid items-center gap-3 md:grid-cols-[160px_1fr]">
      <span className="font-serif text-lg font-bold uppercase tracking-wider">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border border-white/40 bg-[#111120]/60 px-3 py-2 text-sm text-white outline-none focus:border-[#fff48e]"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid items-center gap-3 md:grid-cols-[160px_1fr]">
      <span className="font-serif text-sm font-bold uppercase tracking-wider">
        {label}
      </span>

      <input
        type="number"
        min={0}
        max={5}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="border-0 border-b border-white/50 bg-transparent px-2 py-1 text-sm text-white outline-none focus:border-[#fff48e]"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="grid items-center gap-3 md:grid-cols-[160px_1fr]">
      <span className="font-serif text-lg font-bold uppercase tracking-wider">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border border-white/40 bg-[#111120] px-3 py-2 text-sm text-white outline-none focus:border-[#fff48e]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextareaField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-3 block font-serif text-xl font-bold uppercase tracking-wider">
        {label}
      </span>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[180px] w-full rounded-md border border-[#fff48e]/80 bg-[#111120]/60 p-4 text-sm text-white outline-none placeholder:text-white/50 focus:border-[#fff48e]"
      />
    </label>
  );
}

function ImageUploadField({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <label className="grid items-center gap-3 md:grid-cols-[160px_1fr]">
      <span className="font-serif text-lg font-bold uppercase tracking-wider">
        {label}
      </span>

      <span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />

        <span className="inline-flex min-w-48 cursor-pointer justify-center rounded-md border border-[#fff48e] px-6 py-2 text-sm transition hover:bg-[#fff48e] hover:text-[#111120]">
          {file ? file.name : "Upload image"}
        </span>
      </span>
    </label>
  );
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

function fileNameWithoutExtension(value: string) {
  return value.replace(/\.[^/.]+$/, "");
}

function splitCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function yamlString(value: string) {
  return JSON.stringify(value);
}

function yamlList(values: string[]) {
  if (values.length === 0) {
    return "  - None";
  }

  return values.map((value) => `  - ${yamlString(value)}`).join("\n");
}

function publicPathToZipPath(publicPath: string) {
  return `public${publicPath}`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        reject(new Error("Could not read file."));
        return;
      }

      resolve(result);
    };

    reader.onerror = () => {
      reject(new Error("Could not read file."));
    };

    reader.readAsDataURL(file);
  });
}

