// src/components/editor/NewEntryForm.tsx
"use client";


import { useEffect,  useMemo, useRef, useState } from "react";
import GeneralContentContainer from "@/components/containers/GeneralContentContainer";
import { useSearchParams } from "next/navigation";
import {
  newEntryFormats,
  getEntryFormat,
  getInitialFieldValues,
  getEntryImageFolder,
  getEntryContentFolder,
  getEntryFixedFields,
  type NewEntryType,
  type EntryFieldConfig,
  type EntryFieldValue,
} from "@/lib/new-entry-format";
import {
  deleteLocalEntryDraft,
  getLocalEntryDraftById,
  saveLocalEntryDraft,
} from "@/lib/local-entry-drafts";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";




type PendingImage = {
  file: File;
  publicPath: string;
};

const DEFAULT_ENTRY_TYPE: NewEntryType = "codex.creature";
const DEFAULT_FORMAT = getEntryFormat(DEFAULT_ENTRY_TYPE);

export default function NewEntryForm() {
  const markdownRef = useRef<HTMLTextAreaElement | null>(null);





const [entryType, setEntryType] =
  useState<NewEntryType>(DEFAULT_ENTRY_TYPE);

const selectedFormat = useMemo(() => {
  return getEntryFormat(entryType);
}, [entryType]);

const [title, setTitle] = useState("");
const [author, setAuthor] = useState("");
const [imageAlt, setImageAlt] = useState("");
const [mainImage, setMainImage] = useState<File | null>(null);
const [markdownImages, setMarkdownImages] = useState<PendingImage[]>([]);
const [markdown, setMarkdown] = useState("");
const [galleryImages, setGalleryImages] = useState<PendingImage[]>([]);

const [fields, setFields] = useState<Record<string, EntryFieldValue>>(() =>
  getInitialFieldValues(DEFAULT_FORMAT),
);


//draft state
const searchParams = useSearchParams();
const draftIdFromUrl = searchParams.get("draftId");

const [localDraftId, setLocalDraftId] = useState<string | null>(null);

// setup form state from local draft if draftId is present in URL
useEffect(() => {
  if (!draftIdFromUrl) return;

  const draft = getLocalEntryDraftById(draftIdFromUrl);

  if (!draft) {
    setSubmitMessage("Local draft not found.");
    return;
  }

  const draftFormat = getEntryFormat(draft.entryType);

  setEntryType(draft.entryType);
  setTitle(draft.title);
  setAuthor(draft.author ?? "");
  setImageAlt(draft.imageAlt ?? "");
  setFields({
    ...getInitialFieldValues(draftFormat),
    ...draft.fields,
  });
  setMarkdown(draft.markdown ?? "");
  setMainImage(null);
  setMarkdownImages([]);
  setLocalDraftId(draft.id);

  setSubmitMessage(
    "Local draft loaded. Remember to select the main image again before submitting.",
  );
}, [draftIdFromUrl]);

//save in local draft when form state changes

function handleSaveLocalDraft() {
  const trimmedTitle = title.trim();
  const safeTitle = trimmedTitle.length > 0 ? trimmedTitle : "Untitled Entry";

  const draft = saveLocalEntryDraft({
    id: localDraftId ?? crypto.randomUUID(),
    entryType,
    title: safeTitle,
    slug: slugify(safeTitle),
    author: selectedFormat.requiresAuthor ? author.trim() : undefined,
    imageAlt: imageAlt.trim(),
    fields,
    markdown,
  });

  setLocalDraftId(draft.id);
  setSubmitMessage("Local draft saved in this browser.");
}






// submit state

  const [isSubmitting, setIsSubmitting] = useState(false);
const [submitMessage, setSubmitMessage] = useState<string | null>(null);

const slug = slugify(title || "new-entry");

const baseImageFolder = useMemo(() => {
  return getEntryImageFolder({
    entryType,
    slug,
    fields,
  });
}, [entryType, slug, fields]);

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


  function handleGalleryImageFiles(files: FileList | null) {
  if (!files) return;

  const imageFiles = Array.from(files).filter((file) =>
    file.type.startsWith("image/"),
  );

  const newGalleryImages = imageFiles.map((file, index) => {
    const safeName = sanitizeFileName(file.name);
    const uniqueName = `${Date.now()}-${index}-${safeName}`;

    return {
      file,
      publicPath: `${baseImageFolder}/gallery/${uniqueName}`,
    };
  });

  setGalleryImages((current) => [...current, ...newGalleryImages]);
}

function handleRemoveGalleryImage(publicPath: string) {
  setGalleryImages((current) =>
    current.filter((image) => image.publicPath !== publicPath),
  );
}

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


  const handleEntryTypeChange = (value: string) => {
  const nextEntryType = value as NewEntryType;
  const nextFormat = getEntryFormat(nextEntryType);

  setEntryType(nextEntryType);
  setFields(getInitialFieldValues(nextFormat));

  setMainImage(null);
  setMarkdownImages([]);
  setGalleryImages([]);
  setMarkdown("");
  setImageAlt("");
  setSubmitMessage(null);
  setLocalDraftId(null);
  setSubmitMessage(null);
};


async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (selectedFormat.mainImageRequired && !mainImage) {
    setSubmitMessage("Main image is required for this entry type.");
    return;
  }

  setIsSubmitting(true);
  setSubmitMessage(null);

  try {
    const payload = {
      entryType,
      title: title.trim(),
      slug,
      author: selectedFormat.requiresAuthor ? author.trim() : undefined,
      imageAlt: imageAlt.trim() || title.trim(),
      contentFolder: getEntryContentFolder({
        entryType,
        fields,
      }),
      imageFolder: getEntryImageFolder({
        entryType,
        slug,
        fields,
      }),
      fixedFields: getEntryFixedFields(entryType),
      fields,
      markdown,
      mainImage: mainImage
        ? {
            fileName: sanitizeFileName(mainImage.name),
            base64: await fileToBase64(mainImage),
            mimeType: mainImage.type,
            publicPath: mainImagePath,
          }
        : null,
      markdownImages: await Promise.all(
        markdownImages.map(async (image) => ({
          fileName: sanitizeFileName(image.file.name),
          base64: await fileToBase64(image.file),
          mimeType: image.file.type,
          publicPath: image.publicPath,
        })),
      ),
      galleryImages: await Promise.all(
  galleryImages.map(async (image) => ({
    fileName: sanitizeFileName(image.file.name),
    base64: await fileToBase64(image.file),
    mimeType: image.file.type,
    publicPath: image.publicPath,
  })),
),
    };

    const response = await fetch("/api/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    let result: {
      error?: string;
      message?: string;
      entry?: unknown;
    } = {};

    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch {
      result = {
        error: responseText || "Response was not valid JSON.",
      };
    }

    if (!response.ok) {
      throw new Error(
        result.error ?? result.message ?? "Could not submit entry.",
      );
    }

    if (localDraftId) {
      deleteLocalEntryDraft(localDraftId);
      setLocalDraftId(null);
    }

    setSubmitMessage(
      result.message ?? "Entry submitted for approval.",
    );
  } catch (error) {
    setSubmitMessage(
      error instanceof Error
        ? error.message
        : "Could not submit entry.",
    );
  } finally {
    setIsSubmitting(false);
  }
}

// maneja archivos importados de markdown
async function handleImportMarkdownFile(file: File | null) {
  if (!file) return;

  const isMarkdownFile =
    file.name.endsWith(".md") || file.name.endsWith(".mdx");

  if (!isMarkdownFile) {
    setSubmitMessage("Please upload a .md or .mdx file.");
    return;
  }

  try {
    const text = await file.text();
    const importedEntry = parseMarkdownEntryFile(text);

    const nextEntryType = inferEntryTypeFromFrontmatter(
      importedEntry.frontmatter,
    );

    const nextFormat = getEntryFormat(nextEntryType);
    const nextTitle =
      getStringFrontmatterValue(importedEntry.frontmatter.title) ||
      fileNameWithoutExtension(file.name);

    setEntryType(nextEntryType);
    setTitle(nextTitle);
    setAuthor(getStringFrontmatterValue(importedEntry.frontmatter.author));
    setImageAlt(getStringFrontmatterValue(importedEntry.frontmatter.imageAlt));
    setFields(getImportedFields(nextFormat, importedEntry.frontmatter));
    setMarkdown(importedEntry.markdown);

    setMainImage(null);
    setMarkdownImages([]);
    setLocalDraftId(null);

    const importedImage = getStringFrontmatterValue(
      importedEntry.frontmatter.image,
    );

    setSubmitMessage(
      importedImage
        ? `Entry imported. The file references this image: ${importedImage}. Please upload the main image manually before submitting if this entry type requires it.`
        : "Entry imported. Review the fields before submitting.",
    );
  } catch (error) {
    setSubmitMessage(
      error instanceof Error
        ? error.message
        : "Could not import Markdown file.",
    );
  }
}


  

return (
  <main className="min-h-screen bg-[#111120] bg-[url('/images/page-backgrounds/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
      <GeneralContentContainer>
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Editor
          </p>

          <h1 className="mt-2 font-[Spectral_SC] text-2xl font-bold uppercase tracking-wider sm:text-3xl">
            New Entry
          </h1>
        </header>

        <ImportMarkdownField onImport={handleImportMarkdownFile} />

        <div className="space-y-8 sm:space-y-10">
          <div className="grid gap-5 lg:grid-cols-2">
            <TextField label="Title" value={title} onChange={setTitle} />

            <SelectField
              label="Type of entry"
              value={entryType}
              onChange={handleEntryTypeChange}
              options={newEntryFormats.map((format) => ({
                label: `${format.group} — ${format.label}`,
                value: format.entryType,
              }))}
            />

            {selectedFormat.requiresAuthor && (
              <TextField label="Author" value={author} onChange={setAuthor} />
            )}

            {selectedFormat.usesMainImage && (
              <>
                <TextField
                  label="Image Alt"
                  value={imageAlt}
                  onChange={setImageAlt}
                />

                <ImageUploadField
                  label={
                    selectedFormat.mainImageRequired
                      ? "Main Image"
                      : "Main Image Optional"
                  }
                  file={mainImage}
                  onChange={setMainImage}
                />

                {mainImagePath && (
                  <p className="break-all rounded-md border border-white/20 bg-black/20 px-3 py-2 text-xs text-white/60 lg:col-span-2">
                    Image path:{" "}
                    <span className="text-[#fff48e]">{mainImagePath}</span>
                  </p>
                )}
              </>
            )}

            {selectedFormat.usesGalleryImages && (
  <GalleryImagesUploadField
    images={galleryImages}
    onAddFiles={handleGalleryImageFiles}
    onRemove={handleRemoveGalleryImage}
  />
)}
          </div>

          <section>
            <h2 className="mb-5 font-[Spectral_SC] text-xl font-bold uppercase tracking-wider text-white sm:text-2xl">
              Entry Fields
            </h2>

            <div className="grid items-start gap-5 lg:grid-cols-2">
              {selectedFormat.fields.map((field) => (
                <div key={field.name} className={getDynamicFieldClassName(field)}>
                  <DynamicEntryField
                    field={field}
                    value={fields[field.name]}
                    onChange={(value) =>
                      setFields((current) => ({
                        ...current,
                        [field.name]: value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </GeneralContentContainer>

      {selectedFormat.usesMarkdown && (
        <GeneralContentContainer>
          <h2 className="mb-5 font-[Spectral_SC] text-xl font-bold uppercase tracking-wider sm:text-2xl">
            Custom Markdown
          </h2>

          <textarea
            ref={markdownRef}
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            onDrop={handleMarkdownDrop}
            onDragOver={(event) => event.preventDefault()}
            placeholder="Write the free Markdown section here. You can drag images into this box."
            className="min-h-[260px] w-full resize-y rounded-md border border-[#fff48e]/80 bg-[#111120]/60 p-3 font-mono text-base text-white outline-none placeholder:text-white/50 focus:border-[#fff48e] sm:min-h-[360px] sm:p-4 sm:text-sm"
          />

          {markdownImages.length > 0 && (
            <div className="mt-4 rounded-md border border-white/20 bg-black/20 px-4 py-3 text-sm text-white/70">
              <p className="mb-2 font-bold text-white">
                Pending markdown images:
              </p>

              <ul className="max-h-48 list-disc space-y-2 overflow-y-auto pl-5">
                {markdownImages.map((image) => (
                  <li key={image.publicPath} className="break-all">
                    {image.file.name} →{" "}
                    <span className="text-[#fff48e]">
                      {image.publicPath}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </GeneralContentContainer>
      )}

      <GeneralContentContainer>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleSaveLocalDraft}
            className="w-full rounded-md border !border-[#fff48e] px-5 py-3 font-[Spectral_SC] text-sm uppercase tracking-wider text-white transition hover:!border-[#fff48e] hover:text-[#fff48e]"
          >
            Save Local Draft
          </button>

          <SubmitButton isSubmitting={isSubmitting} />
        </div>

        {submitMessage && (
          <p className="mt-4 break-words text-center text-sm text-[#fff48e]">
            {submitMessage}
          </p>
        )}
      </GeneralContentContainer>
    </form>
  </main>
);
}


function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-[Spectral_SC] text-sm font-bold uppercase tracking-wider text-white sm:text-base lg:text-lg">
      {children}
    </span>
  );
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
    <label className="grid min-w-0 gap-2 md:grid-cols-[160px_minmax(0,1fr)] md:items-center md:gap-3">
      <FieldLabel>{label}</FieldLabel>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 rounded-md border border-white/40 bg-[#111120]/60 px-3 py-2 text-base text-white outline-none focus:border-[#fff48e] sm:text-sm"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="grid min-w-0 gap-2 md:grid-cols-[160px_minmax(0,1fr)] md:items-center md:gap-3">
      <FieldLabel>{label}</FieldLabel>

      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="min-w-0 rounded-md border border-white/40 bg-[#111120]/60 px-3 py-2 text-base text-white outline-none focus:border-[#fff48e] sm:text-sm"
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
    <label className="grid min-w-0 gap-2 md:grid-cols-[160px_minmax(0,1fr)] md:items-center md:gap-3">
      <FieldLabel>{label}</FieldLabel>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 rounded-md border border-white/40 bg-[#111120] px-3 py-2 text-base text-white outline-none focus:border-[#fff48e] sm:text-sm"
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
    <label className="block min-w-0">
      <span className="mb-2 block font-[Spectral_SC] text-lg font-bold uppercase tracking-wider text-white sm:mb-3 sm:text-xl">
        {label}
      </span>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[150px] w-full resize-y rounded-md border border-[#fff48e]/80 bg-[#111120]/60 p-3 text-base text-white outline-none placeholder:text-white/50 focus:border-[#fff48e] sm:min-h-[180px] sm:p-4 sm:text-sm"
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
    <label className="grid min-w-0 gap-2 md:grid-cols-[160px_minmax(0,1fr)] md:items-center md:gap-3">
      <FieldLabel>{label}</FieldLabel>

      <span className="min-w-0">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />

        <span className="inline-flex w-full cursor-pointer justify-center rounded-md border border-[#fff48e] px-4 py-2 text-center text-sm transition hover:bg-[#fff48e] hover:text-[#111120] sm:w-auto sm:min-w-48 sm:px-6">
          <span className="truncate">
            {file ? file.name : "Upload image"}
          </span>
        </span>
      </span>
    </label>
  );
}

function FieldWrapper({
  children,
  helpText,
}: {
  children: React.ReactNode;
  helpText?: string;
}) {
  return (
    <div className="min-w-0">
      {children}

      {helpText && (
        <p className="mt-2 break-words text-xs leading-relaxed text-white/50">
          {helpText}
        </p>
      )}
    </div>
  );
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full rounded-md border-2 !border-[#fff48e] px-5 py-3 font-[Spectral_SC] text-sm uppercase tracking-wider transition hover:bg-[#fff48e] hover:!text-[#fff48e] disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
}

// DynamicEntryField

function DynamicEntryField({
  field,
  value,
  onChange,
}: {
  field: EntryFieldConfig;
  value: EntryFieldValue | undefined;
  onChange: (value: EntryFieldValue) => void;
}) {
  if (field.kind === "textarea" || field.kind === "yaml") {
    return (
      <FieldWrapper helpText={field.helpText}>
        <TextareaField
          label={field.label}
          placeholder={field.placeholder ?? ""}
          value={String(value ?? "")}
          onChange={(nextValue) => onChange(nextValue)}
        />
      </FieldWrapper>
    );
  }

  if (field.kind === "select") {
    return (
      <FieldWrapper helpText={field.helpText}>
        <SelectField
          label={field.label}
          value={String(value ?? "")}
          onChange={(nextValue) => onChange(nextValue)}
          options={(field.options ?? []).map((option) => ({
            label: option,
            value: option,
          }))}
        />
      </FieldWrapper>
    );
  }

  if (field.kind === "number") {
    return (
      <FieldWrapper helpText={field.helpText}>
        <NumberField
          label={field.label}
          value={Number(value ?? 0)}
          onChange={(nextValue) => onChange(nextValue)}
          min={field.min}
          max={field.max}
        />
      </FieldWrapper>
    );
  }

  if (field.kind === "boolean") {
    return (
      <FieldWrapper helpText={field.helpText}>
        <label className="grid items-center gap-3 md:grid-cols-[160px_1fr]">
          <span className="font-[Spectral_SC] text-lg font-bold uppercase tracking-wider">
            {field.label}
          </span>

          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(event.target.checked)}
            className="h-5 w-5 accent-[#fff48e]"
          />
        </label>
      </FieldWrapper>
    );
  }

  if (field.kind === "list") {
    return (
      <FieldWrapper helpText={field.helpText}>
        <TextareaField
          label={field.label}
          placeholder={field.placeholder ?? "Separate values with commas"}
          value={Array.isArray(value) ? value.join(", ") : String(value ?? "")}
          onChange={(nextValue) => onChange(splitCommaList(nextValue))}
        />
      </FieldWrapper>
    );
  }

  if (field.kind === "stats") {
    const fallbackStats = {
      strength: 1,
      speed: 1,
      durability: 1,
      magic: 1,
      intellect: 1,
      senses: 1,
    };

    const stats =
      typeof value === "object" && value !== null && !Array.isArray(value)
        ? (value as Record<string, number>)
        : fallbackStats;

    return (
      <FieldWrapper helpText={field.helpText}>
        <div className="pt-4">
          <h2 className="mb-4 border-b border-white/40 pb-2 font-[Spectral_SC] text-xl font-bold uppercase tracking-wider">
            {field.label}
          </h2>

          <div className="space-y-3">
            {Object.entries(stats).map(([key, statValue]) => (
              <NumberField
                key={key}
                label={capitalize(key)}
                value={Number(statValue)}
                onChange={(newValue) =>
                  onChange({
                    ...stats,
                    [key]: newValue,
                  })
                }
              />
            ))}
          </div>
        </div>
      </FieldWrapper>
    );
  }

  return (
    <FieldWrapper helpText={field.helpText}>
      <TextField
        label={field.label}
        value={String(value ?? "")}
        onChange={(nextValue) => onChange(nextValue)}
      />
    </FieldWrapper>
  );
}




//helper functions

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

function SubmitSection({
  isSubmitting,
  submitMessage,
}: {
  isSubmitting: boolean;
  submitMessage: string | null;
}) {
  return (
    <div className="mt-8 flex flex-col items-center">
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full max-w-md rounded-md border-2 border-[#fff48e] px-8 py-3 font-[Spectral_SC] text-lg uppercase tracking-wider transition hover:bg-[#fff48e] hover:text-[#111120] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {submitMessage && (
        <p className="mt-4 text-center text-sm text-[#fff48e]">
          {submitMessage}
        </p>
      )}
    </div>
  );
}

function getDynamicFieldClassName(field: EntryFieldConfig) {
  if (
    field.kind === "textarea" ||
    field.kind === "yaml" ||
    field.kind === "stats" ||
    field.kind === "list"
  ) {
    return "min-w-0 lg:col-span-2";
  }

  return "min-w-0";
}

// ImportMarkdownField

function ImportMarkdownField({
  onImport,
}: {
  onImport: (file: File | null) => void;
}) {
  return (
    <div className="mb-8 rounded-md border border-white/20 bg-black/20 px-4 py-4">
      <label className="block">
        <span className="mb-2 block font-[Spectral_SC] text-sm font-bold uppercase tracking-wider text-white">
          Import from .md or .mdx
        </span>

        <input
          type="file"
          accept=".md,.mdx,text/markdown,text/mdx"
          onChange={(event) => onImport(event.target.files?.[0] ?? null)}
          className="block w-full text-sm text-white file:mr-4 file:rounded-md file:border file:border-[#fff48e] file:bg-transparent file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-[#fff48e] hover:file:text-[#111120]"
        />
      </label>

      <p className="mt-2 text-xs leading-relaxed text-white/50">
        The file must include YAML frontmatter. Text content after the
        frontmatter will be imported as the Markdown / MDX body.
      </p>
    </div>
  );
}

type ImportedMarkdownEntry = {
  frontmatter: Record<string, unknown>;
  markdown: string;
};

function parseMarkdownEntryFile(text: string): ImportedMarkdownEntry {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(
      "The file must start with YAML frontmatter between --- markers.",
    );
  }

  const [, rawFrontmatter, markdown] = match;

  const parsedFrontmatter = parseYaml(rawFrontmatter) as unknown;

  if (
    typeof parsedFrontmatter !== "object" ||
    parsedFrontmatter === null ||
    Array.isArray(parsedFrontmatter)
  ) {
    throw new Error("The frontmatter must be a valid YAML object.");
  }

  return {
    frontmatter: parsedFrontmatter as Record<string, unknown>,
    markdown: markdown.trimStart(),
  };
}

function inferEntryTypeFromFrontmatter(
  frontmatter: Record<string, unknown>,
): NewEntryType {
  const explicitEntryType = getStringFrontmatterValue(frontmatter.entryType);

  if (isNewEntryType(explicitEntryType)) {
    return explicitEntryType;
  }

  const category = getStringFrontmatterValue(frontmatter.category);

  const categoryToEntryType: Record<string, NewEntryType> = {
    creatures: "codex.creature",
    creature: "codex.creature",
    spells: "codex.spell",
    spell: "codex.spell",
    techniques: "codex.technique",
    technique: "codex.technique",
    flora: "codex.flora",
    minerals: "codex.mineral",
    mineral: "codex.mineral",
    potions: "codex.potion",
    potion: "codex.potion",
    items: "codex.item",
    item: "codex.item",
    runes: "codex.rune",
    rune: "codex.rune",
  };

  const inferredEntryType = categoryToEntryType[category.toLowerCase()];

  return inferredEntryType ?? DEFAULT_ENTRY_TYPE;
}

function isNewEntryType(value: string): value is NewEntryType {
  return newEntryFormats.some((format) => format.entryType === value);
}

function getImportedFields(
  format: typeof DEFAULT_FORMAT,
  frontmatter: Record<string, unknown>,
) {
  const importedFields = getInitialFieldValues(format);

  for (const field of format.fields) {
    const value = frontmatter[field.name];

    if (value === undefined) continue;

    importedFields[field.name] = normalizeImportedFieldValue(value, field);
  }

  return importedFields;
}

function normalizeImportedFieldValue(
  value: unknown,
  field: EntryFieldConfig,
): EntryFieldValue {
  if (field.kind === "number") {
    return Number(value ?? 0);
  }

  if (field.kind === "boolean") {
    return Boolean(value);
  }

  if (field.kind === "list") {
    if (Array.isArray(value)) {
      return value.map(String);
    }

    if (typeof value === "string") {
      return splitCommaList(value);
    }

    return [];
  }

  if (field.kind === "stats") {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return value as Record<string, number>;
    }

    return {};
  }

  if (field.kind === "yaml") {
    if (typeof value === "string") {
      return value;
    }

    return stringifyYaml(value).trim();
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return stringifyYaml(value).trim();
  }

  return String(value ?? "");
}

function getStringFrontmatterValue(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
}

function GalleryImagesUploadField({
  images,
  onAddFiles,
  onRemove,
}: {
  images: PendingImage[];
  onAddFiles: (files: FileList | null) => void;
  onRemove: (publicPath: string) => void;
}) {
  return (
    <div className="rounded-md border border-white/20 bg-black/20 px-4 py-4 lg:col-span-2">
      <label className="block">
        <span className="mb-2 block font-[Spectral_SC] text-sm font-bold uppercase tracking-wider text-white">
          Gallery Images
        </span>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => onAddFiles(event.target.files)}
          className="block w-full text-sm text-white file:mr-4 file:rounded-md file:border file:border-[#fff48e] file:bg-transparent file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-[#fff48e] hover:file:text-[#111120]"
        />
      </label>

      {images.length > 0 && (
        <ul className="mt-4 space-y-2 text-xs text-white/70">
          {images.map((image) => (
            <li
              key={image.publicPath}
              className="flex flex-col gap-2 rounded-md border border-white/20 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="break-all">
                {image.file.name} →{" "}
                <span className="text-[#fff48e]">{image.publicPath}</span>
              </span>

              <button
                type="button"
                onClick={() => onRemove(image.publicPath)}
                className="w-fit text-red-300 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}