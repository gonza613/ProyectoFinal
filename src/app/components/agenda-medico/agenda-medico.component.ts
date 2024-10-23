import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AgendaService } from 'src/app/services/agenda.service';
import { AltaHorariosComponent } from './alta-horarios/alta-horarios.component';

@Component({
  selector: 'app-agenda-medico',
  templateUrl: './agenda-medico.component.html',
  styleUrls: ['./agenda-medico.component.css']
})
export class AgendaMedicoComponent {

  id:any;
  token: any;
  displayedColumns = ['fecha','hora_salida','hora_entrada'];
  horarios: FormGroup;
  agenda: any;
  fecha = new Date().toISOString().split('T')[0];

  constructor(private router: Router, private snackBar: MatSnackBar, private fb: FormBuilder, private agendaService: AgendaService, private dialog: MatDialog){
    this.id=localStorage.getItem('id');
    this.token=localStorage.getItem('jwt');
    
    this.horarios = this.fb.group({
      fecha: [new Date(), Validators.required]
    });
    const hoy = new Date().toISOString();
    this.obtenerAgenda(hoy);
    this.horarios.get('fecha')?.valueChanges.subscribe((value) => {
      this.fecha = this.horarios.controls['fecha'].value.toISOString().split('T')[0]
    })
    // this.horarios.get('fecha')?.valueChanges.subscribe((value) => {
    //   this.obtenerAgenda(this.horarios.controls['fecha'].value);
  }

  obtenerAgenda(fecha:any){
    if(fecha === ''){
      fecha = this.horarios.controls['fecha'].value;
    }
    this.agendaService.obtenerAgenda(this.id, this.token).subscribe((data: any) => {
      console.log(data);
      if(data.codigo === 200){

      // Obtener la fecha seleccionada del FormControl
      const fechaSeleccionada = new Date(this.horarios.controls['fecha'].value);
          
      // Convertir la fecha seleccionada al formato ISO completo
      let fechaFormatted = fechaSeleccionada.toISOString().split('T')[0];

        const payload = Array.isArray(data.payload) ? data.payload : Object.values(data.payload);

        this.agenda = payload.filter((horario: { fecha: any; }) => {const fechaHorario = new Date(horario.fecha).toISOString().split('T')[0];
        return fechaHorario === fechaFormatted;});
        console.log(this.agenda);
      } else if (data.codigo === -1){
        this.jwtExpirado();
      } else {
        this.openSnackBar(data.mensaje);
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

  abrirAltaHorarios(fecha: string) {
    const dialogRef = this.dialog.open(AltaHorariosComponent, {
      width: '450px',
      data: { fecha : this.fecha }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/agenda-medico']);
      } else {
        console.log('Acción cancelada');
      }
    });
  }


}
