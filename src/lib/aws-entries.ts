// src/lib/aws-entries.ts

import "server-only";

import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
  type NativeAttributeValue,
} from "@aws-sdk/lib-dynamodb";
import { dynamoDocumentClient } from "@/lib/aws-clients";
import type { EntryRecord, EntryStatus } from "@/lib/entries-types";

const ENTRIES_TABLE_NAME = process.env.VIELORA_ENTRIES_TABLE_NAME;

if (!ENTRIES_TABLE_NAME) {
  throw new Error("VIELORA_ENTRIES_TABLE_NAME is missing.");
}

type EntryDbItem = EntryRecord & {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;
};

export type UpdateEntryEditableFieldsInput = {
  entryId: string;
  title?: string;
  slug?: string;
  contentFolder?: string;
  imageFolder?: string;
  fixedFields?: EntryRecord["fixedFields"];
  fields?: EntryRecord["fields"];
  markdown?: string;
  imageAlt?: string;
  mainImage?: EntryRecord["mainImage"];
  galleryImages?: EntryRecord["galleryImages"];
  publishedFilesToDelete?: EntryRecord["publishedFilesToDelete"];
};

function entryPk(entryId: string) {
  return `ENTRY#${entryId}`;
}

function metadataSk() {
  return "METADATA";
}

function authorPk(authorId: string) {
  return `AUTHOR#${authorId}`;
}

function statusPk(status: EntryStatus) {
  return `STATUS#${status}`;
}

function toDbItem(entry: EntryRecord): EntryDbItem {
  return {
    ...entry,
    PK: entryPk(entry.entryId),
    SK: metadataSk(),
    GSI1PK: authorPk(entry.authorId),
    GSI1SK: entry.updatedAt,
    GSI2PK: statusPk(entry.status),
    GSI2SK: entry.updatedAt,
  };
}

function fromDbItem(item: EntryDbItem | undefined): EntryRecord | null {
  if (!item) return null;

  const {
    PK,
    SK,
    GSI1PK,
    GSI1SK,
    GSI2PK,
    GSI2SK,
    ...entry
  } = item;

  return entry;
}

export async function putEntry(entry: EntryRecord) {
  await dynamoDocumentClient.send(
    new PutCommand({
      TableName: ENTRIES_TABLE_NAME,
      Item: toDbItem(entry),
      ConditionExpression: "attribute_not_exists(PK)",
    }),
  );

  return entry;
}

export async function getEntryById(entryId: string) {
  const result = await dynamoDocumentClient.send(
    new GetCommand({
      TableName: ENTRIES_TABLE_NAME,
      Key: {
        PK: entryPk(entryId),
        SK: metadataSk(),
      },
    }),
  );

  return fromDbItem(result.Item as EntryDbItem | undefined);
}

type DynamoLastEvaluatedKey = Record<string, NativeAttributeValue> | undefined;

export async function listEntriesForAuthor(authorId: string) {
  const items: EntryRecord[] = [];
  let exclusiveStartKey: DynamoLastEvaluatedKey;

  do {
    const result = await dynamoDocumentClient.send(
      new QueryCommand({
        TableName: ENTRIES_TABLE_NAME,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :authorPk",
        ExpressionAttributeValues: {
          ":authorPk": authorPk(authorId),
        },
        ScanIndexForward: false,
        ExclusiveStartKey: exclusiveStartKey,
      }),
    );

    items.push(
      ...(result.Items ?? [])
        .map((item) => fromDbItem(item as EntryDbItem))
        .filter((entry): entry is EntryRecord => Boolean(entry)),
    );

    exclusiveStartKey = result.LastEvaluatedKey;
  } while (exclusiveStartKey);

  return items;
}

// List entries by status, sorted by updatedAt descending
export async function listEntriesByStatus(status: EntryStatus) {
  const items: EntryRecord[] = [];
  let exclusiveStartKey: DynamoLastEvaluatedKey;

  do {
    const result = await dynamoDocumentClient.send(
      new QueryCommand({
        TableName: ENTRIES_TABLE_NAME,
        IndexName: "GSI2",
        KeyConditionExpression: "GSI2PK = :statusPk",
        ExpressionAttributeValues: {
          ":statusPk": statusPk(status),
        },
        ScanIndexForward: false,
        ExclusiveStartKey: exclusiveStartKey,
      }),
    );

    items.push(
      ...(result.Items ?? [])
        .map((item) => fromDbItem(item as EntryDbItem))
        .filter((entry): entry is EntryRecord => Boolean(entry)),
    );

    exclusiveStartKey = result.LastEvaluatedKey;
  } while (exclusiveStartKey);

  return items;
}

export async function listAllEntries() {
  const items: EntryRecord[] = [];
  let exclusiveStartKey: DynamoLastEvaluatedKey;

  do {
    const result = await dynamoDocumentClient.send(
      new ScanCommand({
        TableName: ENTRIES_TABLE_NAME,
        ExclusiveStartKey: exclusiveStartKey,
      }),
    );

    items.push(
      ...(result.Items ?? [])
        .map((item) => fromDbItem(item as EntryDbItem))
        .filter((entry): entry is EntryRecord => Boolean(entry)),
    );

    exclusiveStartKey = result.LastEvaluatedKey;
  } while (exclusiveStartKey);

  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function updateEntryStatus({
  entryId,
  status,
  reviewerId,
  reviewerName,
  reviewMessage,
}: {
  entryId: string;
  status: EntryStatus;
  reviewerId?: string;
  reviewerName?: string;
  reviewMessage?: string;
}) {
  const currentEntry = await getEntryById(entryId);

  if (!currentEntry) {
    return null;
  }

  const updatedAt = new Date().toISOString();

  const result = await dynamoDocumentClient.send(
    new UpdateCommand({
      TableName: ENTRIES_TABLE_NAME,
      Key: {
        PK: entryPk(entryId),
        SK: metadataSk(),
      },
      UpdateExpression: [
        "SET #status = :status",
        "updatedAt = :updatedAt",
        "GSI2PK = :gsi2pk",
        "GSI2SK = :gsi2sk",
        "reviewerId = :reviewerId",
        "reviewerName = :reviewerName",
        "reviewMessage = :reviewMessage",
        "reviewedAt = :reviewedAt",
      ].join(", "),
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": status,
        ":updatedAt": updatedAt,
        ":gsi2pk": statusPk(status),
        ":gsi2sk": updatedAt,
        ":reviewerId": reviewerId ?? "",
        ":reviewerName": reviewerName ?? "",
        ":reviewMessage": reviewMessage ?? "",
        ":reviewedAt": updatedAt,
      },
      ReturnValues: "ALL_NEW",
    }),
  );

  return fromDbItem(result.Attributes as EntryDbItem | undefined);
}

export async function deleteEntry(entryId: string) {
  await dynamoDocumentClient.send(
    new DeleteCommand({
      TableName: ENTRIES_TABLE_NAME,
      Key: {
        PK: entryPk(entryId),
        SK: metadataSk(),
      },
    }),
  );
}

// Update editable fields of an entry
export async function updateEntryEditableFields({
  entryId,
  title,
  slug,
  contentFolder,
  imageFolder,
  fixedFields,
  fields,
  markdown,
  imageAlt,
  mainImage,
  galleryImages,
  publishedFilesToDelete,
}: UpdateEntryEditableFieldsInput) {
  const currentEntry = await getEntryById(entryId);

  if (!currentEntry) {
    return null;
  }

  const updatedAt = new Date().toISOString();

  const updateExpressions = [
    "updatedAt = :updatedAt",
    "GSI1SK = :updatedAt",
    "GSI2SK = :updatedAt",
  ];

  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {
    ":updatedAt": updatedAt,
  };

  function setField(fieldName: string, value: unknown) {
    if (value === undefined) return;

    const nameKey = `#${fieldName}`;
    const valueKey = `:${fieldName}`;

    expressionAttributeNames[nameKey] = fieldName;
    expressionAttributeValues[valueKey] = value;
    updateExpressions.push(`${nameKey} = ${valueKey}`);
  }

  setField("title", title);
  setField("slug", slug);
  setField("contentFolder", contentFolder);
  setField("imageFolder", imageFolder);
  setField("fixedFields", fixedFields);
  setField("fields", fields);
  setField("markdown", markdown);
  setField("imageAlt", imageAlt);
  setField("mainImage", mainImage);
  setField("galleryImages", galleryImages);
setField("publishedFilesToDelete", publishedFilesToDelete);

  const shouldReturnToPending =
    currentEntry.status === "rejected" ||
    currentEntry.status === "edit-requested" ||
    currentEntry.status === "approved" ||
    currentEntry.status === "published";

  if (shouldReturnToPending) {
    expressionAttributeNames["#status"] = "status";

    expressionAttributeValues[":status"] = "pending";
    expressionAttributeValues[":gsi2pk"] = statusPk("pending");
    expressionAttributeValues[":empty"] = "";

    updateExpressions.push("#status = :status");
    updateExpressions.push("GSI2PK = :gsi2pk");
    updateExpressions.push("submittedAt = :updatedAt");

    updateExpressions.push("reviewerId = :empty");
    updateExpressions.push("reviewerName = :empty");
    updateExpressions.push("reviewMessage = :empty");
    updateExpressions.push("reviewedAt = :empty");

    updateExpressions.push("editRequestMessage = :empty");
    updateExpressions.push("editRequestedAt = :empty");
  }

  const result = await dynamoDocumentClient.send(
    new UpdateCommand({
      TableName: ENTRIES_TABLE_NAME,
      Key: {
        PK: entryPk(entryId),
        SK: metadataSk(),
      },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames:
        Object.keys(expressionAttributeNames).length > 0
          ? expressionAttributeNames
          : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    }),
  );

  return fromDbItem(result.Attributes as EntryDbItem | undefined);
}

export async function requestEntryEdit({
  entryId,
  editRequestMessage,
}: {
  entryId: string;
  editRequestMessage?: string;
}) {
  const currentEntry = await getEntryById(entryId);

  if (!currentEntry) {
    return null;
  }

  const updatedAt = new Date().toISOString();

  const result = await dynamoDocumentClient.send(
    new UpdateCommand({
      TableName: ENTRIES_TABLE_NAME,
      Key: {
        PK: entryPk(entryId),
        SK: metadataSk(),
      },
      UpdateExpression: [
        "SET #status = :status",
        "updatedAt = :updatedAt",
        "GSI2PK = :gsi2pk",
        "GSI2SK = :gsi2sk",
        "editRequestMessage = :editRequestMessage",
        "editRequestedAt = :editRequestedAt",
      ].join(", "),
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": "edit-requested",
        ":updatedAt": updatedAt,
        ":gsi2pk": statusPk("edit-requested"),
        ":gsi2sk": updatedAt,
        ":editRequestMessage": editRequestMessage ?? "",
        ":editRequestedAt": updatedAt,
      },
      ReturnValues: "ALL_NEW",
    }),
  );

  return fromDbItem(result.Attributes as EntryDbItem | undefined);
}

export async function markEntryPublished({
  entryId,
  reviewerId,
  reviewerName,
  reviewMessage,
  publishedFiles,
}: {
  entryId: string;
  reviewerId: string;
  reviewerName: string;
  reviewMessage?: string;
  publishedFiles: EntryRecord["publishedFiles"];
}) {
  const currentEntry = await getEntryById(entryId);

  if (!currentEntry) {
    return null;
  }

  const updatedAt = new Date().toISOString();

  const result = await dynamoDocumentClient.send(
    new UpdateCommand({
      TableName: ENTRIES_TABLE_NAME,
      Key: {
        PK: entryPk(entryId),
        SK: metadataSk(),
      },
      UpdateExpression: [
        "SET #status = :status",
        "updatedAt = :updatedAt",
        "GSI2PK = :gsi2pk",
        "GSI2SK = :gsi2sk",
        "reviewerId = :reviewerId",
        "reviewerName = :reviewerName",
        "reviewMessage = :reviewMessage",
        "reviewedAt = :reviewedAt",
        "publishedAt = :publishedAt",
        "publishedFiles = :publishedFiles",
      ].join(", "),
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": "published",
        ":updatedAt": updatedAt,
        ":gsi2pk": statusPk("published"),
        ":gsi2sk": updatedAt,
        ":reviewerId": reviewerId,
        ":reviewerName": reviewerName,
        ":reviewMessage": reviewMessage ?? "",
        ":reviewedAt": updatedAt,
        ":publishedAt": updatedAt,
        ":publishedFiles": publishedFiles ?? [],
      },
      ReturnValues: "ALL_NEW",
    }),
  );

  return fromDbItem(result.Attributes as EntryDbItem | undefined);
}