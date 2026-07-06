import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MenuComponent } from '../../menu/menu.component';
import { PronosticoService } from '../../services/pronostico-service';
import { LocalizacionService } from '../../services/localizacion-service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

import { Localizacion } from '../../models/localizacion.model';
import { Pronostico } from '../../models/pronostico.model';

@Component({
  selector: 'app-registro-pronostico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MenuComponent],
  templateUrl: './registro-pronostico.html',
  styleUrl: './registro-pronostico.css'
})
export class RegistroPronosticoComponent implements OnInit {

  forms: FormGroup;

  localizaciones: Localizacion[] = [];
  pronosticos: any[] = [];
  pronosticosFiltrados: any[] = [];

  idLocalizacionFiltro = '';

  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private pronosticoService: PronosticoService,
    private localizacionService: LocalizacionService,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.forms = this.fb.group({
      idLocalizacion: ['', [Validators.required]],
      fechaPronostico: ['', [Validators.required]],
      temperatura: [''],
      alturaOlas: [''],
      periodoOlas: [''],
      direccionOlas: [''],
      velocidadViento: [''],
      direccionViento: [''],
      humedad: [''],
      lluvia: [''],
      nubosidad: [''],
      radiacionSolar: ['']
    });
  }

  ngOnInit(): void {
    this.cargarLocalizaciones();
    this.cargarPronosticos();
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

  cargarPronosticos(): void {
    this.apiService.listarTodosPronosticos().subscribe({
      next: (data) => {
        this.pronosticos = data;
        this.pronosticosFiltrados = data;
      },
      error: () => {
        this.pronosticos = [];
        this.pronosticosFiltrados = [];
      }
    });
  }

  registrarPronostico(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (this.forms.invalid) {
      this.forms.markAllAsTouched();
      this.tipoMensaje = 'error';
      this.mensaje = 'Complete correctamente los campos obligatorios.';
      return;
    }

    const objPronostico: Pronostico = this.limpiarDatos(this.forms.value);

    this.pronosticoService.registrarPronostico(objPronostico).subscribe({
      next: () => {
        this.tipoMensaje = 'exito';
        this.mensaje = 'Pronóstico registrado correctamente.';

        this.forms.reset();
        this.cargarPronosticos();
      },
      error: (error) => {
        this.tipoMensaje = 'error';
        this.mensaje = this.obtenerMensajeError(error);
      }
    });
  }

  limpiarDatos(data: any): Pronostico {
    const usuario = this.authService.getCurrentUser();

    return {
      idLocalizacion: Number(data.idLocalizacion),
      idFuente: 1,
      idUsuarioCreador: usuario?.idUsuario ? Number(usuario.idUsuario) : undefined,
      fechaPronostico: data.fechaPronostico,
      temperatura: data.temperatura ? Number(data.temperatura) : undefined,
      alturaOlas: data.alturaOlas ? Number(data.alturaOlas) : undefined,
      periodoOlas: data.periodoOlas ? Number(data.periodoOlas) : undefined,
      direccionOlas: data.direccionOlas || undefined,
      velocidadViento: data.velocidadViento ? Number(data.velocidadViento) : undefined,
      direccionViento: data.direccionViento || undefined,
      humedad: data.humedad ? Number(data.humedad) : undefined,
      lluvia: data.lluvia ? Number(data.lluvia) : undefined,
      nubosidad: data.nubosidad ? Number(data.nubosidad) : undefined,
      radiacionSolar: data.radiacionSolar ? Number(data.radiacionSolar) : undefined
    };
  }

  buscarPorPlaya(): void {
    if (!this.idLocalizacionFiltro) {
      this.pronosticosFiltrados = [...this.pronosticos];
      return;
    }

    this.apiService.listaPorLocalizacion(Number(this.idLocalizacionFiltro)).subscribe({
      next: (data) => {
        this.pronosticosFiltrados = data;
      },
      error: () => {
        this.pronosticosFiltrados = [];
      }
    });
  }

  listarTodos(): void {
    this.idLocalizacionFiltro = '';
    this.cargarPronosticos();
  }

  obtenerIdLocalizacion(localizacion: any): any {
    return localizacion?.id
      || localizacion?.idLocalizacion
      || localizacion?.idlocalizacion;
  }

  obtenerIdLocalizacionPronostico(pronostico: any): any {
    return pronostico?.idLocalizacion
      || pronostico?.idlocalizacion
      || pronostico?.localizacion?.id
      || pronostico?.localizacion?.idLocalizacion
      || pronostico?.localizacion?.idlocalizacion;
  }

  obtenerNombrePlayaPorPronostico(pronostico: any): string {
    const idLocalizacion = this.obtenerIdLocalizacionPronostico(pronostico);

    const localizacion = this.localizaciones.find(loc =>
      this.obtenerIdLocalizacion(loc) === idLocalizacion
    );

    if (!localizacion) {
      return `Localización ${idLocalizacion || '-'}`;
    }

    return this.obtenerTextoLocalizacion(localizacion);
  }

  obtenerTextoLocalizacion(localizacion: any): string {
    if (!localizacion) {
      return 'Sin localización';
    }

    const playa = localizacion.nombrePlaya || localizacion.playa || 'Playa sin nombre';
    const distrito = localizacion.distrito || '';
    const provincia = localizacion.provincia || '';
    const departamento = localizacion.departamento || '';
    const pais = localizacion.pais || '';

    return `${playa}${distrito ? ' - ' + distrito : ''}${provincia ? ' - ' + provincia : ''}${departamento ? ' - ' + departamento : ''}${pais ? ' - ' + pais : ''}`;
  }

  obtenerValor(valor: any): string {
    return valor !== null && valor !== undefined && valor !== '' ? valor : '-';
  }

  obtenerMensajeError(error: any): string {
    if (error?.error?.errores) {
      return Object.keys(error.error.errores)
        .map(campo => `${campo}: ${error.error.errores[campo]}`)
        .join(' | ');
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

    if (error?.message) {
      return error.message;
    }

    return 'No se pudo registrar el pronóstico. Verifique que el backend esté activo.';
  }
}