"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iHerbSavePromo = exports.iHerbSearchPromo = exports.iHerbGetPromoById = void 0;
const responseCodes_1 = require("../constants/responseCodes");
const responses_1 = require("../constants/responses");
const iHerbPromotion_1 = require("../models/iHerbPromotion");
const commonTypes_1 = require("../types/commonTypes");
const helpers_1 = require("./helpers");
async function iHerbGetPromoById(req, res) {
    try {
        const pmmId = req.params.promotionId;
        const promo = await iHerbPromotion_1.IHerbPromotion.findOne({ pmmId });
        if (!promo) {
            return res.status(responseCodes_1.RESPONSE_CODE_NOT_FOUND).json({
                data: null,
                error: { message: responses_1.ERROR_FIND_PROMO },
            });
        }
        res.status(responseCodes_1.RESPONSE_CODE_OK).json(promo);
    }
    catch (error) {
        const errorMessage = responses_1.ERROR_FETCH_PROMO +
            (error instanceof Error ? error.message : responses_1.UNKNOWN_ERROR);
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
        const searchFields = (0, helpers_1.createSearchFields)(predicates);
        const query = (0, helpers_1.createQuery)(predicates, queryOperator, searchFields, promotionType, "promotionType");
        const promotions = await iHerbPromotion_1.IHerbPromotion.find(query);
        const totalCount = promotions.length;
        res.status(responseCodes_1.RESPONSE_CODE_OK).json({
            results: promotions,
            totalCount,
            error: null,
        });
    }
    catch (error) {
        const errorMessage = responses_1.ERROR_SEARCH_PROMO +
            (error instanceof Error ? error.message : responses_1.UNKNOWN_ERROR);
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
        const { pmmId } = savedPromo;
        let promotion;
        switch (savedPromo.promotionType) {
            case "ITEM_REWARD":
                ({ promotion } = await (0, helpers_1.createOrUpdatePromotion)(iHerbPromotion_1.ItemRewardIHerbPromotion, savedPromo, pmmId));
                break;
            case "PRICE_BASED":
                ({ promotion } = await (0, helpers_1.createOrUpdatePromotion)(iHerbPromotion_1.PriceBasedIHerbPromotion, savedPromo, pmmId));
                break;
            case "FREE_SHIPPING":
                ({ promotion } = await (0, helpers_1.createOrUpdatePromotion)(iHerbPromotion_1.FreeShippingIHerbPromotion, savedPromo, pmmId));
                break;
            default:
                throw new Error(responses_1.ERROR_PROMO_TYPE);
        }
        const validationError = promotion.validateSync();
        if (validationError) {
            throw validationError;
        }
        const updatedPromo = await promotion.save();
        res.status(responseCodes_1.RESPONSE_CODE_OK).json(updatedPromo);
    }
    catch (error) {
        const errorMessage = responses_1.ERROR_SAVE_PROMO +
            (error instanceof Error ? error.message : responses_1.UNKNOWN_ERROR);
        res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).json({
            data: null,
            error: { message: errorMessage },
        });
    }
}
exports.iHerbSavePromo = iHerbSavePromo;
