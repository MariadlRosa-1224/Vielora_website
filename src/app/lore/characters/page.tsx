// src/app/characters/page.tsx

import CharactersClient from "@/components/characters/CharactersClient";
import { getAllCharacterEntries } from "@/lib/characters";

export const metadata = {
  title: "Characters | Isles of Vielora",
};

export default function CharactersPage() {
  const characters = getAllCharacterEntries();

  return <CharactersClient initialCharacters={characters} />;
}