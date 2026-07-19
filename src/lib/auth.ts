// src/lib/auth.ts

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

type CognitoUserInfo = {
  sub: string;
  username?: string;
  name?: string;
  email: string;
  picture?: string;
  email_verified?: string | boolean;
  "custom:role"?: string;
};

const baseURL = requireEnv("BETTER_AUTH_URL").replace(/\/+$/, "");

const trustedOrigins = (
  process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? baseURL
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const mongodbUri = requireEnv("MONGODB_URI");
const mongodbDatabaseName = requireEnv("MONGODB_DB_NAME");

const cognitoDomain = requireEnv("COGNITO_DOMAIN")
  .replace(/^https?:\/\//, "")
  .replace(/\/+$/, "");

const cognitoRegion =
  process.env.COGNITO_REGION?.trim() ||
  requireEnv("AWS_REGION");

declare global {
  // Evita crear múltiples clientes durante hot reload en desarrollo.
  // eslint-disable-next-line no-var
  var __vieloraMongoClient: MongoClient | undefined;
}

const mongoClient =
  globalThis.__vieloraMongoClient ??
  new MongoClient(mongodbUri);

if (process.env.NODE_ENV !== "production") {
  globalThis.__vieloraMongoClient = mongoClient;
}

const db = mongoClient.db(mongodbDatabaseName);

export const auth = betterAuth({
  appName: "Isles of Vielora",

  baseURL,

  secret: requireEnv("BETTER_AUTH_SECRET"),

  trustedOrigins,

  database: mongodbAdapter(db, {}),

  user: {
    additionalFields: {
      sub: {
        type: "string",
        required: true,
      },
      username: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        required: true,
        default: "user",
      },
    },
  },

  socialProviders: {
    cognito: {
      clientId: requireEnv("COGNITO_CLIENT_ID"),
      clientSecret: requireEnv("COGNITO_CLIENT_SECRET"),
      domain: cognitoDomain,
      region: cognitoRegion,
      userPoolId: requireEnv("COGNITO_USER_POOL_ID"),

      // La propiedad correcta es "scope", en singular.
      scope: [
        "openid",
        "profile",
        "email",
        "aws.cognito.signin.user.admin",
      ],

      getUserInfo: async (token) => {
        const response = await fetch(
          `https://${cognitoDomain}/oauth2/userInfo`,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch Cognito user info: ${response.status}`,
          );
        }

        const userInfo =
          (await response.json()) as CognitoUserInfo;

        const username =
          userInfo.username ??
          userInfo.email;

        return {
          user: {
            id: userInfo.sub,
            sub: userInfo.sub,

            name:
              userInfo.name ??
              username,

            username,
            email: userInfo.email,

            // Better Auth utiliza "image", no "picture".
            image: userInfo.picture,

            emailVerified:
              userInfo.email_verified === true ||
              userInfo.email_verified === "true",

            role:
              userInfo["custom:role"] ??
              "user",
          },
          data: userInfo,
        };
      },
    },
  },
});