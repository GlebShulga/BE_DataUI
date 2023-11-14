import mongoose, { Schema } from "mongoose";

import { LOCALE, discountType } from "../types/commonTypes";
import {
  AmazonVoucherDocument,
  PromotionalAmazonVoucherDocument,
  SerialAmazonVoucherDocument,
} from "../types/amazonVoucherTypes";

export const localizedDescriptionSchema = new Schema({
  locale: {
    type: String,
    enum: Object.values(LOCALE),
    required: true,
  },
  shortDescription: String,
  longDescription: String,
});

const amazonVoucherSchema = new Schema<AmazonVoucherDocument>(
  {
    voucherName: {
      type: String,
      required: true,
    },
    localizedDescriptions: {
      type: [localizedDescriptionSchema],
      required: true,
    },
    effectiveFrom: String,
    effectiveTo: String,
    enabled: {
      type: Boolean,
      required: true,
    },
    discountType: {
      type: String,
      enum: Object.values(discountType),
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    quantityRedeemableVouchers: {
      type: Number,
      required: true,
    },
    voucherType: {
      type: String,
      enum: ["PROMOTIONAL", "CUSTOM", "SERIAL"],
    },
    id: Number,
  },
  { collection: "voucher" },
);

const PromotionalVoucherSchema = new Schema<PromotionalAmazonVoucherDocument>({
  redemptionsPerCart: Number,
  codePrefix: String,
  code: String,
}).add(amazonVoucherSchema);

const CustomVoucherSchema = new Schema<PromotionalAmazonVoucherDocument>({
  redemptionsPerCart: Number,
  code: String,
}).add(amazonVoucherSchema);

const SerialVoucherSchema = new Schema<SerialAmazonVoucherDocument>({
  redemptionsPerCart: Number,
  code: String,
  durationInDays: Schema.Types.Mixed,
}).add(amazonVoucherSchema);

const amazonDBName = process.env.AMAZON_MONGODB_DB_NAME || "test";
const db = mongoose.connection.useDb(amazonDBName);

export const AmazonVoucher = db.model("AmazonVoucher", amazonVoucherSchema);
export const PromotionalAmazonVoucher = db.model(
  "PromotionalAmazonVoucher",
  PromotionalVoucherSchema,
);
export const CustomAmazonVoucher = db.model(
  "CustomAmazonVoucher",
  CustomVoucherSchema,
);
export const SerialAmazonVoucher = db.model(
  "SerialAmazonVoucher",
  SerialVoucherSchema,
);
