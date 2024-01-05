"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const __1 = require("../..");
const responseCodes_1 = require("../../constants/responseCodes");
const iHerbPrice_1 = require("../../models/iHerbPrice");
jest.mock("../../models/iHerbPrice");
describe("iHerbPrices", () => {
    afterAll(async () => {
        await __1.server.close();
        await mongoose_1.default.connection.close();
    });
    describe("iHerbSearchPrices", () => {
        const mockPredicateRelation = "OR";
        const mockPriceType = "regular";
        it("should return prices that match the search criteria", async () => {
            const mockPrices = [
                { id: "1", price: 10, currency: "CAD", type: mockPriceType },
                { id: "2", price: 10, currency: "CAD", type: mockPriceType },
            ];
            iHerbPrice_1.IHerbPrice.find.mockResolvedValue(mockPrices);
            const response = await (0, supertest_1.default)(__1.app).post("/ih/v1/prices/search").send({
                predicates: [],
                predicateRelation: mockPredicateRelation,
                type: mockPriceType,
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
            iHerbPrice_1.IHerbPrice.find.mockRejectedValue(mockError);
            const response = await (0, supertest_1.default)(__1.app).post("/ih/v1/prices/search").send({
                predicates: [],
                predicateRelation: mockPredicateRelation,
                type: mockPriceType,
            });
            expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_SERVER_ERROR);
            expect(response.body.error.message).toBe(`Error searching price: ${mockError.message}`);
        });
    });
    describe("iHerbGetPriceById", () => {
        it("should return the price with the given ID", async () => {
            const mockPriceId = "1";
            const mockPrice = {
                _id: mockPriceId,
                price: 10,
                currency: "CAD",
                type: "regular",
            };
            iHerbPrice_1.IHerbPrice.findOne.mockResolvedValue(mockPrice);
            const response = await (0, supertest_1.default)(__1.app).get(`/ih/v1/prices/${mockPriceId}`);
            expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_OK);
            expect(response.body).toEqual(mockPrice);
        });
        it("should return an error if no price with the given ID exists", async () => {
            const mockPriceId = "1";
            iHerbPrice_1.IHerbPrice.findOne.mockResolvedValue(null);
            const response = await (0, supertest_1.default)(__1.app).get(`/ih/v1/prices/${mockPriceId}`);
            expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_NOT_FOUND);
            expect(response.body.error.message).toBe("No price with such ID");
        });
        it("should return an error if fetching the price fails", async () => {
            const mockPriceId = "1";
            const mockError = new Error("Fetch failed");
            iHerbPrice_1.IHerbPrice.findOne.mockRejectedValue(mockError);
            const response = await (0, supertest_1.default)(__1.app).get(`/ih/v1/prices/${mockPriceId}`);
            expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_SERVER_ERROR);
            expect(response.body.error.message).toBe(`Error fetching price: ${mockError.message}`);
        });
    });
    describe("iHerbSavePrice", () => {
        const mockPrice = {
            priceEventId: "23584554",
            descriptions: [
                {
                    locale: "en",
                    shortDescription: "short Description English",
                    longDescription: null,
                },
            ],
        };
        it("should update an existing price", async () => {
            iHerbPrice_1.IHerbPrice.findOne.mockResolvedValue(null);
            iHerbPrice_1.IHerbPrice.prototype.save.mockResolvedValue(mockPrice);
            const response = await (0, supertest_1.default)(__1.app)
                .post("/ih/v1/prices/updateDescription")
                .send(mockPrice);
            expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_OK);
            expect(response.body).toEqual(mockPrice);
        });
        it("should return an error if saving the price fails", async () => {
            const mockError = new Error("Save failed");
            iHerbPrice_1.IHerbPrice.prototype.save.mockRejectedValue(mockError);
            const response = await (0, supertest_1.default)(__1.app)
                .post("/ih/v1/prices/updateDescription")
                .send(mockPrice);
            expect(response.status).toBe(responseCodes_1.RESPONSE_CODE_SERVER_ERROR);
            expect(response.body.error.message).toBe(`Error saving price: ${mockError.message}`);
        });
    });
});
