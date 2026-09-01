import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoeService } from '../../../data/services/shoe';
import { Shoe } from '../../../core/domain/models/shoe.model';
import { CartService } from '../../../data/services/cart';
import { SignalRService } from '../../../data/services/signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  shoeService = inject(ShoeService);
  cartService = inject(CartService);
  signalRService = inject(SignalRService);
  
  shoes: Shoe[] = [];
  loading = true;
  selectedCategory: string = 'All';
  searchQuery: string = '';
  sortBy: 'featured' | 'price-low' | 'price-high' | 'name' = 'featured';
  
  selectedShoe: Shoe | null = null;
  selectedSize: number = 42;
  availableSizes: number[] = [39, 40, 41, 42, 43, 44, 45];
  
  addedToCartToast: string | null = null;
  private subscription: Subscription | undefined;
  private toastTimeout: any;

  get categories(): string[] {
    return ['All', 'Men', 'Women', 'Kids'];
  }

  get categoryCounts(): { [key: string]: number } {
    return {
      'All': this.shoes.length,
      'Men': this.shoes.filter(s => s.category?.toLowerCase() === 'men').length,
      'Women': this.shoes.filter(s => s.category?.toLowerCase() === 'women').length,
      'Kids': this.shoes.filter(s => s.category?.toLowerCase() === 'kids').length
    };
  }

  get displayedShoes(): Shoe[] {
    let list = this.shoes;

    // Filter by Category
    if (this.selectedCategory !== 'All') {
      list = list.filter(s => s.category?.toLowerCase() === this.selectedCategory.toLowerCase());
    }

    // Filter by Search Query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) || 
        (s.description && s.description.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (this.sortBy) {
      case 'price-low':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...list].sort((a, b) => b.price - a.price);
      case 'name':
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  scrollToCatalog() {
    const catalogElement = document.getElementById('catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openShoeDetails(shoe: Shoe) {
    this.selectedShoe = shoe;
    this.selectedSize = 42;
    document.body.style.overflow = 'hidden';
  }

  closeShoeDetails() {
    this.selectedShoe = null;
    document.body.style.overflow = '';
  }

  selectSize(size: number) {
    this.selectedSize = size;
  }

  handleAddToCart(shoe: Shoe, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.cartService.addToCart(shoe);
    this.showToast(`"${shoe.name}" added to your bespoke cart.`);
  }

  private showToast(msg: string) {
    this.addedToCartToast = msg;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.addedToCartToast = null;
    }, 3000);
  }

  loadShoes() {
    this.shoeService.getShoes().subscribe({
      next: (shoes) => {
        this.shoes = shoes;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    this.loadShoes();
    this.subscription = this.signalRService.shoesUpdated$.subscribe(() => {
      this.loadShoes();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    document.body.style.overflow = '';
  }
}

