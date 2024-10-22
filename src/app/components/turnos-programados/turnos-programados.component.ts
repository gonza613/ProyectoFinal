import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TurnosService } from 'src/app/services/turnos.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


export interface Turnos {
  fecha: Date;
  hora: string;
  cobertura: string;
  nombre_medico: string;
  nombre_paciente: string;
  nota: number;
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
    fechaSeleccionada: any | null = null;
  constructor(private turnosService: TurnosService, 
    private fb: FormBuilder, 
    private snackBar: MatSnackBar,
    private router: Router ){
    this.id = localStorage.getItem('id');
    this.token = localStorage.getItem('jwt');
    this.displayedColumns = ['fecha','hora','nombre_medico','nombre_paciente','cobertura','nota'];
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
