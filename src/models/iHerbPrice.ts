import mongoose, { Schema } from "mongoose";
import { IHerbPriceDocument } from "../types/iHerbPriceTypes";
import { localizedDescriptionSchema } from "./amazonVoucher";

const IHerbPriceSchema = new Schema<IHerbPriceDocument>(
  {
    priceEventId: { type: Number, required: true },
    priceEventDescription: { type: String, required: true },
    priceTypeDto: { type: String, required: false },
    effectiveFrom: { type: Date, required: true },
    effectiveTo: { type: Date, required: true },
    descriptions: [localizedDescriptionSchema],
    modified: { type: String, required: false },
  },
  { collection: "price" },
);

const iHerbDBName = process.env.IHERB_MONGODB_DB_NAME || "test";

const db = mongoose.connection.useDb(iHerbDBName);

export const IHerbPrice = db.model("IHerbPrice", IHerbPriceSchema);