"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amazonSearchPromoVoucherCode = void 0;
const amazonPromoVoucher_1 = require("../models/amazonPromoVoucher");
const responseCodes_1 = require("../constants/responseCodes");
async function amazonSearchPromoVoucherCode(req, res) {
    const PAGE_SIZE = 15;
    const { voucherId, searchTerm } = req.body;
    try {
        let query = {};
        if (!!searchTerm && voucherId) {
            query = {
                voucherId,
                code: searchTerm,
            };
        }
        else if (voucherId) {
            query = { voucherId };
        }
        const voucherCodes = await amazonPromoVoucher_1.AmazonPromoVoucherCode.find(query);
        const totalCount = voucherCodes.length;
        res.status(responseCodes_1.RESPONSE_CODE_OK).json({
            results: voucherCodes,
            pageSize: PAGE_SIZE,
            totalCount,
            error: null,
        });
    }
    catch (error) {
        const errorMessage = "Error searching voucher code: " +
            (error instanceof Error ? error.message : "Unknown error");
        res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).json({
            data: null,
            error: { message: errorMessage },
        });
    }
}
exports.amazonSearchPromoVoucherCode = amazonSearchPromoVoucherCode;
