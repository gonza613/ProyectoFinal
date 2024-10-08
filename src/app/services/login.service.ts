import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:4200/api';  // La URL del backend

  constructor(private http: HttpClient) { }

  // Método para hacer el login
  login(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
      
    return this.http.post(`${this.apiUrl}/login`, body, { headers });
  }

}
