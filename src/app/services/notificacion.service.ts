import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private apiUrl = 'http://localhost:8091/api/notificaciones';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  listarPorUsuario(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  listarPorEstado(estado: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estado/${estado}`);
  }

  listarPorRiesgo(riesgo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/riesgo/${riesgo}`);
  }

  guardar(idUsuario: number, idLocalizacion: number | null, notificacion: any): Observable<any> {
    let params = new HttpParams().set('idUsuario', idUsuario.toString());

    if (idLocalizacion) {
      params = params.set('idLocalizacion', idLocalizacion.toString());
    }

    return this.http.post<any>(this.apiUrl, notificacion, { params });
  }

  actualizar(id: number, notificacion: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, notificacion);
  }

  marcarComoLeida(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/leido`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}