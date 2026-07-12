// src/app/lore/extras/page.tsx

import LoreIndexPage from "@/components/lore/LoreIndexPage";
import { getLoreIndexSections, lorePageConfig } from "@/lib/lore";

export default function ExtrasPage() {
  const config = lorePageConfig.extras;
  const sections = getLoreIndexSections("extras");

  return (
    <LoreIndexPage
      title={config.title}
      description={config.description}
      sections={sections}
    />
  );
}