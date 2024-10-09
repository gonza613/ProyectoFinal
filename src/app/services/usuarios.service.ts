import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = 'http://localhost:4000/api';  // La URL del backend

  constructor(private http: HttpClient) { }

  // Método para hacer el login
  obtenerUsuario(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
      
    return this.http.get(`${this.apiUrl}/obtenerUsuario/${id}`, { headers });
  }

  

}
