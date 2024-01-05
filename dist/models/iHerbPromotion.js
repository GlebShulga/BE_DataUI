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
exports.FreeShippingIHerbPromotion = exports.PriceBasedIHerbPromotion = exports.ItemRewardIHerbPromotion = exports.IHerbPromotion = void 0;
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importStar(require("mongoose"));
dotenv.config();
const IHerbPriceBasedDiscountSchema = new mongoose_1.Schema({
    priceType: Number,
    discount: Number,
    discountType: String,
});
const basicPromotionSchema = new mongoose_1.Schema({
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
}, { collection: "promo" });
const ItemRewardIHerbPromotionSchema = new mongoose_1.Schema({
    barcodes: [String],
    spendAmount: String,
    quantityThreshold: Number,
    freeShippingIncluded: Boolean,
}).add(basicPromotionSchema);
const PriceBasedIHerbPromotionSchema = new mongoose_1.Schema({
    discounts: [IHerbPriceBasedDiscountSchema],
}).add(basicPromotionSchema);
const FreeShippingIHerbPromotionSchema = new mongoose_1.Schema({
    modificationAmount: Number,
    spendAmount: String,
    quantityThreshold: Number,
}).add(basicPromotionSchema);
const iHerbDBName = process.env.IHERB_MONGODB_DB_NAME || "test";
const db = mongoose_1.default.connection.useDb(iHerbDBName);
exports.IHerbPromotion = db.model("IHerbPromotion", basicPromotionSchema);
exports.ItemRewardIHerbPromotion = db.model("ItemRewardIHerbPromotion", ItemRewardIHerbPromotionSchema);
exports.PriceBasedIHerbPromotion = db.model("PriceBasedIHerbPromotion", PriceBasedIHerbPromotionSchema);
exports.FreeShippingIHerbPromotion = db.model("FreeShippingIHerbPromotion", FreeShippingIHerbPromotionSchema);
