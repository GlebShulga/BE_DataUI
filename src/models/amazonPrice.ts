import mongoose, { Schema } from "mongoose";
import { AmazonPriceDocument } from "../types/amazonPriceTypes";
import { localizedDescriptionSchema } from "./amazonVoucher";

const amazonPriceSchema = new Schema<AmazonPriceDocument>(
  {
    id: { type: Number, required: true },
    productId: { type: String, required: false },
    eventId: { type: Number, required: false },
    level: { type: Number, required: false },
    eventDescription: { type: String, required: false },
    value: { type: Number, required: false },
    effectiveFrom: { type: Date, required: false },
    effectiveTo: { type: Date, required: false },
    typePriority: { type: Number, required: false },
    typeName: { type: String, required: false },
    status: { type: String, required: false },
    temporary: { type: Boolean, required: false },
    localizedDescriptions: [localizedDescriptionSchema],
    onlineOnly: { type: Boolean, required: true },
    romanceCopyApproved: { type: Boolean, required: true },
    productName: { type: String, required: false },
  },
  { collection: "price" },
);

const amazonDBName = process.env.AMAZON_MONGODB_DB_NAME || "test";
const db = mongoose.connection.useDb(amazonDBName);

export const AmazonPrice = db.model("AmazonPrice", amazonPriceSchema);
