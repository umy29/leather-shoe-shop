import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './presentation/components/navbar/navbar';
import { Cart } from './presentation/components/cart/cart';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Cart],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'frontend';
}
