import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificacion } from '../models/expus.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private apiUrl = 'http://localhost:8091/api/notificaciones';

  constructor(private http: HttpClient) {}

  listar(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Notificacion> {
    return this.http.get<Notificacion>(`${this.apiUrl}/${id}`);
  }

  listarPorUsuario(idUsuario: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  listarPorEstado(estado: string): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/estado/${estado}`);
  }

  listarPorRiesgo(riesgo: string): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/riesgo/${riesgo}`);
  }

  guardar(idUsuario: number, idLocalizacion: number | null, notificacion: Notificacion): Observable<Notificacion> {
    let params = new HttpParams().set('idUsuario', idUsuario.toString());
    if (idLocalizacion) {
      params = params.set('idLocalizacion', idLocalizacion.toString());
    }
    return this.http.post<Notificacion>(this.apiUrl, notificacion, { params });
  }

  actualizar(id: number, notificacion: Notificacion): Observable<Notificacion> {
    return this.http.put<Notificacion>(`${this.apiUrl}/${id}`, notificacion);
  }

  marcarComoLeida(id: number): Observable<Notificacion> {
    return this.http.put<Notificacion>(`${this.apiUrl}/${id}/leido`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}