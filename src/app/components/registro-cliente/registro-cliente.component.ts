import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { ApiService } from '../../services/api.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-registro-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuComponent],
  templateUrl: './registro-cliente.component.html',
  styleUrl: './registro-cliente.component.css'
})
export class RegistroClienteComponent {

  forms: FormGroup;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.forms = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      login: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^[0-9]{9}$/)]],
      fechanacimiento: ['', [Validators.required]],
      direccion: ['', [Validators.required]]
    });
  }

  registrarUsuario(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (this.forms.invalid) {
      this.forms.markAllAsTouched();
      this.tipoMensaje = 'error';
      this.mensaje = 'Complete correctamente los campos obligatorios.';
      return;
    }

    const objUsuario: Usuario = {
      ...this.forms.value,
      fecharegistro: new Date().toISOString().split('T')[0],
      estado: 'ACTIVO',
      rol: 'CLIENTE'
    };

    this.apiService.registrarUsuario(objUsuario).subscribe({
      next: () => {
        this.tipoMensaje = 'exito';
        this.mensaje = 'Usuario registrado correctamente.';
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

    return 'No se pudo registrar el usuario. Verifique que el backend esté activo.';
  }
}
