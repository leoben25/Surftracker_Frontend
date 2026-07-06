import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { FavoritoService } from '../../services/favorito.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css'
})
export class Favoritos implements OnInit {
  listaFavoritos: any[] = [];
  listaLocalizaciones: any[] = [];

  idLocalizacionSeleccionada: number | null = null;

  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(
    private favoritoService: FavoritoService,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarLocalizaciones();
    this.cargarFavoritos();
  }

  cargarLocalizaciones(): void {
    this.apiService.consultarLocalizaciones().subscribe({
      next: (data) => {
        this.listaLocalizaciones = data;
      },
      error: () => {
        this.tipoMensaje = 'error';
        this.mensaje = 'No se pudieron cargar las localizaciones.';
      }
    });
  }

  cargarFavoritos(): void {
    const usuario = this.authService.getCurrentUser();

    if (!usuario?.idUsuario) {
      this.tipoMensaje = 'error';
      this.mensaje = 'No se encontró el usuario logueado.';
      return;
    }

    this.favoritoService.listarPorUsuario(usuario.idUsuario).subscribe({
      next: (data) => {
        console.log('Favoritos recibidos:', data);
        this.listaFavoritos = data;
      },
      error: () => {
        this.tipoMensaje = 'error';
        this.mensaje = 'No se pudieron cargar tus favoritos.';
      }
    });
    
  }

  agregarFavorito(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    const usuario = this.authService.getCurrentUser();

    if (!usuario?.idUsuario) {
      this.tipoMensaje = 'error';
      this.mensaje = 'Debe iniciar sesión.';
      return;
    }

    if (!this.idLocalizacionSeleccionada) {
      this.tipoMensaje = 'error';
      this.mensaje = 'Seleccione una localización.';
      return;
    }

    const yaExiste = this.listaFavoritos.some(fav =>
      this.obtenerIdLocalizacion(fav.localizacion) === Number(this.idLocalizacionSeleccionada)
    );

    if (yaExiste) {
      this.tipoMensaje = 'error';
      this.mensaje = 'Esta localización ya está en tus favoritos.';
      return;
    }

    this.favoritoService.guardarFavorito(usuario.idUsuario, Number(this.idLocalizacionSeleccionada)).subscribe({
      next: () => {
        this.tipoMensaje = 'exito';
        this.mensaje = 'Localización agregada a favoritos.';
        this.idLocalizacionSeleccionada = null;
        this.cargarFavoritos();
      },
      error: () => {
        this.tipoMensaje = 'error';
        this.mensaje = 'No se pudo agregar a favoritos.';
      }
    });
  }

  eliminarFavorito(fav: any): void {
    const idFavorito = fav.idFavorito || fav.idfavorito || fav.id;

    if (!idFavorito) {
      this.tipoMensaje = 'error';
      this.mensaje = 'No se encontró el ID del favorito.';
      return;
    }

    this.favoritoService.eliminarFavorito(idFavorito).subscribe({
      next: () => {
        this.tipoMensaje = 'exito';
        this.mensaje = 'Favorito eliminado correctamente.';
        this.cargarFavoritos();
      },
      error: () => {
        this.tipoMensaje = 'error';
        this.mensaje = 'No se pudo eliminar el favorito.';
      }
    });
  }

  obtenerIdLocalizacion(localizacion: any): number {
    return localizacion?.id || localizacion?.idLocalizacion || localizacion?.idlocalizacion;
  }

  obtenerNombreLocalizacion(localizacion: any): string {
    if (!localizacion) {
      return 'Sin localización';
    }

    const playa =
      localizacion.playa ||
      localizacion.nombrePlaya ||
      localizacion.nombreplaya ||
      localizacion.nombre ||
      localizacion.descripcion ||
      'Playa sin nombre';

    const distrito = localizacion.distrito || '';
    const provincia = localizacion.provincia || '';
    const departamento = localizacion.departamento || '';
    const pais = localizacion.pais || '';

    return `${playa}${distrito ? ' - ' + distrito : ''}${provincia ? ' - ' + provincia : ''}${departamento ? ' - ' + departamento : ''}${pais ? ' - ' + pais : ''}`;
  }

  obtenerTextoLocalizacion(localizacion: any): string {
    const id = this.obtenerIdLocalizacion(localizacion);
    return `ID ${id} - ${this.obtenerNombreLocalizacion(localizacion)}`;
  }
}