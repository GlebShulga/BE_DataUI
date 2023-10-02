import { Request, Response } from "express";
import {
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
import { Product } from "../models";

export async function getProductsList(req: Request, res: Response) {
  try {
    const productList = await Product.find(
      {},
      { _id: 1, title: 1, description: 1, price: 1 }
    );

    res.status(RESPONSE_CODE_OK).json({
      data: productList,
      error: null,
    });
  } catch (error) {
    const errorMessage =
      "Error fetching products: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        data: null,
        error: { message: "No product with such ID" },
      });
    }

    res.status(RESPONSE_CODE_OK).json({
      data: product,
      error: null,
    });
  } catch (error) {
    const errorMessage =
      "Error fetching product: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}
