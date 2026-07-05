import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { FavoritoService } from '../../services/favorito.service';
import { Favorito } from '../../models/expus.model';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, MenuComponent], 
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css'
})
export class Favoritos implements OnInit {
  listaFavoritos: Favorito[] = [];

  constructor(private favoritoService: FavoritoService) {}

  ngOnInit(): void {
    this.favoritoService.listar().subscribe({
      next: (datos: any) => this.listaFavoritos = datos, 
      error: (err: any) => console.error(err)           
    });
  }
}