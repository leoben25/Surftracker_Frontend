import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { MenuComponent } from '../../menu/menu.component';
import { ApiService } from '../../services/api.service';
import { FavoritoService } from '../../services/favorito.service';
import { AuthService } from '../../services/auth.service';
import { Localizacion } from '../../models/localizacion.model';

@Component({
  selector: 'app-registro-localizacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MenuComponent],
  templateUrl: './registro-localizacion.component.html',
  styleUrl: './registro-localizacion.component.css'
})
export class RegistroLocalizacionComponent implements OnInit {

  forms: FormGroup;

  localizaciones: any[] = [];
  localizacionesFiltradas: any[] = [];
  favoritos: any[] = [];

  textoBusqueda = '';

  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private favoritoService: FavoritoService,
    private authService: AuthService
  ) {
    this.forms = this.fb.group({
      nombrePlaya: ['', [Validators.required]],
      distrito: [''],
      provincia: [''],
      departamento: [''],
      pais: ['Perú'],
      latitud: [''],
      longitud: ['']
    });
  }

  ngOnInit(): void {
    this.cargarLocalizaciones();
    this.cargarFavoritos();
  }

  registrarLocalizacion(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (this.forms.invalid) {
      this.forms.markAllAsTouched();
      this.tipoMensaje = 'error';
      this.mensaje = 'Complete correctamente los campos obligatorios.';
      return;
    }

    const objLocalizacion: Localizacion = {
      ...this.forms.value,
      latitud: this.forms.value.latitud ? Number(this.forms.value.latitud) : null,
      longitud: this.forms.value.longitud ? Number(this.forms.value.longitud) : null
    };

    this.apiService.registrarLocalizacion(objLocalizacion).subscribe({
      next: () => {
        this.tipoMensaje = 'exito';
        this.mensaje = 'Localización registrada correctamente.';

        this.forms.reset({
          pais: 'Perú'
        });

        this.cargarLocalizaciones();
      },
      error: (error) => {
        this.tipoMensaje = 'error';
        this.mensaje = this.obtenerMensajeError(error);
      }
    });
  }

  cargarLocalizaciones(): void {
    this.apiService.consultarLocalizaciones().subscribe({
      next: (data) => {
        this.localizaciones = data;
        this.aplicarFiltro();
      },
      error: () => {
        this.localizaciones = [];
        this.localizacionesFiltradas = [];
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
        this.favoritos = [];
      }
    });
  }

  aplicarFiltro(): void {
    const texto = this.textoBusqueda.trim().toLowerCase();

    if (!texto) {
      this.localizacionesFiltradas = [...this.localizaciones];
      return;
    }

    this.localizacionesFiltradas = this.localizaciones.filter(loc => {
      const playa = (loc.nombrePlaya || '').toLowerCase();
      const distrito = (loc.distrito || '').toLowerCase();
      const provincia = (loc.provincia || '').toLowerCase();
      const departamento = (loc.departamento || '').toLowerCase();
      const pais = (loc.pais || '').toLowerCase();

      return playa.includes(texto)
        || distrito.includes(texto)
        || provincia.includes(texto)
        || departamento.includes(texto)
        || pais.includes(texto);
    });
  }

  limpiarBusqueda(): void {
    this.textoBusqueda = '';
    this.aplicarFiltro();
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
          this.cargarFavoritos();
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

  obtenerMensajeError(error: any): string {
    if (error?.error?.mensaje) {
      return error.error.mensaje;
    }

    if (error?.error?.detalle) {
      return error.error.detalle;
    }

    if (typeof error?.error === 'string') {
      return error.error;
    }

    return 'No se pudo registrar la localización. Verifique que el backend esté activo.';
  }
}