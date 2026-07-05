// src/components/codex/entry-templates/CreatureEntryTemplate.tsx

import Image from "next/image";

export type CreatureEntryData = {
  title: string;
  image: string;
  imageAlt: string;
  location: string;
  rarity: string;
  tameability: string;
  rank: string;
  dangerLevel: string;
  aspects: string[];
  loot: string[];
  stats: {
    strength: number;
    speed: number;
    durability: number;
    magic: number;
    intellect: number;
    senses: number;
  };
  abilities: string[];
};

type CreatureEntryTemplateProps = {
  entry: CreatureEntryData;
};

export default function CreatureEntryTemplate({
  entry,
}: CreatureEntryTemplateProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <h1 className="font-serif text-3xl font-bold uppercase tracking-wider">
          {entry.title}
        </h1>

        <div className="mt-8 space-y-4 text-sm">
          <InfoLine label="Location" value={entry.location} />
          <InfoLine label="Rarity" value={entry.rarity} />
          <InfoLine label="Tameability" value={entry.tameability} />
          <InfoLine label="Rank" value={entry.rank} />
          <InfoLine label="Danger Level" value={entry.dangerLevel} />
        </div>

        <div className="mt-6 text-sm">
          <p className="font-bold">Aspect:</p>
          <ul className="ml-10 mt-1 list-disc">
            {entry.aspects.map((aspect) => (
              <li key={aspect}>{aspect}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-sm">
          <p className="font-bold">Loot:</p>
          <ul className="ml-10 mt-1 list-disc">
            {entry.loot.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-6 border-t border-white/40 pt-4 md:grid-cols-2">
          <div>
            <h2 className="mb-3 border-b border-white/40 pb-2 font-serif text-sm uppercase tracking-wider">
              Stats:
            </h2>

            <div className="space-y-1 text-sm">
              <StatLine label="Strength" value={entry.stats.strength} />
              <StatLine label="Speed" value={entry.stats.speed} />
              <StatLine label="Durability" value={entry.stats.durability} />
              <StatLine label="Magic" value={entry.stats.magic} />
              <StatLine label="Intellect" value={entry.stats.intellect} />
              <StatLine label="Senses" value={entry.stats.senses} />
            </div>
          </div>

          <div>
            <h2 className="mb-3 border-b border-white/40 pb-2 font-serif text-sm uppercase tracking-wider">
              Abilities:
            </h2>

            <ul className="grid list-disc gap-x-8 gap-y-1 pl-5 text-sm md:grid-cols-2">
              {entry.abilities.map((ability) => (
                <li key={ability}>{ability}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative mx-auto h-[430px] w-full max-w-[300px] overflow-hidden self-center rounded-md border border-white/40">
        <Image
          src={entry.image}
          alt={entry.imageAlt}
          fill
          className="object-cover"
          sizes="300px"
          priority
        />
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-bold">{label}:</span> {value}
    </p>
  );
}

function StatLine({ label, value }: { label: string; value: number }) {
  return (
    <p>
      <span>{label}:</span>{" "}
      <span className="text-[#fff48e]">{"★".repeat(value)}</span>
    </p>
  );
}