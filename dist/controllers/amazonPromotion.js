"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amazonSavePromo = exports.amazonSearchPromo = exports.amazonGetPromoById = void 0;
const responseCodes_1 = require("../constants/responseCodes");
const responses_1 = require("../constants/responses");
const productCategory_1 = require("../models/productCategory");
const amazonPromotion_1 = require("../models/amazonPromotion");
const product_1 = require("./product");
const productCategory_2 = require("../types/productCategory");
const commonTypes_1 = require("../types/commonTypes");
const helpers_1 = require("./helpers");
async function amazonGetPromoById(req, res) {
    try {
        const pmmId = req.params.promotionId;
        const promo = await amazonPromotion_1.AmazonPromotion.findOne({ pmmId });
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
exports.amazonGetPromoById = amazonGetPromoById;
async function amazonSearchPromo(req, res) {
    const { predicates, predicateRelation, type: promotionType } = req.body;
    const queryOperator = predicateRelation === commonTypes_1.PredicateRelation.AND ? "$and" : "$or";
    try {
        const searchFields = (0, helpers_1.createSearchFields)(predicates);
        const query = (0, helpers_1.createQuery)(predicates, queryOperator, searchFields, promotionType, "promotionType");
        const promotions = await amazonPromotion_1.AmazonPromotion.find(query);
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
exports.amazonSearchPromo = amazonSearchPromo;
async function amazonSavePromo(req, res) {
    try {
        const savedPromo = req.body;
        const { pmmId } = savedPromo;
        let promotion;
        let originalEnabled;
        switch (savedPromo.promotionType) {
            case "AM_MULTI":
                ({ promotion, originalEnabled } = await (0, helpers_1.createOrUpdatePromotion)(amazonPromotion_1.MultiAmazonPromotion, savedPromo, pmmId));
                break;
            case "AM_PRICE_BASED":
                ({ promotion, originalEnabled } = await (0, helpers_1.createOrUpdatePromotion)(amazonPromotion_1.PriceBasedAmazonPromotion, savedPromo, pmmId));
                break;
            case "AM_FIXED_DISCOUNT":
                ({ promotion, originalEnabled } = await (0, helpers_1.createOrUpdatePromotion)(amazonPromotion_1.FixedDiscountAmazonPromotion, savedPromo, pmmId));
                break;
            case "AM_FREE_SHIPPING":
                ({ promotion, originalEnabled } = await (0, helpers_1.createOrUpdatePromotion)(amazonPromotion_1.ShippingAmazonPromotion, savedPromo, pmmId));
                break;
            case "AM_XFORY":
                ({ promotion, originalEnabled } = await (0, helpers_1.createOrUpdatePromotion)(amazonPromotion_1.XForYAmazonPromotion, savedPromo, pmmId));
                break;
            case "AM_SPEND_AND_GET_GC":
                ({ promotion, originalEnabled } = await (0, helpers_1.createOrUpdatePromotion)(amazonPromotion_1.SpendAndGetAmazonPromotion, savedPromo, pmmId));
                break;
            default:
                throw new Error(responses_1.ERROR_PROMO_TYPE);
        }
        if (!Array.isArray(promotion.zones)) {
            promotion.zones = [];
        }
        promotion.zones[0] = {
            effectiveFrom: savedPromo.effectiveFrom,
            effectiveTo: savedPromo.effectiveTo ?? savedPromo.zones[0]?.effectiveTo,
            modified: new Date(),
        };
        if (originalEnabled !== savedPromo.enabled) {
            promotion.actionLog = promotion.actionLog ?? [];
            promotion.actionLog.push({
                pmmId: req.body.pmmId,
                date: new Date(),
                enabled: req.body.enabled,
            });
        }
        if (savedPromo.buyComponent && savedPromo.buyComponent.items) {
            const newItems = savedPromo.buyComponent.items;
            const itemIds = newItems.map((item) => item.item);
            promotion.components = promotion.components ?? [];
            for (const component of promotion.components) {
                const existingItemIds = component.items.map((item) => item.hierarchyLevel === productCategory_2.hierarchyItemLevelByType.PRODUCT
                    ? item.styleCode
                    : item.code);
                component.items = component.items.filter((item) => itemIds.includes(item.hierarchyLevel === productCategory_2.hierarchyItemLevelByType.PRODUCT
                    ? item.styleCode
                    : item.code));
                const newItemIds = itemIds.filter((id) => !existingItemIds.includes(id));
                for (const itemId of newItemIds) {
                    let itemDocument;
                    const newItem = newItems.find((item) => item.item === itemId);
                    if (newItem.hierarchyLevel === productCategory_2.hierarchyItemLevelByType.PRODUCT) {
                        const product = await (0, product_1.getProductById)(itemId);
                        itemDocument = new productCategory_1.Product(product);
                    }
                    else if (newItem.hierarchyLevel === productCategory_2.hierarchyItemLevelByType.CATEGORY) {
                        const category = await (0, product_1.getCategoryById)(itemId);
                        itemDocument = new productCategory_1.Product(category);
                    }
                    if (itemDocument) {
                        component.items.push({
                            ...itemDocument.toObject(),
                            hierarchyLevel: newItem.hierarchyLevel,
                        });
                    }
                }
            }
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
exports.amazonSavePromo = amazonSavePromo;
