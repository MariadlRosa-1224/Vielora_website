// src/components/characters/CharacterEntryTemplate.tsx

"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type CharacterGalleryImage = {
  src: string;
  alt?: string;
  label?: string;
};

export type CharacterEntryData = {
  title: string;

  name: string;
  age: string;
  race: string;
  gender: string;
  occupation: string;
  affiliations: string[];
  description: string;

  image: string;
  imageAlt: string;
  galleryImages?: CharacterGalleryImage[];
};

type CharacterEntryTemplateProps = {
  entry: CharacterEntryData;
};

export default function CharacterEntryTemplate({
  entry,
}: CharacterEntryTemplateProps) {
  const images = useMemo<CharacterGalleryImage[]>(() => {
    const mainImage: CharacterGalleryImage = {
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

  const [selectedImage, setSelectedImage] = useState<CharacterGalleryImage>(
    images[0],
  );

  return (
    <div>
      <h1 className="mb-8 font-['Spectral_SC'] text-3xl font-bold uppercase tracking-wider text-white">
        {entry.title}
      </h1>

      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div>
          <div className="relative h-[390px] w-full overflow-hidden rounded-md border border-[#fff48e]/80 bg-[#111120]/60">
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt ?? entry.imageAlt}
              fill
              priority
              sizes="260px"
              className="object-cover"
            />
          </div>

          <CharacterThumbnailGallery
            images={images}
            selectedImage={selectedImage}
            onSelect={setSelectedImage}
          />
        </div>

        <div className="flex flex-col justify-start text-base leading-relaxed text-white">
          <div className="space-y-5">
            <InfoLine label="Name" value={entry.name} />
            <InfoLine label="Age" value={entry.age} />
            <InfoLine label="Race" value={entry.race} />
            <InfoLine label="Gender" value={entry.gender} />
            <InfoLine label="Occupation" value={entry.occupation} />

            <p>
              <span className="font-['Spectral_SC'] font-bold uppercase tracking-wide">
                Affiliations:
              </span>{" "}
              {entry.affiliations.join(", ")}
            </p>

            <p>
              <span className="font-['Spectral_SC'] font-bold uppercase tracking-wide">
                Description:
              </span>{" "}
              {entry.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CharacterThumbnailGallery({
  images,
  selectedImage,
  onSelect,
}: {
  images: CharacterGalleryImage[];
  selectedImage: CharacterGalleryImage;
  onSelect: (image: CharacterGalleryImage) => void;
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