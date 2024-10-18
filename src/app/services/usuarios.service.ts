import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = 'http://localhost:4000/api';  // La URL del backend

  constructor(private http: HttpClient) { 
  }

  // Método para hacer el login
  obtenerUsuario(id: any, token: string ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': token
    });
      
    return this.http.get(`${this.apiUrl}/obtenerUsuario/${id}`, { headers });
  }

  obtenerUsuarios(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': token
    });    
      
    return this.http.get(`${this.apiUrl}/obtenerUsuarios`, { headers });
  }

  actualizarUsuario(id: any, body: any, token:string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': token
    });
      
    return this.http.put(`${this.apiUrl}/actualizarUsuario/${id}`, body, { headers });
  }
}
