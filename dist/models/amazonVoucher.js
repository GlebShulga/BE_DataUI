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
exports.SerialAmazonVoucher = exports.CustomAmazonVoucher = exports.PromotionalAmazonVoucher = exports.AmazonVoucher = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const commonTypes_1 = require("../types/commonTypes");
const localizedDescriptionSchema = new mongoose_1.Schema({
    locale: {
        type: String,
        enum: Object.values(commonTypes_1.LOCALE),
        required: true,
    },
    shortDescription: String,
    longDescription: String,
});
const amazonVoucherSchema = new mongoose_1.Schema({
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
        enum: Object.values(commonTypes_1.discountType),
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
}, { collection: "voucher" });
const PromotionalVoucherSchema = new mongoose_1.Schema({
    redemptionsPerCart: Number,
    codePrefix: String,
    code: String,
}).add(amazonVoucherSchema);
const CustomVoucherSchema = new mongoose_1.Schema({
    redemptionsPerCart: Number,
    code: String,
}).add(amazonVoucherSchema);
const SerialVoucherSchema = new mongoose_1.Schema({
    redemptionsPerCart: Number,
    code: String,
    durationInDays: mongoose_1.Schema.Types.Mixed,
}).add(amazonVoucherSchema);
const amazonDBName = process.env.AMAZON_MONGODB_DB_NAME || "test";
const db = mongoose_1.default.connection.useDb(amazonDBName);
exports.AmazonVoucher = db.model("AmazonVoucher", amazonVoucherSchema);
exports.PromotionalAmazonVoucher = db.model("PromotionalAmazonVoucher", PromotionalVoucherSchema);
exports.CustomAmazonVoucher = db.model("CustomAmazonVoucher", CustomVoucherSchema);
exports.SerialAmazonVoucher = db.model("SerialAmazonVoucher", SerialVoucherSchema);
