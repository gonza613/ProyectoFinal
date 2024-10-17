import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  private apiUrl = 'http://localhost:4000/api';  // La URL del backend
  token : any = localStorage.getItem('jwt');
  constructor(private http: HttpClient) { }

  obtenerTurnoPaciente(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': this.token
    });
    return this.http.get(`${this.apiUrl}/obtenerTurnoPaciente/${id}`, { headers });
  }

 obtenerTurnoMedico(id: any, fecha:any): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'authorization': this.token
  });
  return this.http.get(`${this.apiUrl}/obtenerTurnosMedico/${id}/${fecha}`, { headers });
}


}
