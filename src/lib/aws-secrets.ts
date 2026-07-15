// src/lib/aws-secrets.ts

import "server-only";

import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

const AWS_REGION = process.env.AWS_REGION ?? "us-east-2";

const secretsClient = new SecretsManagerClient({
  region: AWS_REGION,
});

const secretCache = new Map<string, string>();

export async function getSecretString(secretId: string) {
  const cachedSecret = secretCache.get(secretId);

  if (cachedSecret) {
    return cachedSecret;
  }

  const response = await secretsClient.send(
    new GetSecretValueCommand({
      SecretId: secretId,
    }),
  );

  if (!response.SecretString) {
    throw new Error(`Secret ${secretId} does not contain SecretString.`);
  }

  secretCache.set(secretId, response.SecretString);

  return response.SecretString;
}

export async function getGithubTokenFromSecret() {
  const secretId = process.env.GITHUB_TOKEN_SECRET_ID;

  if (!secretId) {
    throw new Error("GITHUB_TOKEN_SECRET_ID is missing.");
  }

  const secretString = await getSecretString(secretId);

  try {
    const parsed = JSON.parse(secretString) as Record<string, unknown>;

    const token =
      parsed.GITHUB_TOKEN ??
      parsed.github_token ??
      parsed.token ??
      parsed.githubToken;

    if (typeof token === "string" && token.trim()) {
      return token.trim();
    }
  } catch {
    // Secret is probably plain text.
  }

  return secretString.trim();
}