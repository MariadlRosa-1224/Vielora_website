import type { CodexEntryMeta } from "@/lib/codex";
import ItemCard from "../ItemCard/ItemCard";

type ItemListProps = {
  items: CodexEntryMeta[];
};

export default function ItemList({ items }: ItemListProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-center text-white/80">
        No items found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ItemCard key={item.href} item={item} />
      ))}
    </div>
  );
}