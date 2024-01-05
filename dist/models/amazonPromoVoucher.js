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
exports.AmazonPromoVoucherCode = void 0;
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importStar(require("mongoose"));
dotenv.config();
const VoucherCodeSchema = new mongoose_1.Schema({
    voucherId: { type: Number, required: true },
    code: { type: String, required: true },
    dateTimeGenerated: { type: String },
    quantityRedeemableVouchers: { type: Number },
    redemptionsPerCart: { type: Number },
    generationDate: { type: String },
    used: { type: Boolean, default: false },
}, { collection: "voucherCode" });
const amazonDBName = process.env.AMAZON_MONGODB_DB_NAME || "test";
const db = mongoose_1.default.connection.useDb(amazonDBName);
exports.AmazonPromoVoucherCode = db.model("VoucherCode", VoucherCodeSchema);
