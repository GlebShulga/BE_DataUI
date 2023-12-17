import request from "supertest";
import mongoose from "mongoose";
import { app, server } from "../..";
import {
  AmazonPromotion,
  MultiAmazonPromotion,
  PriceBasedAmazonPromotion,
} from "../../models/amazonPromotion";
import {
  RESPONSE_CODE_NOT_FOUND,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../../constants/responseCodes";

jest.mock("../../models/amazonPromotion");

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

      (AmazonPromotion.find as jest.Mock).mockResolvedValue(mockPromotions);

      const response = await request(app)
        .post("/am/v1/promotions/search")
        .send({
          predicates: [],
          predicateRelation: "AND",
          type: "type1",
        });

      expect(response.status).toBe(RESPONSE_CODE_OK);
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

      expect(response.status).toBe(RESPONSE_CODE_SERVER_ERROR);
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

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual(mockPromotion);
    });

    it("should return an error if the promotion does not exist", async () => {
      (AmazonPromotion.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/am/v1/promotions/123");

      expect(response.status).toBe(RESPONSE_CODE_NOT_FOUND);
      expect(response.body.data).toBeNull();
      expect(response.body.error.message).toBe("No promotion with such ID");
    });

    it("should return an error if the database query fails", async () => {
      const mockError = new Error("Database query failed");

      (AmazonPromotion.findOne as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app).get("/am/v1/promotions/123");

      expect(response.status).toBe(RESPONSE_CODE_SERVER_ERROR);
      expect(response.body.results).toBeNull();
      expect(response.body.error.message).toBe(
        `Error fetching promotion: ${mockError.message}`,
      );
    });
  });

  describe("amazonSavePromo", () => {
    const mockSaveMultiPromo = {
      promotionType: "AM_MULTI",
      pmmId: "f39406bf-fc93-11ed-b66e-005056a25d87",
      name: "2 For Promo Private",
      description: "2 For Promo Private",
      priorityType: 500,
      effectiveFrom: "2023-05-27T08:38:11.000",
      effectiveTo: "2099-01-01T00:00:00.000",
      romanceCopyApproved: true,
      enabled: false,
      localizedDescriptions: [
        {
          _id: "657add6be8917b12f1dd3a85",
          pmmId: "f39406bf-fc93-11ed-b66e-005056a25d87",
          locale: "en",
          shortDescription: "2 For Promo Private SD",
          longDescription: "2 For Promo Private LD",
        },
      ],
      version: 1,
      totalRetailPrice: 50,
      buyComponent: {
        _id: "657add6be8917b12f1dd3a7f",
        purchaseType: "ACTUAL",
        quantity: 1,
        promotionPart: "BUY",
        rewardDerivationRuleNumber: 1,
        items: [
          {
            hierarchyLevel: 2,
            item: "8001",
          },
          {
            hierarchyLevel: 1,
            item: "334020269",
          },
          {
            hierarchyLevel: 1,
            item: "333323951",
          },
        ],
        id: 499160,
      },
    };

    const mockPriceBasedPromo = {
      sourceType: "MANUAL",
      restrictions: [],
      _id: "64e30b6166de4a205062e630",
      promotionType: "AM_PRICE_BASED",
      pmmId: "6945cde6-d212-11ed-93c5-005056a24e03",
      name: "WBO10215",
      description: "WBO10215a",
      priorityType: 500,
      zones: [
        {
          _id: "657c00aea5c9625c05dc2525",
          effectiveFrom: "2023-04-03T12:34:25.000Z",
          effectiveTo: "2098-12-31T20:00:00.000Z",
          modified: "2023-04-03T12:34:25.000Z",
        },
      ],
      actionLog: [
        {
          _id: "657c00aea5c9625c05dc2526",
          pmmId: "6945cde6-d212-11ed-93c5-005056a24e03",
          date: "2023-04-11T19:54:54.000Z",
          enabled: true,
        },
      ],
      romanceCopyApproved: true,
      enabled: false,
      localizedDescriptions: [
        {
          _id: "657c00aea5c9625c05dc2527",
          pmmId: "6945cde6-d212-11ed-93c5-005056a24e03",
          locale: "en",
          shortDescription: "Test",
          longDescription: "Test bug",
        },
      ],
      voucher: {
        id: 1001269,
        description: "WBO10215",
        voucherCode: {
          code: "51EC82VC1J1MVV02DH",
          quantityRedeemableVouchers: 3,
          dateTimeGenerated: "2023-04-11T15:42:33.517",
        },
        voucherType: "PROMOTIONAL",
        discountAmount: 0,
        discountType: "PERCENT",
        enabled: false,
        effectiveFrom: "2023-04-11T15:42:33.514",
        modified: "2023-04-11T15:42:33.000",
        creationDate: "2023-04-11T15:42:33.517",
        romanceCopyApproved: true,
        voucherCodeQuantity: 1,
        localizedDescriptions: [
          {
            pmmId: "6945cde6-d212-11ed-93c5-005056a24e03",
            locale: "en",
            shortDescription: "Test",
            longDescription: "Testubg",
          },
        ],
        invalid: false,
        code: "51EC82VC1J1MVV02DH",
        custom: false,
        quantityRedeemableVouchers: 3,
        dateTimeGenerated: "2023-04-11T15:42:33.517",
        serial: false,
      },
      version: 1,
      discountType: "PERCENT",
      components: [
        {
          _id: "657c00aea5c9625c05dc2528",
          purchaseType: "ACTUAL",
          quantity: 1,
          promotionPart: "BUY",
          rewardDerivationRuleNumber: 1,
          items: [
            {
              _id: "657c00aea5c9625c05dc2529",
              catalogVersion: "Sport equipment Catalog",
              code: "10",
              name: "DPT 10 HOCKEY",
              url: "",
              hierarchyLevel: 2,
              codeField: "code",
            },
          ],
          id: 492764,
        },
      ],
      discountList: [
        {
          priceType: 5,
          priceName: "Permanent",
          discountAmount: 20,
        },
        {
          priceType: 70,
          priceName: "Promotional",
          discountAmount: 40,
        },
        {
          priceType: 1,
          priceName: "Ticket",
          discountAmount: 10,
        },
        {
          priceType: 80,
          priceName: "Doorcrasher",
          discountAmount: 50,
        },
        {
          priceType: 30,
          priceName: "Clearance",
          discountAmount: 30,
        },
      ],
    };

    it("should create a new Multi Promo if one does not already exist", async () => {
      (MultiAmazonPromotion.findOne as jest.Mock).mockResolvedValue(null);

      (MultiAmazonPromotion.prototype.save as jest.Mock).mockResolvedValue(
        mockSaveMultiPromo,
      );

      const response = await request(app)
        .post("/am/v1/promotions/save")
        .send(mockSaveMultiPromo);

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual(mockSaveMultiPromo);
    });

    it("should update an existing Multi Promo if one already exists", async () => {
      let mockSaveMultiPromoDoc = {
        ...mockSaveMultiPromo,
        set: jest.fn(),
        validateSync: jest.fn(),
        save: jest.fn(),
      };

      mockSaveMultiPromoDoc.save = jest
        .fn()
        .mockResolvedValue(mockSaveMultiPromoDoc);

      (MultiAmazonPromotion.findOne as jest.Mock).mockResolvedValue(
        mockSaveMultiPromoDoc,
      );

      (MultiAmazonPromotion.prototype.save as jest.Mock).mockResolvedValue(
        mockSaveMultiPromoDoc,
      );

      const response = await request(app)
        .post("/am/v1/promotions/save")
        .send(mockSaveMultiPromo);

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual({
        ...mockSaveMultiPromo,
        components: [],
        zones: [
          expect.objectContaining({
            effectiveFrom: "2023-05-27T08:38:11.000",
            effectiveTo: "2099-01-01T00:00:00.000",
          }),
        ],
      });
    });

    it("should create a new Price Based Promo if one does not already exist", async () => {
      (PriceBasedAmazonPromotion.findOne as jest.Mock).mockResolvedValue(null);

      (PriceBasedAmazonPromotion.prototype.save as jest.Mock).mockResolvedValue(
        mockPriceBasedPromo,
      );

      const response = await request(app)
        .post("/am/v1/promotions/save")
        .send(mockPriceBasedPromo);

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual(mockPriceBasedPromo);
    });

    it("should update an existing Price Based Promo if one already exists", async () => {
      let mockPriceBasePromoDoc = {
        ...mockPriceBasedPromo,
        set: jest.fn(),
        validateSync: jest.fn(),
        save: jest.fn(),
      };

      mockPriceBasePromoDoc.save = jest
        .fn()
        .mockResolvedValue(mockPriceBasePromoDoc);

      (MultiAmazonPromotion.findOne as jest.Mock).mockResolvedValue(
        mockPriceBasePromoDoc,
      );

      (MultiAmazonPromotion.prototype.save as jest.Mock).mockResolvedValue(
        mockPriceBasePromoDoc,
      );

      const response = await request(app)
        .post("/am/v1/promotions/save")
        .send(mockPriceBasedPromo);

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual({
        ...mockPriceBasedPromo,
        zones: [
          expect.objectContaining({
            effectiveTo: "2098-12-31T20:00:00.000Z",
          }),
        ],
      });
    });

    it("should handle errors", async () => {
      const response = await request(app)
        .post("/am/v1/promotions/save")
        .send({});

      expect(response.status).toBe(RESPONSE_CODE_SERVER_ERROR);
      expect(response.body).toEqual({
        data: null,
        error: { message: "Error saving promotion: Invalid promotion type" },
      });
    });
  });
});
