// src/app/editor/new-entry/page.tsx

import NewEntryForm from "@/components/editor/NewEntryForm";
import { verifyPermission } from "@/lib/dal";

export default async function NewEntryPage() {
  await verifyPermission("entry:create");

  return <NewEntryForm />;
}