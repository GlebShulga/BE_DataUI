import { readFile } from "fs/promises";
import { PRODUCTS_FILE_PATH } from "../constants/filePaths";
import { Product } from "../types/types";

export async function getProduct(
  productId?: string
): Promise<Product | Product[] | undefined> {
  try {
    const productsData = await readFile(PRODUCTS_FILE_PATH, "utf8");
    const productList: Product[] = JSON.parse(productsData);

    if (productId) {
      const product = productList.find((p) => p.id === productId);
      return product || undefined;
    } else {
      return productList;
    }
  } catch (error) {
    throw new Error("Error fetching product(s)");
  }
}
