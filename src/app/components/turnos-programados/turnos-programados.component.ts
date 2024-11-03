import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TurnosService } from 'src/app/services/turnos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotaComponent } from './nota/nota.component';
import { NuevoTurnoComponent } from '../nuevo-turno/nuevo-turno.component';


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
export class TurnosProgramadosComponent implements OnInit {
  id: any;
  token: any;
  rol: any = localStorage.getItem('rol');
  turnos: any;
  displayedColumns: any;
  fecha: FormGroup;
  fechaTurno: any;
  nota: any;
  id_url: any;
  fechaSeleccionada: any | null = null;
  hoy: Date = new Date();
  @Input() id_urlPadre!: any
  @Input() dia!: any
  constructor(private turnosService: TurnosService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute) {
    this.id = localStorage.getItem('id');
    this.token = localStorage.getItem('jwt');
    this.displayedColumns = ['fecha', 'hora', 'nombre_paciente', 'edad', 'cobertura', 'nota'];
    this.id_url = this.activatedRoute.snapshot.paramMap.get('id')
    this.fecha = this.fb.group({
      fecha: [this.hoy],
    });
  }

  ngOnInit(): void {
    const today = new Date();
    const formattedDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    if (this.rol === 'operador') {
      this.id_url = this.id_urlPadre
      this.obtenerTurnosMedico(this.dia);
    } else {

      this.obtenerTurnosMedico(formattedDate);
    }

  }

  obtenerTurnosMedico(fecha: any) {
    if (fecha == '') {
      fecha = this.fecha.controls['fecha'].value
      fecha = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();
    }
    let body: any;
    if (this.rol === 'operador') {
      body = {
        id_medico: this.id_url,
        fecha: fecha
      }
    } else {
      body = {
        id_medico: this.id,
        fecha: fecha
      }
    }
    this.turnosService.obtenerTurnoMedico(JSON.stringify(body), this.token).subscribe((data: any) => {
      if (data.codigo === 200 && data.payload.length > 0) {
        this.turnos = data.payload;
        this.openSnackBar('Turnos para el dia: ' + fecha);
      } else if (data.codigo === -1) {
        this.jwtExpirado();
      } else {
        this.turnos = []
        this.openSnackBar('No se encontraron turnos para el dia: ' + fecha);
      }
    })
  }

  calcularEdad(fechaNacimiento: string): number {
    let hoy = new Date();
    let nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    let mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  }
  abrirNuevoTurno() {
    const dialogo = this.dialog.open(NuevoTurnoComponent, {
      width: '450px',
      data: {
        id_medico: this.id_url,
        fecha: this.dia
      }
    })
    dialogo.afterClosed().subscribe((result) => {
      this.turnos = [];
      this.obtenerTurnosMedico(this.dia)
    })
  }

  verNota(nota: string) {
    let dialogRef = this.dialog.open(NotaComponent, {
      width: '450px',
      data: { nota: nota }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/turnos-programados']);
      }
    });
  }

  eliminarTurno(id: any) {
    this.turnosService.eliminarTurno(id, this.token).subscribe((data: any) => {
      this.openSnackBar('Turno eliminado correctamente.');
      this.obtenerTurnosMedico(this.dia);
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
