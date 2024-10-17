import { Component, OnInit } from '@angular/core';
import { TurnosService } from 'src/app/services/turnos.service';

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
  turnos: any;
  displayedColumns : any;

  fechaSeleccionada: any | null = null;
  constructor(private turnosService: TurnosService){
    this.id = localStorage.getItem('id');
    this.displayedColumns = ['fecha','hora','nombre_medico','nombre_paciente','cobertura','nota'];
  }
  ngOnInit(): void {
    const today = new Date();
    const formattedDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    // console.log(formattedDate); // Ejemplo: "2024-10-17"
    this.obtenerTurnosMedico(formattedDate);
    // console.log(formattedDate);
    
  }

  obtenerTurnosMedico(fecha: any){
    
    
    this.turnosService.obtenerTurnoMedico(this.id, fecha).subscribe((data: any) => {
      console.log(data);
      if(data.codigo == 200){
        this.turnos = data.payload;
      } else {
        console.error(data.mensaje);
      }
    })
  }

}
