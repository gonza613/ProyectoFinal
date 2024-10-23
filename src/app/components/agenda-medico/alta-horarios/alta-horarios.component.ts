import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AgendaService } from 'src/app/services/agenda.service';
import { EspecialidadService } from '../../../services/especialidad.service';

@Component({
  selector: 'app-alta-horarios',
  templateUrl: './alta-horarios.component.html',
  styleUrls: ['./alta-horarios.component.css']
})
export class AltaHorariosComponent {
  forma: FormGroup;
  fecha: string;
  token: any = localStorage.getItem('jwt')
  id: any = localStorage.getItem('id')
  constructor(private fb: FormBuilder, 
    private router: Router,
    private snackBar: MatSnackBar,
    private agendaService: AgendaService,
    private especialidadesService: EspecialidadService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { fecha: string }){
    this.forma = this.fb.group({
      hora_desde: ['', Validators.required],
      hora_hasta: ['', Validators.required]
    });
    this.fecha = data.fecha;
  }

  async crearAgenda(){
    let especialidad;
        this.especialidadesService.obtenerEspecialidadesMedico(this.id,this.token).subscribe((data: any) =>{        
        if(data.codigo === 200){
           especialidad = data.payload[0].id_especialidad
           let body = {
            id_medico: this.id,
            id_especialidad: especialidad,
            fecha: this.fecha,
            hora_entrada: this.forma.controls['hora_desde'].value,
            hora_salida: this.forma.controls['hora_hasta'].value
          }          
          this.agendaService.crearAgenda(JSON.stringify(body),this.token).subscribe((data:any) =>{
            if (data.codigo === 200){
              this.openSnackBar('Guardado correctamente');
              this.dialog.closeAll();
              window.location.reload();

              } else if (data.codigo === -1){
              this.jwtExpirado();
            } else {
              this.openSnackBar(data.mensaje)
            }
          })
        }else if (data.codigo === -1){
          this.jwtExpirado();
        } else {
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
