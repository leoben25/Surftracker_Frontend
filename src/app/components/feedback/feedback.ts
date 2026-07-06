import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { FeedbackService } from '../../services/feedback.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MenuComponent],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css'
})
export class Feedback implements OnInit {

  forms: FormGroup;

  listaPronosticos: any[] = [];
  listaLocalizaciones: any[] = [];
  listaFeedbacks: any[] = [];
  listaFeedbacksFiltrados: any[] = [];

  filtroCalificacion = '';

  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.forms = this.fb.group({
      idPronostico: ['', [Validators.required]],
      calificacion: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.cargarLocalizaciones();
    this.cargarPronosticos();
    this.cargarFeedbacks();
  }

  cargarPronosticos(): void {
    this.apiService.listarTodosPronosticos().subscribe({
      next: (data) => {
        this.listaPronosticos = data;
      },
      error: () => {
        this.tipoMensaje = 'error';
        this.mensaje = 'No se pudieron cargar los pronósticos.';
      }
    });
  }

  cargarLocalizaciones(): void {
    this.apiService.consultarLocalizaciones().subscribe({
      next: (data) => {
        this.listaLocalizaciones = data;
      },
      error: () => {
        this.listaLocalizaciones = [];
      }
    });
  }

  cargarFeedbacks(): void {
    const usuario = this.authService.getCurrentUser();

    if (!usuario?.idUsuario) {
      this.tipoMensaje = 'error';
      this.mensaje = 'No se encontró el usuario logueado.';
      return;
    }

    const rol = (usuario.rol || '').toUpperCase();

    if (rol === 'ADMIN' || rol === 'ROLE_ADMIN') {
      this.feedbackService.listar().subscribe({
        next: (data) => {
          this.listaFeedbacks = data;
          this.aplicarFiltro();
        },
        error: () => {
          this.tipoMensaje = 'error';
          this.mensaje = 'No se pudieron cargar los feedbacks.';
        }
      });
    } else {
      this.feedbackService.listarPorUsuario(usuario.idUsuario).subscribe({
        next: (data) => {
          this.listaFeedbacks = data;
          this.aplicarFiltro();
        },
        error: () => {
          this.tipoMensaje = 'error';
          this.mensaje = 'No se pudieron cargar tus feedbacks.';
        }
      });
    }
  }

  registrarFeedback(): void {
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

    const objFeedback = {
      usuario: {
        idUsuario: usuario.idUsuario
      },
      pronostico: {
        idPronostico: Number(this.forms.value.idPronostico)
      },
      comentario: this.forms.value.comentario,
      calificacion: Number(this.forms.value.calificacion)
    };

    this.feedbackService.guardar(objFeedback).subscribe({
      next: () => {
        this.tipoMensaje = 'exito';
        this.mensaje = 'Feedback registrado correctamente.';
        this.forms.reset();
        this.cargarFeedbacks();
      },
      error: (error) => {
        console.error('Error al registrar feedback:', error);
        this.tipoMensaje = 'error';
        this.mensaje = this.obtenerMensajeError(error);
      }
    });
  }

  eliminarFeedback(item: any): void {
    const id = this.obtenerIdFeedback(item);

    if (!id) {
      this.tipoMensaje = 'error';
      this.mensaje = 'No se encontró el ID del feedback.';
      return;
    }

    this.feedbackService.eliminar(id).subscribe({
      next: () => {
        this.tipoMensaje = 'exito';
        this.mensaje = 'Feedback eliminado correctamente.';
        this.cargarFeedbacks();
      },
      error: () => {
        this.tipoMensaje = 'error';
        this.mensaje = 'No se pudo eliminar el feedback.';
      }
    });
  }

  aplicarFiltro(): void {
    if (!this.filtroCalificacion) {
      this.listaFeedbacksFiltrados = [...this.listaFeedbacks];
      return;
    }

    this.listaFeedbacksFiltrados = this.listaFeedbacks.filter(item =>
      Number(item.calificacion) === Number(this.filtroCalificacion)
    );
  }

  limpiarFiltro(): void {
    this.filtroCalificacion = '';
    this.aplicarFiltro();
  }

  obtenerIdFeedback(item: any): number {
    return item?.idFeedback || item?.idfeedback || item?.id;
  }

  obtenerIdPronostico(item: any): any {
    return item?.pronostico?.idPronostico
      || item?.pronostico?.idpronostico
      || item?.pronostico?.id
      || '-';
  }

  obtenerTextoPronostico(item: any): string {
  if (!item) {
    return '';
  }

  const playa = this.obtenerNombrePlayaPorPronostico(item);
  const fecha = item.fechaPronostico || item.fechapronostico || '-';
  const temperatura = item.temperatura ?? '-';
  const alturaOlas = item.alturaOlas ?? item.altura_olas ?? item.alturaolas ?? '-';
  const viento = item.velocidadViento ?? item.velocidad_viento ?? item.velocidadviento ?? '-';

  return `${playa} | ${fecha} | Temp. ${temperatura} °C | Olas ${alturaOlas} m | Viento ${viento} km/h`;
}

obtenerIdPronosticoItem(item: any): any {
  return item?.idPronostico || item?.idpronostico || item?.id;
}

obtenerIdLocalizacionPronostico(item: any): any {
  return item?.idLocalizacion
    || item?.idlocalizacion
    || item?.localizacion?.id
    || item?.localizacion?.idLocalizacion
    || item?.localizacion?.idlocalizacion;
}

obtenerNombrePlayaPorPronostico(pronostico: any): string {
  const idLocalizacion = this.obtenerIdLocalizacionPronostico(pronostico);

  const localizacion = this.listaLocalizaciones.find(loc =>
    this.obtenerIdLocalizacion(loc) === idLocalizacion
  );

  if (!localizacion) {
    return `Localización ${idLocalizacion || '-'}`;
  }

  return this.obtenerTextoLocalizacion(localizacion);
}

obtenerIdLocalizacion(localizacion: any): any {
  return localizacion?.id
    || localizacion?.idLocalizacion
    || localizacion?.idlocalizacion;
}

obtenerTextoLocalizacion(localizacion: any): string {
  if (!localizacion) {
    return 'Sin localización';
  }

  const playa =
    localizacion.nombrePlaya ||
    localizacion.playa ||
    localizacion.nombre ||
    'Playa sin nombre';

  const distrito = localizacion.distrito || '';
  const provincia = localizacion.provincia || '';
  const departamento = localizacion.departamento || '';
  const pais = localizacion.pais || '';

  return `${playa}${distrito ? ' - ' + distrito : ''}${provincia ? ' - ' + provincia : ''}${departamento ? ' - ' + departamento : ''}${pais ? ' - ' + pais : ''}`;
}

  obtenerUsuario(item: any): string {
    const usuario = item?.usuario;

    if (!usuario) {
      return 'Usuario no encontrado';
    }

    return usuario.login || usuario.nombres || usuario.correo || `Usuario ${usuario.idUsuario}`;
  }

  obtenerMensajeError(error: any): string {
    if (error?.error?.mensaje) {
      return error.error.mensaje;
    }

    if (typeof error?.error === 'string') {
      return error.error;
    }

    return 'No se pudo registrar el feedback.';
  }
}