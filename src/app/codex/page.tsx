import CodexClient from "../../components/codex/CodexClient";
import {getAllCodexEntries} from "@/lib/codex";

export default function CodexPage() {
  const entries = getAllCodexEntries();

  return <CodexClient initialItems={entries} />;
}