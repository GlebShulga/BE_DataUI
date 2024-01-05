"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpendAndGetAmazonPromotion = exports.XForYAmazonPromotion = exports.ShippingAmazonPromotion = exports.FixedDiscountAmazonPromotion = exports.PriceBasedAmazonPromotion = exports.MultiAmazonPromotion = exports.AmazonPromotion = void 0;
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importStar(require("mongoose"));
const amazonPromoTypes_1 = require("../types/amazonPromoTypes");
const commonTypes_1 = require("../types/commonTypes");
const productCategory_1 = require("./productCategory");
dotenv.config();
const buyComponentSchema = new mongoose_1.Schema({
    id: Number,
    purchaseType: {
        type: String,
        enum: Object.values(commonTypes_1.purchaseType),
    },
    quantity: Number,
    promotionPart: String,
    componentType: {
        type: String,
        enum: Object.values(amazonPromoTypes_1.componentType),
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
                    validator: (value) => Object.values(amazonPromoTypes_1.hierarchyItemLevelByType).includes(value),
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
const ItemSchema = new mongoose_1.Schema({
    item: String,
    exclusion: Boolean,
    hierarchyLevel: Number,
    brand: String,
});
const basicPromotionSchema = new mongoose_1.Schema({
    promotionType: String,
    pmmId: String,
    name: String,
    description: String,
    priorityType: Number,
    components: [
        {
            purchaseType: {
                type: String,
                enum: Object.values(commonTypes_1.purchaseType),
            },
            quantity: Number,
            promotionPart: String,
            rewardDerivationRuleNumber: Number,
            items: [(0, productCategory_1.createSchema)("products")],
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
}, { collection: "promo" });
const MultiAmazonPromotionSchema = new mongoose_1.Schema({
    totalRetailPrice: Number,
    buyComponent: buyComponentSchema,
}).add(basicPromotionSchema);
const PriceBasedAmazonPromotionSchema = new mongoose_1.Schema({
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
const FixedDiscountAmazonPromotionSchema = new mongoose_1.Schema({
    discount: Number,
}).add(basicPromotionSchema);
const ShippingAmazonPromotionSchema = new mongoose_1.Schema({
    discount: Number,
    shippingMaxDiscount: Number,
    orderThreshold: Number,
    deliveryMode: String,
    items: [ItemSchema],
}).add(basicPromotionSchema);
const XForYAmazonPromotionSchema = new mongoose_1.Schema({
    discount: Number,
    buyComponent: buyComponentSchema,
}).add(basicPromotionSchema);
const SpendAndGetAmazonPromotionSchema = new mongoose_1.Schema({
    items: [ItemSchema],
    giftCardAmount: Number,
    giftCardExpirationDate: Date,
    giftCardDeliveryDate: Date,
}).add(basicPromotionSchema);
const amazonDBName = process.env.AMAZON_MONGODB_DB_NAME || "test";
const db = mongoose_1.default.connection.useDb(amazonDBName);
exports.AmazonPromotion = db.model("AmazonPromotion", basicPromotionSchema);
exports.MultiAmazonPromotion = db.model("MultiAmazonPromotion", MultiAmazonPromotionSchema);
exports.PriceBasedAmazonPromotion = db.model("PriceBasedAmazonPromotion", PriceBasedAmazonPromotionSchema);
exports.FixedDiscountAmazonPromotion = db.model("FixedDiscountAmazonPromotion", FixedDiscountAmazonPromotionSchema);
exports.ShippingAmazonPromotion = db.model("ShippingAmazonPromotion", ShippingAmazonPromotionSchema);
exports.XForYAmazonPromotion = db.model("XForYAmazonPromotion", XForYAmazonPromotionSchema);
exports.SpendAndGetAmazonPromotion = db.model("SpendAndGetAmazonPromotion", SpendAndGetAmazonPromotionSchema);
