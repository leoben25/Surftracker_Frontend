import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { ApiService } from '../../services/api.service';
import { Localizacion } from '../../models/localizacion.model';

@Component({
  selector: 'app-lista-localizaciones',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './lista-localizaciones.component.html',
  styleUrl: './lista-localizaciones.component.css'
})
export class ListaLocalizacionesComponent implements OnInit {
  localizaciones: Localizacion[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarLocalizaciones();
  }

  cargarLocalizaciones(): void {
    this.apiService.consultarLocalizaciones().subscribe({
      next: (data) => {
        this.localizaciones = data;
      },
      error: () => {
        this.localizaciones = [];
      }
    });
  }
}
