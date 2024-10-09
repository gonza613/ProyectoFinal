import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pantalla-principal',
  templateUrl: './pantalla-principal.component.html',
  styleUrls: ['./pantalla-principal.component.css']
})
export class PantallaPrincipalComponent implements OnInit{

  usuario = localStorage.getItem('nombreUsuario');
  rol = localStorage.getItem('rol');

  userName: string = 'Nombre del Usuario'; 
  // userType: string = 'Paciente';

  constructor(private router: Router){}

  ngOnInit(): void {
    const usuario = localStorage.getItem('nombreUsuario');
    const rol = localStorage.getItem('rol');

    if (usuario && rol) {
      console.log(`Usuario conectado: ${usuario}, Rol: ${rol}`);
    } else {
      console.log('No hay usuario conectado');
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('rol');
    this.router.navigate(['/home']);
  }

  nuevoTurno(){
    this.router.navigate(['/nuevo-turno']);
  }
}
