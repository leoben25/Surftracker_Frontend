import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { LocalizacionService } from '../../services/localizacion-service';
import { Localizacion } from '../../models/localizacion.model';

@Component({
  selector: 'app-registro-localizacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuComponent],
  templateUrl: './registro-localizacion.component.html',
  styleUrl: './registro-localizacion.component.css'
})
export class RegistroLocalizacionComponent {

  forms: FormGroup;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private localizacionService: LocalizacionService
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

  registrarLocalizacion(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (this.forms.invalid) {
      this.forms.markAllAsTouched();
      this.tipoMensaje = 'error';
      this.mensaje = 'Complete correctamente los campos obligatorios.';
      return;
    }

    const objLocalizacion: Localizacion = this.forms.value;

    this.localizacionService.registrarLocalizacion(objLocalizacion).subscribe({
      next: () => {
        this.tipoMensaje = 'exito';
        this.mensaje = 'Localización registrada correctamente.';
        this.forms.reset({
          pais: 'Perú'
        });
      },
      error: (error) => {
        this.tipoMensaje = 'error';
        this.mensaje = this.obtenerMensajeError(error);
      }
    });
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