import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
  token: any;
  turnos:Turnos[] = [];
  displayedColumns = ['fecha','hora','agenda','paciente'];
  especialidades:  { [key: number]: string } = {
                   1:'Traumatologia',
                   2:'Cardiologia',
                   3:'Gastroenterologia',
                   4:'Ginecologia',
                   5:'Clinico',
                   6:'Odontologia',
                   7:'Dermatologia',
                   8:'Oftalmologia',
                   9:'Pediatra',
                   10:'Urologia',
                   11:'Neurologia',
                   12:'Nutricion',
                   13:'Psicologia',
                   14:'Fonoaudiologia',
  }
  
  constructor(private turnosService: TurnosService,
    private router:Router,
    private snackBar: MatSnackBar
  ){
    this.id=localStorage.getItem('id');
    this.token=localStorage.getItem('jwt');
  }

  ngOnInit(): void {
    this.obtenerTurnos();
  }

 obtenerTurnos(){
  this.turnosService.obtenerTurnoPaciente(this.id, this.token).subscribe((data: any)=>{
    if(data.codigo === 200){
      this.turnos= data.payload;
    }else if (data.codigo === -1){
      this.jwtExpirado();
    } else {
      this.openSnackBar(data.mensaje);
    }
  })
 }

 obetenerEspecialidad(id: number){
  return this.especialidades[id];
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
