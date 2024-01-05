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
import { PromotionLocalizedDescription, Zone, purchaseType } from "./commonTypes";
export interface IHerbPromotion {
    promotionType: string;
    pmmId: string;
    name: string;
    description: string;
    components: IHerbPromotionComponent;
    zones: Zone[];
    localizedPromotionDetails: PromotionLocalizedDescription[];
    sourceType: string;
    enabled: boolean;
    stackable: boolean;
    promotionVouchers: IHerbAdvanceVoucher;
}
export interface ItemRewardIHerbPromotion extends IHerbPromotion {
    barcodes: string[];
    spendAmount: string;
    quantityThreshold: number;
    freeShippingIncluded: boolean;
}
export interface PriceBasedIHerbPromotion extends IHerbPromotion {
    discounts: IHerbPriceBasedDiscount[];
}
export interface FreeShippingIHerbPromotion extends IHerbPromotion {
    modificationAmount: number;
    spendAmount: string;
    quantityThreshold: number;
}
interface IHerbPromotionComponent {
    purchaseType: purchaseType;
    quantity: number;
    promotionPart: string;
    spendAmount: number;
    modificationAmount: number;
    modificationType: string;
    items: string[];
}
export interface IHerbAdvanceVoucher {
    id: number;
    isPublic: boolean;
    codes: IHerbAdvanceVoucherCodes[];
    generationDetails: IHerbAdvanceVoucherGenerationDetails;
    codesCount: number;
}
interface IHerbAdvanceVoucherCodes {
    code: string;
    used: boolean;
    generationDate: string;
}
interface IHerbAdvanceVoucherGenerationDetails {
    prefix: string;
    username: string;
    voucherCodesQuantity: number;
    id: number;
}
export interface IHerbPriceBasedDiscount {
    priceType: number;
    discount: number;
    discountType: string;
}
export interface IHerbPromotionDocument extends IHerbPromotion, Document {
}
export interface ItemRewardIHerbPromotionDocument extends ItemRewardIHerbPromotion, Document {
}
export interface PriceBasedIHerbPromotionDocument extends PriceBasedIHerbPromotion, Document {
}
export interface FreeShippingIHerbPromotionDocument extends FreeShippingIHerbPromotion, Document {
}
export {};
