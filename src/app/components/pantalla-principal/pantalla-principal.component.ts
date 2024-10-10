import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CrearPacienteComponent } from '../crear-paciente/crear-paciente.component';
@Component({
  selector: 'app-pantalla-principal',
  templateUrl: './pantalla-principal.component.html',
  styleUrls: ['./pantalla-principal.component.css']
})
export class PantallaPrincipalComponent implements OnInit{

  usuario = localStorage.getItem('nombreUsuario');
  rol = localStorage.getItem('rol');
  id = localStorage.getItem('id');

  userName: string = 'Nombre del Usuario'; 
  // userType: string = 'Paciente';
  // userType: string = 'Operador'; 

  constructor(private router: Router, private dialog: MatDialog){}

  ngOnInit(): void {
    
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('id');
    this.router.navigate(['/home']);
  }

  nuevoTurno(){
    this.router.navigate(['/nuevo-turno']);
  }

  abrirCrearPaciente() {
    const dialogRef = this.dialog.open(CrearPacienteComponent, {
      width: '450px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Paciente creado:', result);
      } else {
        console.log('Acción cancelada');
      }
    });
  }

  misDatos(){
    this.router.navigate(['mis-datos']);
  }

}
