import Image from "next/image";

export type MineralEntryData = {
  title: string;
  author: string;
  image: string;
  imageAlt: string;
  category: string;
  rarity: string;
  location: string;
  //Properties
  mineralType: string;
  density: string;
  hardness: string;
  solubility: string;
  reactivity: string;
  meltingPoint: string;
  magicalReactivity: string;
  cost: string[];
  properties: string[];

};

type MineralEntryTemplateProps = {
  entry: MineralEntryData;
};

export default function MineralEntryTemplate({
  entry,
}: MineralEntryTemplateProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <h1 className="font-[Spectral_SC] text-3xl font-bold uppercase tracking-wider">
          {entry.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          by {entry.author}
        </p>

        <div className="mt-8 space-y-4 text-sm">
            <InfoLine label="Rarity" value={entry.rarity} />
            <InfoLine label="Location" value={entry.location} />
            <InfoLine label="Type" value={entry.mineralType} />
            <InfoLine label="Density" value={entry.density} />
            <InfoLine label="Hardness" value={entry.hardness} />
            <InfoLine label="Solubility" value={entry.solubility} />
            <InfoLine label="Reactivity" value={entry.reactivity} />
            <InfoLine label="Magical Reactivity" value={entry.magicalReactivity} />
            <InfoLine label="Melting Point" value={entry.meltingPoint} />

        </div>

        <div className="mt-6 text-sm">
          <p className="font-bold">Properties:</p>
          <ul className="ml-10 mt-1 list-disc">
            {entry.properties.map((property) => (
              <li key={property}>{property}</li>
            ))}
          </ul>
        </div>


        <div className="mt-6 text-sm">
          <p className="font-bold">Cost:</p>
          <ul className="ml-10 mt-1 list-disc">
            {entry.cost.map((cost) => (
              <li key={cost}>{cost}</li>
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