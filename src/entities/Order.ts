import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuidv4 } from "uuid";
import { CartItem } from "../types/types";
import { User } from "./User";

@Entity({ tableName: "orders" })
export class Order {
  @PrimaryKey()
  id: string = uuidv4();

  @ManyToOne(() => User)
  user!: User;

  @Property()
  cartId: string;

  @Property({ type: "json" })
  items: CartItem[];

  @Property({ type: "json" })
  payment: {
    type: string;
    address: string;
    creditCard: string;
  };

  @Property({ type: "json" })
  delivery: {
    type: string;
    address: string;
  };

  @Property({ nullable: true })
  comments?: string;

  @Property()
  status: string;

  @Property()
  totalPrice: number;

  constructor(
    user: User,
    cartId: string,
    items: CartItem[],
    payment: {
      type: string;
      address: string;
      creditCard: string;
    },
    delivery: {
      type: string;
      address: string;
    },
    status: string,
    totalPrice: number,
    comments?: string
  ) {
    this.user = user;
    this.cartId = cartId;
    this.items = items;
    this.payment = payment;
    this.delivery = delivery;
    this.status = status;
    this.totalPrice = totalPrice;
    this.comments = comments;
  }
}
