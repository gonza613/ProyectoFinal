import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MisTurnosComponent } from '../mis-turnos/mis-turnos.component';
@Component({
  selector: 'app-pantalla-principal',
  templateUrl: './pantalla-principal.component.html',
  styleUrls: ['./pantalla-principal.component.css']
})

export class PantallaPrincipalComponent {
  
  readonly dialog = inject(MatDialog);
  userName: string = 'Nombre del Usuario'; 
  userType: string = 'Paciente'; //hardcodeado por ahora

  constructor(private router: Router){
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.router.navigate(['/home']);
  }

  nuevoTurno(){
    this.router.navigate(['/nuevo-turno']);
  }

  openDialog() {
    this.dialog.open(MisTurnosComponent);
  }

}
