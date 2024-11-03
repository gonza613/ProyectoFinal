import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CrearPacienteComponent } from '../crear-paciente/crear-paciente.component';
import { MisTurnosComponent } from '../mis-turnos/mis-turnos.component';
import { TurnosService } from 'src/app/services/turnos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgendaService } from 'src/app/services/agenda.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { firstValueFrom } from 'rxjs';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { AgendaOperadorComponent } from '../agenda-operador/agenda-operador.component';

@Component({
  selector: 'app-pantalla-principal',
  templateUrl: './pantalla-principal.component.html',
  styleUrls: ['./pantalla-principal.component.css']
})
export class PantallaPrincipalComponent implements OnInit {

  usuario = localStorage.getItem('nombreUsuario');
  rol = localStorage.getItem('rol');
  id = localStorage.getItem('id');
  tituloCrear: string = '';
  turnos: any[] = [];
  agenda: any[] = [];
  medicos: any;
  agendas: any[] = [];
  horarios: FormGroup;
  fecha = new Date().toISOString().split('T')[0];
  token: any = localStorage.getItem('jwt');
  usuarios: any;
  especialidad: any;
  dia: any;
  muestraTurno: boolean = false;
  id_medico: any;
  displayedColumns = ['nombre_medico', 'especialidad', 'horario_atencion', 'acciones'];
  constructor(private router: Router, private especialidadesServices: EspecialidadService, private dialog: MatDialog, private usuariosServices: UsuariosService, private turnosService: TurnosService, private snackBar: MatSnackBar, private agendaService: AgendaService, private fb: FormBuilder) {
    this.horarios = this.fb.group({
      fecha: [new Date(), Validators.required]
    });
    this.horarios.get('fecha')?.valueChanges.subscribe((value) => {
      this.fecha = this.horarios.controls['fecha'].value.toISOString().split('T')[0]
    })
    this.obtenerEspecialidades();
  }

  ngOnInit(): void {
    if (this.rol === 'operador') {
      this.tituloCrear = 'Crear paciente';
      this.obtenerUsuarios();
    } else {
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

  async obtenerUsuarios() {
    this.medicos = await firstValueFrom(this.usuariosServices.obtenerUsuarios(this.token))
    if (this.medicos.codigo === 200 && this.medicos.payload.length > 0) {
      this.usuarios = this.medicos.payload
      this.medicos = this.medicos.payload.filter((user: any) => user.rol === 'medico')
    } else if (this.medicos.codigo === -1) {
      this.openSnackBar(this.medicos.mensaje)
    } else {
      this.openSnackBar('No se encontraron medicos o agendas para este dia')
    }

    let promesas = this.medicos.map((medico: any) => this.obtenerAgenda(medico.id, ''));

    try {
      this.agendas = await Promise.all(promesas);
      this.agendas = this.agendas.flat();
      this.muestraTurno = false;
    } catch (error) {
      this.openSnackBar('Error al obtener las agendas:' + error);
    }
  }

  obtenerUnUsuario(id: any) {
    let medico = this.usuarios.find((user: any) => user.id === id)
    return medico.nombre + ' ' + medico.apellido;
  }

  obtenerEspecialidad(id_especialidad: any) {
    return this.especialidad[id_especialidad - 1].descripcion;
  }

  obtenerEspecialidades() {
    this.especialidadesServices.obtenerEspecialidades(this.token).subscribe((data: any) => {
      if (data.codigo === 200 && data.payload.length > 0) {
        this.especialidad = data.payload
      } else if (data.codigo === -1) {
        this.jwtExpirado()
      } else {
        this.openSnackBar(data.mensaje)
      }
    })
  }

  obtenerAgenda(id: any, fecha: any): Promise<any> {
    return new Promise((resolve) => {
      if (fecha === '') {
        fecha = this.horarios.controls['fecha'].value;
      }
      this.agendaService.obtenerAgenda(id, this.token).subscribe((data: any) => {
        if (data.codigo === 200 && data.payload.length > 0) {
          let fechaSeleccionada = new Date(this.horarios.controls['fecha'].value);
          let fechaFormatted = fechaSeleccionada.toISOString().split('T')[0];
          let payload = Array.isArray(data.payload) ? data.payload : Object.values(data.payload);
          let agendaFiltrada = payload.filter((horario: { fecha: any; }) => {
            let fechaHorario = new Date(horario.fecha).toISOString().split('T')[0];
            return fechaHorario === fechaFormatted;
          });

          resolve(agendaFiltrada);
        } else if (data.codigo === -1) {
          this.jwtExpirado();
        } else {
          this.openSnackBar(data.mensaje);
        }
      });
    });
  }

  nuevoTurno() {
    this.router.navigate(['/nuevo-turno']);
  }

  abrirCrearPaciente() {
    let dialogRef = this.dialog.open(CrearPacienteComponent, {
      width: '450px'
    });
  }

  misDatos() {
    this.router.navigate(['mis-datos']);
  }
  abrirMisTurnos() {
    this.dialog.open(MisTurnosComponent, {
      width: '450px'
    });
  }
  abrirListaUsuario() {
    this.router.navigate(['lista-usuarios']);
  }
  abrirTurnosProgramados(id: any) {
    this.id_medico = id
    let fechaSeleccionada = new Date(this.horarios.controls['fecha'].value);
    this.dia = fechaSeleccionada.toISOString().split('T')[0];
    this.muestraTurno = true;
  }

  abrirTurnosProgramadosMedico() {
    this.router.navigate(['turnos-programados/' + this.id]);
  }

  abrirGestionAgenda() {
    this.router.navigate(['gestion-agenda']);
  }

  abrirEditarAgenda(id_agenda: any, id_medico: any, fecha: any, id_especialidad: any) {
    let dialogRef = this.dialog.open(AgendaOperadorComponent, {
      width: '450px',
      data: {
        id_agenda: id_agenda,
        id_medico: id_medico,
        fecha: fecha,
        id_especialidad: id_especialidad
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerUsuarios();
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
