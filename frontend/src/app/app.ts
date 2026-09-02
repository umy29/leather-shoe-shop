import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Navbar } from './presentation/components/navbar/navbar';
import { Cart } from './presentation/components/cart/cart';
import { SignalRService } from './data/services/signalr.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, Navbar, Cart],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'frontend';
  signalRService = inject(SignalRService);

  ngOnInit() {
    this.signalRService.startConnection();
  }

  scrollToCatalog(event?: Event) {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

