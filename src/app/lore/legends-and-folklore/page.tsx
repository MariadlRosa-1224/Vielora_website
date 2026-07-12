// src/app/lore/legends-and-folklore/page.tsx

import LoreIndexPage from "@/components/lore/LoreIndexPage";
import { getLoreIndexSections, lorePageConfig } from "@/lib/lore";

export default function LegendsAndFolklorePage() {
  const config = lorePageConfig["legends-and-folklore"];
  const sections = getLoreIndexSections("legends-and-folklore");

  return (
    <LoreIndexPage
      title={config.title}
      description={config.description}
      sections={sections}
    />
  );
}