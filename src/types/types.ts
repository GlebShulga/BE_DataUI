export interface User {
  id: string;
}

export interface CartItem {
  product: Product;
  count: number;
}

export interface Cart {
  id: string; // uuid
  userId: string;
  isDeleted: boolean;
  items: CartItem[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  cartId: string;
  items: CartItem[];
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
