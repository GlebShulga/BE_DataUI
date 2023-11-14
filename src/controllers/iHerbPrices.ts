import { Request, Response } from "express";
import { IHerbPrice } from "../models/iHerbPrice";
import {
  RESPONSE_CODE_NOT_FOUND,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";

export async function iHerbSearchPrices(req: Request, res: Response) {
  const searchTerm = req.body.searchTerm;
  const { type } = req.body;

  try {
    let query = {};

    const searchFields = [
      { pmmId: { $regex: searchTerm, $options: "i" } },
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ]; // TODO: check which fields are searchable for Price

    if (searchTerm && type) {
      query = {
        type,
        $or: searchFields,
      };
    } else if (type) {
      query = { type };
    } else if (searchTerm) {
      query = {
        $or: searchFields,
      };
    }

    const price = await IHerbPrice.find(query);

    const totalCount = price.length;

    res.status(RESPONSE_CODE_OK).json({
      results: price,
      totalCount,
      error: null,
    });
  } catch (error) {
    const errorMessage =
      "Error searching price: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}

export async function iHerbGetPriceById(req: Request, res: Response) {
  try {
    const priceEventId = req.params.priceId;

    const price = await IHerbPrice.findOne({ priceEventId });

    if (!price) {
      return res.status(RESPONSE_CODE_NOT_FOUND).json({
        data: null,
        error: { message: "No price with such ID" },
      });
    }

    res.status(RESPONSE_CODE_OK).json(price);
  } catch (error) {
    const errorMessage =
      "Error fetching price: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      results: null,
      error: { message: errorMessage },
    });
  }
}

export async function iHerbSavePrice(req: Request, res: Response) {
  try {
    const savedPrice = req.body;
    const { priceEventId } = savedPrice;

    let price;

    price = await IHerbPrice.findOne({ priceEventId });
    if (!price) {
      price = new IHerbPrice(savedPrice);
    } else {
      // price.set("localizedDescriptions", savedPrice.descriptions);
      price.set(savedPrice);
    }

    const validationError = price.validateSync();

    if (validationError) {
      throw validationError;
    }

    const updatedPromo = await price.save();

    res.status(RESPONSE_CODE_OK).json(updatedPromo);
  } catch (error) {
    const errorMessage =
      "Error saving price: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}
