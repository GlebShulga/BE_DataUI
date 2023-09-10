import path from "path";

const projectRoot = path.resolve(__dirname, "../..");
const dbPath = path.join(projectRoot, "src", "db");

export const ORDERS_FILE_PATH = path.join(dbPath, "orders.json");
export const CARTS_FILE_PATH = path.join(dbPath, "carts.json");
export const PRODUCTS_FILE_PATH = path.join(dbPath, "products.json");
export const USERS_FILE_PATH = path.join(dbPath, "users.json");
