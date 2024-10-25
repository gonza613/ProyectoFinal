import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TurnosService } from 'src/app/services/turnos.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AltaHorariosComponent } from '../agenda-medico/alta-horarios/alta-horarios.component';
import { NotaComponent } from './nota/nota.component';


export interface Turnos {
  fecha: Date;
  hora: string;
  cobertura: string;
  nombre_paciente: string;
  nombre_medico: string;
  nota: string;
} 

@Component({
  selector: 'app-turnos-programados',
  templateUrl: './turnos-programados.component.html',
  styleUrls: ['./turnos-programados.component.css']
})
export class TurnosProgramadosComponent implements OnInit{
  id: any;
  token: any;
  turnos: any;
  displayedColumns : any;
  fecha: FormGroup;
  fechaTurno: any;
  nota:any;
    fechaSeleccionada: any | null = null;
  constructor(private turnosService: TurnosService, 
    private fb: FormBuilder, 
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog ){
    this.id = localStorage.getItem('id');
    this.token = localStorage.getItem('jwt');
    this.displayedColumns = ['fecha','hora','nombre_paciente','edad','cobertura','nota'];
    this.fecha = this.fb.group({
      fecha: [''],
    });
  }
  ngOnInit(): void {
    const today = new Date();
    const formattedDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    this.obtenerTurnosMedico(formattedDate);
  }

  obtenerTurnosMedico(fecha: any){
    if (fecha == ''){
      fecha=this.fecha.controls['fecha'].value
      fecha=fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();
    }    

    let body = {
      id_medico : this.id,
      fecha : fecha
    }
    this.turnosService.obtenerTurnoMedico(JSON.stringify(body), this.token).subscribe((data: any) => {
      if(data.codigo === 200){
        this.turnos = data.payload;
        console.log(this.turnos);
        
        if(this.turnos[0]){
        this.openSnackBar('Turnos para el dia: '+fecha);        
      } else {
        this.openSnackBar('No se encontraron turnos para el dia: '+fecha);        
      }
    }else if(data.codigo === -1){
      this.jwtExpirado();
    } else {
        this.openSnackBar(data.mensaje);
      }
    })
  }

  calcularEdad(fechaNacimiento: string): number {
    let hoy = new Date(); // Fecha actual
    let nacimiento = new Date(fechaNacimiento); // Fecha de nacimiento

    // Calculamos la diferencia de años
    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    // Verificamos si el cumpleaños ya ha pasado este año, de no ser así, restamos un año
    let mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }

    return edad;
}

  verNota(nota: string){ 
    // this.nota=nota
      const dialogRef = this.dialog.open(NotaComponent, {
        width: '450px',
        data : {nota: nota}
      });
      console.log(nota);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['/turnos-programados']);
        } else {
          console.log('Acción cancelada');
        }
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
