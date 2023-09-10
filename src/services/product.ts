import { readFile } from "fs/promises";
import { PRODUCTS_FILE_PATH } from "../constants/filePaths";
import { Product } from "../types/types";

export async function getProduct(
  productId?: string
): Promise<Product | Product[] | undefined> {
  try {
    // Read products data from the file
    const productsData = await readFile(PRODUCTS_FILE_PATH, "utf8");
    const productList: Product[] = JSON.parse(productsData);

    if (productId) {
      // If productId is provided, find and return the specific product
      const product = productList.find((p) => p.id === productId);
      return product || undefined;
    } else {
      // If productId is not provided, return the entire product list
      return productList;
    }
  } catch (error) {
    throw new Error("Error fetching product(s)");
  }
}
