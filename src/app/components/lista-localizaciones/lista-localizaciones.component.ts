import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { MenuComponent } from '../../menu/menu.component';
import { ApiService } from '../../services/api.service';
import { FavoritoService } from '../../services/favorito.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lista-localizaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent],
  templateUrl: './lista-localizaciones.component.html',
  styleUrl: './lista-localizaciones.component.css'
})
export class ListaLocalizacionesComponent implements OnInit {
  localizaciones: any[] = [];
  localizacionesFiltradas: any[] = [];
  favoritos: any[] = [];

  textoBusqueda = '';
  isAdmin = false;
  isLoggedIn = false;

  constructor(
    private apiService: ApiService,
    private favoritoService: FavoritoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.verificarUsuario();
    this.cargarLocalizaciones();
    this.cargarFavoritos();
  }

  verificarUsuario(): void {
    const usuario = this.authService.getCurrentUser();
    const rol = (usuario?.rol || '').toUpperCase();

    this.isLoggedIn = this.authService.isAuthenticated();
    this.isAdmin = rol === 'ADMIN' || rol === 'ROLE_ADMIN';
  }

  cargarLocalizaciones(): void {
    this.apiService.consultarLocalizaciones().subscribe({
      next: (data) => {
        this.localizaciones = data;
        this.localizacionesFiltradas = data;
      },
      error: () => {
        this.localizaciones = [];
        this.localizacionesFiltradas = [];

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las localizaciones.'
        });
      }
    });
  }

  cargarFavoritos(): void {
    const usuario = this.authService.getCurrentUser();

    if (!usuario?.idUsuario) {
      return;
    }

    this.favoritoService.listarPorUsuario(usuario.idUsuario).subscribe({
      next: (data) => {
        this.favoritos = data;
      },
      error: () => {
        console.error('No se pudieron cargar favoritos');
      }
    });
  }

  filtrarLocalizaciones(): void {
    const texto = this.textoBusqueda.trim().toLowerCase();

    if (!texto) {
      this.localizacionesFiltradas = [...this.localizaciones];
      return;
    }

    this.localizacionesFiltradas = this.localizaciones.filter(loc => {
      const nombrePlaya = (loc.nombrePlaya || '').toLowerCase();
      const distrito = (loc.distrito || '').toLowerCase();
      const provincia = (loc.provincia || '').toLowerCase();
      const departamento = (loc.departamento || '').toLowerCase();
      const pais = (loc.pais || '').toLowerCase();

      return nombrePlaya.includes(texto)
        || distrito.includes(texto)
        || provincia.includes(texto)
        || departamento.includes(texto)
        || pais.includes(texto);
    });
  }

  limpiarBusqueda(): void {
    this.textoBusqueda = '';
    this.localizacionesFiltradas = [...this.localizaciones];
  }

  agregarAFavoritos(localizacion: any): void {
    const usuario = this.authService.getCurrentUser();

    if (!usuario?.idUsuario) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión requerida',
        text: 'Debe iniciar sesión para agregar favoritos.'
      });
      return;
    }

    const idLocalizacion = this.obtenerIdLocalizacion(localizacion);

    if (this.esFavorito(localizacion)) {
      Swal.fire({
        icon: 'info',
        title: 'Ya está en favoritos',
        text: 'Esta localización ya fue agregada a tus favoritos.'
      });
      return;
    }

    this.favoritoService.guardarFavorito(usuario.idUsuario, idLocalizacion).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Agregado',
          text: 'Localización agregada a favoritos.'
        });

        this.cargarFavoritos();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar a favoritos.'
        });
      }
    });
  }

  eliminarLocalizacion(localizacion: any): void {
    const id = this.obtenerIdLocalizacion(localizacion);

    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar localización?',
      text: `Se eliminará ${localizacion.nombrePlaya || 'esta localización'}.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.apiService.eliminarLocalizacion(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Localización eliminada correctamente.'
          });

          this.cargarLocalizaciones();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo eliminar',
            text: 'La localización puede estar relacionada con pronósticos, favoritos u otros registros.'
          });
        }
      });
    });
  }

  esFavorito(localizacion: any): boolean {
    const idLocalizacion = this.obtenerIdLocalizacion(localizacion);

    return this.favoritos.some(fav => {
      const locFav = fav.localizacion;
      return this.obtenerIdLocalizacion(locFav) === idLocalizacion;
    });
  }

  obtenerIdLocalizacion(localizacion: any): number {
    return localizacion?.id
      || localizacion?.idLocalizacion
      || localizacion?.idlocalizacion;
  }

  obtenerTextoLocalizacion(localizacion: any): string {
    const playa = localizacion.nombrePlaya || localizacion.playa || 'Playa sin nombre';
    const distrito = localizacion.distrito || '';
    const provincia = localizacion.provincia || '';
    const departamento = localizacion.departamento || '';
    const pais = localizacion.pais || '';

    return `${playa}${distrito ? ' - ' + distrito : ''}${provincia ? ' - ' + provincia : ''}${departamento ? ' - ' + departamento : ''}${pais ? ' - ' + pais : ''}`;
  }

}