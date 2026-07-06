import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Localizacion } from '../models/localizacion.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8091/api';

  constructor(private http: HttpClient) {}

  registrarUsuario(data: Usuario): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios/registrarUsuario`, data);
  }

  loginUsuario(login: string, password: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/auth/login`, {
    login: login,
    password: password
  });
}

  registrarLocalizacion(data: Localizacion): Observable<any> {
    return this.http.post(`${this.baseUrl}/localizaciones/registrarLocalizacion`, data);
  }

  consultarLocalizaciones(): Observable<Localizacion[]> {
    return this.http.get<Localizacion[]>(`${this.baseUrl}/localizaciones/listaTodos`);
  }

  buscarLocalizacionPorId(id: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/localizaciones/${id}`);
}

eliminarLocalizacion(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/localizaciones/eliminarLocalizacion/${id}`);
}

  listaPorLocalizacion(idLocalizacion: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pronosticos/listaPorLocalizacion/${idLocalizacion}`);
  }

  listarTodosPronosticos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pronosticos/listaTodos`);
  }

  registrarObservacionReal(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/observacionReal/registrarObservacionReal`, data);
  }

  listarObservacionesReales(): Observable<any> {
    return this.http.get(`${this.baseUrl}/observacionReal`);
  }

  registrarReportePrecision(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reportepresicion/insertaReporte`, data);
  }

  listarTodosReportes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reportepresicion/listaTodos`);
  }

  listarReportesPorFecha(fecha: string): Observable<any> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get(`${this.baseUrl}/reportepresicion/listaPorFecha`, { params });
  }

  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuarios`);
  }

  buscarUsuarioPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usuarios/${id}`);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${id}`);
  }
}