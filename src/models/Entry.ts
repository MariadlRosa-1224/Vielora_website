// src/models/Entry.ts

import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { entryStatuses } from "@/lib/entries-types";

//Entradas enviadas a ser aprobadas
const EntryImageAssetSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    publicPath: {
      type: String,
      default: "",
      trim: true,
    },

    storagePath: {
      type: String,
      default: "",
      trim: true,
    },

    mimeType: {
      type: String,
      default: "",
      trim: true,
    },

    sizeBytes: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const PublishedFileSchema = new Schema(
  {
    path: {
      type: String,
      required: true,
      trim: true,
    },

    htmlUrl: {
      type: String,
      default: "",
      trim: true,
    },

    commitUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const EntrySchema = new Schema(
  {
    entryType: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    authorId: {
      type: String,
      required: true,
      index: true,
    },

    authorName: {
      type: String,
      required: true,
      trim: true,
    },

    authorEmail: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    status: {
      type: String,
      enum: entryStatuses,
      default: "pending",
      required: true,
      index: true,
    },

    fields: {
      type: Schema.Types.Mixed,
      default: {},
    },

    markdown: {
      type: String,
      default: "",
    },

    imageAlt: {
      type: String,
      default: "",
      trim: true,
    },

    mainImage: {
      type: EntryImageAssetSchema,
      default: null,
    },

    markdownImages: {
      type: [EntryImageAssetSchema],
      default: [],
    },

    reviewerId: {
      type: String,
      default: "",
      index: true,
    },

    reviewerName: {
      type: String,
      default: "",
      trim: true,
    },

    reviewMessage: {
      type: String,
      default: "",
    },

    publishedFiles: {
      type: [PublishedFileSchema],
      default: [],
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

EntrySchema.index({
  authorId: 1,
  status: 1,
});

EntrySchema.index({
  entryType: 1,
  status: 1,
});

EntrySchema.index({
  entryType: 1,
  slug: 1,
});

export type EntryDocument = InferSchemaType<typeof EntrySchema>;

const EntryModel =
  mongoose.models.Entry || mongoose.model("Entry", EntrySchema);

export default EntryModel;