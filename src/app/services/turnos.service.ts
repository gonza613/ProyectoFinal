import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  private apiUrl = 'http://localhost:4000/api';  // La URL del backend
  constructor(private http: HttpClient) { }

  obtenerTurnoPaciente(id: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': token
    });
    return this.http.get(`${this.apiUrl}/obtenerTurnoPaciente/${id}`, { headers });
  }

 obtenerTurnoMedico(body: any, token:string): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'authorization': token
  });
  return this.http.post(`${this.apiUrl}/obtenerTurnosMedico`, body, { headers });
}

asignarTurno(body: any, token: string): Observable<any> {
 const headers = new HttpHeaders({
   'Content-Type': 'application/json',
   'authorization': token
 });
 return this.http.post(`${this.apiUrl}/asignarTurnoPaciente`, body ,{ headers });
}

eliminarTurno(id: any, token: string): Observable<any> {
 const headers = new HttpHeaders({
   'Content-Type': 'application/json',
   'authorization': token
 });
 return this.http.delete(`${this.apiUrl}/eliminarTurnoPaciente/${id}`,{ headers });
}



}
