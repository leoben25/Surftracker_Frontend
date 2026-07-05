import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { ApiService } from '../../services/api.service';
import { Pronostico } from '../../models/pronostico.model';
import { ObservacionReal } from '../../models/observacion-real.model';
import { ReportePrecision } from '../../models/reporte-precision.model';

@Component({
  selector: 'app-registro-reporte',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MenuComponent],
  templateUrl: './registro-reporte.component.html',
  styleUrl: './registro-reporte.component.css'
})
export class RegistroReporteComponent implements OnInit {

  forms: FormGroup;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';
  
  listaPronosticos: Pronostico[] = [];
  listaObservaciones: ObservacionReal[] = [];
  listaReportes: ReportePrecision[] = [];
  
  fechaFiltro: string = '';

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.forms = this.fb.group({
      observacion: [null, [Validators.required]],
      porcentajePrecision: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      diferencia: ['', [Validators.required]],
      fechaReporte: ['', [Validators.required]],
      pronostico: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarCombos();
    this.listarTodos();
  }

  cargarCombos(): void {
    this.apiService.listarTodosPronosticos().subscribe({
      next: (data) => this.listaPronosticos = data,
      error: () => this.mostrarError('Error al cargar pronósticos.')
    });

    this.apiService.listarObservacionesReales().subscribe({
      next: (data) => this.listaObservaciones = data,
      error: () => this.mostrarError('Error al cargar observaciones reales.')
    });
  }

  listarTodos(): void {
    this.apiService.listarTodosReportes().subscribe({
      next: (data) => this.listaReportes = data,
      error: () => this.mostrarError('No se pudieron listar los reportes.')
    });
  }

  buscarPorFecha(): void {
    if (!this.fechaFiltro) {
      this.listarTodos();
      return;
    }
    this.apiService.listarReportesPorFecha(this.fechaFiltro).subscribe({
      next: (data) => this.listaReportes = data,
      error: () => this.mostrarError('Error al filtrar por fecha.')
    });
  }

  registrarReporte(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (this.forms.invalid) {
      this.forms.markAllAsTouched();
      this.tipoMensaje = 'error';
      this.mensaje = 'Complete correctamente los campos obligatorios.';
      return;
    }

    const objReporte: ReportePrecision = this.forms.value;

    this.apiService.registrarReportePrecision(objReporte).subscribe({
      next: () => {
        this.tipoMensaje = 'exito';
        this.mensaje = 'Reporte generado con éxito.';
        this.forms.reset();
        this.listarTodos();
      },
      error: (error) => {
        this.tipoMensaje = 'error';
        this.mensaje = this.obtenerMensajeError(error);
      }
    });
  }

  mostrarError(msg: string): void {
    this.tipoMensaje = 'error';
    this.mensaje = msg;
  }

  obtenerMensajeError(error: any): string {
    if (error?.error?.errores) {
      return Object.keys(error.error.errores)
        .map(campo => `${campo}: ${error.error.errores[campo]}`)
        .join(' | ');
    }
    if (error?.error?.mensaje) return error.error.mensaje;
    return 'No se pudo procesar el reporte de precisión.';
  }
}