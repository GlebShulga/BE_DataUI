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
import { AmazonVoucherDocument, PromotionalAmazonVoucherDocument, SerialAmazonVoucherDocument } from "../types/amazonVoucherTypes";
export declare const AmazonVoucher: mongoose.Model<AmazonVoucherDocument, {}, {}, {}, mongoose.Document<unknown, {}, AmazonVoucherDocument> & AmazonVoucherDocument & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<AmazonVoucherDocument, mongoose.Model<AmazonVoucherDocument, any, any, any, mongoose.Document<unknown, any, AmazonVoucherDocument> & AmazonVoucherDocument & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, AmazonVoucherDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<AmazonVoucherDocument>> & mongoose.FlatRecord<AmazonVoucherDocument> & {
    _id: mongoose.Types.ObjectId;
}>>;
export declare const PromotionalAmazonVoucher: mongoose.Model<PromotionalAmazonVoucherDocument, {}, {}, {}, mongoose.Document<unknown, {}, PromotionalAmazonVoucherDocument> & PromotionalAmazonVoucherDocument & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<PromotionalAmazonVoucherDocument, mongoose.Model<PromotionalAmazonVoucherDocument, any, any, any, mongoose.Document<unknown, any, PromotionalAmazonVoucherDocument> & PromotionalAmazonVoucherDocument & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, PromotionalAmazonVoucherDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<PromotionalAmazonVoucherDocument>> & mongoose.FlatRecord<PromotionalAmazonVoucherDocument> & {
    _id: mongoose.Types.ObjectId;
}>>;
export declare const CustomAmazonVoucher: mongoose.Model<PromotionalAmazonVoucherDocument, {}, {}, {}, mongoose.Document<unknown, {}, PromotionalAmazonVoucherDocument> & PromotionalAmazonVoucherDocument & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<PromotionalAmazonVoucherDocument, mongoose.Model<PromotionalAmazonVoucherDocument, any, any, any, mongoose.Document<unknown, any, PromotionalAmazonVoucherDocument> & PromotionalAmazonVoucherDocument & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, PromotionalAmazonVoucherDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<PromotionalAmazonVoucherDocument>> & mongoose.FlatRecord<PromotionalAmazonVoucherDocument> & {
    _id: mongoose.Types.ObjectId;
}>>;
export declare const SerialAmazonVoucher: mongoose.Model<SerialAmazonVoucherDocument, {}, {}, {}, mongoose.Document<unknown, {}, SerialAmazonVoucherDocument> & SerialAmazonVoucherDocument & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<SerialAmazonVoucherDocument, mongoose.Model<SerialAmazonVoucherDocument, any, any, any, mongoose.Document<unknown, any, SerialAmazonVoucherDocument> & SerialAmazonVoucherDocument & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, SerialAmazonVoucherDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<SerialAmazonVoucherDocument>> & mongoose.FlatRecord<SerialAmazonVoucherDocument> & {
    _id: mongoose.Types.ObjectId;
}>>;
