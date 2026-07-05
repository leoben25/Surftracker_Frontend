import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.actualizarEstado();
    this.authService.isAuthenticated$.subscribe(() => {
      this.actualizarEstado();
    });
  }

  private actualizarEstado(): void {
    const currentUser = this.authService.getCurrentUser();
    this.isLoggedIn = this.authService.isAuthenticated();
    this.isAdmin = currentUser?.rol === 'ADMIN';
  }

  irAListaLocalizaciones(): void {
    this.router.navigate(['/lista-localizaciones']);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
