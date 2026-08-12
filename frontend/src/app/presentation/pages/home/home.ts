import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoeService } from '../../../data/services/shoe';
import { Shoe } from '../../../core/domain/models/shoe.model';
import { CartService } from '../../../data/services/cart';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  shoeService = inject(ShoeService);
  cartService = inject(CartService);
  shoes: Shoe[] = [];
  menShoes: Shoe[] = [];
  womenShoes: Shoe[] = [];
  kidsShoes: Shoe[] = [];
  loading = true;
  selectedCategory: string = 'Men';
  selectedShoe: Shoe | null = null;

  get displayedShoes(): Shoe[] {
    switch (this.selectedCategory) {
      case 'Women': return this.womenShoes;
      case 'Kids': return this.kidsShoes;
      default: return this.menShoes;
    }
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  openShoeDetails(shoe: Shoe) {
    this.selectedShoe = shoe;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  closeShoeDetails() {
    this.selectedShoe = null;
    document.body.style.overflow = ''; // Restore scrolling
  }

  ngOnInit() {
    this.shoeService.getShoes().subscribe({
      next: (shoes) => {
        this.shoes = shoes;
        this.menShoes = shoes.filter(s => s.category === 'Men');
        this.womenShoes = shoes.filter(s => s.category === 'Women');
        this.kidsShoes = shoes.filter(s => s.category === 'Kids');
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
