import { Request } from "express";
import { EntityManager } from "@mikro-orm/core";
import { ObjectId } from "mongoose";

export interface IUser {
  _id: ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}

export interface ICartItem {
  product: IProduct;
  count: number;
}

export interface ICart {
  _id: ObjectId;
  user: ObjectId;
  isDeleted: boolean;
  items: ICartItem[];
}

export interface IProduct {
  _id: ObjectId;
  title: string;
  description: string;
  price: number;
}

export interface IOrder {
  id: string;
  userId: string;
  cartId: string;
  items: ICartItem[];
  payment: {
    type: string;
    address: string;
    creditCard: string;
  };
  delivery: {
    type: string;
    address: string;
  };
  comments?: string;
  status: string;
  totalPrice: number;
}

export interface CustomRequest extends Request {
  orm: EntityManager;
}
