import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { Localizacion } from '../models/localizacion.model';

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
}