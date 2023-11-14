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

export interface PromotionalAmazonVoucherDocument
  extends PromotionalAmazonVoucher,
    Document {
  id?: number;
}

export interface CustomAmazonVoucherDocument
  extends CustomAmazonVoucher,
    Document {
  id?: number;
}

export interface SerialAmazonVoucherDocument
  extends SerialAmazonVoucher,
    Document {
  id?: number;
}

export type VoucherType = "PROMOTIONAL" | "CUSTOM" | "SERIAL";
