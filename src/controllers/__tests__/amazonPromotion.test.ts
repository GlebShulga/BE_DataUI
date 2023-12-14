import request from "supertest";
import mongoose from "mongoose";
import { app, server } from "../..";
import {
  AmazonPromotion,
  MultiAmazonPromotion,
} from "../../models/amazonPromotion";

jest.mock("../../models/amazonPromotion");
// jest.mock("../../models/MultiAmazonPromotion");
// jest.mock("../../models/PriceBasedAmazonPromotion");
// jest.mock("../../models/FixedDiscountAmazonPromotion");
// jest.mock("../../models/ShippingAmazonPromotion");
// jest.mock("../../models/XForYAmazonPromotion");
// jest.mock("../../models/SpendAndGetAmazonPromotion");

describe("amazonPromo", () => {
  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  describe("amazonSearchPromo", () => {
    it("should return promotions and total count", async () => {
      const mockPromotions = [
        { promotionType: "type1" },
        { promotionType: "type2" },
      ];

      // Mock the AmazonPromotion.find method
      (AmazonPromotion.find as jest.Mock).mockResolvedValue(mockPromotions);

      const response = await request(app)
        .post("/am/v1/promotions/search")
        .send({
          predicates: [],
          predicateRelation: "AND",
          type: "type1",
        });

      expect(response.status).toBe(200);
      expect(response.body.results).toEqual(mockPromotions);
      expect(response.body.totalCount).toBe(mockPromotions.length);
      expect(response.body.error).toBeNull();
    });

    it("should return an error if the search fails", async () => {
      const mockError = new Error("Search failed");

      (AmazonPromotion.find as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app)
        .post("/am/v1/promotions/search")
        .send({
          predicates: [],
          predicateRelation: "AND",
          type: "type1",
        });

      expect(response.status).toBe(500);
      expect(response.body.data).toBeNull();
      expect(response.body.error.message).toBe(
        `Error searching promotions: ${mockError.message}`,
      );
    });
  });

  describe("amazonGetPromoById", () => {
    it("should return a promotion if it exists", async () => {
      const mockPromotion = { pmmId: "123", promotionType: "type1" };

      (AmazonPromotion.findOne as jest.Mock).mockResolvedValue(mockPromotion);

      const response = await request(app).get("/am/v1/promotions/123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPromotion);
    });

    it("should return an error if the promotion does not exist", async () => {
      (AmazonPromotion.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/am/v1/promotions/123");

      expect(response.status).toBe(404);
      expect(response.body.data).toBeNull();
      expect(response.body.error.message).toBe("No promotion with such ID");
    });

    it("should return an error if the database query fails", async () => {
      const mockError = new Error("Database query failed");

      (AmazonPromotion.findOne as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app).get("/am/v1/promotions/123");

      expect(response.status).toBe(500);
      expect(response.body.results).toBeNull();
      expect(response.body.error.message).toBe(
        `Error fetching promotion: ${mockError.message}`,
      );
    });
  });

  describe("amazonSavePromo", () => {
    afterAll(async () => {
      await server.close();
    });

    it("should create a new promotion if one does not already exist", async () => {
      const mockPromotion = {
        _id: {
          $oid: "64e36ba866de4a205062e690",
        },
        promotionType: "AM_MULTI",
        pmmId: "ef785258-febc-11ed-b149-005056a22361",
        name: "Sample Promo",
        description: "Sample Promo",
        priorityType: 500,
        prioritySubType: 0,
        priceDerivationRuleNumber: "1",
        action: "UPDATE",
        components: [
          {
            purchaseType: "ACTUAL",
            quantity: 1,
            promotionPart: "BUY",
            rewardDerivationRuleNumber: 1,
            items: [
              {
                item: "333519769",
                exclusion: false,
                hierarchyLevel: 1,
              },
            ],
            id: 499159,
          },
        ],
        zones: [
          {
            pmmId: "ef785258-febc-11ed-b149-005056a22361",
            level: 1,
            storesGroupId: 1,
            effectiveFrom: {
              $date: "2023-05-30T07:27:12.000Z",
            },
            modified: {
              $date: "2023-05-30T05:38:42.000Z",
            },
            effectiveTo: {
              $date: "2098-12-31T20:00:00.000Z",
            },
            priceModificationNumber: 1,
          },
        ],
        localizedDescriptions: [
          {
            pmmId: "ef785258-febc-11ed-b149-005056a22361",
            locale: "en",
            shortDescription: "Buy 3, Get One Free*",
            longDescription:
              "Men's, Women's & Kids' Socks Buy One, Get One 50% Off. *2nd Item Must Be Of Equal Or Lesser Value. Selection & Availability May Vary By Location. Excludes Nike, Licensed, Icebreaker, Smartwool & Items Ending in .88c. Order must be completed by December 12th, 2019 1:59 AM ET to qualify.",
          },
          {
            pmmId: "ef785258-febc-11ed-b149-005056a22361",
            locale: "fr",
          },
        ],
        discountType: "DOLLAR",
        totalRetailPrice: 50,
        romanceCopyApproved: false,
        restrictionRomanceCopyApproved: false,
        sourceType: "MANUAL",
        enabled: false,
        applyType: "AUTO",
        restrictions: [],
        spentLimitCheck: false,
      };

      (MultiAmazonPromotion.findOne as jest.Mock).mockResolvedValue(null);

      (MultiAmazonPromotion.prototype.save as jest.Mock).mockResolvedValue(
        mockPromotion,
      );

      const response = await request(app)
        .post("/am/v1/promotions/save")
        .send(mockPromotion);
      console.log("response.body:", response.body);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPromotion);
    });

    // Add more tests as needed to cover other cases
  });
});
