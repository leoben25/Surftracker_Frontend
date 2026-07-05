import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { PronosticoService } from '../../services/pronostico-service';
import { LocalizacionService } from '../../services/localizacion-service';
import { Localizacion } from '../../models/localizacion.model';
import { Pronostico } from '../../models/pronostico.model';

@Component({
  selector: 'app-registro-pronostico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuComponent],
  templateUrl: './registro-pronostico.html',
  styleUrl: './registro-pronostico.css'
})
export class RegistroPronosticoComponent implements OnInit {

  forms: FormGroup;
  localizaciones: Localizacion[] = [];
  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private pronosticoService: PronosticoService,
    private localizacionService: LocalizacionService
  ) {
    this.forms = this.fb.group({
      idLocalizacion: ['', [Validators.required]],
      idFuente: [''],
      idUsuarioCreador: [''],
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
    },
    error: (error) => {
      this.tipoMensaje = 'error';
      this.mensaje = this.obtenerMensajeError(error);
    }
  });
}

  limpiarDatos(data: any): Pronostico {
    return {
      idLocalizacion: Number(data.idLocalizacion),
      idFuente: data.idFuente ? Number(data.idFuente) : undefined,
      idUsuarioCreador: data.idUsuarioCreador ? Number(data.idUsuarioCreador) : undefined,
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