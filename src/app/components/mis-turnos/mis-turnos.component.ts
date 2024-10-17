import { Component, OnInit } from '@angular/core';
import { TurnosService } from 'src/app/services/turnos.service';

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
  turnos:Turnos[] = [];
  displayedColumns = ['fecha','hora','agenda','paciente'];
  //displayedColumns : any;
  constructor(private turnosService: TurnosService){
    this.id=localStorage.getItem('id');
  }

  ngOnInit(): void {
    this.obtenerTurnos();
  }

 obtenerTurnos(){
  this.turnosService.obtenerTurnoPaciente(this.id).subscribe((data: any)=>{
    console.log(data)
    if(data.codigo == 200){
      this.turnos= data.payload;
    } else {
      console.error(data.mensaje)
    }
  })
 }
}
