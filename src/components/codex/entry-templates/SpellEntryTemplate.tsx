import Image from "next/image";

export type SpellEntryData = {
  title: string;
  image: string;
  imageAlt: string;
  category: string;
  stat: string;
  school: string;
  rank: string;
  caliber: string;
  costs: string[];
  downsides: string[];
  cooldowns: string[];
  requirements: string[];
};

type SpellEntryTemplateProps = {
  entry: SpellEntryData;
};

export default function SpellEntryTemplate({
  entry,
}: SpellEntryTemplateProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <h1 className="font-serif text-3xl font-bold uppercase tracking-wider">
          {entry.title}
        </h1>

        <div className="mt-8 space-y-4 text-sm">
          <InfoLine label="Rank" value={entry.rank} />
          <InfoLine label="School" value={entry.school} />
          <InfoLine label="Stat" value={entry.stat} />
          <InfoLine label="Caliber" value={entry.caliber} />
        </div>

        <div className="mt-6 text-sm">
          <p className="font-bold">Cost:</p>
          <ul className="ml-10 mt-1 list-disc">
            {entry.costs.map((cost) => (
              <li key={cost}>{cost}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-sm">
          <p className="font-bold">Downsides:</p>
          <ul className="ml-10 mt-1 list-disc">
            {entry.downsides.map((downside) => (
              <li key={downside}>{downside}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-sm">
          <p className="font-bold">Cooldowns:</p>
          <ul className="ml-10 mt-1 list-disc">
            {entry.cooldowns.map((cooldown) => (
              <li key={cooldown}>{cooldown}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-sm">
          <p className="font-bold">Requirements:</p>
          <ul className="ml-10 mt-1 list-disc">
            {entry.requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
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