import request from "supertest";
import mongoose from "mongoose";
import { app, server } from "../..";
import {
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../../constants/responseCodes";
import { AmazonPromoVoucherCode } from "../../models/amazonPromoVoucher";

jest.mock("../../models/amazonPromoVoucher");

describe("amazonSearchPromoVoucherCode", () => {
  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  it("should search voucher codes and return results", async () => {
    const mockVoucherId = 123;
    const mockSearchTerm = "ABC";
    const mockVoucherCodes = [{ id: 123, code: "ABC" }];

    (AmazonPromoVoucherCode.find as jest.Mock).mockResolvedValue(
      mockVoucherCodes,
    );

    const response = await request(app)
      .post("/am/v1/vouchers/serial/search")
      .send({ voucherId: mockVoucherId, searchTerm: mockSearchTerm });

    expect(response.status).toBe(RESPONSE_CODE_OK);
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

    (AmazonPromoVoucherCode.find as jest.Mock).mockRejectedValue(mockError);

    const response = await request(app)
      .post("/am/v1/vouchers/serial/search")
      .send({ voucherId: mockVoucherId, searchTerm: mockSearchTerm });

    expect(response.status).toBe(RESPONSE_CODE_SERVER_ERROR);
    expect(response.body.error.message).toBe(
      `Error searching voucher code: ${mockError.message}`,
    );
  });
});
