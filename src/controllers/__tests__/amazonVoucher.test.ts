import request from "supertest";
import mongoose from "mongoose";
import { app, server } from "../..";
import {
  RESPONSE_CODE_NOT_FOUND,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../../constants/responseCodes";
import {
  AmazonVoucher,
  CustomAmazonVoucher,
  PromotionalAmazonVoucher,
  SerialAmazonVoucher,
} from "../../models/amazonVoucher";

jest.mock("../../models/amazonVoucher");

describe("amazonVouchers", () => {
  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  describe("amazonSearchVoucher", () => {
    it("should return vouchers and total count", async () => {
      const mockVouchers = [{ VoucherType: "type1" }, { VoucherType: "type2" }];

      (AmazonVoucher.find as jest.Mock).mockResolvedValue(mockVouchers);

      const response = await request(app).post("/am/v1/vouchers/search").send({
        predicates: [],
        predicateRelation: "AND",
        voucherType: "test",
      });

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body.results).toEqual(mockVouchers);
      expect(response.body.totalCount).toBe(mockVouchers.length);
      expect(response.body.error).toBeNull();
    });

    it("should return an error if the search fails", async () => {
      const mockError = new Error("Search failed");

      (AmazonVoucher.find as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app).post("/am/v1/vouchers/search").send({
        predicates: [],
        predicateRelation: "AND",
        voucherType: "invalid_type",
      });

      expect(response.status).toBe(RESPONSE_CODE_SERVER_ERROR);
      expect(response.body.data).toBeNull();
      expect(response.body.error.message).toBe(
        `Error searching vouchers: ${mockError.message}`,
      );
    });
  });

  describe("amazonGetVoucherById", () => {
    it("should return a voucher if it exists", async () => {
      const mockVoucher = { voucherId: "123", voucherType: "type1" };

      (AmazonVoucher.findOne as jest.Mock).mockResolvedValue(mockVoucher);

      const response = await request(app).get("/am/v1/vouchers/123");

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual(mockVoucher);
    });

    it("should return an error if the voucher does not exist", async () => {
      (AmazonVoucher.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/am/v1/vouchers/123");

      expect(response.status).toBe(RESPONSE_CODE_NOT_FOUND);
      expect(response.body.data).toBeNull();
      expect(response.body.error.message).toBe("No voucher with such ID");
    });

    it("should return an error if the database query fails", async () => {
      const mockError = new Error("Database query failed");

      (AmazonVoucher.findOne as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app).get("/am/v1/vouchers/123");

      expect(response.status).toBe(RESPONSE_CODE_SERVER_ERROR);
      expect(response.body.results).toBeNull();
      expect(response.body.error.message).toBe(
        `Error fetching voucher: ${mockError.message}`,
      );
    });
  });

  describe("amazonSaveVoucher", () => {
    const mockPromotionalVoucher = {
      _id: "64e36b5e66de4a205062e683",
      id: 1000252,
      voucherName: "ar-test123233",
      voucherCode: {
        code: "TEST-68UJ51REFKY4QE25MQ",
        quantityRedeemableVouchers: 1,
        dateTimeGenerated: "2023-03-06T09:40:47.160Z",
      },
      voucherType: "PROMOTIONAL",
      discountAmount: 10,
      discountType: "DOLLAR",
      enabled: true,
      redemptionsPerCart: 2,
      effectiveFrom: "Mon Feb 27 2023 12:47:45 GMT+0400 (GMT+04:00)",
      effectiveTo: "Wed Mar 01 2023 00:00:00 GMT+0400 (GMT+04:00)",
      modified: "2023-03-06T09:40:47.000Z",
      creationDate: "2023-02-27T01:49:39.784Z",
      romanceCopyApproved: false,
      restrictionRomanceCopyApproved: false,
      codePrefix: "TEST",
      voucherCodeQuantity: 1,
      localizedDescriptions: [
        {
          _id: "657e8d8750145d69cdfb721d",
          locale: "en",
          shortDescription: "short desc",
          longDescription: "long desc",
        },
      ],
      restrictionLocalizedDescriptions: [],
      restrictions: [],
      invalid: false,
      code: "TEST-68UJ51REFKY4QE25MQ",
      quantityRedeemableVouchers: 1,
      dateTimeGenerated: "2023-03-06T09:40:47.160Z",
      custom: false,
      serial: false,
    };

    const mockSerialVoucher = {
      _id: "65472f599c87ce44fcd49825",
      id: 1009001,
      voucherName: "Mock Serial Voucher",
      voucherCode: {
        code: "1",
        quantityRedeemableVouchers: 1,
        dateTimeGenerated: "2023-02-27T08:47:45.859Z",
      },
      voucherType: "SERIAL",
      discountAmount: 5,
      discountType: "DOLLAR",
      enabled: false,
      redemptionsPerCart: 5,
      effectiveFrom: "Tue Feb 21 2023 12:47:45 GMT+0400 (GMT+04:00)",
      effectiveTo: "Wed Dec 27 2023 12:47:45 GMT+0400 (GMT+04:00)",
      modified: "2023-03-02T09:37:45.859Z",
      creationDate: "2023-02-27T08:47:45.859Z",
      romanceCopyApproved: false,
      restrictionRomanceCopyApproved: false,
      codePrefix: "prefix",
      voucherCodeQuantity: 10,
      localizedDescriptions: [],
      restrictionLocalizedDescriptions: [],
      restrictions: [],
      code: "code",
      dateTimeGenerated: {
        $date: null,
      },
      quantityRedeemableVouchers: 10,
      serial: true,
      custom: false,
      invalid: false,
    };

    it("should save a promotional voucher", async () => {
      (PromotionalAmazonVoucher.findOne as jest.Mock).mockResolvedValue(null);
      (PromotionalAmazonVoucher.prototype.save as jest.Mock).mockResolvedValue(
        mockPromotionalVoucher,
      );

      const response = await request(app)
        .put("/am/v1/vouchers")
        .send(mockPromotionalVoucher);

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual(mockPromotionalVoucher);
    });

    it("should save a custom voucher", async () => {
      const mockVoucher = { id: "123", voucherType: "CUSTOM" };

      (CustomAmazonVoucher.findOne as jest.Mock).mockResolvedValue(null);
      (CustomAmazonVoucher.prototype.save as jest.Mock).mockResolvedValue(
        mockVoucher,
      );

      const response = await request(app)
        .put("/am/v1/vouchers")
        .send(mockVoucher);

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual(mockVoucher);
    });

    it("should save a serial voucher", async () => {
      (SerialAmazonVoucher.findOne as jest.Mock).mockResolvedValue(null);
      (SerialAmazonVoucher.prototype.save as jest.Mock).mockResolvedValue(
        mockSerialVoucher,
      );

      const response = await request(app)
        .put("/am/v1/vouchers")
        .send(mockSerialVoucher);

      expect(response.status).toBe(RESPONSE_CODE_OK);
      expect(response.body).toEqual(mockSerialVoucher);
    });

    it("should return an error if the voucher type is invalid", async () => {
      const mockVoucher = { id: "123", voucherType: "INVALID_TYPE" };

      const response = await request(app)
        .put("/am/v1/vouchers")
        .send(mockVoucher);

      expect(response.status).toBe(RESPONSE_CODE_SERVER_ERROR);
      expect(response.body.error.message).toBe(
        "Error saving voucher: Invalid voucher type",
      );
    });

    it("should return an error if the voucher validation fails", async () => {
      const mockVoucher = { id: "123", voucherType: "PROMOTIONAL" };
      const mockError = new Error("Validation failed");

      (PromotionalAmazonVoucher.findOne as jest.Mock).mockResolvedValue(null);
      (
        PromotionalAmazonVoucher.prototype.validateSync as jest.Mock
      ).mockReturnValue(mockError);

      const response = await request(app)
        .put("/am/v1/vouchers")
        .send(mockVoucher);

      expect(response.status).toBe(RESPONSE_CODE_SERVER_ERROR);
      expect(response.body.error.message).toBe(
        `Error saving voucher: ${mockError.message}`,
      );
    });
  });
});
