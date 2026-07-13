"use client";


import { useMemo, useRef, useState } from "react";
import GeneralContentContainer from "@/components/containers/GeneralContentContainer";
import { authClient } from "@/lib/auth-client";
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


const [fields, setFields] = useState<Record<string, EntryFieldValue>>(() =>
  getInitialFieldValues(DEFAULT_FORMAT),
);






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
  setMarkdown("");
  setImageAlt("");
  setSubmitMessage(null);
};


const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  if (isSubmitting) return;

  if (!title.trim()) {
    alert("Entry title is required.");
    return;
  }

  if (selectedFormat.requiresAuthor && !author.trim()) {
    alert("Author is required for this entry type.");
    return;
  }

  if (selectedFormat.mainImageRequired && !mainImage) {
    alert("Main image is required for this entry type.");
    return;
  }

  const missingField = selectedFormat.fields.find((field) => {
    if (!field.required) return false;

    const value = fields[field.name];

    if (value === undefined || value === null) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    if (Array.isArray(value) && value.length === 0) return true;

    return false;
  });

  if (missingField) {
    alert(`${missingField.label} is required.`);
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
    const imageFolder = getEntryImageFolder({
      entryType,
      slug,
      fields,
    });

    const contentFolder = getEntryContentFolder({
      entryType,
      fields,
    });

    const mainImageBase64 = mainImage ? await fileToBase64(mainImage) : null;

    const markdownImagesPayload = await Promise.all(
      markdownImages.map(async (image) => ({
        fileName: image.file.name,
        base64: await fileToBase64(image.file),
      })),
    );

    const payload = {
      entryType,
      title,
      slug,

      author: selectedFormat.requiresAuthor ? author : undefined,
      imageAlt: imageAlt.trim() || title,

      contentFolder,
      imageFolder,
      fixedFields: getEntryFixedFields(entryType),

      fields,
      markdown,

      mainImage: mainImage
        ? {
            fileName: mainImage.name,
            base64: mainImageBase64,
          }
        : null,

      markdownImages: markdownImagesPayload,
    };

    const payloadText = JSON.stringify(payload);

    console.log(
      "Payload size MB:",
      new Blob([payloadText]).size / 1024 / 1024,
    );

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: payloadText,
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





  

  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-6 py-24 text-white">
      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl space-y-6">
        <GeneralContentContainer>
          <h1 className="mb-8 font-[Spectral_SC] text-3xl font-bold uppercase tracking-wider">
            New Entry
          </h1>
          <div className="space-y-10">
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
          <p className="text-sm text-white/60 lg:col-span-2">
            Image path:{" "}
            <span className="text-[#fff48e]">{mainImagePath}</span>
          </p>
        )}
      </>
    )}
  </div>

  <div className="grid items-start gap-8 lg:grid-cols-2">
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
</div>
          
        </GeneralContentContainer>

{selectedFormat.usesMarkdown && (
  <GeneralContentContainer>
    <h2 className="mb-6 font-[Spectral_SC] text-2xl font-bold uppercase tracking-wider">
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
        <p className="mb-2 font-bold text-white">
          Pending markdown images:
        </p>

        <ul className="list-disc space-y-1 pl-6">
          {markdownImages.map((image) => (
            <li key={image.publicPath}>
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
  <SubmitSection
    isSubmitting={isSubmitting}
    submitMessage={submitMessage}
  />
</GeneralContentContainer>
      </form>
    </main>
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
    <label className="grid items-center gap-3 md:grid-cols-[160px_1fr]">
      <span className="font-[Spectral_SC] text-lg font-bold uppercase tracking-wider">
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
    <label className="grid items-center gap-3 md:grid-cols-[160px_1fr]">
      <span className="font-[Spectral_SC] text-sm font-bold uppercase tracking-wider">
        {label}
      </span>

      <input
        type="number"
        min={min}
        max={max}
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
      <span className="font-[Spectral_SC] text-lg font-bold uppercase tracking-wider">
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
      <span className="mb-3 block font-[Spectral_SC] text-xl font-bold uppercase tracking-wider">
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
      <span className="font-[Spectral_SC] text-lg font-bold uppercase tracking-wider">
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

// FirldWrapper

function FieldWrapper({
  children,
  helpText,
}: {
  children: React.ReactNode;
  helpText?: string;
}) {
  return (
    <div>
      {children}

      {helpText && (
        <p className="mt-2 text-xs leading-relaxed text-white/50">
          {helpText}
        </p>
      )}
    </div>
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
    return "lg:col-span-2";
  }

  return "";
}