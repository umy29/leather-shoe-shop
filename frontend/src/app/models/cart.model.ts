import { Shoe } from './shoe.model';

export interface CartItem {
  shoe: Shoe;
  quantity: number;
}
