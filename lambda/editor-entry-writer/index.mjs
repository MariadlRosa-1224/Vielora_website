import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secrets = new SecretsManagerClient({});

const entryTypes = {
  "codex.creature": {
    mdxDir: "content/codex/creatures",
    imageDir: "public/images/codex/creatures",
    kind: "creature",
  },
  "lore.character": {
    mdxDir: "content/lore/characters",
    imageDir: "public/images/lore/characters",
    kind: "character",
  },
};

export async function handler(event) {
  try {
    if (event.requestContext?.http?.method === "OPTIONS") {
      return response(204, {});
    }

    const body = JSON.parse(event.body ?? "{}");

    const result = await createEntry(body);

    return response(201, result);
  } catch (error) {
    console.error(error);

    return response(error.statusCode ?? 500, {
      error: error.message ?? "Internal server error",
    });
  }
}

async function createEntry(input) {
  const entryType = entryTypes[input.entryType];

  if (!entryType) {
    throw httpError(400, "Invalid entry type.");
  }

  const title = requiredString(input.title, "title");
  const slug = slugify(input.slug || title);

  const imageFolder = `${entryType.imageDir}/${slug}`;
  const mdxPath = `${entryType.mdxDir}/${slug}.mdx`;

  const mainImage = input.mainImage;

  if (!mainImage?.fileName || !mainImage?.base64) {
    throw httpError(400, "mainImage is required.");
  }

  const mainImageName = sanitizeFileName(mainImage.fileName);
  const mainImagePath = `${imageFolder}/${mainImageName}`;
  const publicMainImagePath = stripPublic(mainImagePath);

  const markdownImages = Array.isArray(input.markdownImages)
    ? input.markdownImages
    : [];

  const extraImages = markdownImages.map((image) => {
    const fileName = sanitizeFileName(image.fileName);

    return {
      ...image,
      fileName,
      repoPath: `${imageFolder}/${fileName}`,
      publicPath: stripPublic(`${imageFolder}/${fileName}`),
    };
  });

  const mdx =
    entryType.kind === "creature"
      ? buildCreatureMdx({
          ...input,
          title,
          slug,
          imagePath: publicMainImagePath,
        })
      : buildCharacterMdx({
          ...input,
          title,
          slug,
          imagePath: publicMainImagePath,
        });

  const token = await getGithubToken();

  await assertFileDoesNotExist(mdxPath, token);

  const commitMessage = `feat(content): add ${title}`;

  await putGithubFile({
    path: mdxPath,
    content: mdx,
    message: commitMessage,
    token,
  });

  await putGithubFile({
    path: mainImagePath,
    contentBase64: mainImage.base64,
    message: commitMessage,
    token,
    alreadyBase64: true,
  });

  for (const image of extraImages) {
    await putGithubFile({
      path: image.repoPath,
      contentBase64: image.base64,
      message: commitMessage,
      token,
      alreadyBase64: true,
    });
  }

  return {
    ok: true,
    mdxPath,
    mainImagePath,
    entryUrl:
      entryType.kind === "creature"
        ? `/codex/creatures/${slug}`
        : `/lore/characters/${slug}`,
  };
}

function buildCreatureMdx(input) {
  const fields = input.fields ?? {};
  const stats = fields.stats ?? {};

  return `---
title: ${yamlString(input.title)}
slug: ${yamlString(input.slug)}
category: creatures
tags:
  - Creature
  - ${yamlString(fields.location ?? "Anywhere")}
  - ${yamlString(fields.rarity ?? "Special")}
  - ${yamlString(fields.tameability ?? "Untameable")}
image: ${yamlString(input.imagePath)}
imageAlt: ${yamlString(input.title)}
location: ${yamlString(fields.location ?? "Anywhere")}
rarity: ${yamlString(fields.rarity ?? "Special")}
tameability: ${yamlString(fields.tameability ?? "Untameable")}
rank: ${yamlString(fields.rank ?? "E")}
dangerLevel: ${yamlString(fields.dangerLevel ?? "All")}
aspects:
${yamlList(fields.aspects ?? [])}
loot:
${yamlList(fields.loot ?? [])}
stats:
  strength: ${numberOrDefault(stats.strength, 1)}
  speed: ${numberOrDefault(stats.speed, 1)}
  durability: ${numberOrDefault(stats.durability, 1)}
  magic: ${numberOrDefault(stats.magic, 1)}
  intellect: ${numberOrDefault(stats.intellect, 1)}
  senses: ${numberOrDefault(stats.senses, 1)}
abilities:
${yamlList(fields.abilities ?? [])}
draft: false
---

# ${input.title}

${input.markdown?.trim() ?? ""}
`;
}

function buildCharacterMdx(input) {
  return `---
title: ${yamlString(input.title)}
slug: ${yamlString(input.slug)}
image: ${yamlString(input.imagePath)}
imageAlt: ${yamlString(input.title)}
draft: false
---

# ${input.title}

![${input.title}](${input.imagePath})

${input.markdown?.trim() ?? ""}
`;
}

async function putGithubFile({
  path,
  content,
  contentBase64,
  message,
  token,
  alreadyBase64 = false,
}) {
  const encodedContent = alreadyBase64
    ? normalizeBase64(contentBase64)
    : Buffer.from(content, "utf8").toString("base64");

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH;

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeRepoPath(path)}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: encodedContent,
      branch,
    }),
  });

  if (!res.ok) {
    const details = await res.text();
    throw httpError(res.status, `GitHub write failed for ${path}: ${details}`);
  }

  return res.json();
}

async function assertFileDoesNotExist(path, token) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH;

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeRepoPath(path)}?ref=${encodeURIComponent(branch)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (res.status === 404) return;

  if (res.ok) {
    throw httpError(409, `Entry already exists at ${path}.`);
  }

  const details = await res.text();
  throw httpError(res.status, `Could not check existing file: ${details}`);
}

async function getGithubToken() {
  const result = await secrets.send(
    new GetSecretValueCommand({
      SecretId: process.env.GITHUB_TOKEN_SECRET,
    }),
  );

  if (!result.SecretString) {
    throw httpError(500, "GitHub token secret is empty.");
  }

  return result.SecretString;
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function requiredString(value, name) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw httpError(400, `${name} is required.`);
  }

  return value.trim();
}

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function sanitizeFileName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

function stripPublic(path) {
  return path.replace(/^public/, "");
}

function encodeRepoPath(path) {
  return path
    .split("/")
    .map(encodeURIComponent)
    .join("/");
}

function yamlString(value) {
  return JSON.stringify(String(value));
}

function yamlList(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return "  - None";
  }

  return values.map((value) => `  - ${yamlString(value)}`).join("\n");
}

function numberOrDefault(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeBase64(value) {
  return String(value).replace(/^data:[^;]+;base64,/, "");
}