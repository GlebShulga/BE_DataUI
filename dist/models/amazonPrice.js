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
exports.AmazonPrice = void 0;
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
const amazonPriceSchema = new mongoose_1.Schema({
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
}, { collection: "price" });
const amazonDBName = process.env.AMAZON_MONGODB_DB_NAME || "test";
const db = mongoose_1.default.connection.useDb(amazonDBName);
exports.AmazonPrice = db.model("AmazonPrice", amazonPriceSchema);
