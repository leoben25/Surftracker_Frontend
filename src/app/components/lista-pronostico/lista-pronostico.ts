import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { PronosticoService } from '../../services/pronostico-service';
import { LocalizacionService } from '../../services/localizacion-service';
import { Pronostico } from '../../models/pronostico.model';
import { Localizacion } from '../../models/localizacion.model';

@Component({
  selector: 'app-lista-pronostico',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent],
  templateUrl: './lista-pronostico.html',
  styleUrl: './lista-pronostico.css'
})
export class ListaPronosticoComponent implements OnInit {

  pronosticos: Pronostico[] = [];
  localizaciones: Localizacion[] = [];

  idLocalizacion = '';
  fecha = '';
  desde = '';
  hasta = '';

  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(
    private pronosticoService: PronosticoService,
    private localizacionService: LocalizacionService
  ) {}

  ngOnInit(): void {
    this.cargarLocalizaciones();
    this.listarTodos();
  }

  cargarLocalizaciones(): void {
    this.localizacionService.listarLocalizaciones().subscribe({
      next: (data) => {
        this.localizaciones = data;
      },
      error: () => {
        this.tipoMensaje = 'error';
        this.mensaje = 'No se pudieron cargar las localizaciones.';
      }
    });
  }

  listarTodos(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    this.pronosticoService.listarPronosticos().subscribe({
      next: (data) => {
        this.pronosticos = data;
      },
      error: (error) => {
        this.pronosticos = [];
        this.tipoMensaje = 'error';
        this.mensaje = this.obtenerMensajeError(error);
      }
    });
  }

  buscarPorLocalizacion(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (!this.idLocalizacion) {
      this.tipoMensaje = 'error';
      this.mensaje = 'Seleccione una localización.';
      return;
    }

    this.pronosticoService.listarPorLocalizacion(Number(this.idLocalizacion)).subscribe({
      next: (data) => {
        this.pronosticos = data;
      },
      error: (error) => {
        this.pronosticos = [];
        this.tipoMensaje = 'error';
        this.mensaje = this.obtenerMensajeError(error);
      }
    });
  }

  buscarPorFecha(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (!this.idLocalizacion || !this.fecha) {
      this.tipoMensaje = 'error';
      this.mensaje = 'Seleccione una localización y una fecha.';
      return;
    }

    this.pronosticoService.buscarPorLocalizacionYFecha(Number(this.idLocalizacion), this.fecha).subscribe({
      next: (data) => {
        this.pronosticos = data ? [data] : [];
      },
      error: (error) => {
        this.pronosticos = [];
        this.tipoMensaje = 'error';
        this.mensaje = this.obtenerMensajeError(error);
      }
    });
  }

  buscarPorRango(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (!this.idLocalizacion || !this.desde || !this.hasta) {
      this.tipoMensaje = 'error';
      this.mensaje = 'Seleccione una localización, fecha desde y fecha hasta.';
      return;
    }

    this.pronosticoService.buscarPorRangoFechas(Number(this.idLocalizacion), this.desde, this.hasta).subscribe({
      next: (data) => {
        this.pronosticos = data;
      },
      error: (error) => {
        this.pronosticos = [];
        this.tipoMensaje = 'error';
        this.mensaje = this.obtenerMensajeError(error);
      }
    });
  }

  obtenerIdLocalizacion(item: any): number {
    return item.idLocalizacion || item.id || item.idlocalizacion;
  }

  obtenerNombreLocalizacion(item: any): string {
    return item.nombrePlaya || item.nombre || item.playa || 'Localización';
  }

  obtenerMensajeError(error: any): string {
    if (error?.status === 401) {
      return 'No autorizado. Esta consulta funcionará cuando se integre el login.';
    }

    if (error?.error?.mensaje) {
      return error.error.mensaje;
    }

    if (error?.error?.detalle) {
      return error.error.detalle;
    }

    if (error?.error?.error) {
      return error.error.error;
    }

    if (typeof error?.error === 'string') {
      return error.error;
    }

    return 'No se pudieron consultar los pronósticos.';
  }
}