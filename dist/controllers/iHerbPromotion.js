"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iHerbSavePromo = exports.iHerbSearchPromo = exports.iHerbGetPromoById = void 0;
const responseCodes_1 = require("../constants/responseCodes");
const iHerbPromotion_1 = require("../models/iHerbPromotion");
const createSearchFields_1 = require("./helpers/createSearchFields");
const commonTypes_1 = require("../types/commonTypes");
const createQuery_1 = require("./helpers/createQuery");
async function iHerbGetPromoById(req, res) {
    try {
        const pmmId = req.params.promotionId;
        const promo = await iHerbPromotion_1.IHerbPromotion.findOne({ pmmId });
        if (!promo) {
            return res.status(responseCodes_1.RESPONSE_CODE_NOT_FOUND).json({
                data: null,
                error: { message: "No promotion with such ID" },
            });
        }
        res.status(responseCodes_1.RESPONSE_CODE_OK).json(promo);
    }
    catch (error) {
        const errorMessage = "Error fetching promotion: " +
            (error instanceof Error ? error.message : "Unknown error");
        res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).json({
            results: null,
            error: { message: errorMessage },
        });
    }
}
exports.iHerbGetPromoById = iHerbGetPromoById;
async function iHerbSearchPromo(req, res) {
    const { predicates, predicateRelation, type: promotionType } = req.body;
    const queryOperator = predicateRelation === commonTypes_1.PredicateRelation.AND ? "$and" : "$or";
    try {
        const searchFields = (0, createSearchFields_1.createSearchFields)(predicates);
        const query = (0, createQuery_1.createQuery)(predicates, queryOperator, searchFields, promotionType, "promotionType");
        const promotions = await iHerbPromotion_1.IHerbPromotion.find(query);
        const totalCount = promotions.length;
        res.status(responseCodes_1.RESPONSE_CODE_OK).json({
            results: promotions,
            totalCount,
            error: null,
        });
    }
    catch (error) {
        const errorMessage = "Error searching promotions: " +
            (error instanceof Error ? error.message : "Unknown error");
        res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).json({
            data: null,
            error: { message: errorMessage },
        });
    }
}
exports.iHerbSearchPromo = iHerbSearchPromo;
async function iHerbSavePromo(req, res) {
    try {
        const savedPromo = req.body;
        const pmmId = savedPromo.pmmId;
        let promotion;
        switch (savedPromo.promotionType) {
            case "ITEM_REWARD":
                promotion = await iHerbPromotion_1.ItemRewardIHerbPromotion.findOne({ pmmId });
                if (!promotion) {
                    promotion = new iHerbPromotion_1.ItemRewardIHerbPromotion(savedPromo);
                }
                else {
                    promotion.set(savedPromo);
                }
                break;
            case "PRICE_BASED":
                promotion = await iHerbPromotion_1.PriceBasedIHerbPromotion.findOne({ pmmId });
                if (!promotion) {
                    promotion = new iHerbPromotion_1.PriceBasedIHerbPromotion(savedPromo);
                }
                else {
                    promotion.set(savedPromo);
                }
                break;
            case "FREE_SHIPPING":
                promotion = await iHerbPromotion_1.FreeShippingIHerbPromotion.findOne({ pmmId });
                if (!promotion) {
                    promotion = new iHerbPromotion_1.FreeShippingIHerbPromotion(savedPromo);
                }
                else {
                    promotion.set(savedPromo);
                }
                break;
            default:
                throw new Error("Invalid promotion type");
        }
        const validationError = promotion.validateSync();
        if (validationError) {
            throw validationError;
        }
        const updatedPromo = await promotion.save();
        res.status(responseCodes_1.RESPONSE_CODE_OK).json(updatedPromo);
    }
    catch (error) {
        const errorMessage = "Error saving promotion: " +
            (error instanceof Error ? error.message : "Unknown error");
        res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).json({
            data: null,
            error: { message: errorMessage },
        });
    }
}
exports.iHerbSavePromo = iHerbSavePromo;
