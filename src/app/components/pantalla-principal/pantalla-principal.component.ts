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
import { UsuariosService } from 'src/app/services/usuarios.service';
import { firstValueFrom, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { EspecialidadService } from 'src/app/services/especialidad.service';

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
  medicos:any;
  agendas:any[]=[];
  horarios: FormGroup;
  fecha = new Date().toISOString().split('T')[0];
  token: any = localStorage.getItem('jwt');
  usuarios:any;
  especialidad:any;
  dia:any;
  muestraTurno: boolean = false;
  id_medico:any;
  displayedColumns = ['nombre_medico','especialidad','horario_atencion','acciones'];
  constructor(private router: Router, private especialidadesServices: EspecialidadService, private dialog: MatDialog, private usuariosServices:UsuariosService,private turnosService: TurnosService, private snackBar: MatSnackBar, private agendaService: AgendaService, private fb: FormBuilder){
    this.horarios = this.fb.group({
      fecha: [new Date(), Validators.required]
    });
    const hoy = new Date().toISOString();
    // this.obtenerAgenda(hoy);
    this.horarios.get('fecha')?.valueChanges.subscribe((value) => {
      this.fecha = this.horarios.controls['fecha'].value.toISOString().split('T')[0]
    })
    this.obtenerEspecialidades();
  }

  ngOnInit(): void {
    if(this.rol === 'operador'){
      this.tituloCrear = 'Crear paciente';
    } else{
      this.tituloCrear = 'Crear usuario';
    }
    this.obtenerUsuarios()
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

  obtenerTurnos(id:any){
    let body={
      id_medico:id,
      fecha:'2024-10-26'
    }
    this.turnosService.obtenerTurnoMedico(body, this.token).subscribe((data: any)=>{
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

   async obtenerUsuarios(){
    this.medicos = await firstValueFrom(this.usuariosServices.obtenerUsuarios(this.token))
    if (this.medicos.codigo === 200 && this.medicos.payload.length > 0) {
      this.usuarios = this.medicos.payload
      this.medicos = this.medicos.payload.filter((user: any) => user.rol === 'medico')
      console.log(this.medicos);
      console.log(this.usuarios);
    } else {
      this.openSnackBar(this.medicos.mensaje)
    }

      const promesas = this.medicos.map((medico: any) => this.obtenerAgenda(medico.id,''));
      
      try {
        this.agendas = await Promise.all(promesas);
        this.agendas = this.agendas.flat();
        console.log(this.agendas);
      } catch (error) {
        console.error('Error al obtener las agendas:', error);
      }
   }

  //  obtenerUnUsuario(id:any){
  //   this.usuariosServices.obtenerUsuario(id,this.token).subscribe((data:any)=>{
  //     if(data.codigo===200 && data.payload.length > 0){
  //       console.log(data);
  //       // return data.payload[0].nombre + ' ' + data.payload[0].apellido  
  //     } else {
  //       // return this.openSnackBar(data.mensaje)
  //     }
  //   })
  //  }

  obtenerUnUsuario(id:any){
    return this.usuarios[id-1].nombre + ' ' +this.usuarios[id-1].apellido;
  }

  obtenerEspecialidad(id_especialidad:any){
    return this.especialidad[id_especialidad-1].descripcion;
  }

  obtenerEspecialidades(){
    this.especialidadesServices.obtenerEspecialidades(this.token).subscribe((data:any)=>{
      console.log(data);
      
      this.especialidad=data.payload      
    })
  }

  //  obtenerAgenda(id:any ,fecha:any){
  //   if(fecha === ''){
  //     fecha = this.horarios.controls['fecha'].value;
  //   }
  //   this.agendaService.obtenerAgenda(id, this.token).subscribe((data: any) => {
  //     // console.log(data)
  //     if(data.codigo === 200){

  //     // Obtener la fecha seleccionada del FormControl
  //     const fechaSeleccionada = new Date(this.horarios.controls['fecha'].value);
          
  //     // Convertir la fecha seleccionada al formato ISO completo
  //     let fechaFormatted = fechaSeleccionada.toISOString().split('T')[0];

  //       const payload = Array.isArray(data.payload) ? data.payload : Object.values(data.payload);

  //       this.agenda = payload.filter((horario: { fecha: any; }) => {const fechaHorario = new Date(horario.fecha).toISOString().split('T')[0];
  //       return fechaHorario === fechaFormatted;
  //     });
  //       // console.log(this.agenda);
  //     } else if (data.codigo === -1){
  //       this.jwtExpirado();
  //     } else {
  //       this.openSnackBar(data.mensaje);
  //     }
  //   })
  // }

  obtenerAgenda(id: any, fecha: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (fecha === '') {
        fecha = this.horarios.controls['fecha'].value;
      }
      this.agendaService.obtenerAgenda(id, this.token).subscribe((data: any) => {
        if (data.codigo === 200) {
          const fechaSeleccionada = new Date(this.horarios.controls['fecha'].value);
          let fechaFormatted = fechaSeleccionada.toISOString().split('T')[0];
  
          const payload = Array.isArray(data.payload) ? data.payload : Object.values(data.payload);
  
          const agendaFiltrada = payload.filter((horario: { fecha: any; }) => {
            const fechaHorario = new Date(horario.fecha).toISOString().split('T')[0];
            return fechaHorario === fechaFormatted;
          });
  
          resolve(agendaFiltrada);
        } else if (data.codigo === -1) {
          this.jwtExpirado();
          reject('Token expirado');
        } else {
          this.openSnackBar(data.mensaje);
          reject(data.mensaje);
        }
      }, error => {
        reject(error);
      });
    });
  }
  obtenerTurnos2(id: any, fecha: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (fecha === '') {
        fecha = this.horarios.controls['fecha'].value;
      }
      this.turnosService.obtenerTurnoPaciente(id, this.token).subscribe((data: any) => {
        if (data.codigo === 200) {
          const fechaSeleccionada = new Date(this.horarios.controls['fecha'].value);
          let fechaFormatted = fechaSeleccionada.toISOString().split('T')[0];
  
          const payload = Array.isArray(data.payload) ? data.payload : Object.values(data.payload);
  
          const agendaFiltrada = payload.filter((horario: { fecha: any; }) => {
            const fechaHorario = new Date(horario.fecha).toISOString().split('T')[0];
            return fechaHorario === fechaFormatted;
          });
  
          resolve(agendaFiltrada);
        } else if (data.codigo === -1) {
          this.jwtExpirado();
          reject('Token expirado');
        } else {
          this.openSnackBar(data.mensaje);
          reject(data.mensaje);
        }
      });
    });
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
  abrirTurnosProgramados(id:any){
    this.id_medico = id
    let fechaSeleccionada = new Date(this.horarios.controls['fecha'].value);
    this.dia = fechaSeleccionada.toISOString().split('T')[0];
    console.log(this.dia);
    console.log(this.id_medico);
    if(this.muestraTurno === true){
    this.muestraTurno=false;
    } else {
      this.muestraTurno=true;
    }
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
