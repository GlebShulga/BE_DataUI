"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amazonSaveVoucher = exports.amazonGetVoucherById = exports.amazonSearchVoucher = void 0;
const responseCodes_1 = require("../constants/responseCodes");
const amazonVoucher_1 = require("../models/amazonVoucher");
const commonTypes_1 = require("../types/commonTypes");
const createSearchFields_1 = require("./helpers/createSearchFields");
const createQuery_1 = require("./helpers/createQuery");
async function amazonSearchVoucher(req, res) {
    const { predicates, predicateRelation, voucherType } = req.body;
    const queryOperator = predicateRelation === commonTypes_1.PredicateRelation.AND ? "$and" : "$or";
    try {
        const searchFields = (0, createSearchFields_1.createSearchFields)(predicates);
        const query = (0, createQuery_1.createQuery)(predicates, queryOperator, searchFields, voucherType, "voucherType");
        const vouchers = await amazonVoucher_1.AmazonVoucher.find(query);
        const totalCount = vouchers.length;
        res.status(responseCodes_1.RESPONSE_CODE_OK).json({
            results: vouchers,
            totalCount,
            error: null,
        });
    }
    catch (error) {
        const errorMessage = "Error searching vouchers: " +
            (error instanceof Error ? error.message : "Unknown error");
        res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).json({
            data: null,
            error: { message: errorMessage },
        });
    }
}
exports.amazonSearchVoucher = amazonSearchVoucher;
async function amazonGetVoucherById(req, res) {
    try {
        const id = req.params.voucherId;
        const voucher = await amazonVoucher_1.AmazonVoucher.findOne({ id });
        if (!voucher) {
            return res.status(responseCodes_1.RESPONSE_CODE_NOT_FOUND).json({
                data: null,
                error: { message: "No voucher with such ID" },
            });
        }
        res.status(responseCodes_1.RESPONSE_CODE_OK).json(voucher);
    }
    catch (error) {
        const errorMessage = "Error fetching voucher: " +
            (error instanceof Error ? error.message : "Unknown error");
        res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).json({
            results: null,
            error: { message: errorMessage },
        });
    }
}
exports.amazonGetVoucherById = amazonGetVoucherById;
async function amazonSaveVoucher(req, res) {
    try {
        const savedVoucher = req.body;
        const id = savedVoucher.id;
        let voucher;
        switch (savedVoucher.voucherType) {
            case "PROMOTIONAL":
                voucher = await amazonVoucher_1.PromotionalAmazonVoucher.findOne({ id });
                if (!voucher) {
                    voucher = new amazonVoucher_1.PromotionalAmazonVoucher(savedVoucher);
                }
                else {
                    voucher.set(savedVoucher);
                }
                break;
            case "CUSTOM":
                voucher = await amazonVoucher_1.CustomAmazonVoucher.findOne({ id });
                if (!voucher) {
                    voucher = new amazonVoucher_1.CustomAmazonVoucher(savedVoucher);
                }
                else {
                    voucher.set(savedVoucher);
                }
                break;
            case "SERIAL":
                voucher = await amazonVoucher_1.SerialAmazonVoucher.findOne({ id });
                if (!voucher) {
                    voucher = new amazonVoucher_1.SerialAmazonVoucher(savedVoucher);
                }
                else {
                    voucher.set(savedVoucher);
                }
                break;
            default:
                throw new Error("Invalid voucher type");
        }
        const validationError = voucher.validateSync();
        if (validationError) {
            throw validationError;
        }
        const updatedPromo = await voucher.save();
        res.status(responseCodes_1.RESPONSE_CODE_OK).json(updatedPromo);
    }
    catch (error) {
        const errorMessage = "Error saving voucher: " +
            (error instanceof Error ? error.message : "Unknown error");
        res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).json({
            data: null,
            error: { message: errorMessage },
        });
    }
}
exports.amazonSaveVoucher = amazonSaveVoucher;
