import request from "supertest";
import mongoose from "mongoose";
import { app, server } from "../..";
import {
  RESPONSE_CODE_NOT_FOUND,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../../constants/responseCodes";
import { IHerbPrice } from "../../models/iHerbPrice";

jest.mock("../../models/iHerbPrice");

describe("iHerbPrices", () => {
  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  describe("iHerbSearchPrices", () => {
    const mockPredicateRelation = "OR";
    const mockPriceType = "regular";

    it("should return prices that match the search criteria", async () => {
      const mockPrices = [
        { id: "1", price: 10, currency: "CAD", type: mockPriceType },
        { id: "2", price: 10, currency: "CAD", type: mockPriceType },
      ];

      (IHerbPrice.find as jest.Mock).mockResolvedValue(mockPrices);

      const response = await request(app).post("/ih/v1/prices/search").send({
        predicates: [],
        predicateRelation: mockPredicateRelation,
        type: mockPriceType,
      });

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual({
        results: mockPrices,
        totalCount: mockPrices.length,
        error: null,
      });
    });

    it("should return an error if the search fails", async () => {
      const mockError = new Error("Search failed");

      (IHerbPrice.find as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app).post("/ih/v1/prices/search").send({
        predicates: [],
        predicateRelation: mockPredicateRelation,
        type: mockPriceType,
      });

      expect(response.status).toBe(RESPONSE_CODE_SERVER_ERROR);
      expect(response.body.error.message).toBe(
        `Error searching price: ${mockError.message}`,
      );
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

      (IHerbPrice.findOne as jest.Mock).mockResolvedValue(mockPrice);

      const response = await request(app).get(`/ih/v1/prices/${mockPriceId}`);

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual(mockPrice);
    });

    it("should return an error if no price with the given ID exists", async () => {
      const mockPriceId = "1";

      (IHerbPrice.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get(`/ih/v1/prices/${mockPriceId}`);

      expect(response.status).toBe(RESPONSE_CODE_NOT_FOUND);
      expect(response.body.error.message).toBe("No price with such ID");
    });

    it("should return an error if fetching the price fails", async () => {
      const mockPriceId = "1";
      const mockError = new Error("Fetch failed");

      (IHerbPrice.findOne as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app).get(`/ih/v1/prices/${mockPriceId}`);

      expect(response.status).toBe(RESPONSE_CODE_SERVER_ERROR);
      expect(response.body.error.message).toBe(
        `Error fetching price: ${mockError.message}`,
      );
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
      (IHerbPrice.findOne as jest.Mock).mockResolvedValue(null);
      (IHerbPrice.prototype.save as jest.Mock).mockResolvedValue(mockPrice);

      const response = await request(app)
        .post("/ih/v1/prices/updateDescription")
        .send(mockPrice);

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual(mockPrice);
    });

    it("should return an error if saving the price fails", async () => {
      const mockError = new Error("Save failed");

      (IHerbPrice.prototype.save as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app)
        .post("/ih/v1/prices/updateDescription")
        .send(mockPrice);

      expect(response.status).toBe(RESPONSE_CODE_SERVER_ERROR);
      expect(response.body.error.message).toBe(
        `Error saving price: ${mockError.message}`,
      );
    });
  });
});
