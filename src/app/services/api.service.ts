import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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

  loginUsuario(login: string, password: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`).pipe(
      map((usuarios) => usuarios.filter((usuario) => usuario.login === login && usuario.password === password))
    );
  }

  registrarLocalizacion(data: Localizacion): Observable<any> {
    return this.http.post(`${this.baseUrl}/localizaciones/registrarLocalizacion`, data);
  }

  consultarLocalizaciones(): Observable<Localizacion[]> {
    return this.http.get<Localizacion[]>(`${this.baseUrl}/localizaciones/listaTodos`);
  }

    listaPorLocalizacion(idLocalizacion: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pronosticos/listaPorLocalizacion/${idLocalizacion}`);
  }

  listarTodosPronosticos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pronosticos/listaTodos`);
  }

  registrarObservacionReal(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/observacionReal/registrar`, data);
  }

  listarObservacionesReales(): Observable<any> {
    return this.http.get(`${this.baseUrl}/observacionReal/listaTodos`);
  }

  registrarReportePrecision(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reportepresicion/registrar`, data);
  }

  listarTodosReportes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reportepresicion/listaTodos`);
  }

  listarReportesPorFecha(fecha: string): Observable<any> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get(`${this.baseUrl}/reportepresicion/listaPorFecha`, { params });
  }
}