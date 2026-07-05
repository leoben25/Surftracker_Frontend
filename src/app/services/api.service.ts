import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cliente } from '../models/cliente.model';
import { Localizacion } from '../models/localizacion.model';
import { Pronostico } from '../models/pronostico.model';
import { ObservacionReal } from '../models/observacion-real.model';
import { ReportePrecision } from '../models/reporte-precision.model';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8091/api';

  constructor(private http: HttpClient) {}

  
  registrarCliente(data: Cliente): Observable<any> {
    return this.http.post(`${this.baseUrl}/clientes/registro`, data);
  }

  
  registrarLocalizacion(data: Localizacion): Observable<any> {
    return this.http.post(`${this.baseUrl}/localizaciones/registrarLocalizacion`, data);
  }

  consultarLocalizaciones(): Observable<Localizacion[]> {
    return this.http.get<Localizacion[]>(`${this.baseUrl}/localizaciones/listaTodos`);
  }

  
  listaPorLocalizacion(idLocalizacion: number): Observable<Pronostico[]> {
    return this.http.get<Pronostico[]>(`${this.baseUrl}/pronosticos/listaPorLocalizacion/${idLocalizacion}`);
  }

  registrarPronostico(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pronosticos/registro`, data);
  }

  listarTodosPronosticos(): Observable<Pronostico[]> {
    return this.http.get<Pronostico[]>(`${this.baseUrl}/pronosticos/listaTodos`);
  }

  
  registrarObservacionReal(data: ObservacionReal): Observable<ObservacionReal> {
    return this.http.post<ObservacionReal>(`${this.baseUrl}/observacionReal/registrarObservacionReal`, data);
  }

  listarObservacionesReales(): Observable<ObservacionReal[]> {
    return this.http.get<ObservacionReal[]>(`${this.baseUrl}/observacionReal`);
  }

  buscarObservacionRealPorId(id: number): Observable<ObservacionReal> {
    return this.http.get<ObservacionReal>(`${this.baseUrl}/observacionReal/${id}`);
  }

  actualizarObservacionReal(data: ObservacionReal): Observable<ObservacionReal> {
    return this.http.put<ObservacionReal>(`${this.baseUrl}/observacionReal`, data);
  }

  eliminarObservacionReal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/observacionReal/${id}`);
  }


  registrarReportePrecision(data: ReportePrecision): Observable<ReportePrecision> {   
    return this.http.post<any>(`${this.baseUrl}/reportepresicion/insertaReporte`, data).pipe(
      map(res => res.data)
    );
  }

  listarReportesPorFecha(fecha: string): Observable<ReportePrecision[]> {
    return this.http.get<ReportePrecision[]>(`${this.baseUrl}/reportepresicion/listaPorFecha?fecha=${fecha}`);
  }

  listarTodosReportes(): Observable<ReportePrecision[]> {
    return this.http.get<ReportePrecision[]>(`${this.baseUrl}/reportepresicion/listaTodos`);
  }
}