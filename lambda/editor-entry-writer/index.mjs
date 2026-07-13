import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secrets = new SecretsManagerClient({});

const staticEntryTypes = {
  "codex.creature": {
    mdxDir: "content/codex/creatures",
    imageDir: "public/images/codex/creatures",
    routePrefix: "/codex/creatures",
    mainImageRequired: true,
    requiresAuthor: true,
    fixedFields: {
      category: "creatures",
    },
  },
  "codex.spell": {
    mdxDir: "content/codex/spells",
    imageDir: "public/images/codex/spells",
    routePrefix: "/codex/spells",
    mainImageRequired: true,
    requiresAuthor: true,
    fixedFields: {
      category: "spells",
    },
  },
  "codex.technique": {
    mdxDir: "content/codex/techniques",
    imageDir: "public/images/codex/techniques",
    routePrefix: "/codex/techniques",
    mainImageRequired: true,
    requiresAuthor: true,
    fixedFields: {
      category: "techniques",
    },
  },
  "codex.flora": {
    mdxDir: "content/codex/flora",
    imageDir: "public/images/codex/flora",
    routePrefix: "/codex/flora",
    mainImageRequired: true,
    requiresAuthor: true,
    fixedFields: {
      category: "flora",
    },
  },
  "codex.mineral": {
    mdxDir: "content/codex/minerals",
    imageDir: "public/images/codex/minerals",
    routePrefix: "/codex/minerals",
    mainImageRequired: true,
    requiresAuthor: true,
    fixedFields: {
      category: "minerals",
    },
  },
  "codex.potion": {
    mdxDir: "content/codex/potions",
    imageDir: "public/images/codex/potions",
    routePrefix: "/codex/potions",
    mainImageRequired: true,
    requiresAuthor: true,
    fixedFields: {
      category: "potions",
    },
  },
  "codex.item": {
    mdxDir: "content/codex/items",
    imageDir: "public/images/codex/items",
    routePrefix: "/codex/items",
    mainImageRequired: true,
    requiresAuthor: true,
    fixedFields: {
      category: "items",
    },
  },
  "codex.rune": {
    mdxDir: "content/codex/runes",
    imageDir: "public/images/codex/runes",
    routePrefix: "/codex/runes",
    mainImageRequired: true,
    requiresAuthor: true,
    fixedFields: {
      category: "runes",
    },
  },

  race: {
    mdxDir: "content/races",
    imageDir: "public/images/races",
    routePrefix: "/races",
    mainImageRequired: true,
    requiresAuthor: false,
    fixedFields: {},
  },

  "lore.character": {
    mdxDir: "content/lore/characters",
    imageDir: "public/images/lore/characters",
    routePrefix: "/lore/characters",
    mainImageRequired: true,
    requiresAuthor: false,
    fixedFields: {},
  },
  "lore.timeline": {
    mdxDir: "content/lore/timeline",
    imageDir: "public/images/lore/timeline",
    routePrefix: "/lore/timeline",
    mainImageRequired: true,
    requiresAuthor: false,
    fixedFields: {
      kind: "timeline",
    },
  },
  "lore.extra": {
    mdxDir: "content/lore/extras",
    imageDir: "public/images/lore/extras",
    routePrefix: "/lore/extras",
    mainImageRequired: true,
    requiresAuthor: false,
    fixedFields: {
      kind: "extras",
    },
  },
  "lore.legend": {
    mdxDir: "content/lore/legends-and-folklore",
    imageDir: "public/images/lore/legends-and-folklore",
    routePrefix: "/lore/legends-and-folklore",
    mainImageRequired: true,
    requiresAuthor: false,
    fixedFields: {
      kind: "legends-and-folklore",
    },
  },

  "world-information": {
    mdxDir: "content/world-information",
    imageDir: "public/images/world-information",
    routePrefix: "/world-information",
    mainImageRequired: true,
    requiresAuthor: false,
    fixedFields: {},
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

function getEntryTypeConfig(input) {
  if (input.entryType === "location.entry") {
    const fields = input.fields ?? {};
    const location = slugify(requiredString(fields.location, "fields.location"));

    return {
      mdxDir: `content/locations/${location}`,
      imageDir: `public/images/locations/${location}`,
      routePrefix: `/locations/${location}`,
      mainImageRequired: false,
      requiresAuthor: false,
      fixedFields: {},
    };
  }

  const config = staticEntryTypes[input.entryType];

  if (!config) {
    throw httpError(400, `Invalid entry type: ${input.entryType}`);
  }

  return config;
}



async function createEntry(input) {
  const entryType = getEntryTypeConfig(input);

  const title = requiredString(input.title, "title");
  const slug = slugify(input.slug || title);

  if (entryType.requiresAuthor) {
    requiredString(input.author, "author");
  }

  const imageFolder = `${entryType.imageDir}/${slug}`;
  const mdxPath = `${entryType.mdxDir}/${slug}.mdx`;

  const mainImage = input.mainImage;

  if (entryType.mainImageRequired && (!mainImage?.fileName || !mainImage?.base64)) {
    throw httpError(400, "mainImage is required.");
  }

  let mainImagePath = null;
  let publicMainImagePath = null;

  if (mainImage?.fileName && mainImage?.base64) {
    const mainImageName = sanitizeFileName(mainImage.fileName);
    mainImagePath = `${imageFolder}/${mainImageName}`;
    publicMainImagePath = stripPublic(mainImagePath);
  }

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

  const mdx = buildGenericMdx({
    input,
    config: entryType,
    title,
    slug,
    imagePath: publicMainImagePath,
  });

  const token = await getGithubToken();

  await assertFileDoesNotExist(mdxPath, token);

  const commitMessage = `feat(content): add ${title}`;

  const writtenFiles = [];

  const mdxResult = await putGithubFile({
    path: mdxPath,
    content: mdx,
    message: commitMessage,
    token,
  });

  writtenFiles.push({
    path: mdxPath,
    htmlUrl: mdxResult.content?.html_url,
    commitUrl: mdxResult.commit?.html_url,
  });

  if (mainImagePath && mainImage?.base64) {
    const mainImageResult = await putGithubFile({
      path: mainImagePath,
      contentBase64: mainImage.base64,
      message: commitMessage,
      token,
      alreadyBase64: true,
    });

    writtenFiles.push({
      path: mainImagePath,
      htmlUrl: mainImageResult.content?.html_url,
      commitUrl: mainImageResult.commit?.html_url,
    });
  }

  for (const image of extraImages) {
    if (!image.base64) continue;

    const imageResult = await putGithubFile({
      path: image.repoPath,
      contentBase64: image.base64,
      message: commitMessage,
      token,
      alreadyBase64: true,
    });

    writtenFiles.push({
      path: image.repoPath,
      htmlUrl: imageResult.content?.html_url,
      commitUrl: imageResult.commit?.html_url,
    });
  }

  return {
    ok: true,
    mdxPath,
    mainImagePath,
    writtenFiles,
    entryUrl: `${entryType.routePrefix}/${slug}`,
  };
}

function buildGenericMdx({ input, config, title, slug, imagePath }) {
  const fields = input.fields ?? {};
  const markdown = input.markdown?.trim() ?? "";

  const frontmatterLines = [];

  frontmatterLines.push(`title: ${yamlString(title)}`);
  frontmatterLines.push(`slug: ${yamlString(slug)}`);

  if (config.requiresAuthor) {
    frontmatterLines.push(`author: ${yamlString(input.author)}`);
  }

  for (const [key, value] of Object.entries(config.fixedFields ?? {})) {
    frontmatterLines.push(`${key}: ${yamlValue(value)}`);
  }

  if (imagePath) {
    frontmatterLines.push(`image: ${yamlString(imagePath)}`);
    frontmatterLines.push(
      `imageAlt: ${yamlString(input.imageAlt || title)}`,
    );
  }

  for (const [key, value] of Object.entries(fields)) {
    if (shouldSkipField(key, value, config)) continue;

    frontmatterLines.push(yamlField(key, value));
  }

  frontmatterLines.push("draft: false");

  return `---
${frontmatterLines.join("\n")}
---

# ${title}

${markdown}
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

// YAML helpers

const rawYamlFields = new Set([
  "weaknesses",
  "galleryImages",
  "abilityTree",
]);

const optionalEmptyFields = new Set([
  "href",
]);

function shouldSkipField(key, value, config) {
  if (key in (config.fixedFields ?? {})) return true;

  if (
    key === "title" ||
    key === "slug" ||
    key === "image" ||
    key === "imageAlt" ||
    key === "draft" ||
    key === "author"
  ) {
    return true;
  }

  if (value === undefined || value === null) return true;

  if (
    optionalEmptyFields.has(key) &&
    typeof value === "string" &&
    value.trim() === ""
  ) {
    return true;
  }

  return false;
}

function yamlField(key, value) {
  if (rawYamlFields.has(key)) {
    return yamlRawField(key, value);
  }

  if (Array.isArray(value)) {
    return `${key}:\n${yamlList(value)}`;
  }

  if (typeof value === "object" && value !== null) {
    return `${key}:\n${yamlObject(value, 2)}`;
  }

  return `${key}: ${yamlValue(value)}`;
}

function yamlValue(value) {
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return String(value);
  return yamlString(value);
}

function yamlObject(value, spaces = 2) {
  const indent = " ".repeat(spaces);

  return Object.entries(value)
    .map(([key, nestedValue]) => {
      if (Array.isArray(nestedValue)) {
        return `${indent}${key}:\n${yamlList(nestedValue, spaces + 2)}`;
      }

      if (typeof nestedValue === "object" && nestedValue !== null) {
        return `${indent}${key}:\n${yamlObject(nestedValue, spaces + 2)}`;
      }

      return `${indent}${key}: ${yamlValue(nestedValue)}`;
    })
    .join("\n");
}

function yamlRawField(key, value) {
  const text = String(value ?? "").trim();

  if (!text) {
    return `${key}: []`;
  }

  if (text === "[]" || text === "{}") {
    return `${key}: ${text}`;
  }

  return `${key}:\n${indentYaml(text, 2)}`;
}

function indentYaml(value, spaces = 2) {
  const indent = " ".repeat(spaces);

  return String(value)
    .split("\n")
    .map((line) => `${indent}${line}`)
    .join("\n");
}

// Utility functions


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

function yamlList(values, spaces = 2) {
  const indent = " ".repeat(spaces);

  if (!Array.isArray(values) || values.length === 0) {
    return `${indent}- None`;
  }

  return values.map((value) => `${indent}- ${yamlString(value)}`).join("\n");
}

/* function numberOrDefault(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
} */

function normalizeBase64(value) {
  return String(value).replace(/^data:[^;]+;base64,/, "");
}