import { Request, Response } from "express";
import { Product, Category } from "../models/productCategory";
import {
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";

export async function amazonSearchProductOrCategory(
  req: Request,
  res: Response,
) {
  const PRODUCT_SEARCH_TYPE = "STYLE_SEARCH";
  const BULK_PRODUCT_SEARCH_TYPE = "STYLE_BULK_SEARCH";
  const CATEGORY_SEARCH_TYPE = "CATEGORY_SEARCH";
  const BULK_CATEGORY_SEARCH_TYPE = "CATEGORY_BULK_SEARCH";
  const PAGE_SIZE = 5;

  const { query: searchTerm, searchType: type, currentPage = 0 } = req.body;

  try {
    let query = {};

    if (searchTerm) {
      if (
        type === BULK_PRODUCT_SEARCH_TYPE ||
        type === BULK_CATEGORY_SEARCH_TYPE
      ) {
        const styleCodes = searchTerm
          .split(",")
          .map((code: string) => code.trim());
        query = { styleCode: { $in: styleCodes } };
      } else {
        const searchFields = [
          { styleCode: { $regex: searchTerm, $options: "i" } },
          { catalogVersion: { $regex: searchTerm, $options: "i" } },
          { brandName: { $regex: searchTerm, $options: "i" } },
        ];
        query = {
          $or: searchFields,
        };
      }
    }

    let Model;
    if (type === PRODUCT_SEARCH_TYPE || type === BULK_PRODUCT_SEARCH_TYPE) {
      Model = Product;
    } else if (
      type === CATEGORY_SEARCH_TYPE ||
      type === BULK_CATEGORY_SEARCH_TYPE
    ) {
      Model = Category;
    } else {
      throw new Error("Invalid search type");
    }

    const totalResults = await Model.countDocuments(query);
    const totalPages = Math.ceil(totalResults / PAGE_SIZE);

    const productCategory = await Model.find(query)
      .skip(currentPage * PAGE_SIZE)
      .limit(PAGE_SIZE);

    res.status(RESPONSE_CODE_OK).json({
      products: productCategory,
      pagination: {
        currentPage,
        pageSize: PAGE_SIZE,
        totalPages,
        totalResults,
      },
      error: null,
    });
  } catch (error) {
    const errorMessage =
      "Error searching product or category: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}

export async function getProductById(styleCode: string) {
  const product = await Product.findOne({ styleCode });

  if (!product) {
    throw new Error("No product with such ID");
  }
  return product;
}

export async function getCategoryById(code: string) {
  const product = await Product.findOne({ code });

  if (!product) {
    throw new Error("No category with such ID");
  }
  return product;
}

export async function amazonGetProductById(req: Request, res: Response) {
  try {
    const styleCode = req.params.productId;
    const product = await getProductById(styleCode);
    res.status(RESPONSE_CODE_OK).json(product);
  } catch (error) {
    const errorMessage =
      "Error fetching product: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      results: null,
      error: { message: errorMessage },
    });
  }
}
