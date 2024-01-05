"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const __1 = require("../..");
const responseCodes_1 = require("../../constants/responseCodes");
const amazonPrice_1 = require("../../models/amazonPrice");
jest.mock("../../models/amazonPrice");
describe("amazonPrices", () => {
    afterAll(async () => {
        await __1.server.close();
        await mongoose_1.default.connection.close();
    });
    describe("amazonSearchPrices", () => {
        it("should search prices and return results", async () => {
            const mockPrices = [{ id: "123", price: "100" }];
            amazonPrice_1.AmazonPrice.find.mockResolvedValue(mockPrices);
            const response = await (0, supertest_1.default)(__1.app).post("/am/v1/prices/search").send({
                predicates: [],
                predicateRelation: "OR",
            });
            expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_OK);
            expect(response.body).toEqual({
                results: mockPrices,
                totalCount: mockPrices.length,
                error: null,
            });
        });
        it("should return an error if the search fails", async () => {
            const mockError = new Error("Search failed");
            amazonPrice_1.AmazonPrice.find.mockRejectedValue(mockError);
            const response = await (0, supertest_1.default)(__1.app).post("/am/v1/prices/search").send({
                predicates: [],
                predicateRelation: "OR",
            });
            expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_SERVER_ERROR);
            expect(response.body.error.message).toBe(`Error searching price: ${mockError.message}`);
        });
    });
    describe("amazonGetPriceById", () => {
        it("should get a price by id and return it", async () => {
            const mockPrice = { id: "123", price: "100" };
            amazonPrice_1.AmazonPrice.findOne.mockResolvedValue(mockPrice);
            const response = await (0, supertest_1.default)(__1.app).get("/am/v1/prices/123");
            expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_OK);
            expect(response.body).toEqual(mockPrice);
        });
        it("should return an error if no price with such id", async () => {
            amazonPrice_1.AmazonPrice.findOne.mockResolvedValue(null);
            const response = await (0, supertest_1.default)(__1.app).get("/am/v1/prices/123");
            expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_NOT_FOUND);
            expect(response.body.error.message).toBe("No price with such ID");
        });
        it("should return an error if the fetch fails", async () => {
            const mockError = new Error("Fetch failed");
            amazonPrice_1.AmazonPrice.findOne.mockRejectedValue(mockError);
            const response = await (0, supertest_1.default)(__1.app).get("/am/v1/prices/123");
            expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_SERVER_ERROR);
            expect(response.body.error.message).toBe(`Error fetching price: ${mockError.message}`);
        });
    });
    describe("amazonSavePrice", () => {
        const mockPrice = {
            _id: "64788e9fec853cb2728dd2f7",
            id: 267428,
            productId: "332230882",
            eventId: 1758913,
            level: 1,
            storeGroupId: 1,
            eventDescription: "Adv Scen 1a",
            value: 22,
            effectiveFrom: "2021-05-20T04:00:00.000Z",
            effectiveTo: "2022-05-21T03:59:59.000Z",
            typePriority: 70,
            typeName: "PROMOTIONAL",
            status: "UPDATED",
            action: "UPDATE",
            temporary: false,
            releasedDate: "2021-05-20T04:00:00.000Z",
            prioritySubType: 23,
            productSellingPriceNumber: 769861206,
            onlineOnly: false,
            timeTestedPrice: 0,
            romanceCopyApproved: false,
            localizedDescriptions: [],
        };
        it("should save a new price and return it", async () => {
            amazonPrice_1.AmazonPrice.findOne.mockResolvedValue(null);
            amazonPrice_1.AmazonPrice.prototype.save.mockResolvedValue(mockPrice);
            const response = await (0, supertest_1.default)(__1.app).put("/am/v1/prices").send(mockPrice);
            expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_OK);
            expect(response.body).toEqual(mockPrice);
        });
        it("should update an existing price and return it", async () => {
            const updatedPrice = {
                priceId: 267428,
                onlineOnly: false,
                romanceCopyApproved: true,
                descriptions: [
                    {
                        locale: "en",
                        shortDescription: "Short Price Description",
                        longDescription: "Long Description",
                    },
                ],
            };
            amazonPrice_1.AmazonPrice.prototype.save.mockResolvedValue(updatedPrice);
            const response = await (0, supertest_1.default)(__1.app)
                .put("/am/v1/prices")
                .send(updatedPrice);
            expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_OK);
            expect(response.body).toEqual(updatedPrice);
        });
        it("should return an error if the save fails", async () => {
            const mockError = new Error("Save failed");
            amazonPrice_1.AmazonPrice.prototype.save.mockRejectedValue(mockError);
            const response = await (0, supertest_1.default)(__1.app).put("/am/v1/prices").send(mockPrice);
            expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_SERVER_ERROR);
            expect(response.body.error.message).toBe(`Error saving price: ${mockError.message}`);
        });
    });
});
