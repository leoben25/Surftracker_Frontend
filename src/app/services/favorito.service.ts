import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorito } from '../models/expus.model';

@Injectable({ providedIn: 'root' })
export class FavoritoService {
  private apiUrl = 'http://localhost:8091/api/favoritos'; 

  constructor(private http: HttpClient) { }

  listar(): Observable<Favorito[]> {
    return this.http.get<Favorito[]>(this.apiUrl);
  }
}
