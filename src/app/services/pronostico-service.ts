import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../../app.settings';
import { Observable } from 'rxjs';
import { Pronostico } from '../models/pronostico.model';

const baseUrl = AppSettings.API_ENDPOINT + '/pronosticos';

@Injectable({
  providedIn: 'root'
})
export class PronosticoService {

  constructor(private http: HttpClient) {}

  registrarPronostico(data: Pronostico): Observable<any> {
    return this.http.post(baseUrl + '/registro', data);
  }

  listarPronosticos(): Observable<Pronostico[]> {
    return this.http.get<Pronostico[]>(baseUrl + '/listaTodos');
  }

  listarPorLocalizacion(idLocalizacion: number): Observable<Pronostico[]> {
    return this.http.get<Pronostico[]>(baseUrl + '/listaPorLocalizacion/' + idLocalizacion);
  }

  buscarPorLocalizacionYFecha(idLocalizacion: number, fecha: string): Observable<Pronostico> {
    return this.http.get<Pronostico>(
      baseUrl + '/localizacion/' + idLocalizacion + '/fecha/' + fecha
    );
  }

  buscarPorRangoFechas(idLocalizacion: number, desde: string, hasta: string): Observable<Pronostico[]> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);

    return this.http.get<Pronostico[]>(
      baseUrl + '/localizacion/' + idLocalizacion + '/rango',
      { params }
    );
  }

  actualizarPronostico(idPronostico: number, data: Pronostico): Observable<any> {
    return this.http.put(baseUrl + '/' + idPronostico, data);
  }
}