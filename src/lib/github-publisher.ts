// src/lib/github-publisher.ts

import "server-only";

import { getGithubTokenFromSecret } from "@/lib/aws-secrets";

const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "main";

if (!GITHUB_OWNER) {
  throw new Error("GITHUB_OWNER is missing.");
}

if (!GITHUB_REPO) {
  throw new Error("GITHUB_REPO is missing.");
}

type GithubContentResponse = {
  content?: {
    path?: string;
    html_url?: string;
    sha?: string;
  };
  commit?: {
    html_url?: string;
  };
};

function encodeRepoPath(path: string) {
  return path
    .replace(/^\/+/, "")
    .split("/")
    .map(encodeURIComponent)
    .join("/");
}

function githubContentsUrl(path: string) {
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeRepoPath(path)}`;
}

async function getGithubHeaders(extraHeaders: HeadersInit = {}) {
  const token = await getGithubTokenFromSecret();

  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    ...extraHeaders,
  };
}

async function githubRequest<T>(url: string, init: RequestInit = {}) {
  const response = await fetch(url, {
    ...init,
    headers: await getGithubHeaders(init.headers ?? {}),
  });

  const text = await response.text();

  let body: unknown = {};

  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = {
      message: text,
    };
  }

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : `GitHub request failed with status ${response.status}.`;

    throw new Error(message);
  }

  return body as T;
}

async function getExistingFileSha(path: string) {
  const cleanPath = path.replace(/^\/+/, "");
  const url = `${githubContentsUrl(cleanPath)}?ref=${encodeURIComponent(
    GITHUB_BRANCH,
  )}`;

  const response = await fetch(url, {
    headers: await getGithubHeaders(),
  });

  if (response.status === 404) {
    return undefined;
  }

  const body = (await response.json().catch(() => ({}))) as {
    sha?: string;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(body.message ?? "Could not check existing GitHub file.");
  }

  return body.sha;
}

export async function putGithubFile({
  path,
  contentBase64,
  message,
}: {
  path: string;
  contentBase64: string;
  message: string;
}) {
  const cleanPath = path.replace(/^\/+/, "");
  const sha = await getExistingFileSha(cleanPath);

  const body: {
    message: string;
    content: string;
    branch: string;
    sha?: string;
  } = {
    message,
    content: contentBase64,
    branch: GITHUB_BRANCH,
  };

  if (sha) {
    body.sha = sha;
  }

  return githubRequest<GithubContentResponse>(githubContentsUrl(cleanPath), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function deleteGithubFile({
  path,
  message,
}: {
  path: string;
  message: string;
}) {
  const cleanPath = path.replace(/^\/+/, "");
  const sha = await getExistingFileSha(cleanPath);

  if (!sha) {
    return null;
  }

  return githubRequest<GithubContentResponse>(githubContentsUrl(cleanPath), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      sha,
      branch: GITHUB_BRANCH,
    }),
  });
}