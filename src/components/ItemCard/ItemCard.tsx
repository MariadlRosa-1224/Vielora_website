// src/components/codex/ItemCard.tsx

import Image from "next/image";
import Link from "next/link";
import type { CodexEntryMeta } from "@/lib/codex";

type ItemCardProps = {
  item: CodexEntryMeta;
};

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={item.href} className="group relative flex h-[260px] w-[200px] cursor-pointer flex-col justify-end overflow-hidden rounded-[10px] border border-white/80 bg-transparent transition-transform duration-500 hover:scale-105">
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="180px"
      />

      <div className="absolute inset-0 z-10 bg-[#0d0f89]/35 transition-opacity duration-500 group-hover:opacity-0" />

      <div className="relative z-20 flex h-full flex-col justify-end p-4">
        <h2 className="font-serif text-base font-bold text-white">
          {item.title}
        </h2>

        <div className="my-2 h-[2px] w-full bg-white" />

        <p className="text-xs text-white">
          {item.category}
        </p>
      </div>
    </Link>
  );
}