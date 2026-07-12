// src/app/lore/timeline/page.tsx

import LoreIndexPage from "@/components/lore/LoreIndexPage";
import { getLoreIndexSections, lorePageConfig } from "@/lib/lore";

export default function TimelinePage() {
  const config = lorePageConfig.timeline;
  const sections = getLoreIndexSections("timeline");

  return (
    <LoreIndexPage
      title={config.title}
      description={config.description}
      sections={sections}
    />
  );
}