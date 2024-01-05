/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document } from "mongoose";
import { LOCALE, discountType } from "./commonTypes";
interface LocalizedDescription {
    locale: LOCALE;
    shortDescription: string;
    longDescription: string;
}
export interface AmazonVoucher {
    voucherName: string;
    localizedDescriptions: LocalizedDescription[];
    effectiveFrom: string;
    effectiveTo: string;
    enabled: boolean;
    discountType: discountType;
    discountAmount: number;
    quantityRedeemableVouchers: number;
    voucherType: VoucherType;
    id?: number;
}
export interface PromotionalAmazonVoucher extends AmazonVoucher {
    redemptionsPerCart: Number;
    codePrefix: String;
    code: String;
}
export interface CustomAmazonVoucher extends AmazonVoucher {
    redemptionsPerCart: Number;
    code: String;
}
export interface SerialAmazonVoucher extends AmazonVoucher {
    redemptionsPerCart: Number;
    code: String;
    durationInDays?: String | Number;
}
export interface AmazonVoucherDocument extends AmazonVoucher, Document {
    id?: number;
}
export interface PromotionalAmazonVoucherDocument extends PromotionalAmazonVoucher, Document {
    id?: number;
}
export interface CustomAmazonVoucherDocument extends CustomAmazonVoucher, Document {
    id?: number;
}
export interface SerialAmazonVoucherDocument extends SerialAmazonVoucher, Document {
    id?: number;
}
export type VoucherType = "PROMOTIONAL" | "CUSTOM" | "SERIAL";
export {};
