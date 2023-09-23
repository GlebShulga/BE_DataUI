import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { v4 as uuidv4 } from "uuid";
import { Cart } from "./Cart";
import { Order } from "./Order";

@Entity({ tableName: "users" })
export class User {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  username!: string;

  @Property()
  email!: string;

  @OneToOne(() => Cart, { nullable: true })
  cart?: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders = new Collection<Order>(this);

  constructor(username: string, email: string) {
    this.username = username;
    this.email = email;
  }
}
