
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  published: boolean;
  shippingCost: number;
}

export interface Order {
  id: string;
  trackingId: string;
  userId: string;
  userEmail: string;
  userPhone: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingCost: number;
  landmark: string;
  status: OrderStatus;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export type OrderStatus = 'Order Placed' | 'Order Packed' | 'Order Shipped' | 'Order Delivered' | 'Order Cancelled';

export interface Currency {
  code: string;
  symbol: string;
  conversionRate: number;
}
