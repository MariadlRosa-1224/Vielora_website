import Image from "next/image";

export type ItemEntryData = {
  title: string;
  author: string;
  image: string;
  imageAlt: string;
  category: string;
  rarity: string;
  availability: string;
  Cost: string[];
  craftability: string[];
  location: string;
};

type ItemEntryTemplateProps = {
  entry: ItemEntryData;
};

export default function ItemEntryTemplate({
  entry,
}: ItemEntryTemplateProps) {
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
          <InfoLine label="Availability" value={entry.availability} />
            <InfoLine label="Location" value={entry.location} />
        </div>


                <div className="mt-6 text-sm">
          <p className="font-bold">Cost:</p>
          <ul className="ml-10 mt-1 list-disc">
            {entry.Cost.map((cost) => (
              <li key={cost}>{cost}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-sm">
          <p className="font-bold">Craftability:</p>
          <ul className="ml-10 mt-1 list-disc">
            {entry.craftability.map((craft) => (
              <li key={craft}>{craft}</li>
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