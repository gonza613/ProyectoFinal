import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EspecialidadService } from 'src/app/services/especialidad.service';

@Component({
  selector: 'app-acciones',
  templateUrl: './acciones.component.html',
  styleUrls: ['./acciones.component.css']
})
export class AccionesComponent {

  especialidad: any;
  id_medico: any ;
  token: any = localStorage.getItem('jwt');
  constructor(private especialidadesService: EspecialidadService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { id_medico: string }
  ){
    this.id_medico = data.id_medico;
    this.obtenerEspecialidadesMedico()
  }

  obtenerEspecialidadesMedico(){
    this.especialidadesService.obtenerEspecialidadesMedico(this.id_medico,this.token).subscribe((data : any)=>{
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
