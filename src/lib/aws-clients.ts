// src/lib/aws-clients.ts

import "server-only";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_REGION = process.env.AWS_REGION ?? "us-east-2";

export const dynamoClient = new DynamoDBClient({
  region: AWS_REGION,
});

export const dynamoDocumentClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

export const s3Client = new S3Client({
  region: AWS_REGION,
});