import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CrearPacienteComponent } from '../crear-paciente/crear-paciente.component';
import { MisTurnosComponent } from '../mis-turnos/mis-turnos.component';
import { ListaUsuariosComponent } from '../lista-usuarios/lista-usuarios.component';
import { TurnosService } from 'src/app/services/turnos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgendaService } from 'src/app/services/agenda.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pantalla-principal',
  templateUrl: './pantalla-principal.component.html',
  styleUrls: ['./pantalla-principal.component.css']
})
export class PantallaPrincipalComponent implements OnInit{

  usuario = localStorage.getItem('nombreUsuario');
  rol = localStorage.getItem('rol');
  id = localStorage.getItem('id');
  tituloCrear: string = '';
  turnos:any[] = [];
  agenda:any[] = [];
  horarios: FormGroup;
  fecha = new Date().toISOString().split('T')[0];
  token: any = localStorage.getItem('jwt');

  displayedColumns = ['nombre_medico','especialidad','horario_atencion','acciones'];

  constructor(private router: Router, private dialog: MatDialog, private turnosService: TurnosService, private snackBar: MatSnackBar, private agendaService: AgendaService, private fb: FormBuilder){
    this.horarios = this.fb.group({
      fecha: [new Date(), Validators.required]
    });
    const hoy = new Date().toISOString();
    this.obtenerAgenda(hoy);
    this.horarios.get('fecha')?.valueChanges.subscribe((value) => {
      this.fecha = this.horarios.controls['fecha'].value.toISOString().split('T')[0]
    })
    this.obtenerTurnos();
  }

  ngOnInit(): void {
    if(this.rol === 'operador'){
      this.tituloCrear = 'Crear paciente';
    } else{
      this.tituloCrear = 'Crear usuario';
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('id');
    this.router.navigate(['/home']);
  }

  obtenerTurnos(){
    this.turnosService.obtenerTurnoPaciente(this.id, this.token).subscribe((data: any)=>{
      console.log(data.payload);
      if(data.codigo === 200){
        this.turnos= data.payload.sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());     
      }else if (data.codigo === -1){
        this.jwtExpirado();
      } else {
        this.openSnackBar(data.mensaje);
      }
    })
   }

   obtenerAgenda(fecha:any){
    if(fecha === ''){
      fecha = this.horarios.controls['fecha'].value;
    }
    this.agendaService.obtenerAgenda('7', this.token).subscribe((data: any) => {
      console.log(data)
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

  nuevoTurno(){
    this.router.navigate(['/nuevo-turno']);
  }

  abrirCrearPaciente() {
    const dialogRef = this.dialog.open(CrearPacienteComponent, {
      width: '450px'
    });
  }

  misDatos(){
    this.router.navigate(['mis-datos']);
  }
  abrirMisTurnos() {
    this.dialog.open(MisTurnosComponent);
  }
  abrirListaUsuario() {
    this.router.navigate(['lista-usuarios']);
  }
  abrirTurnosProgramados(){
    this.router.navigate(['turnos-programados']);
  }
  abrirGestionAgenda(){
    this.router.navigate(['gestion-agenda']);
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
