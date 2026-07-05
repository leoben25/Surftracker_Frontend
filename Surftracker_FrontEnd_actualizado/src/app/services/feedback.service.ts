import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../models/expus.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:8091/api/feedbacks';

  constructor(private http: HttpClient) {}

  listar(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Feedback> {
    return this.http.get<Feedback>(`${this.apiUrl}/${id}`);
  }

  listarPorUsuario(idUsuario: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  listarPorPronostico(idPronostico: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/pronostico/${idPronostico}`);
  }

  listarPorCalificacion(calificacion: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/calificacion/${calificacion}`);
  }

  guardar(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.apiUrl}/guardarFeedback`, feedback);
  }

  actualizar(id: number, feedback: Feedback): Observable<Feedback> {
    return this.http.put<Feedback>(`${`${this.apiUrl}`}/${id}`, feedback);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}