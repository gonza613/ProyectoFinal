import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AgendaService } from 'src/app/services/agenda.service';

@Component({
  selector: 'app-agenda-operador',
  templateUrl: './agenda-operador.component.html',
  styleUrls: ['./agenda-operador.component.css']
})
export class AgendaOperadorComponent {
  id_agenda: any;
  id_especialidad: any;
  fecha: any;
  id_medico: any;
  agendaForm: FormGroup;
  token: any = localStorage.getItem('jwt');
  constructor(@Inject(MAT_DIALOG_DATA) public data: { id_agenda: any, id_medico: any, fecha: any, id_especialidad: any },private fb: FormBuilder, private agendaService: AgendaService, private dialogRef: MatDialogRef<AgendaOperadorComponent>, private router: Router, private snackBar: MatSnackBar){
    this.id_agenda = data.id_agenda;
    this.id_medico = data.id_medico;
    this.fecha = data.fecha;
    this.id_especialidad = data.id_especialidad;

    
    this.agendaForm = this.fb.group({
      hora_entrada: ['', Validators.required],
      hora_salida: ['', Validators.required]
    });
  }

  editarAgenda(){
    let body = {
      id_medico: this.id_medico,
      id_especialidad: this.id_especialidad,
      fecha: this.fecha,
      hora_entrada: this.agendaForm.controls['hora_entrada'].value,
      hora_salida: this.agendaForm.controls['hora_salida'].value
    }
    console.log(body)
    this.agendaService.editarAgenda(this.id_agenda, JSON.stringify(body), this.token).subscribe((data:any) => {
      if(data.codigo === 200){
        this.dialogRef.close(true);
        this.openSnackBar('Modificacion de agenda exitoso');
        
      } else {
        console.error(data.mensaje)
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
