"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const objectId = joi_1.default.string().custom((value, helpers) => {
    if (!mongoose_1.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
});
exports.updateCartSchema = joi_1.default.object({
    user: objectId.required(),
    isDeleted: joi_1.default.boolean().required(),
    items: joi_1.default.array()
        .items(joi_1.default.object({
        product: joi_1.default.object({
            _id: objectId.required(),
            title: joi_1.default.string().required(),
            description: joi_1.default.string().required(),
            price: joi_1.default.number().required(),
        }).required(),
        count: joi_1.default.number().integer().required(),
    }))
        .required(),
});
