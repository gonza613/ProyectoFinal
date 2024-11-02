import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { TurnosService } from 'src/app/services/turnos.service';

@Component({
  selector: 'app-acciones',
  templateUrl: './acciones.component.html',
  styleUrls: ['./acciones.component.css']
})
export class AccionesComponent {

  especialidad: any;
  id_turno: any ;
  token: any = localStorage.getItem('jwt');
  id: any = localStorage.getItem('id');
  turno:any;
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private turnosSerivce: TurnosService,
    @Inject(MAT_DIALOG_DATA) public data: { id_turno: string },
    private dialog: MatDialog
  ){
    this.id_turno = data.id_turno;
    this.obtenerTurno(this.id_turno);
  }

  obtenerTurno(id: any){
    this.turnosSerivce.obtenerTurnoPaciente(this.id, this.token).subscribe((data: any)=>{      
      if(data.codigo === 200 && data.payload.length > 0){
        this.turno= data.payload.find((turno: any) => turno.id_turno === id );             
      }else if (data.codigo === -1){
        this.jwtExpirado();
      } else {
        this.openSnackBar(data.mensaje);
      }
    })
   }

   cerrar(){
    this.dialog.closeAll();
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
