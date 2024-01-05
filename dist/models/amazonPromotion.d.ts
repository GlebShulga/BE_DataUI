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
import mongoose from "mongoose";
import { AmazonPromotionDocument, FixedDiscountAmazonPromotionDocument, MultiAmazonPromotionDocument, PriceBasedAmazonPromotionDocument, ShippingAmazonPromotionDocument, SpendAndGetAmazonPromotionDocument, XForYAmazonPromotionDocument } from "../types/amazonPromoTypes";
export declare const AmazonPromotion: mongoose.Model<AmazonPromotionDocument, {}, {}, {}, mongoose.Document<unknown, {}, AmazonPromotionDocument> & AmazonPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<AmazonPromotionDocument, mongoose.Model<AmazonPromotionDocument, any, any, any, mongoose.Document<unknown, any, AmazonPromotionDocument> & AmazonPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, AmazonPromotionDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<AmazonPromotionDocument>> & mongoose.FlatRecord<AmazonPromotionDocument> & {
    _id: mongoose.Types.ObjectId;
}>>;
export declare const MultiAmazonPromotion: mongoose.Model<MultiAmazonPromotionDocument, {}, {}, {}, mongoose.Document<unknown, {}, MultiAmazonPromotionDocument> & MultiAmazonPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<MultiAmazonPromotionDocument, mongoose.Model<MultiAmazonPromotionDocument, any, any, any, mongoose.Document<unknown, any, MultiAmazonPromotionDocument> & MultiAmazonPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, MultiAmazonPromotionDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<MultiAmazonPromotionDocument>> & mongoose.FlatRecord<MultiAmazonPromotionDocument> & {
    _id: mongoose.Types.ObjectId;
}>>;
export declare const PriceBasedAmazonPromotion: mongoose.Model<PriceBasedAmazonPromotionDocument, {}, {}, {}, mongoose.Document<unknown, {}, PriceBasedAmazonPromotionDocument> & PriceBasedAmazonPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<PriceBasedAmazonPromotionDocument, mongoose.Model<PriceBasedAmazonPromotionDocument, any, any, any, mongoose.Document<unknown, any, PriceBasedAmazonPromotionDocument> & PriceBasedAmazonPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, PriceBasedAmazonPromotionDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<PriceBasedAmazonPromotionDocument>> & mongoose.FlatRecord<PriceBasedAmazonPromotionDocument> & {
    _id: mongoose.Types.ObjectId;
}>>;
export declare const FixedDiscountAmazonPromotion: mongoose.Model<FixedDiscountAmazonPromotionDocument, {}, {}, {}, mongoose.Document<unknown, {}, FixedDiscountAmazonPromotionDocument> & FixedDiscountAmazonPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<FixedDiscountAmazonPromotionDocument, mongoose.Model<FixedDiscountAmazonPromotionDocument, any, any, any, mongoose.Document<unknown, any, FixedDiscountAmazonPromotionDocument> & FixedDiscountAmazonPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, FixedDiscountAmazonPromotionDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<FixedDiscountAmazonPromotionDocument>> & mongoose.FlatRecord<FixedDiscountAmazonPromotionDocument> & {
    _id: mongoose.Types.ObjectId;
}>>;
export declare const ShippingAmazonPromotion: mongoose.Model<ShippingAmazonPromotionDocument, {}, {}, {}, mongoose.Document<unknown, {}, ShippingAmazonPromotionDocument> & ShippingAmazonPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<ShippingAmazonPromotionDocument, mongoose.Model<ShippingAmazonPromotionDocument, any, any, any, mongoose.Document<unknown, any, ShippingAmazonPromotionDocument> & ShippingAmazonPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ShippingAmazonPromotionDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<ShippingAmazonPromotionDocument>> & mongoose.FlatRecord<ShippingAmazonPromotionDocument> & {
    _id: mongoose.Types.ObjectId;
}>>;
export declare const XForYAmazonPromotion: mongoose.Model<XForYAmazonPromotionDocument, {}, {}, {}, mongoose.Document<unknown, {}, XForYAmazonPromotionDocument> & XForYAmazonPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<XForYAmazonPromotionDocument, mongoose.Model<XForYAmazonPromotionDocument, any, any, any, mongoose.Document<unknown, any, XForYAmazonPromotionDocument> & XForYAmazonPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, XForYAmazonPromotionDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<XForYAmazonPromotionDocument>> & mongoose.FlatRecord<XForYAmazonPromotionDocument> & {
    _id: mongoose.Types.ObjectId;
}>>;
export declare const SpendAndGetAmazonPromotion: mongoose.Model<SpendAndGetAmazonPromotionDocument, {}, {}, {}, mongoose.Document<unknown, {}, SpendAndGetAmazonPromotionDocument> & SpendAndGetAmazonPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<SpendAndGetAmazonPromotionDocument, mongoose.Model<SpendAndGetAmazonPromotionDocument, any, any, any, mongoose.Document<unknown, any, SpendAndGetAmazonPromotionDocument> & SpendAndGetAmazonPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, SpendAndGetAmazonPromotionDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<SpendAndGetAmazonPromotionDocument>> & mongoose.FlatRecord<SpendAndGetAmazonPromotionDocument> & {
    _id: mongoose.Types.ObjectId;
}>>;
