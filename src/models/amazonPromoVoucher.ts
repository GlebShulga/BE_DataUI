import * as dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
import { IVoucherCode, IVoucherCodeDocument } from "../types/amazonPromoTypes";

dotenv.config();

const VoucherCodeSchema = new Schema<IVoucherCodeDocument>(
  {
    voucherId: { type: Number, required: true },
    code: { type: String, required: true },
    dateTimeGenerated: { type: String },
    quantityRedeemableVouchers: { type: Number },
    redemptionsPerCart: { type: Number },
    generationDate: { type: String },
    used: { type: Boolean, default: false },
  },
  { collection: "voucherCode" },
);

const amazonDBName = process.env.AMAZON_MONGODB_DB_NAME || "test";
const db = mongoose.connection.useDb(amazonDBName);

export const AmazonPromoVoucherCode = db.model(
  "VoucherCode",
  VoucherCodeSchema,
);
