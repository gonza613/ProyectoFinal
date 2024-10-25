import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  constructor(private especialidadesService: EspecialidadService,
    private router: Router,
    private snackBar: MatSnackBar,
    private turnosSerivce: TurnosService,
    @Inject(MAT_DIALOG_DATA) public data: { id_turno: string }
  ){
    this.id_turno = data.id_turno;
    this.obtenerEspecialidadesMedico()
    this.obtenerTurno(this.id_turno);
  }

  obtenerTurno(id: any){
    this.turnosSerivce.obtenerTurnoPaciente(this.id, this.token).subscribe((data: any)=>{
      console.log(data.payload);
      
      if(data.codigo === 200){
        this.turno= data.payload.find((turno: any) => turno.id === id );     
        console.log(this.turno);
        
      }else if (data.codigo === -1){
        this.jwtExpirado();
      } else {
        this.openSnackBar(data.mensaje);
      }
    })
   }

  obtenerEspecialidadesMedico(){
    this.especialidadesService.obtenerEspecialidadesMedico(this.id_turno,this.token).subscribe((data : any)=>{
      console.log(data)
      if (data.codigo === 200){
        this.especialidad = data.payload;
      } else if (data.codigo === -1){
        this.jwtExpirado()
      }else {
        this.openSnackBar(data.mensaje)
      }
    })
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
