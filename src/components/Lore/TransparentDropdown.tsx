const chapters = [
  "Chapter I",
  "Chapter II",
  "Chapter III",
  "Chapter IV",
  "Chapter V",
  "Chapter VI",
  "Chapter VII",
  "Chapter VIII",
  "Chapter IX",
  "Chapter X",
];

interface TransparentDropdownProps {
  chapter: string;
}

export default function TransparentDropdown({
  chapter,
}: TransparentDropdownProps) {
  return (
    <div className="group flex w-[220px] flex-col">
      <div className="flex h-20 w-[220px] items-center justify-center rounded-[10px] border-2 border-white bg-white/30 font-serif transition-opacity group-hover:opacity-80">
        <h3 className="font-['Spectral_SC'] text-center text-2xl font-bold text-white">
          {chapter}
        </h3>
      </div>

      <div className="flex h-fit flex-col items-center bg-transparent">
        {chapters.map((chapterItem) => (
          <div
            key={chapterItem}
            className="hidden h-[30px] w-[200px] cursor-pointer items-center justify-center border-2 border-white bg-white/30 font-serif text-base text-white transition-opacity hover:opacity-80 group-hover:flex"
          >
            <p>{chapterItem}</p>
          </div>
        ))}
      </div>
    </div>
  );
}