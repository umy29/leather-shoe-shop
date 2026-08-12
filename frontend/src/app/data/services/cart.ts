import { Injectable, computed, signal } from '@angular/core';
import { Shoe } from '../../core/domain/models/shoe.model';
import { CartItem } from '../../core/domain/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSignal = signal<CartItem[]>([]);

  readonly cartItems = this.cartItemsSignal.asReadonly();
  
  readonly totalItems = computed(() => {
    return this.cartItemsSignal().reduce((total, item) => total + item.quantity, 0);
  });

  readonly totalPrice = computed(() => {
    return this.cartItemsSignal().reduce((total, item) => total + (item.shoe.price * item.quantity), 0);
  });

  readonly isCartOpen = signal<boolean>(false);

  toggleCart() {
    this.isCartOpen.set(!this.isCartOpen());
  }

  openCart() {
    this.isCartOpen.set(true);
  }

  closeCart() {
    this.isCartOpen.set(false);
  }

  addToCart(shoe: Shoe) {
    this.cartItemsSignal.update(items => {
      const existingItem = items.find(item => item.shoe.id === shoe.id);
      if (existingItem) {
        return items.map(item => 
          item.shoe.id === shoe.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...items, { shoe, quantity: 1 }];
    });
    this.openCart(); // Automatically open cart when adding
  }

  removeFromCart(shoeId: number) {
    this.cartItemsSignal.update(items => items.filter(item => item.shoe.id !== shoeId));
  }

  updateQuantity(shoeId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(shoeId);
      return;
    }
    
    this.cartItemsSignal.update(items => 
      items.map(item => 
        item.shoe.id === shoeId 
          ? { ...item, quantity } 
          : item
      )
    );
  }

  clearCart() {
    this.cartItemsSignal.set([]);
  }
}
