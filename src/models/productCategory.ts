import mongoose, { Schema } from "mongoose";
import { ProductCategoryDocument } from "../types/productCategory";

export const createSchema = (collectionName: string) =>
  new Schema<ProductCategoryDocument>(
    {
      brandName: { type: String, required: true },
      catalogVersion: { type: String, required: true },
      code: { type: String, required: true },
      description: { type: String, required: true },
      name: { type: String, required: true },
      priceRange: { type: Object, required: false },
      styleCode: { type: String, required: true },
      url: { type: String, required: true },
      hierarchyLevel: { type: Number, enum: [1, 2], required: true },
    },
    { collection: collectionName },
  );

const amazonDBName = process.env.PRODUCT_MONGODB_DB_NAME || "test";
const db = mongoose.connection.useDb(amazonDBName);

export const Product = db.model("Product", createSchema("products"));
export const Category = db.model("Category", createSchema("category"));
