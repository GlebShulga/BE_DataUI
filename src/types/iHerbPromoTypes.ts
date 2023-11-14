import { Document } from "mongoose";
import {
  PromotionLocalizedDescription,
  Zone,
  purchaseType,
} from "./commonTypes";

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
  //   priorityType: number;
  //   prioritySubType: number;
  //   priceDerivationRuleNumber: string;
  //   action: string;
  //   discountType: string;
  //   totalRetailPrice: number;
  //   romanceCopyApproved: boolean;
  //   restrictionRomanceCopyApproved: boolean;
  //   applyType: string;
  //   restrictions: string[];
  //   spentLimitCheck: boolean;
  //   version: number;
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

export interface IHerbPromotionDocument extends IHerbPromotion, Document {}
export interface ItemRewardIHerbPromotionDocument
  extends ItemRewardIHerbPromotion,
    Document {}
export interface PriceBasedIHerbPromotionDocument
  extends PriceBasedIHerbPromotion,
    Document {}
export interface FreeShippingIHerbPromotionDocument
  extends FreeShippingIHerbPromotion,
    Document {}
