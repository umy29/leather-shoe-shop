import { Shoe } from './shoe.model';

export interface OrderItem {
  id?: number;
  orderId?: number;
  shoeId: number;
  quantity: number;
  unitPrice: number;
  shoe?: Shoe;
}

export interface Order {
  id?: number;
  orderNumber?: string;
  customerName: string;
  deliveryAddress: string;
  phoneNumber: string;
  subtotal: number;
  salesTax: number;
  shippingFee: number;
  total: number;
  orderDate?: string;
  orderItems: OrderItem[];
}
