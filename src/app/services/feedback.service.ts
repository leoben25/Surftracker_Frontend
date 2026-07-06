import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:8091/api/feedbacks';

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

  listarPorPronostico(idPronostico: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pronostico/${idPronostico}`);
  }

  listarPorCalificacion(calificacion: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/calificacion/${calificacion}`);
  }

  guardar(feedback: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/guardarFeedback`, feedback);
  }

  actualizar(id: number, feedback: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, feedback);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}