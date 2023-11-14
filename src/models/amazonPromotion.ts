import * as dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
import {
  AmazonPromotionDocument,
  FixedDiscountAmazonPromotionDocument,
  MultiAmazonPromotionDocument,
  PriceBasedAmazonPromotionDocument,
  ShippingAmazonPromotionDocument,
  SpendAndGetAmazonPromotionDocument,
  XForYAmazonPromotionDocument,
  componentType,
  hierarchyItemLevelByType,
} from "../types/amazonPromoTypes";
import { purchaseType } from "../types/commonTypes";
import { createSchema } from "./productCategory";

dotenv.config();
const buyComponentSchema = new Schema({
  id: Number,
  purchaseType: {
    type: String,
    enum: Object.values(purchaseType),
  },
  quantity: Number,
  promotionPart: String,
  componentType: {
    type: String,
    enum: Object.values(componentType),
  },
  items: [
    {
      item: String,
      exclusion: {
        type: Boolean,
        default: false,
      },
      hierarchyLevel: {
        type: Number,
        validate: {
          validator: (value: number) =>
            Object.values(hierarchyItemLevelByType).includes(value),
          message: "Invalid hierarchy level",
        },
      },
      brand: {
        type: String,
        default: "",
      },
      codeField: {
        type: String,
        default: "",
      },
    },
  ],
  rewardDerivationRuleNumber: Number,
});

const ItemSchema = new Schema({
  item: String,
  exclusion: Boolean,
  hierarchyLevel: Number,
  brand: String,
});

const basicPromotionSchema = new Schema<AmazonPromotionDocument>(
  {
    promotionType: String,
    pmmId: String,
    name: String,
    description: String,
    priorityType: Number,
    components: [
      {
        purchaseType: {
          type: String,
          enum: Object.values(purchaseType),
        },
        quantity: Number,
        promotionPart: String,
        rewardDerivationRuleNumber: Number,
        items: [createSchema("products")],
        id: Number,
      },
    ],
    zones: [
      {
        effectiveFrom: Date,
        effectiveTo: Date,
        modified: Date,
      },
    ],
    actionLog: [
      {
        pmmId: String,
        enabled: Boolean,
        date: Date,
      },
    ],
    localizedDescriptions: [
      {
        pmmId: String,
        locale: String,
        shortDescription: String,
        longDescription: String,
      },
    ],
    discountType: String,
    romanceCopyApproved: Boolean,
    sourceType: {
      type: String,
      default: "MANUAL",
    },
    enabled: Boolean,
    applyType: String,
    restrictions: [String], // Assuming restrictions are strings, you can modify this based on the actual structure
    spentLimitCheck: Boolean,
    version: Number,
  },
  { collection: "promo" },
);

const MultiAmazonPromotionSchema = new Schema<MultiAmazonPromotionDocument>({
  totalRetailPrice: Number,
  buyComponent: buyComponentSchema,
}).add(basicPromotionSchema);

const PriceBasedAmazonPromotionSchema =
  new Schema<PriceBasedAmazonPromotionDocument>({
    items: [
      {
        item: String,
        exclusion: Boolean,
        hierarchyLevel: Number,
        brand: String,
      },
    ],
    discountList: [
      { discountAmount: Number, priceType: Number, priceName: String },
    ],
  }).add(basicPromotionSchema);

const FixedDiscountAmazonPromotionSchema =
  new Schema<FixedDiscountAmazonPromotionDocument>({
    discount: Number,
  }).add(basicPromotionSchema);

const ShippingAmazonPromotionSchema =
  new Schema<ShippingAmazonPromotionDocument>({
    discount: Number,
    shippingMaxDiscount: Number,
    orderThreshold: Number,
    deliveryMode: String,
    items: [ItemSchema],
  }).add(basicPromotionSchema);

const XForYAmazonPromotionSchema = new Schema<XForYAmazonPromotionDocument>({
  discount: Number,
  buyComponent: buyComponentSchema,
}).add(basicPromotionSchema);

const SpendAndGetAmazonPromotionSchema =
  new Schema<SpendAndGetAmazonPromotionDocument>({
    items: [ItemSchema],
    giftCardAmount: Number,
    giftCardExpirationDate: Date,
    giftCardDeliveryDate: Date,
  }).add(basicPromotionSchema);

const amazonDBName = process.env.AMAZON_MONGODB_DB_NAME || "test";
const db = mongoose.connection.useDb(amazonDBName);

export const AmazonPromotion = db.model(
  "AmazonPromotion",
  basicPromotionSchema,
);

export const MultiAmazonPromotion = db.model(
  "MultiAmazonPromotion",
  MultiAmazonPromotionSchema,
);

export const PriceBasedAmazonPromotion = db.model(
  "PriceBasedAmazonPromotion",
  PriceBasedAmazonPromotionSchema,
);

export const FixedDiscountAmazonPromotion = db.model(
  "FixedDiscountAmazonPromotion",
  FixedDiscountAmazonPromotionSchema,
);

export const ShippingAmazonPromotion = db.model(
  "ShippingAmazonPromotion",
  ShippingAmazonPromotionSchema,
);

export const XForYAmazonPromotion = db.model(
  "XForYAmazonPromotion",
  XForYAmazonPromotionSchema,
);

export const SpendAndGetAmazonPromotion = db.model(
  "SpendAndGetAmazonPromotion",
  SpendAndGetAmazonPromotionSchema,
);
