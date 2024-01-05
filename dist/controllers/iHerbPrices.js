"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iHerbSavePrice = exports.iHerbGetPriceById = exports.iHerbSearchPrices = void 0;
const iHerbPrice_1 = require("../models/iHerbPrice");
const responseCodes_1 = require("../constants/responseCodes");
const commonTypes_1 = require("../types/commonTypes");
const createSearchFields_1 = require("./helpers/createSearchFields");
const createQuery_1 = require("./helpers/createQuery");
async function iHerbSearchPrices(req, res) {
    const { predicates, predicateRelation, type: priceType } = req.body;
    const queryOperator = predicateRelation === commonTypes_1.PredicateRelation.AND ? "$and" : "$or";
    try {
        const searchFields = (0, createSearchFields_1.createSearchFields)(predicates);
        const query = (0, createQuery_1.createQuery)(predicates, queryOperator, searchFields, priceType);
        const price = await iHerbPrice_1.IHerbPrice.find(query);
        const totalCount = price.length;
        res.status(responseCodes_1.RESPONSE_CODE_OK).json({
            results: price,
            totalCount,
            error: null,
        });
    }
    catch (error) {
        const errorMessage = "Error searching price: " +
            (error instanceof Error ? error.message : "Unknown error");
        res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).json({
            data: null,
            error: { message: errorMessage },
        });
    }
}
exports.iHerbSearchPrices = iHerbSearchPrices;
async function iHerbGetPriceById(req, res) {
    try {
        const priceEventId = req.params.priceId;
        const price = await iHerbPrice_1.IHerbPrice.findOne({ priceEventId });
        if (!price) {
            return res.status(responseCodes_1.RESPONSE_CODE_NOT_FOUND).json({
                data: null,
                error: { message: "No price with such ID" },
            });
        }
        res.status(responseCodes_1.RESPONSE_CODE_OK).json(price);
    }
    catch (error) {
        const errorMessage = "Error fetching price: " +
            (error instanceof Error ? error.message : "Unknown error");
        res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).json({
            results: null,
            error: { message: errorMessage },
        });
    }
}
exports.iHerbGetPriceById = iHerbGetPriceById;
async function iHerbSavePrice(req, res) {
    try {
        const savedPrice = req.body;
        const { priceEventId } = savedPrice;
        let price;
        price = await iHerbPrice_1.IHerbPrice.findOne({ priceEventId });
        if (!price) {
            price = new iHerbPrice_1.IHerbPrice(savedPrice);
        }
        else {
            price.set(savedPrice);
        }
        const validationError = price.validateSync();
        if (validationError) {
            throw validationError;
        }
        const updatedPromo = await price.save();
        res.status(responseCodes_1.RESPONSE_CODE_OK).json(updatedPromo);
    }
    catch (error) {
        const errorMessage = "Error saving price: " +
            (error instanceof Error ? error.message : "Unknown error");
        res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).json({
            data: null,
            error: { message: errorMessage },
        });
    }
}
exports.iHerbSavePrice = iHerbSavePrice;
