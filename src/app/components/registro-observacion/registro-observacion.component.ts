import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { ApiService } from '../../services/api.service';
import { Localizacion } from '../../models/localizacion.model';
import { ObservacionReal } from '../../models/observacion-real.model';

@Component({
  selector: 'app-registro-observacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuComponent],
  templateUrl: './registro-observacion.component.html',
  styleUrl: './registro-observacion.component.css'
})
export class RegistroObservacionComponent implements OnInit {

  forms: FormGroup;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';
  listaLocalizaciones: Localizacion[] = [];

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.forms = this.fb.group({
      localizacion: [null, [Validators.required]],
      fechaObservacion: ['', [Validators.required]],
      temperaturaReal: ['', [Validators.required]],
      alturaOlasReal: ['', [Validators.required]],
      velocidadVientoReal: ['', [Validators.required]],
      descripcion: ['', [Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this.cargarLocalizaciones();
  }

  cargarLocalizaciones(): void {
    this.apiService.consultarLocalizaciones().subscribe({
      next: (data) => {
        this.listaLocalizaciones = data;
      },
      error: () => {
        this.tipoMensaje = 'error';
        this.mensaje = 'Error al cargar las localizaciones. Verifique el backend.';
      }
    });
  }

  registrarObservacion(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (this.forms.invalid) {
      this.forms.markAllAsTouched();
      this.tipoMensaje = 'error';
      this.mensaje = 'Complete correctamente los campos obligatorios.';
      return;
    }

    const objObservacion: ObservacionReal = this.forms.value;

    this.apiService.registrarObservacionReal(objObservacion).subscribe({
      next: () => {
        this.tipoMensaje = 'exito';
        this.mensaje = 'Observación Real registrada correctamente.';
        this.forms.reset();
      },
      error: (error) => {
        this.tipoMensaje = 'error';
        this.mensaje = this.obtenerMensajeError(error);
      }
    });
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

    return 'No se pudo registrar la observación. Verifique que el backend esté activo.';
  }
}