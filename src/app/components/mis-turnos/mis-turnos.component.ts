import { Component } from '@angular/core';

export interface PeriodicElement {
  fecha: string;
  hora: string;
  especialista: string;
  especialidad: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {fecha: 'Lunes 1 de octubre', hora: '12:00', especialista: 'Pedro', especialidad: 'H'},
  {fecha: 'Martes 2 de octubre', hora: '13:00', especialista: 'Goiak', especialidad: 'He'},
  {fecha: 'Miercoles 3 de octubre', hora: '14:00', especialista: 'Medico', especialidad: 'Li'},
  {fecha: 'Jueves 4 de octubre', hora: '15:00', especialista: 'Doctor', especialidad: 'Be'},
  {fecha: 'Viernes 5 de octubre', hora: '16:00', especialista: 'doc', especialidad: 'B'},
];

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent {
  displayedColumns: string[] = ['fecha', 'hora', 'especialista', 'especialidad'];
  dataSource = ELEMENT_DATA;
}
