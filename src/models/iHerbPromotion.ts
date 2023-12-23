import * as dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
import {
  FreeShippingIHerbPromotionDocument,
  IHerbPromotionDocument,
  ItemRewardIHerbPromotionDocument,
  PriceBasedIHerbPromotionDocument,
} from "../types/iHerbPromoTypes";

dotenv.config();

const IHerbPriceBasedDiscountSchema = new Schema({
  priceType: Number,
  discount: Number,
  discountType: String,
});

const basicPromotionSchema: Schema = new Schema<IHerbPromotionDocument>(
  {
    pmmId: String,
    name: String,
    description: String,
    components: [
      {
        _id: false,
        purchaseType: String,
        quantity: Number,
        spendAmount: Number,
        promotionPart: String,
        modificationAmount: Number,
        modificationType: String,
        items: [String],
      },
    ],
    localizedPromotionDetails: [
      {
        pmmId: String,
        shortDescription: String,
        longDescription: String,
        locale: String,
      },
    ],
    zones: [
      {
        effectiveFrom: Date,
        effectiveTo: Date,
        modified: Date,
      },
    ],
    promotionVouchers: [String],
    stackable: Boolean,
    enabled: Boolean,
    sourceType: String,
  },
  { collection: "promo" },
);

const ItemRewardIHerbPromotionSchema =
  new Schema<ItemRewardIHerbPromotionDocument>({
    barcodes: [String],
    spendAmount: String,
    quantityThreshold: Number,
    freeShippingIncluded: Boolean,
  }).add(basicPromotionSchema);

const PriceBasedIHerbPromotionSchema =
  new Schema<PriceBasedIHerbPromotionDocument>({
    discounts: [IHerbPriceBasedDiscountSchema],
  }).add(basicPromotionSchema);

const FreeShippingIHerbPromotionSchema =
  new Schema<FreeShippingIHerbPromotionDocument>({
    modificationAmount: Number,
    spendAmount: String,
    quantityThreshold: Number,
  }).add(basicPromotionSchema);

const iHerbDBName = process.env.IHERB_MONGODB_DB_NAME || "test";

const db = mongoose.connection.useDb(iHerbDBName);
export const IHerbPromotion = db.model("IHerbPromotion", basicPromotionSchema);

export const ItemRewardIHerbPromotion = db.model(
  "ItemRewardIHerbPromotion",
  ItemRewardIHerbPromotionSchema,
);

export const PriceBasedIHerbPromotion = db.model(
  "PriceBasedIHerbPromotion",
  PriceBasedIHerbPromotionSchema,
);

export const FreeShippingIHerbPromotion = db.model(
  "FreeShippingIHerbPromotion",
  FreeShippingIHerbPromotionSchema,
);
