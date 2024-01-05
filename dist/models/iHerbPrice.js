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
exports.IHerbPrice = void 0;
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
const IHerbPriceSchema = new mongoose_1.Schema({
    priceEventId: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
        get: (value) => parseInt(value, 10),
        set: (value) => value.toString(),
    },
    priceEventDescription: { type: String, required: true },
    priceTypeDto: { type: String, required: false },
    effectiveFrom: { type: Date, required: true },
    effectiveTo: { type: Date, required: true },
    descriptions: [localizedDescriptionSchema],
    modified: { type: String, required: false },
}, { collection: "price" });
const iHerbDBName = process.env.IHERB_MONGODB_DB_NAME || "test";
const db = mongoose_1.default.connection.useDb(iHerbDBName);
exports.IHerbPrice = db.model("IHerbPrice", IHerbPriceSchema);
