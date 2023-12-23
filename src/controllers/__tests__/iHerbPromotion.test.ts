import request from "supertest";
import mongoose from "mongoose";
import { app, server } from "../..";
import {
  RESPONSE_CODE_NOT_FOUND,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../../constants/responseCodes";
import {
  FreeShippingIHerbPromotion,
  IHerbPromotion,
  ItemRewardIHerbPromotion,
} from "../../models/iHerbPromotion";

jest.mock("../../models/iHerbPromotion");

describe("iHerbPromo", () => {
  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  describe("iHerbSearchPromo", () => {
    it("should search promotions and return results", async () => {
      const mockPredicateRelation = "AND";
      const mockPromotionType = "type1";
      const mockPromotions = [
        { promotionType: "type1" },
        { promotionType: "type2" },
      ];

      (IHerbPromotion.find as jest.Mock).mockResolvedValue(mockPromotions);

      const response = await request(app)
        .post("/ih/v1/promotions/search")
        .send({
          predicates: [],
          predicateRelation: mockPredicateRelation,
          type: mockPromotionType,
        });

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual({
        results: mockPromotions,
        totalCount: mockPromotions.length,
        error: null,
      });
    });

    it("should return an error if the search fails", async () => {
      const mockPredicateRelation = "AND";
      const mockPromotionType = "type1";
      const mockError = new Error("Search failed");

      (IHerbPromotion.find as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app)
        .post("/ih/v1/promotions/search")
        .send({
          predicates: [],
          predicateRelation: mockPredicateRelation,
          type: mockPromotionType,
        });

      expect(response.status).toBe(RESPONSE_CODE_SERVER_ERROR);
      expect(response.body.error.message).toBe(
        `Error searching promotions: ${mockError.message}`,
      );
    });
  });

  describe("iHerbGetPromoById", () => {
    it("should return a promotion if it exists", async () => {
      const mockPromotion = { pmmId: "123", promotionType: "type1" };

      (IHerbPromotion.findOne as jest.Mock).mockResolvedValue(mockPromotion);

      const response = await request(app).get("/ih/v1/promotions/123");

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual(mockPromotion);
    });

    it("should return an error if the promotion does not exist", async () => {
      (IHerbPromotion.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/ih/v1/promotions/123");

      expect(response.status).toBe(RESPONSE_CODE_NOT_FOUND);
      expect(response.body.data).toBeNull();
      expect(response.body.error.message).toBe("No promotion with such ID");
    });

    it("should return an error if the database query fails", async () => {
      const mockError = new Error("Database query failed");

      (IHerbPromotion.findOne as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app).get("/ih/v1/promotions/123");

      expect(response.status).toBe(RESPONSE_CODE_SERVER_ERROR);
      expect(response.body.results).toBeNull();
      expect(response.body.error.message).toBe(
        `Error fetching promotion: ${mockError.message}`,
      );
    });
  });

  describe("iHerbSavePromo", () => {
    const mockSaveItemRewardPromo = {
      pmmId: "4d8f4e82",
      promotionType: "ITEM_REWARD",
      name: "Promotion 12",
      description: "Lorem ipsum dolor sit amet",
      components: [
        {
          id: 1,
          purchaseType: "ACTUAL",
          quantity: 1,
          promotionPart: "BUY",
          modificationAmount: 5,
          modificationType: "DOLLAR",
          items: [],
        },
      ],
      localizedPromotionDetails: [
        {
          _id: "6582a58956ac9ea6e425e867",
          pmmId: "4d8f4e82",
          locale: "en",
          shortDescription: "Short description",
          longDescription: "Long description",
        },
      ],
      zones: [
        {
          _id: "6582a58956ac9ea6e425e866",
          effectiveFrom: "2022-01-20T04:00:00.000",
          effectiveTo: "2022-12-31T23:59:59.000Z",
        },
      ],
      modified: "2023-01-01T10:00:00.000Z",
      promotionVouchers: [],
      stackable: true,
      enabled: false,
      sourceType: "MANUAL",
      freeShippingIncluded: true,
    };

    const mockSaveFreeShippingPromo = {
      pmmId: "shippingPromo001",
      promotionType: "FREE_SHIPPING",
      name: "Free Shipping Promo",
      description: "Enjoy free shipping on orders over $50.",
      components: [
        {
          purchaseType: "ACTUAL",
          quantity: 1,
          spendAmount: 50,
          promotionPart: "BUY",
          modificationAmount: "1",
          modificationType: "PERCENT",
          items: [],
        },
      ],
      localizedPromotionDetails: [
        {
          _id: "6582ac8584cbdd300993d84d",
          shortDescription: "No shipping charges for orders over $50.",
          longDescription: "Shop now and save on shipping!",
          locale: "en",
        },
      ],
      zones: [
        {
          _id: "6582ac8584cbdd300993d84e",
          effectiveFrom: "2022-01-27T04:00:00.000",
          effectiveTo: "2023-12-28T00:00:00.000Z",
        },
      ],
      modified: "2022-03-18T00:00:00.000Z",
      promotionVouchers: [],
      stackable: false,
      enabled: true,
      sourceType: "MANUAL",
      modificationAmount: 0,
      spendAmount: 50,
      quantityThreshold: 1,
    };

    it("should create a new Item Reward Promo if one does not already exist", async () => {
      (ItemRewardIHerbPromotion.findOne as jest.Mock).mockResolvedValue(null);

      (ItemRewardIHerbPromotion.prototype.save as jest.Mock).mockResolvedValue(
        mockSaveItemRewardPromo,
      );

      const response = await request(app)
        .post("/ih/v1/promotions/save")
        .send(mockSaveItemRewardPromo);

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual(mockSaveItemRewardPromo);
    });

    it("should update an existing Item Reward Promo if one already exists", async () => {
      let mockSaveItemRewardPromoDoc = {
        ...mockSaveItemRewardPromo,
        set: jest.fn(),
        validateSync: jest.fn(),
        save: jest.fn(),
      };

      mockSaveItemRewardPromoDoc.save = jest
        .fn()
        .mockResolvedValue(mockSaveItemRewardPromoDoc);

      (ItemRewardIHerbPromotion.findOne as jest.Mock).mockResolvedValue(
        mockSaveItemRewardPromoDoc,
      );

      (ItemRewardIHerbPromotion.prototype.save as jest.Mock).mockResolvedValue(
        mockSaveItemRewardPromoDoc,
      );

      const response = await request(app)
        .post("/ih/v1/promotions/save")
        .send(mockSaveItemRewardPromo);

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual(mockSaveItemRewardPromo);
    });

    it("should create a new Free Shipping Promo if one does not already exist", async () => {
      (FreeShippingIHerbPromotion.findOne as jest.Mock).mockResolvedValue(null);

      (
        FreeShippingIHerbPromotion.prototype.save as jest.Mock
      ).mockResolvedValue(mockSaveFreeShippingPromo);

      const response = await request(app)
        .post("/ih/v1/promotions/save")
        .send(mockSaveFreeShippingPromo);

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual(mockSaveFreeShippingPromo);
    });

    it("should update an existing Free Shipping Promo if one already exists", async () => {
      let mockSaveFreeShippingPromoDoc = {
        ...mockSaveFreeShippingPromo,
        set: jest.fn(),
        validateSync: jest.fn(),
        save: jest.fn(),
      };

      mockSaveFreeShippingPromoDoc.save = jest
        .fn()
        .mockResolvedValue(mockSaveFreeShippingPromoDoc);

      (FreeShippingIHerbPromotion.findOne as jest.Mock).mockResolvedValue(
        mockSaveFreeShippingPromoDoc,
      );

      (
        FreeShippingIHerbPromotion.prototype.save as jest.Mock
      ).mockResolvedValue(mockSaveFreeShippingPromoDoc);

      const response = await request(app)
        .post("/ih/v1/promotions/save")
        .send(mockSaveFreeShippingPromo);

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual(mockSaveFreeShippingPromo);
    });

    it("should handle errors", async () => {
      const response = await request(app)
        .post("/ih/v1/promotions/save")
        .send({});

      expect(response.status).toBe(RESPONSE_CODE_SERVER_ERROR);
      expect(response.body).toEqual({
        data: null,
        error: { message: "Error saving promotion: Invalid promotion type" },
      });
    });
  });
});
