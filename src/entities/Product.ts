import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuidv4 } from "uuid";

@Entity({ tableName: "products" })
export class Product {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  title!: string;

  @Property()
  description!: string;

  @Property()
  price!: number;

  constructor(title: string, description: string, price: number) {
    this.title = title;
    this.description = description;
    this.price = price;
  }
}
