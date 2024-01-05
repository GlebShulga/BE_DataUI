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
import mongoose, { Document } from "mongoose";
import { LOCALE, PromotionLocalizedDescription, Zone, discountType, purchaseType } from "./commonTypes";
import { VoucherType } from "./amazonVoucherTypes";
import { ProductCategory } from "./productCategory";
export interface IAmazonVoucher {
    voucherName: string;
    localizedDescriptions: VoucherLocalizedDescription[];
    effectiveFrom?: string;
    effectiveTo?: string;
    enabled: boolean;
    discountType: discountType;
    discountAmount: number;
    quantityRedeemableVouchers: number;
    voucherType?: VoucherType;
    id?: number;
    code?: string;
}
export interface IVoucherCode {
    voucherId: number;
    code: string;
    dateTimeGenerated?: string;
    quantityRedeemableVouchers?: number;
    redemptionsPerCart?: number;
    generationDate?: string;
    used?: boolean;
}
export interface IVoucherCodeDocument extends IVoucherCode, Document {
}
export interface VoucherLocalizedDescription {
    locale: LOCALE;
    shortDescription?: string;
    longDescription?: string;
}
export interface AmazonPromotionItem {
    item: string;
    exclusion?: boolean;
    hierarchyLevel: hierarchyItemLevelByType;
    brand?: string;
    codeField?: string;
}
interface AmazonPromotionComponent {
    purchaseType: purchaseType;
    quantity: number;
    promotionPart: string;
    rewardDerivationRuleNumber: number;
    items: ProductCategory[];
    id: number;
}
export interface BuyComponent {
    id: number;
    purchaseType: purchaseType;
    quantity: number;
    promotionPart: string;
    componentType: componentType;
    items: AmazonPromotionItem[];
    rewardDerivationRuleNumber: number;
}
export interface AmazonPromotion {
    promotionType: string;
    pmmId: string;
    name: string;
    description: string;
    priorityType: number;
    components: AmazonPromotionComponent[];
    zones: Zone[];
    actionLog?: Array<{
        pmmId: string;
        enabled: boolean;
        date: Date;
    }>;
    localizedDescriptions: PromotionLocalizedDescription[];
    discountType: string;
    totalRetailPrice: number;
    romanceCopyApproved: boolean;
    restrictionRomanceCopyApproved: boolean;
    sourceType: string;
    enabled: boolean;
    applyType: string;
    restrictions: string[];
    spentLimitCheck: boolean;
    version: number;
    voucher: mongoose.Types.ObjectId;
}
export interface MultiAmazonPromotion extends AmazonPromotion {
    totalRetailPrice: number;
    buyComponent: BuyComponent;
}
export interface PriceBasedAmazonPromotion extends AmazonPromotion {
    items: AmazonPromotionItem[];
    discountList: {
        discountAmount: number;
        priceType: number;
        priceName: string;
    }[];
}
export interface FixedDiscountAmazonPromotion extends AmazonPromotion {
    discount: number;
}
export interface ShippingAmazonPromotion extends AmazonPromotion {
    discount: number;
    shippingMaxDiscount: number;
    orderThreshold: number;
    deliveryMode: string;
    items: AmazonPromotionItem[];
}
export interface XForYAmazonPromotion extends AmazonPromotion {
    discount: number;
    buyComponent: BuyComponent;
}
export interface SpendAndGetAmazonPromotion extends AmazonPromotion {
    items: AmazonPromotionItem[];
    giftCardAmount: number;
    giftCardExpirationDate: Date;
    giftCardDeliveryDate: Date;
}
export interface AmazonPromotionDocument extends AmazonPromotion, Document {
}
export interface MultiAmazonPromotionDocument extends MultiAmazonPromotion, Document {
}
export interface PriceBasedAmazonPromotionDocument extends PriceBasedAmazonPromotion, Document {
}
export interface FixedDiscountAmazonPromotionDocument extends FixedDiscountAmazonPromotion, Document {
}
export interface ShippingAmazonPromotionDocument extends ShippingAmazonPromotion, Document {
}
export interface XForYAmazonPromotionDocument extends XForYAmazonPromotion, Document {
}
export interface SpendAndGetAmazonPromotionDocument extends SpendAndGetAmazonPromotion, Document {
}
export declare enum componentType {
    BUY = 0,
    GET = 1
}
export declare enum hierarchyItemLevelByType {
    PRODUCT = 1,
    CATEGORY = 2
}
export {};
