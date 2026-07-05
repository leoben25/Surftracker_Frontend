import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../app.settings';
import { Observable } from 'rxjs';
import { Localizacion } from '../models/localizacion.model';

const baseUrl = AppSettings.API_ENDPOINT + '/localizaciones';

@Injectable({
  providedIn: 'root'
})
export class LocalizacionService {

  constructor(private http: HttpClient) {}

  registrarLocalizacion(data: Localizacion): Observable<Localizacion> {
    return this.http.post<Localizacion>(baseUrl + '/registrarLocalizacion', data);
  }

  listarLocalizaciones(): Observable<Localizacion[]> {
    return this.http.get<Localizacion[]>(baseUrl + '/listaTodos');
  }

  buscarLocalizacionPorId(id: number): Observable<Localizacion> {
    return this.http.get<Localizacion>(baseUrl + '/' + id);
  }

  actualizarLocalizacion(data: Localizacion): Observable<Localizacion> {
    return this.http.put<Localizacion>(baseUrl + '/actualizarLocalizacion', data);
  }

  eliminarLocalizacion(id: number): Observable<any> {
    return this.http.delete(baseUrl + '/eliminarLocalizacion/' + id);
  }
}