import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { AgendaService } from 'src/app/services/agenda.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css']
})
export class NuevoTurnoComponent {
  turnoForm: FormGroup;
  token: any = localStorage.getItem('jwt');
  id: any = localStorage.getItem('id');
  rol: any = localStorage.getItem('rol');
  profesionales: any;
  especialidad: any;
  cobertura: any;
  agenda: any[] = [];
  agendaHoras: any[] = [];
  availableDates: Date[] = [];
  hora_entrada:any;
  hora_salida:any;
  horas:any[] = [];
  numArray: number = 0;
  turnos:any;
  pacientes:any;
  horasSinConfirmar:any [] =[];
  fecha:any;
  id_medico:any;
  especialidad_medico:any;
  esMatDialog: boolean = false;
  minutosConfirmados!:any [];



  constructor(private fb: FormBuilder, 
    private router: Router,
    private snackBar: MatSnackBar,
    private turnosServie: TurnosService,
    private usuariosService: UsuariosService,
    private especialidadesService: EspecialidadService,
    private agendaService: AgendaService,
    private dialogRef?: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: { id_medico:any,
    fecha:any;}
  ){
    this.esMatDialog = !!data;
    console.log(this.esMatDialog);

    this.turnoForm = this.fb.group({
      paciente: [''],
      cobertura: ['', Validators.required],
      especialidad: ['', Validators.required],
      profesional: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      minutos: ['', Validators.required],
      razon: ['', Validators.required],
    });

    this.turnoForm.disable()

    if (this.esMatDialog && data) {
      this.fecha = new Date(data.fecha + 'T00:00:00');
      this.id_medico= data.id_medico    
      }
    if (this.rol === 'operador') {
  this.turnoForm.controls['paciente'].enable()
  this.turnoForm.get('paciente')?.valueChanges.subscribe((value) => {
    if (value) {
      this.turnoForm.get('cobertura')?.enable();
    } else {
      this.turnoForm.get('cobertura')?.disable();
    }
  });
} else {
  this.turnoForm.controls['cobertura'].enable()
}
    this.turnoForm.get('cobertura')?.valueChanges.subscribe((value) => {
      if (value) {
        this.turnoForm.get('especialidad')?.enable();
        if(this.rol === 'operador'){
          this.especialidadesService.obtenerEspecialidadesMedico(this.id_medico,this.token).subscribe((data:any)=>{
            this.turnoForm.controls['especialidad'].setValue(this.obtenerIdEsp2(data.payload[0].id_especialidad-1))
            this.turnoForm.controls['profesional'].setValue(this.id_medico)
            this.turnoForm.controls['fecha'].setValue(this.fecha)
            this.turnoForm.controls['especialidad'].disable()
            this.turnoForm.controls['profesional'].disable()
            this.turnoForm.controls['fecha'].disable() 
          })
        }

      } else {
        this.turnoForm.get('especialidad')?.disable();
      }
    });
    this.turnoForm.get('especialidad')?.valueChanges.subscribe((value) => {
      if (value) {
        this.turnoForm.get('profesional')?.enable();
        this.obtenerProfesionales(this.turnoForm.controls['especialidad'].value)
        if(this.profesionales.length > 0) {
          snackBar.open('No hay ningún profesional disponible para esta especialidad', 'Cerrar', {
          duration: 3000});
          this.turnoForm.get('profesional')?.disable();}
      } else {
        this.turnoForm.get('profesional')?.disable();
      }
    });
    this.turnoForm.get('profesional')?.valueChanges.subscribe((value) => {
      if (value) {
        this.turnoForm.get('fecha')?.enable();
        this.obtenerAgenda(this.turnoForm.controls['profesional'].value);        
      } else {
        this.turnoForm.get('fecha')?.disable();
      }
    });
    this.turnoForm.get('fecha')?.valueChanges.subscribe((value) => {
      if (value) {
        this.obtenerAgenda(this.turnoForm.controls['profesional'].value);
        this.obtenerTurnosMedico('')
        this.turnoForm.get('hora')?.enable();
      } else {
        this.turnoForm.get('hora')?.disable();
      }
    });
    this.turnoForm.get('hora')?.valueChanges.subscribe((value) => {
      if (value) {
        this.obtenerMinutos(this.turnoForm.controls['hora'].value)
        this.turnoForm.get('minutos')?.enable();
      } else {
        this.turnoForm.get('minutos')?.disable();
      }
    });
    this.turnoForm.get('minutos')?.valueChanges.subscribe((value) => {
      if (value !== '') {
        this.turnoForm.get('razon')?.enable();
      } else {
        this.turnoForm.get('razon')?.disable();
      }
    });
  this.obtenerEspecialidades()    
  this.obtenerCoberturas()   
  this.obtenerPacientes()
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  cancelar(){
    if(this.esMatDialog){
      this.dialogRef?.closeAll();
    } else {
      this.router.navigate(['/pantalla-principal']);
    }
  }

  guardarTurno(){
    if (this.turnoForm.invalid) {
      this.snackBar.open('Por favor, completa todos los campos obligatorios', 'Cerrar', {
        duration: 3000,
      });
      return;
    }
  let body;
  let nombreProf = this.profesionales.find((prof: { id_medico: any; }) => prof.id_medico === this.turnoForm.controls['profesional'].value)
  nombreProf = nombreProf.nombre + ' ' + nombreProf.apellido
    if(this.rol !== 'operador'){

      body = {
        nota: this.turnoForm.controls['razon'].value,
        id_agenda: this.agendaHoras[this.numArray].id,
        fecha: this.turnoForm.controls['fecha'].value,
        hora: this.turnoForm.controls['hora'].value+':'+this.turnoForm.controls['minutos'].value,
        id_paciente: this.id,
        id_cobertura: this.turnoForm.controls['cobertura'].value
      }
    } else  {
      body = {
        nota: this.turnoForm.controls['razon'].value,
        id_agenda: this.agendaHoras[this.numArray].id,
        fecha: this.fecha,
        hora: this.turnoForm.controls['hora'].value+':'+this.turnoForm.controls['minutos'].value,
        id_paciente: this.turnoForm.controls['paciente'].value,
        id_cobertura: this.turnoForm.controls['cobertura'].value
      }
    }
      
    this.turnosServie.asignarTurno(JSON.stringify(body), this.token).subscribe((data : any )=>{      
      if(data.codigo === 200){
        let fechaFormatted = this.turnoForm.controls['fecha'].value.getFullYear() + '-' + (this.turnoForm.controls['fecha'].value.getMonth() + 1) + '-' + this.turnoForm.controls['fecha'].value.getDate();
        this.openSnackBar('Turno confirmado con '+nombreProf
          +' el dia '+fechaFormatted+' a las '+this.turnoForm.controls['hora'].value+':'+this.turnoForm.controls['minutos'].value)
        if (this.esMatDialog){
        this.dialogRef?.closeAll();
        }else {
          this.router.navigate(['/pantalla-principal']);
        }
      } else if (data.codigo === -1){
        this.jwtExpirado()
      } else {
        this.openSnackBar(data.mensaje)
      }
    })
  }

  obtenerIdEsp2(id:any){
  return this.especialidad[id].id
  }

  obtenerProfesionales(id:any) {
    this.especialidadesService.obtenerMedicoPorEspecialidad(id,this.token).subscribe((data:any)=>{
      if (data.codigo === 200 && data.payload.length > 0){
        this.profesionales = data.payload;                
      } else if (data.codigo === -1){
        this.jwtExpirado();
      } else {
        this.openSnackBar(data.mensaje)
      }
    })
  }


  obtenerEspecialidades(){
    this.especialidadesService.obtenerEspecialidades(this.token).subscribe((data : any)=>{
      if (data.codigo === 200 && data.payload.length > 0){
        this.especialidad = data.payload;
      } else if (data.codigo === -1){
        this.jwtExpirado()
      }else {
        this.openSnackBar(data.mensaje)
      }
    })
  }

  obtenerPacientes(){
    this.usuariosService.obtenerUsuarios(this.token).subscribe((data:any)=>{
      this.pacientes = data.payload.filter((data:any) => data.rol ==='paciente')
    })    
  }

  obtenerCoberturas(){
    this.especialidadesService.obtenerCobertura(this.token).subscribe((data : any)=>{
      if (data.codigo === 200 && data.payload.length > 0){        
        this.cobertura = data.payload;
      } else if (data.codigo === -1){
        this.jwtExpirado()
      }else {
        this.openSnackBar(data.mensaje)
      }
    })
  }

  obtenerAgenda(id: string) {
    this.agendaService.obtenerAgenda(id, this.token).subscribe((data: any) => {      
        if (data.codigo === 200 && data.payload.length > 0) {
            this.agenda = data.payload.map((item: any) => new Date(item.fecha));
            let fecha = new Date(this.turnoForm.controls['fecha'].value).toISOString()
            this.agendaHoras = data.payload.filter((obj: { fecha: any; }) => obj.fecha.startsWith(fecha));
            if (this.agendaHoras) {
              this.horas = [];
              for (let i = 0; i < this.agendaHoras.length; i++) {
                let horasEntre = this.obtenerHorasEntre(this.agendaHoras[i].hora_entrada, this.agendaHoras[i].hora_salida);
                this.numArray = i
                this.horas = this.horas.concat(horasEntre).sort();
              }
            }
        } else if (data.codigo === -1){
          this.jwtExpirado();
        } else {
          this.openSnackBar(data.mensaje)
        }
    });
  }

  obtenerHorasEntre(entrada: string, salida: string): string[] {
    const horas: string[] = [];
  
    // Convertir las horas de entrada y salida a objetos Date
    let horaEntrada = new Date();
    let horaSalida = new Date();
  
    // Separar horas y minutos de las cadenas (formato HH:mm)
    const [horaEnt, minEnt] = entrada.split(':').map(Number);
    const [horaSal, minSal] = salida.split(':').map(Number);
  
    // Establecer horas y minutos en el objeto Date
    horaEntrada.setHours(horaEnt, minEnt, 0, 0);
    horaSalida.setHours(horaSal, minSal, 0, 0);
  
    // Mientras la hora de entrada sea menor o igual a la hora de salida
    while (horaEntrada < horaSalida) {
      // Formatear la hora (HH:mm) y agregar al array
      const horaFormateada = `${horaEntrada.getHours().toString().padStart(2, '0')}`;
      horas.push(horaFormateada);
  
      // Incrementar la hora de entrada en 1
      horaEntrada.setHours(horaEntrada.getHours() + 1);
    }
  
    return horas;
  }



dateFilter = (fecha: Date | null): boolean => {
  if (!fecha) {
    return false
  };
  let fechaStr = fecha.toDateString();
  return this.agenda.some(f => f.toDateString() === fechaStr);
};


obtenerTurnosMedico(fecha: any) {
  if (fecha === '') {
    fecha = this.turnoForm.controls['fecha'].value;
    fecha = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();
  }

  const body = {
    id_medico: this.turnoForm.controls['profesional'].value,
    fecha: fecha
  };

  this.turnosServie.obtenerTurnoMedico(JSON.stringify(body), this.token).subscribe((data: any) => {
    if (data.codigo === 200 && data.payload.length > 0) {
      this.turnos = data.payload;

      const horasContadas: { [key: string]: number } = this.turnos.reduce((acc:any, turno:any) => {
        const hora = turno.hora.substr(0, 2);
        acc[hora] = (acc[hora] || 0) + 1;
        return acc;
      }, {});
      this.horasSinConfirmar = Object.keys(horasContadas).filter(hora => horasContadas[hora] > 1);

      this.horas = this.horas.filter(hora => !this.horasSinConfirmar.includes(hora));
    } else if (data.codigo === -1) {
      this.jwtExpirado();
    } else {
      this.openSnackBar(data.mensaje);
    }
  });
}

obtenerMinutos(hora: any) {
  let turnosConfirmados: any[] = this.turnos.filter((obj: { hora: any; }) => obj.hora.startsWith(hora));

  let minutosDisponibles: string[] = ['00', '30'];

  turnosConfirmados.forEach((turno: any) => {
    const minutoTurno = turno.hora.substr(3, 2);
    const index = minutosDisponibles.indexOf(minutoTurno);
    if (index !== -1) {
      minutosDisponibles.splice(index, 1);
    }
  });
  if (minutosDisponibles.length === 0) {
    this.turnoForm.controls['hora'].setValue('');
    this.openSnackBar('La hora seleccionada ya está ocupada por ambos turnos.');
  } else {
    this.minutosConfirmados = minutosDisponibles;
  }
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

