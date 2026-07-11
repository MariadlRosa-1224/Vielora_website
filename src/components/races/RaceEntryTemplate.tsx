// src/components/races/RaceEntryTemplate.tsx

"use client";

import { RaceWeakness } from "@/lib/races";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export type RaceGalleryImage = {
  src: string;
  alt?: string;
  label?: string;
};

export type RaceEntryData = {
  title: string;

  origin: string;
  size: string;
  lifespan: string;
  description: string;
  weaknesses: RaceWeakness[];
  history: string;

  image: string;
  imageAlt: string;
  galleryImages?: RaceGalleryImage[];
};

type RaceEntryTemplateProps = {
  entry: RaceEntryData;
};

export default function RaceEntryTemplate({ entry }: RaceEntryTemplateProps) {
  const images = useMemo<RaceGalleryImage[]>(() => {
    const mainImage: RaceGalleryImage = {
      src: entry.image,
      alt: entry.imageAlt,
      label: "Main portrait",
    };

    const extraImages = entry.galleryImages ?? [];

    const alreadyIncluded = extraImages.some(
      (image) => image.src === entry.image,
    );

    return alreadyIncluded ? extraImages : [mainImage, ...extraImages];
  }, [entry.image, entry.imageAlt, entry.galleryImages]);

  const [selectedImage, setSelectedImage] = useState<RaceGalleryImage>(
    images[0],
  );

  useEffect(() => {
    setSelectedImage(images[0]);
  }, [images]);

  return (
    <div>
      <h1 className="mb-8 font-['Spectral_SC'] text-3xl font-bold uppercase tracking-wider text-white">
        {entry.title}
      </h1>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col justify-start text-base leading-relaxed text-white">
          <div className="space-y-3">
            <InfoLine label="Origin" value={entry.origin} />
            <InfoLine label="Size" value={entry.size} />
            <InfoLine label="Lifespan" value={entry.lifespan} />

            <CollapsibleSection title="Description" defaultOpen={true}>
              <p className="whitespace-pre-line">{entry.description}</p>
            </CollapsibleSection>

            <CollapsibleSection title="Weaknesses">
              <div className="space-y-3">
                {entry.weaknesses.map((weakness) => (
                  <p key={weakness.id} className="whitespace-pre-line">
                    <span className="font-['Spectral_SC'] font-bold uppercase tracking-wide text-[#fff48e]">
                      {weakness.title}:
                    </span>{" "}
                    {weakness.description}
                  </p>
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="History">
              <p className="whitespace-pre-line">{entry.history}</p>
            </CollapsibleSection>
          </div>
        </div>

        <div>
          <div className="relative h-[390px] w-full overflow-hidden rounded-md border border-[#fff48e]/80 bg-[#111120]/60">
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt ?? entry.imageAlt}
              fill
              priority
              sizes="300px"
              className="object-cover"
            />
          </div>

          <RaceThumbnailGallery
            images={images}
            selectedImage={selectedImage}
            onSelect={setSelectedImage}
          />
        </div>
      </div>
    </div>
  );
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="border-y border-white/30">
<button
  type="button"
  onClick={() => setIsOpen((current) => !current)}
  aria-expanded={isOpen}
  className={[
    "flex w-full appearance-none items-center justify-between py-2 text-left",
    "!border-0 !bg-transparent shadow-none outline-none ring-0",
    "transition-colors !hover:border-0 hover:bg-transparent hover:text-[#fff48e] hover:shadow-none",
    "!focus:border-0 focus:bg-transparent focus:outline-none focus:ring-0",
    "focus-visible:outline-none focus-visible:ring-0",
    "active:border-0 active:bg-transparent active:shadow-none",
  ].join(" ")}
>
  <span className="font-['Spectral_SC'] font-bold uppercase tracking-wide">
    {title}:
  </span>

  <span
    aria-hidden="true"
    className={[
      "text-sm transition-transform duration-200",
      isOpen ? "rotate-180 text-[#fff48e]" : "rotate-0",
    ].join(" ")}
  >
    ▾
  </span>
</button>

      <div
        className={[
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden text-sm leading-relaxed text-white">
          {children}
        </div>
      </div>
    </section>
  );
}

function RaceThumbnailGallery({
  images,
  selectedImage,
  onSelect,
}: {
  images: RaceGalleryImage[];
  selectedImage: RaceGalleryImage;
  onSelect: (image: RaceGalleryImage) => void;
}) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#fff48e]/50">
      {images.map((image, index) => {
        const isSelected = selectedImage.src === image.src;

        return (
          <button
            key={`${image.src}-${index}`}
            type="button"
            onClick={() => onSelect(image)}
            aria-label={`Show ${image.label ?? image.alt ?? `image ${index + 1}`}`}
            aria-pressed={isSelected}
            className={[
              "relative h-[78px] w-[58px] shrink-0 overflow-hidden rounded-md border transition duration-200",
              "bg-[#111120]/70 hover:scale-105 hover:border-[#fff48e]",
              isSelected
                ? "border-[#fff48e] shadow-[0_0_12px_rgba(255,244,142,0.45)]"
                : "border-[#fff48e]/70",
            ].join(" ")}
          >
            <Image
              src={image.src}
              alt={image.alt ?? ""}
              fill
              sizes="58px"
              className="object-cover"
            />
          </button>
        );
      })}
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-['Spectral_SC'] font-bold uppercase tracking-wide">
        {label}:
      </span>{" "}
      {value}
    </p>
  );
}