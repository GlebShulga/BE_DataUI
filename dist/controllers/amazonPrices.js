"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amazonSavePrice = exports.amazonGetPriceById = exports.amazonSearchPrices = void 0;
const amazonPrice_1 = require("../models/amazonPrice");
const responseCodes_1 = require("../constants/responseCodes");
const commonTypes_1 = require("../types/commonTypes");
const createSearchFields_1 = require("./helpers/createSearchFields");
const createQuery_1 = require("./helpers/createQuery");
async function amazonSearchPrices(req, res) {
    const { predicates, predicateRelation } = req.body;
    const queryOperator = predicateRelation === commonTypes_1.PredicateRelation.AND ? "$and" : "$or";
    try {
        const searchFields = (0, createSearchFields_1.createSearchFields)(predicates);
        const query = (0, createQuery_1.createQuery)(predicates, queryOperator, searchFields);
        const price = await amazonPrice_1.AmazonPrice.find(query);
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
exports.amazonSearchPrices = amazonSearchPrices;
async function amazonGetPriceById(req, res) {
    try {
        const id = req.params.priceId;
        const price = await amazonPrice_1.AmazonPrice.findOne({ id });
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
exports.amazonGetPriceById = amazonGetPriceById;
async function amazonSavePrice(req, res) {
    try {
        const savedPrice = req.body;
        const id = savedPrice.priceId;
        let price;
        price = await amazonPrice_1.AmazonPrice.findOne({ id });
        if (!price) {
            price = new amazonPrice_1.AmazonPrice(savedPrice);
        }
        else {
            price.set("localizedDescriptions", savedPrice.descriptions);
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
exports.amazonSavePrice = amazonSavePrice;
