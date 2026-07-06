import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { NotificacionService } from '../../services/notificacion.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css'
})
export class NotificacionesComponent implements OnInit {
  notificaciones: any[] = [];
  notificacionesFiltradas: any[] = [];

  filtroEstado = 'TODAS';
  filtroRiesgo = 'TODOS';

  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(
    private notificacionService: NotificacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  cargarNotificaciones(): void {
    const usuario = this.authService.getCurrentUser();

    if (!usuario?.idUsuario) {
      this.tipoMensaje = 'error';
      this.mensaje = 'No se encontró el usuario logueado.';
      return;
    }

    this.notificacionService.listarPorUsuario(usuario.idUsuario).subscribe({
      next: (data) => {
        this.notificaciones = data;
        this.aplicarFiltros();
      },
      error: () => {
        this.tipoMensaje = 'error';
        this.mensaje = 'No se pudieron cargar las notificaciones.';
      }
    });
  }

  aplicarFiltros(): void {
    let resultado = [...this.notificaciones];

    if (this.filtroEstado !== 'TODAS') {
      resultado = resultado.filter(n =>
        (n.estadoLectura || '').toLowerCase() === this.filtroEstado.toLowerCase()
      );
    }

    if (this.filtroRiesgo !== 'TODOS') {
      resultado = resultado.filter(n =>
        (n.nivelRiesgo || '').toLowerCase() === this.filtroRiesgo.toLowerCase()
      );
    }

    this.notificacionesFiltradas = resultado;
  }

  marcarLeida(notificacion: any): void {
    const id = this.obtenerIdNotificacion(notificacion);

    if (!id) {
      this.tipoMensaje = 'error';
      this.mensaje = 'No se encontró el ID de la notificación.';
      return;
    }

    this.notificacionService.marcarComoLeida(id).subscribe({
      next: () => {
        this.tipoMensaje = 'exito';
        this.mensaje = 'Notificación marcada como leída.';
        this.cargarNotificaciones();
      },
      error: () => {
        this.tipoMensaje = 'error';
        this.mensaje = 'No se pudo actualizar la notificación.';
      }
    });
  }

  eliminarNotificacion(notificacion: any): void {
    const id = this.obtenerIdNotificacion(notificacion);

    if (!id) {
      this.tipoMensaje = 'error';
      this.mensaje = 'No se encontró el ID de la notificación.';
      return;
    }

    this.notificacionService.eliminar(id).subscribe({
      next: () => {
        this.tipoMensaje = 'exito';
        this.mensaje = 'Notificación eliminada correctamente.';
        this.cargarNotificaciones();
      },
      error: () => {
        this.tipoMensaje = 'error';
        this.mensaje = 'No se pudo eliminar la notificación.';
      }
    });
  }

  obtenerIdNotificacion(notificacion: any): number {
    return notificacion?.idNotificacion || notificacion?.idnotificacion || notificacion?.id;
  }

  obtenerEstado(notificacion: any): string {
    return notificacion?.estadoLectura || 'no leida';
  }

  obtenerRiesgo(notificacion: any): string {
    return notificacion?.nivelRiesgo || 'sin riesgo';
  }

  obtenerLocalizacion(notificacion: any): string {
    const loc = notificacion?.localizacion;

    if (!loc) {
      return 'Sin localización asociada';
    }

    const playa = loc.playa || loc.nombre || loc.descripcion || 'Playa sin nombre';
    const distrito = loc.distrito || '';
    const provincia = loc.provincia || '';
    const departamento = loc.departamento || '';

    return `${playa}${distrito ? ' - ' + distrito : ''}${provincia ? ' - ' + provincia : ''}${departamento ? ' - ' + departamento : ''}`;
  }

  obtenerClaseRiesgo(nivel: string): string {
    const riesgo = (nivel || '').toLowerCase();

    if (riesgo === 'alto') return 'riesgo-alto';
    if (riesgo === 'medio') return 'riesgo-medio';
    if (riesgo === 'bajo') return 'riesgo-bajo';

    return 'riesgo-normal';
  }

  obtenerCantidadNoLeidas(): number {
    return this.notificaciones.filter(n =>
      (n.estadoLectura || '').toLowerCase() === 'no leida'
    ).length;
  }
}