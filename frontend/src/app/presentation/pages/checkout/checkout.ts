import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../../data/services/cart';
import { OrderService } from '../../../data/services/order';
import { Order } from '../../../core/domain/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  router = inject(Router);
  fb = inject(FormBuilder);

  checkoutForm!: FormGroup;
  isSubmitting = false;

  readonly salesTaxRate = 0.15;
  readonly shippingFee = 300;

  get taxAmount(): number {
    return this.cartService.totalPrice() * this.salesTaxRate;
  }

  get finalTotal(): number {
    return this.cartService.totalPrice() + this.taxAmount + this.shippingFee;
  }

  ngOnInit() {
    if (this.cartService.cartItems().length === 0) {
      this.router.navigate(['/']);
    }

    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9+\\-\\s]+$')]],
      address: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.checkoutForm.invalid || this.cartService.cartItems().length === 0) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const orderItems = this.cartService.cartItems().map(item => ({
      shoeId: item.shoe.id,
      quantity: item.quantity,
      unitPrice: item.shoe.price
    }));

    const order: Order = {
      customerName: this.checkoutForm.value.fullName,
      deliveryAddress: this.checkoutForm.value.address,
      phoneNumber: this.checkoutForm.value.phone,
      subtotal: this.cartService.totalPrice(),
      salesTax: this.taxAmount,
      shippingFee: this.shippingFee,
      total: this.finalTotal,
      orderItems: orderItems
    };

    this.orderService.submitOrder(order).subscribe({
      next: (savedOrder) => {
        this.cartService.clearCart();
        this.router.navigate(['/order-success'], { state: { order: savedOrder } });
      },
      error: (err) => {
        console.error('Error submitting order', err);
        this.isSubmitting = false;
        alert('There was an error submitting your order. Please try again.');
      }
    });
  }
}
