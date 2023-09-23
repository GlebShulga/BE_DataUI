import { EntityManager } from "@mikro-orm/core";
import { Cart, Order, Product, User } from "../entities";

export default async (em: EntityManager): Promise<void> => {
  const product1 = new Product("Product 1", "Description 1", 10.0);
  const product2 = new Product("Product 2", "Description 2", 20.0);
  const product3 = new Product("Product 3", "Description 3", 30.0);

  await em.persistAndFlush([product1, product2, product3]);

  const user1 = new User("User 1", "user1@example.com");
  const user2 = new User("User 2", "user2@example.com");

  const cart1 = new Cart(user1);
  const cart2 = new Cart(user2);

  cart1.addItem(product1, 2);
  cart1.addItem(product2, 1);
  cart2.addItem(product3, 3);

  await em.persistAndFlush([cart1, cart2]);

  const order1 = new Order(
    user1,
    cart1.id,
    [
      { product: product1, count: 2 },
      { product: product2, count: 1 },
    ],
    {
      type: "credit card",
      address: "123 Main St",
      creditCard: "1234-5678-9012-3456",
    },
    {
      type: "standard",
      address: "456 Oak St",
    },
    "pending",
    100.0,
    "This is a test order"
  );
  const order2 = new Order(
    user2,
    cart2.id,
    [{ product: product3, count: 3 }],
    {
      type: "credit card",
      address: "456 Main St",
      creditCard: "5678-9012-3456-1234",
    },
    {
      type: "express",
      address: "789 Oak St",
    },
    "pending",
    150.0,
    "This is another test order"
  );

  await em.persistAndFlush([order1, order2]);
};
