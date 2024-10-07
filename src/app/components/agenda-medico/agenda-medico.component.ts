import { Component } from '@angular/core';

@Component({
  selector: 'app-agenda-medico',
  templateUrl: './agenda-medico.component.html',
  styleUrls: ['./agenda-medico.component.css']
})
export class AgendaMedicoComponent {

  fechaSeleccionada: Date = new Date();  // Por defecto, el día actual
  listaHorarios: { start: string, end: string }[] = [];  // Lista de horarios
  agregarHorario: boolean = false;  // Controla si se está agregando un nuevo horario
  nuevoHorario: { start: string, end: string } = { start: '', end: '' };  // Nuevo horario

  agregarHorarios() {
    this.agregarHorario = true;
  }

  confirmarHorarios() {
    if (this.nuevoHorario.start && this.nuevoHorario.end) {
      this.listaHorarios.push({ ...this.nuevoHorario });
      this.nuevoHorario = { start: '', end: '' };  // Resetea los campos
      this.agregarHorario = false;
    }
  }

  eliminarHorarios(horario: { start: string, end: string }) {
    this.listaHorarios = this.listaHorarios.filter(h => h !== horario);
  }
}

