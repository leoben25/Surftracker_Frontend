import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreferenciaService {
  private apiUrl = 'http://localhost:8091/api/preferencias';

  constructor(private http: HttpClient) {}

  insertar(preferencia: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insertaPreferencia`, preferencia);
  }

  listarPorUsuario(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listaPorUsuario/${idUsuario}`);
  }
}