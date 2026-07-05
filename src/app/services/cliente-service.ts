import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../app.settings';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

const baseUrl = AppSettings.API_ENDPOINT + '/clientes';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    
    constructor(private http: HttpClient) {}
    registrarCliente(data: Cliente): Observable<any> {
    
        return this.http.post(baseUrl + '/registro', data);
    }
}