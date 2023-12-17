import request from "supertest";
import mongoose from "mongoose";
import { app, server } from "../..";
import {
  RESPONSE_CODE_NOT_FOUND,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../../constants/responseCodes";
import { AmazonVoucher } from "../../models/amazonVoucher";

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

  describe("amazonSaveVoucher", () => {});
});
