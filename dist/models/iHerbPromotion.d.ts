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
import { FreeShippingIHerbPromotionDocument, ItemRewardIHerbPromotionDocument, PriceBasedIHerbPromotionDocument } from "../types/iHerbPromoTypes";
export declare const IHerbPromotion: mongoose.Model<{
    [x: string]: any;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    [x: string]: any;
}> & {
    [x: string]: any;
} & Required<{
    _id: unknown;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    [x: string]: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    [x: string]: any;
}>> & mongoose.FlatRecord<{
    [x: string]: any;
}> & Required<{
    _id: unknown;
}>>>;
export declare const ItemRewardIHerbPromotion: mongoose.Model<ItemRewardIHerbPromotionDocument, {}, {}, {}, mongoose.Document<unknown, {}, ItemRewardIHerbPromotionDocument> & ItemRewardIHerbPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<ItemRewardIHerbPromotionDocument, mongoose.Model<ItemRewardIHerbPromotionDocument, any, any, any, mongoose.Document<unknown, any, ItemRewardIHerbPromotionDocument> & ItemRewardIHerbPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ItemRewardIHerbPromotionDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<ItemRewardIHerbPromotionDocument>> & mongoose.FlatRecord<ItemRewardIHerbPromotionDocument> & {
    _id: mongoose.Types.ObjectId;
}>>;
export declare const PriceBasedIHerbPromotion: mongoose.Model<PriceBasedIHerbPromotionDocument, {}, {}, {}, mongoose.Document<unknown, {}, PriceBasedIHerbPromotionDocument> & PriceBasedIHerbPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<PriceBasedIHerbPromotionDocument, mongoose.Model<PriceBasedIHerbPromotionDocument, any, any, any, mongoose.Document<unknown, any, PriceBasedIHerbPromotionDocument> & PriceBasedIHerbPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, PriceBasedIHerbPromotionDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<PriceBasedIHerbPromotionDocument>> & mongoose.FlatRecord<PriceBasedIHerbPromotionDocument> & {
    _id: mongoose.Types.ObjectId;
}>>;
export declare const FreeShippingIHerbPromotion: mongoose.Model<FreeShippingIHerbPromotionDocument, {}, {}, {}, mongoose.Document<unknown, {}, FreeShippingIHerbPromotionDocument> & FreeShippingIHerbPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<FreeShippingIHerbPromotionDocument, mongoose.Model<FreeShippingIHerbPromotionDocument, any, any, any, mongoose.Document<unknown, any, FreeShippingIHerbPromotionDocument> & FreeShippingIHerbPromotionDocument & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, FreeShippingIHerbPromotionDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<FreeShippingIHerbPromotionDocument>> & mongoose.FlatRecord<FreeShippingIHerbPromotionDocument> & {
    _id: mongoose.Types.ObjectId;
}>>;
