import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ShoeService } from '../../../data/services/shoe';
import { Shoe } from '../../../core/domain/models/shoe.model';
import { AdminOrders } from '../admin-orders/admin-orders';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, AdminOrders],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  activeTab: 'inventory' | 'orders' = 'inventory';
  shoeService = inject(ShoeService);
  
  shoes: Shoe[] = [];
  isEditing = false;
  
  currentShoe: Partial<Shoe> = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: ''
  };

  selectedFile: File | null = null;

  ngOnInit() {
    this.loadShoes();
  }

  loadShoes() {
    this.shoeService.getShoes().subscribe(shoes => this.shoes = shoes);
  }

  editShoe(shoe: Shoe) {
    this.currentShoe = { ...shoe };
    this.isEditing = true;
    this.selectedFile = null;
  }

  deleteShoe(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.shoeService.deleteShoe(id).subscribe(() => this.loadShoes());
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Optional: create local preview url if needed, but not required right now
    }
  }

  resetForm() {
    this.currentShoe = { name: '', description: '', price: 0, imageUrl: '', category: '' };
    this.isEditing = false;
    this.selectedFile = null;
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  saveShoe() {
    if (this.selectedFile) {
      this.shoeService.uploadImage(this.selectedFile).subscribe({
        next: (res) => {
          this.currentShoe.imageUrl = 'http://localhost:5277' + res.url;
          this.saveShoeData();
        },
        error: (err) => console.error('Upload failed', err)
      });
    } else {
      this.saveShoeData();
    }
  }

  private saveShoeData() {
    if (this.isEditing && this.currentShoe.id) {
      this.shoeService.updateShoe(this.currentShoe.id, this.currentShoe as Shoe)
        .subscribe(() => {
          this.loadShoes();
          this.resetForm();
        });
    } else {
      this.shoeService.createShoe(this.currentShoe)
        .subscribe(() => {
          this.loadShoes();
          this.resetForm();
        });
    }
  }
}
