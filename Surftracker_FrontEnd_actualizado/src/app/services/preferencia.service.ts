import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preferencia, PreferenciaResponse } from '../models/expus.model';

@Injectable({
  providedIn: 'root'
})
export class PreferenciaService {
  private apiUrl = 'http://localhost:8091/api/preferencias';

  constructor(private http: HttpClient) {}

  insertar(preferencia: Preferencia): Observable<PreferenciaResponse> {
    return this.http.post<PreferenciaResponse>(`${this.apiUrl}/insertaPreferencia`, preferencia);
  }

  listarPorUsuario(idUsuario: number): Observable<Preferencia[]> {
    return this.http.get<Preferencia[]>(`${this.apiUrl}/listaPorUsuario/${idUsuario}`);
  }
}