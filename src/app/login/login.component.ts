import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  iniciarSesion(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.tipoMensaje = 'error';
      this.mensaje = 'Ingrese su login y contraseña.';
      return;
    }

    const { login, password } = this.form.value;

    this.apiService.loginUsuario(login, password).subscribe({
      next: (usuarios) => {
        if (usuarios.length > 0) {
          const usuario: Usuario = usuarios[0];
          this.authService.login(usuario);
          this.tipoMensaje = 'exito';
          this.mensaje = `Bienvenido, ${usuario.login}.`;
          this.router.navigate(['/']);
        } else {
          this.tipoMensaje = 'error';
          this.mensaje = 'Login o contraseña incorrectos.';
        }
      },
      error: () => {
        this.tipoMensaje = 'error';
        this.mensaje = 'No se pudo validar el usuario. Verifique que el backend esté activo.';
      }
    });
  }
}
