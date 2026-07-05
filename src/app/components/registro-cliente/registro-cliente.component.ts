import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { ClienteService } from '../../services/cliente-service';
import { Cliente } from '../../models/cliente.model';

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

  constructor(private fb: FormBuilder, private clienteService: ClienteService) {
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

  registrarCliente(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (this.forms.invalid) {
      this.forms.markAllAsTouched();
      this.tipoMensaje = 'error';
      this.mensaje = 'Complete correctamente los campos obligatorios.';
      return;
    }

    const objCliente: Cliente = this.forms.value;

    this.clienteService.registrarCliente(objCliente).subscribe({
      next: () => {
        this.tipoMensaje = 'exito';
        this.mensaje = 'Cliente registrado correctamente.';
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

    return 'No se pudo registrar el cliente. Verifique que el backend esté activo.';
  }
}
