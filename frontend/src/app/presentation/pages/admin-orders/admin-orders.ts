import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../../data/services/order';
import { Order } from '../../../core/domain/models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css'
})
export class AdminOrders implements OnInit {
  orderService = inject(OrderService);
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  loading = true;

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.loading = false;
      }
    });
  }

  viewDetails(order: Order) {
    this.selectedOrder = order;
  }

  closeDetails() {
    this.selectedOrder = null;
  }

  deleteOrder(id: number | undefined, event?: Event) {
    if (event) {
        event.stopPropagation();
    }
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.orders = this.orders.filter(o => o.id !== id);
          if (this.selectedOrder?.id === id) {
            this.selectedOrder = null;
          }
        },
        error: (err) => {
          console.error('Error deleting order:', err);
          alert('Failed to delete order.');
        }
      });
    }
  }
}
