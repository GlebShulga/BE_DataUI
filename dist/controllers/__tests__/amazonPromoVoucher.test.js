"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const __1 = require("../..");
const responseCodes_1 = require("../../constants/responseCodes");
const amazonPromoVoucher_1 = require("../../models/amazonPromoVoucher");
jest.mock("../../models/amazonPromoVoucher");
describe("amazonSearchPromoVoucherCode", () => {
    afterAll(async () => {
        await __1.server.close();
        await mongoose_1.default.connection.close();
    });
    it("should search voucher codes and return results", async () => {
        const mockVoucherId = 123;
        const mockSearchTerm = "ABC";
        const mockVoucherCodes = [{ id: 123, code: "ABC" }];
        amazonPromoVoucher_1.AmazonPromoVoucherCode.find.mockResolvedValue(mockVoucherCodes);
        const response = await (0, supertest_1.default)(__1.app)
            .post("/am/v1/vouchers/serial/search")
            .send({ voucherId: mockVoucherId, searchTerm: mockSearchTerm });
        expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_OK);
        expect(response.body).toEqual({
            results: mockVoucherCodes,
            pageSize: 15,
            totalCount: mockVoucherCodes.length,
            error: null,
        });
    });
    it("should return an error if the search fails", async () => {
        const mockVoucherId = 123;
        const mockSearchTerm = "ABC";
        const mockError = new Error("Search failed");
        amazonPromoVoucher_1.AmazonPromoVoucherCode.find.mockRejectedValue(mockError);
        const response = await (0, supertest_1.default)(__1.app)
            .post("/am/v1/vouchers/serial/search")
            .send({ voucherId: mockVoucherId, searchTerm: mockSearchTerm });
        expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_SERVER_ERROR);
        expect(response.body.error.message).toBe(`Error searching voucher code: ${mockError.message}`);
    });
});
