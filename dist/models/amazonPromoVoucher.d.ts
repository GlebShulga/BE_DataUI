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
import { IVoucherCodeDocument } from "../types/amazonPromoTypes";
export declare const AmazonPromoVoucherCode: mongoose.Model<IVoucherCodeDocument, {}, {}, {}, mongoose.Document<unknown, {}, IVoucherCodeDocument> & IVoucherCodeDocument & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<IVoucherCodeDocument, mongoose.Model<IVoucherCodeDocument, any, any, any, mongoose.Document<unknown, any, IVoucherCodeDocument> & IVoucherCodeDocument & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IVoucherCodeDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<IVoucherCodeDocument>> & mongoose.FlatRecord<IVoucherCodeDocument> & {
    _id: mongoose.Types.ObjectId;
}>>;
