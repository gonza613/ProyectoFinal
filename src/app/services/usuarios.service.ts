import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = 'http://localhost:4000/api';  // La URL del backend
  token:any;

  constructor(private http: HttpClient) { 
    this.token = localStorage.getItem('jwt');
  }

  // Método para hacer el login
  obtenerUsuario(id: any ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': this.token
    });
      
    return this.http.get(`${this.apiUrl}/obtenerUsuario/${id}`, { headers });
  }

  obtenerUsuarios(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': this.token
    });    
      
    return this.http.get(`${this.apiUrl}/obtenerUsuarios`, { headers });
  }

  actualizarUsuario(id: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': this.token
    });
      
    return this.http.put(`${this.apiUrl}/actualizarUsuario/${id}`, body, { headers });
  }

  

}
