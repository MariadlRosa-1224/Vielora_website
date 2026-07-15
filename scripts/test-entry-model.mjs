// scripts/test-entry-model.mjs

import fs from "node:fs";
import mongoose from "mongoose";

function loadEnvLocal() {
  if (!fs.existsSync(".env.local")) return;

  const content = fs.readFileSync(".env.local", "utf8");

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/i);

    if (!match) continue;

    const key = match[1];
    let value = match[2].trim().replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is missing.");
}

await mongoose.connect(process.env.MONGODB_URI);

const EntrySchema = new mongoose.Schema(
  {
    entryType: String,
    title: String,
    slug: String,
    authorId: String,
    authorName: String,
    authorEmail: String,
    status: String,
    fields: mongoose.Schema.Types.Mixed,
    markdown: String,
  },
  {
    timestamps: true,
  },
);

const Entry =
  mongoose.models.Entry || mongoose.model("Entry", EntrySchema);

const testEntry = await Entry.create({
  entryType: "codex.creature",
  title: "Test Pending Creature",
  slug: "test-pending-creature",
  authorId: "test-user",
  authorName: "Test User",
  authorEmail: "test@example.com",
  status: "pending",
  fields: {
    rarity: "Legendary",
    location: "Anywhere",
  },
  markdown: "This is only a test.",
});

console.log("Created test entry:");
console.log(JSON.stringify(testEntry, null, 2));

await Entry.deleteOne({ _id: testEntry._id });

console.log("Deleted test entry.");

await mongoose.disconnect();