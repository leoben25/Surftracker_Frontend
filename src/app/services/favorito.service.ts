import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritoService {
  private apiUrl = 'http://localhost:8091/api/favoritos';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  listarPorUsuario(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  guardarFavorito(idUsuario: number, idLocalizacion: number): Observable<any> {
    const favorito = {
      usuario: {
        idUsuario: idUsuario
      },
      localizacion: {
        id: idLocalizacion
      }
    };

    return this.http.post(`${this.apiUrl}/guardarFavorito`, favorito);
  }

  eliminarFavorito(idFavorito: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminarFavorito/${idFavorito}`);
  }
}