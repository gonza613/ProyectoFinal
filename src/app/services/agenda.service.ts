import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private apiUrl = 'http://localhost:4000/api';  // La URL del backend

  constructor(private http: HttpClient) { }

  obtenerAgenda( id_medico: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': token
    });
    return this.http.get(`${this.apiUrl}/obtenerAgenda/${id_medico}`, { headers });
  }

  crearAgenda(body:any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': token
    });
    return this.http.post(`${this.apiUrl}/crearAgenda`,body,{ headers });
  }

  editarAgenda(id: any, body:any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': token
    });
    return this.http.put(`${this.apiUrl}/modificarAgenda/${id}`,body,{ headers });
  }
}
