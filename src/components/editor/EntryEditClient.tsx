// src/components/editor/EntryEditClient.tsx

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GeneralContentContainer from "@/components/containers/GeneralContentContainer";
import {
  getEntryFormat,
  type EntryFieldValue,
} from "@/lib/new-entry-format";
import type { EntryRecord } from "@/lib/entries-types";

type EntryEditClientProps = {
  initialEntry: EntryRecord;
};

type PendingGalleryImage = {
  file: File;
  publicPath: string;
};

export default function EntryEditClient({
  initialEntry,
}: EntryEditClientProps) {
  const router = useRouter();
  const format = useMemo(
    () => getEntryFormat(initialEntry.entryType),
    [initialEntry.entryType],
  );

  const supportsGalleryImages = Boolean(format.usesGalleryImages);

  const [title, setTitle] = useState(initialEntry.title);
  const [imageAlt, setImageAlt] = useState(initialEntry.imageAlt ?? "");
  const [markdown, setMarkdown] = useState(initialEntry.markdown ?? "");
  const [fields, setFields] = useState<Record<string, EntryFieldValue>>(
    initialEntry.fields ?? {},
  );

  

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const slug = slugify(title || initialEntry.slug);

  const [replacementMainImage, setReplacementMainImage] = useState<File | null>(
  null,
);

const [replacementMainImagePath, setReplacementMainImagePath] = useState("");

// gallery consts

const [keptGalleryImages, setKeptGalleryImages] = useState(
  initialEntry.galleryImages ?? [],
);

const [newGalleryImages, setNewGalleryImages] = useState<PendingGalleryImage[]>(
  [],
);


  function updateField(name: string, value: EntryFieldValue) {
    setFields((currentFields) => ({
      ...currentFields,
      [name]: value,
    }));
  }

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setIsSubmitting(true);
  setError(null);
  setMessage(null);

  try {
    const replacementMainImagePayload = replacementMainImage
      ? {
          fileName: sanitizeFileName(replacementMainImage.name),
          base64: await fileToBase64(replacementMainImage),
          mimeType: replacementMainImage.type,
          publicPath: replacementMainImagePath,
        }
      : undefined;

    const newGalleryImagePayloads = supportsGalleryImages
      ? await Promise.all(
          newGalleryImages.map(async (image) => ({
            fileName: sanitizeFileName(image.file.name),
            base64: await fileToBase64(image.file),
            mimeType: image.file.type,
            publicPath: image.publicPath,
          })),
        )
      : [];

    const updatePayload: {
      entryType: string;
      title: string;
      slug: string;
      fields: Record<string, EntryFieldValue>;
      markdown: string;
      imageAlt: string;
      mainImage?: {
        fileName: string;
        base64: string;
        mimeType: string;
        publicPath: string;
      };
      galleryImages?: {
        keepPublicPaths: string[];
        newImages: {
          fileName: string;
          base64: string;
          mimeType: string;
          publicPath: string;
        }[];
      };
    } = {
      entryType: initialEntry.entryType,
      title,
      slug,
      fields,
      markdown,
      imageAlt,
      mainImage: replacementMainImagePayload,
    };

    if (supportsGalleryImages) {
      updatePayload.galleryImages = {
        keepPublicPaths: keptGalleryImages
          .map((image) => image.publicPath)
          .filter((path): path is string => Boolean(path)),
        newImages: newGalleryImagePayloads,
      };
    }

    const response = await fetch(
      `/api/entries/${encodeURIComponent(initialEntry.entryId)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      },
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error ?? "Could not update entry.");
    }

    setMessage("Entry updated and sent for review.");

    router.refresh();
    router.push(`/dashboard/entries/${initialEntry.entryId}`);
  } catch (caughtError) {
    setError(
      caughtError instanceof Error
        ? caughtError.message
        : "Could not update entry.",
    );
  } finally {
    setIsSubmitting(false);
  }
}
  
  function handleReplacementMainImageChange(file: File | null) {
  setReplacementMainImage(file);

  if (!file) {
    setReplacementMainImagePath("");
    return;
  }

  const baseFolder = initialEntry.imageFolder || getImageFolderFromPublicPath(
    initialEntry.mainImage?.publicPath,
  );

  const versionedFileName = `${Date.now()}-${sanitizeFileName(file.name)}`;

  setReplacementMainImagePath(`${baseFolder}/${versionedFileName}`);
}


function handleRemoveExistingGalleryImage(publicPath: string) {
  setKeptGalleryImages((current) =>
    current.filter((image) => image.publicPath !== publicPath),
  );
}

function handleAddGalleryImages(files: FileList | null) {
  if (!files) return;

  const imageFiles = Array.from(files).filter((file) =>
    file.type.startsWith("image/"),
  );

  const baseFolder =
    initialEntry.imageFolder ||
    getImageFolderFromPublicPath(initialEntry.mainImage?.publicPath);

  const pendingImages = imageFiles.map((file, index) => {
    const safeName = sanitizeFileName(file.name);
    const uniqueName = `${Date.now()}-${index}-${safeName}`;

    return {
      file,
      publicPath: `${baseFolder}/gallery/${uniqueName}`,
    };
  });

  setNewGalleryImages((current) => [...current, ...pendingImages]);
}

function handleRemoveNewGalleryImage(publicPath: string) {
  setNewGalleryImages((current) =>
    current.filter((image) => image.publicPath !== publicPath),
  );
}


  return (
  <GeneralContentContainer>
    <form onSubmit={handleSubmit} className="space-y-7 sm:space-y-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Edit Entry
          </p>

          <h1 className="mt-2 break-words font-[Spectral_SC] text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl md:text-4xl">
            {initialEntry.title}
          </h1>

          <p className="mt-2 break-words text-sm text-white/60">
            {format.label} · {initialEntry.status}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
          <Link
            href={`/dashboard/entries/${initialEntry.entryId}`}
            className="w-full rounded-md border border-white/40 px-4 py-2 text-center text-sm text-white transition-colors hover:border-[#fff48e] lg:w-auto"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md border border-[#fff48e] px-4 py-2 text-sm text-white transition-colors hover:bg-[#fff48e] hover:text-[#111120] disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      {error && (
        <p className="break-words rounded-md border border-red-400/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {message && (
        <p className="break-words rounded-md border border-green-400/60 bg-green-950/40 px-4 py-3 text-sm text-green-200">
          {message}
        </p>
      )}

      <section className="grid gap-5 md:grid-cols-2">
        <label className="block min-w-0">
          <span className="text-sm font-bold uppercase tracking-wider text-white/70">
            Title
          </span>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 w-full min-w-0 rounded-md border border-white/30 bg-[#111120] px-3 py-2 text-base text-white outline-none focus:border-[#fff48e] sm:text-sm"
            required
          />
        </label>

        <label className="block min-w-0">
          <span className="text-sm font-bold uppercase tracking-wider text-white/70">
            Slug
          </span>

          <input
            value={slug}
            readOnly
            className="mt-2 w-full min-w-0 rounded-md border border-white/20 bg-black/30 px-3 py-2 text-base text-white/60 outline-none sm:text-sm"
          />
        </label>

        <label className="block min-w-0 md:col-span-2">
          <span className="text-sm font-bold uppercase tracking-wider text-white/70">
            Image Alt
          </span>

          <label className="block min-w-0 md:col-span-2">
  <span className="text-sm font-bold uppercase tracking-wider text-white/70">
    Replace Main Image
  </span>

  <input
    type="file"
    accept="image/*"
    onChange={(event) =>
      handleReplacementMainImageChange(event.target.files?.[0] ?? null)
    }
    className="mt-2 block w-full text-sm text-white file:mr-4 file:rounded-md file:border file:border-[#fff48e] file:bg-transparent file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-[#fff48e] hover:file:text-[#111120]"
  />

  {initialEntry.mainImage?.publicPath && (
    <p className="mt-2 break-all text-xs text-white/50">
      Current image:{" "}
      <span className="text-[#fff48e]">
        {initialEntry.mainImage.publicPath}
      </span>
    </p>
  )}

  {replacementMainImagePath && (
    <p className="mt-2 break-all text-xs text-white/50">
      New image path:{" "}
      <span className="text-[#fff48e]">
        {replacementMainImagePath}
      </span>
    </p>
  )}
</label>

{supportsGalleryImages && (
  <EditableGalleryImagesField
    keptImages={keptGalleryImages}
    newImages={newGalleryImages}
    onRemoveExisting={handleRemoveExistingGalleryImage}
    onAddFiles={handleAddGalleryImages}
    onRemoveNew={handleRemoveNewGalleryImage}
  />
)}

          <input
            value={imageAlt}
            onChange={(event) => setImageAlt(event.target.value)}
            className="mt-2 w-full min-w-0 rounded-md border border-white/30 bg-[#111120] px-3 py-2 text-base text-white outline-none focus:border-[#fff48e] sm:text-sm"
          />
        </label>
      </section>

      <section>
        <h2 className="mb-4 font-[Spectral_SC] text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
          Fields
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          {format.fields.map((field) => (
            <EditableField
              key={field.name}
              field={field}
              value={fields[field.name]}
              onChange={(value) => updateField(field.name, value)}
            />
          ))}
        </div>
      </section>

      <section>
        <label className="block min-w-0">
          <span className="font-[Spectral_SC] text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
            Markdown / MDX Content
          </span>

          <textarea
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            rows={18}
            className="mt-4 min-h-[280px] w-full min-w-0 resize-y rounded-md border border-white/30 bg-[#111120] px-3 py-3 font-mono text-base text-white outline-none focus:border-[#fff48e] sm:min-h-[420px] sm:px-4 sm:text-sm"
          />
        </label>
      </section>

      <footer className="grid gap-3 border-t border-white/20 pt-6 sm:grid-cols-2 lg:flex lg:justify-end">
        <Link
          href={`/dashboard/entries/${initialEntry.entryId}`}
          className="w-full rounded-md border border-white/40 px-4 py-2 text-center text-sm text-white transition-colors hover:border-[#fff48e] lg:w-auto"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md border border-[#fff48e] px-4 py-2 text-sm text-white transition-colors hover:bg-[#fff48e] hover:text-[#111120] disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </footer>
    </form>
  </GeneralContentContainer>
);
}



function EditableField({
  field,
  value,
  onChange,
}: {
  field: {
    name: string;
    label: string;
    kind: string;
    options?: readonly string[];
  };
  value: EntryFieldValue | undefined;
  onChange: (value: EntryFieldValue) => void;
}) {
  const baseLabel = (
    <span className="text-sm font-bold uppercase tracking-wider text-white/70">
      {field.label}
    </span>
  );

  if (field.kind === "textarea" || field.kind === "yaml") {
    return (
      <label className="block min-w-0 md:col-span-2">
        {baseLabel}

        <textarea
          value={typeof value === "string" ? value : stringifyEditableValue(value)}
          onChange={(event) => onChange(event.target.value)}
          rows={field.kind === "yaml" ? 8 : 4}
          className="mt-2 w-full min-w-0 resize-y rounded-md border border-white/30 bg-[#111120] px-3 py-2 text-base text-white outline-none focus:border-[#fff48e] sm:text-sm"
        />
      </label>
    );
  }

  if (field.kind === "list") {
    return (
      <label className="block min-w-0 md:col-span-2">
        {baseLabel}

        <textarea
          value={Array.isArray(value) ? value.join("\n") : ""}
          onChange={(event) =>
            onChange(
              event.target.value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
            )
          }
          rows={4}
          placeholder="One item per line"
          className="mt-2 w-full min-w-0 resize-y rounded-md border border-white/30 bg-[#111120] px-3 py-2 text-base text-white outline-none placeholder:text-white/40 focus:border-[#fff48e] sm:text-sm"
        />
      </label>
    );
  }

  if (field.kind === "number") {
    return (
      <label className="block min-w-0">
        {baseLabel}

        <input
          type="number"
          value={typeof value === "number" ? value : Number(value ?? 0)}
          onChange={(event) => onChange(Number(event.target.value))}
          className="mt-2 w-full min-w-0 rounded-md border border-white/30 bg-[#111120] px-3 py-2 text-base text-white outline-none focus:border-[#fff48e] sm:text-sm"
        />
      </label>
    );
  }

  if (field.kind === "boolean") {
    return (
      <label className="flex min-w-0 items-center gap-3 rounded-md border border-white/20 bg-[#111120]/60 px-4 py-3">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-5 w-5 shrink-0 accent-[#fff48e]"
        />

        {baseLabel}
      </label>
    );
  }

  if (field.kind === "select" && field.options && field.options.length > 0) {
    return (
      <label className="block min-w-0">
        {baseLabel}

        <select
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          className="mt-2 w-full min-w-0 rounded-md border border-white/30 bg-[#111120] px-3 py-2 text-base text-white outline-none focus:border-[#fff48e] sm:text-sm"
        >
          <option value="">Select...</option>

          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.kind === "stats") {
    return (
      <label className="block min-w-0 md:col-span-2">
        {baseLabel}

        <textarea
          value={stringifyEditableValue(value)}
          onChange={(event) => {
            try {
              const parsed = JSON.parse(event.target.value) as Record<
                string,
                number
              >;

              onChange(parsed);
            } catch {
              onChange(event.target.value);
            }
          }}
          rows={5}
          className="mt-2 w-full min-w-0 resize-y rounded-md border border-white/30 bg-[#111120] px-3 py-2 font-mono text-base text-white outline-none focus:border-[#fff48e] sm:text-sm"
        />
      </label>
    );
  }

  return (
    <label className="block min-w-0">
      {baseLabel}

      <input
        value={typeof value === "string" ? value : stringifyEditableValue(value)}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full min-w-0 rounded-md border border-white/30 bg-[#111120] px-3 py-2 text-base text-white outline-none focus:border-[#fff48e] sm:text-sm"
      />
    </label>
  );
}

function stringifyEditableValue(value: EntryFieldValue | undefined) {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

function getImageFolderFromPublicPath(publicPath?: string) {
  if (!publicPath) {
    return "/images/uploads";
  }

  const parts = publicPath.split("/").filter(Boolean);

  if (parts.length <= 1) {
    return "/images/uploads";
  }

  return `/${parts.slice(0, -1).join("/")}`;
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

function EditableGalleryImagesField({
  keptImages,
  newImages,
  onRemoveExisting,
  onAddFiles,
  onRemoveNew,
}: {
  keptImages: EntryRecord["galleryImages"];
  newImages: PendingGalleryImage[];
  onRemoveExisting: (publicPath: string) => void;
  onAddFiles: (files: FileList | null) => void;
  onRemoveNew: (publicPath: string) => void;
}) {
  return (
    <section className="md:col-span-2 rounded-md border border-white/20 bg-black/20 px-4 py-4">
      <h2 className="font-[Spectral_SC] text-sm font-bold uppercase tracking-wider text-white">
        Gallery Images
      </h2>

      {keptImages && keptImages.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs uppercase tracking-wider text-white/50">
            Current gallery
          </p>

          {keptImages.map((image) => (
            <div
              key={image.publicPath ?? image.s3Key}
              className="flex flex-col gap-2 rounded-md border border-white/20 px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="break-all text-white/70">
                {image.publicPath ?? image.fileName}
              </span>

              {image.publicPath && (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(image.publicPath!)}
                  className="w-fit text-red-300 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <label className="mt-5 block">
        <span className="mb-2 block text-xs uppercase tracking-wider text-white/50">
          Add new gallery images
        </span>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => onAddFiles(event.target.files)}
          className="block w-full text-sm text-white file:mr-4 file:rounded-md file:border file:border-[#fff48e] file:bg-transparent file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-[#fff48e] hover:file:text-[#111120]"
        />
      </label>

      {newImages.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs uppercase tracking-wider text-white/50">
            New gallery images
          </p>

          {newImages.map((image) => (
            <div
              key={image.publicPath}
              className="flex flex-col gap-2 rounded-md border border-white/20 px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="break-all text-white/70">
                {image.file.name} →{" "}
                <span className="text-[#fff48e]">{image.publicPath}</span>
              </span>

              <button
                type="button"
                onClick={() => onRemoveNew(image.publicPath)}
                className="w-fit text-red-300 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}