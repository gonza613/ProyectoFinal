import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TurnosService } from 'src/app/services/turnos.service';
import { AccionesComponent } from './acciones/acciones.component';


export interface Turnos {
  fecha: Date;
  hora: string;
  id_agenda: number;
  id_paciente: number;
}

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent implements OnInit{

  id:any;
  token: any;
  turnos:Turnos[] = [];
  displayedColumns = ['fecha','hora','acciones'];
  
  constructor(private turnosService: TurnosService,
    private router:Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ){
    this.id=localStorage.getItem('id');
    this.token=localStorage.getItem('jwt');
  }

  ngOnInit(): void {
    this.obtenerTurnos();
  }

  obtenerTurnos() {
    this.turnosService.obtenerTurnoPaciente(this.id, this.token).subscribe((data: any) => {    
      if (data.codigo === 200 && data.payload.length > 0) {
        this.turnos = data.payload.sort((a: any, b: any) => {
          const fechaA = new Date(a.fecha).getTime();
          const fechaB = new Date(b.fecha).getTime();
          if (fechaA === fechaB) {
            return a.hora.localeCompare(b.hora);
          }
          return fechaA - fechaB; 
        }); 
      } else if (data.codigo === -1) {
        this.jwtExpirado();
      } else {
        this.openSnackBar('No tienes ningun turno');
      }
    });
  }

 abrirAcciones(id_turno: any) {
  const dialogRef = this.dialog.open(AccionesComponent, {
    width: '450px',
    data: {id_turno: id_turno}
  });
}

 jwtExpirado() {
  this.openSnackBar('Sesión expirada.');

  setTimeout(() => {
    this.router.navigate(['/home']);
  }, 1000);
}

openSnackBar(message: string) {
  this.snackBar.open(message, 'Cerrar', {
    duration: 5000,
  });
}

}
