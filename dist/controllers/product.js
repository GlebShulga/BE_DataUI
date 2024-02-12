"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amazonGetProductById = exports.getCategoryById = exports.getProductById = exports.amazonSearchProductOrCategory = void 0;
const productCategory_1 = require("../models/productCategory");
const responseCodes_1 = require("../constants/responseCodes");
const responses_1 = require("../constants/responses");
async function amazonSearchProductOrCategory(req, res) {
    const PRODUCT_SEARCH_TYPE = "STYLE_SEARCH";
    const BULK_PRODUCT_SEARCH_TYPE = "STYLE_BULK_SEARCH";
    const CATEGORY_SEARCH_TYPE = "CATEGORY_SEARCH";
    const BULK_CATEGORY_SEARCH_TYPE = "CATEGORY_BULK_SEARCH";
    const PAGE_SIZE = 5;
    const { query: searchTerm, searchType: type, currentPage = 0 } = req.body;
    try {
        let query = {};
        if (searchTerm) {
            if (type === BULK_PRODUCT_SEARCH_TYPE ||
                type === BULK_CATEGORY_SEARCH_TYPE) {
                const styleCodes = searchTerm
                    .split(",")
                    .map((code) => code.trim());
                query = { styleCode: { $in: styleCodes } };
            }
            else {
                const searchFields = [
                    { styleCode: { $regex: searchTerm, $options: "i" } },
                    { catalogVersion: { $regex: searchTerm, $options: "i" } },
                    { brandName: { $regex: searchTerm, $options: "i" } },
                ];
                query = {
                    $or: searchFields,
                };
            }
        }
        let Model;
        if (type === PRODUCT_SEARCH_TYPE || type === BULK_PRODUCT_SEARCH_TYPE) {
            Model = productCategory_1.Product;
        }
        else if (type === CATEGORY_SEARCH_TYPE ||
            type === BULK_CATEGORY_SEARCH_TYPE) {
            Model = productCategory_1.Category;
        }
        else {
            throw new Error(responses_1.ERROR_SEARCH_TYPE);
        }
        const totalResults = await Model.countDocuments(query);
        const totalPages = Math.ceil(totalResults / PAGE_SIZE);
        const productCategory = await Model.find(query)
            .skip(currentPage * PAGE_SIZE)
            .limit(PAGE_SIZE);
        res.status(responseCodes_1.RESPONSE_CODE_OK).json({
            products: productCategory,
            pagination: {
                currentPage,
                pageSize: PAGE_SIZE,
                totalPages,
                totalResults,
            },
            error: null,
        });
    }
    catch (error) {
        const errorMessage = responses_1.ERROR_SEARCH_PRODUCT_OR_CATEGORY +
            (error instanceof Error ? error.message : responses_1.UNKNOWN_ERROR);
        res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).json({
            data: null,
            error: { message: errorMessage },
        });
    }
}
exports.amazonSearchProductOrCategory = amazonSearchProductOrCategory;
async function getProductById(styleCode) {
    const product = await productCategory_1.Product.findOne({ styleCode });
    if (!product) {
        throw new Error(responses_1.ERROR_FIND_PRODUCT);
    }
    return product;
}
exports.getProductById = getProductById;
async function getCategoryById(code) {
    const product = await productCategory_1.Product.findOne({ code });
    if (!product) {
        throw new Error(responses_1.ERROR_FIND_CATEGORY);
    }
    return product;
}
exports.getCategoryById = getCategoryById;
async function amazonGetProductById(req, res) {
    try {
        const styleCode = req.params.productId;
        const product = await getProductById(styleCode);
        res.status(responseCodes_1.RESPONSE_CODE_OK).json(product);
    }
    catch (error) {
        const errorMessage = responses_1.ERROR_FETCH_PRODUCT +
            (error instanceof Error ? error.message : responses_1.UNKNOWN_ERROR);
        res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).json({
            results: null,
            error: { message: errorMessage },
        });
    }
}
exports.amazonGetProductById = amazonGetProductById;
