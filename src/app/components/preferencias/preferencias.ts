import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { PreferenciaService } from '../../services/preferencia.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-preferencias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuComponent],
  templateUrl: './preferencias.html',
  styleUrl: './preferencias.css'
})
export class Preferencias implements OnInit {

  forms: FormGroup;

  listaPreferencias: any[] = [];

  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private preferenciaService: PreferenciaService,
    private authService: AuthService
  ) {
    this.forms = this.fb.group({
      tema: ['Claro', [Validators.required]],
      frecuenciaNotificaciones: ['diaria', [Validators.required]],
      recibirAlertas: [true],
      tipoInformacionPreferida: ['pronostico', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarPreferencias();
  }

  cargarPreferencias(): void {
    const usuario = this.authService.getCurrentUser();

    if (!usuario?.idUsuario) {
      this.tipoMensaje = 'error';
      this.mensaje = 'No se encontró el usuario logueado.';
      return;
    }

    this.preferenciaService.listarPorUsuario(usuario.idUsuario).subscribe({
      next: (data) => {
        this.listaPreferencias = data;
      },
      error: () => {
        this.tipoMensaje = 'error';
        this.mensaje = 'No se pudieron cargar las preferencias.';
      }
    });
  }

  registrarPreferencia(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (this.forms.invalid) {
      this.forms.markAllAsTouched();
      this.tipoMensaje = 'error';
      this.mensaje = 'Complete correctamente los campos obligatorios.';
      return;
    }

    const usuario = this.authService.getCurrentUser();

    if (!usuario?.idUsuario) {
      this.tipoMensaje = 'error';
      this.mensaje = 'Debe iniciar sesión.';
      return;
    }

    const preferencia = {
      idUsuario: usuario.idUsuario,
      tema: this.forms.value.tema,
      frecuenciaNotificaciones: this.forms.value.frecuenciaNotificaciones,
      recibirAlertas: this.forms.value.recibirAlertas,
      tipoInformacionPreferida: this.forms.value.tipoInformacionPreferida
    };

    this.preferenciaService.insertar(preferencia).subscribe({
      next: (response) => {
        this.tipoMensaje = 'exito';
        this.mensaje = response?.mensaje || 'Preferencia registrada correctamente.';
        this.cargarPreferencias();
      },
      error: (error) => {
        console.error('Error al registrar preferencia:', error);
        this.tipoMensaje = 'error';
        this.mensaje = this.obtenerMensajeError(error);
      }
    });
  }

  restaurarFormulario(): void {
    this.forms.reset({
      tema: 'Claro',
      frecuenciaNotificaciones: 'diaria',
      recibirAlertas: true,
      tipoInformacionPreferida: 'pronostico'
    });

    this.mensaje = '';
    this.tipoMensaje = '';
  }

  obtenerIdPreferencia(item: any): any {
    return item?.idPreferencia || item?.idpreferencia || item?.id || '-';
  }

  obtenerTextoAlertas(valor: boolean): string {
    return valor ? 'Sí recibe alertas' : 'No recibe alertas';
  }

  obtenerTemaTexto(tema: string): string {
    if (!tema) return '-';

    const texto = tema.toLowerCase();

    if (texto === 'claro') return 'Claro';
    if (texto === 'oscuro') return 'Oscuro';
    if (texto === 'azul') return 'Azul Marino';

    return tema;
  }

  obtenerFrecuenciaTexto(frecuencia: string): string {
    if (!frecuencia) return '-';

    const texto = frecuencia.toLowerCase();

    if (texto === 'diaria') return 'Diaria';
    if (texto === 'semanal') return 'Semanal';
    if (texto === 'inmediata') return 'Inmediata';
    if (texto === 'nunca') return 'Nunca';

    return frecuencia;
  }

  obtenerInformacionTexto(tipo: string): string {
    if (!tipo) return '-';

    const texto = tipo.toLowerCase();

    if (texto === 'pronostico') return 'Pronóstico de surf';
    if (texto === 'alertas') return 'Alertas de riesgo';
    if (texto === 'clima') return 'Clima';
    if (texto === 'oleaje') return 'Oleaje';

    return tipo;
  }

  obtenerMensajeError(error: any): string {
    if (error?.error?.mensaje) {
      return error.error.mensaje;
    }

    if (typeof error?.error === 'string') {
      return error.error;
    }

    return 'No se pudo registrar la preferencia.';
  }
}