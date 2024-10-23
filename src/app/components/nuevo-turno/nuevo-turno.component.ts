import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { AgendaService } from 'src/app/services/agenda.service';

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css']
})
export class NuevoTurnoComponent {
  turnoForm: FormGroup;
  token: any = localStorage.getItem('jwt');
  id: any = localStorage.getItem('id');
  profesionales: any;
  especialidad: any;
  cobertura: any;
  agenda: any[] = [];
  availableDates: Date[] = [];

  constructor(private fb: FormBuilder, 
    private router: Router,
    private snackBar: MatSnackBar,
    private turnosServie: TurnosService,
    private usuariosService: UsuariosService,
    private especialidadesService: EspecialidadService,
    private agendaService: AgendaService
  ){
    this.turnoForm = this.fb.group({
      cobertura: ['', Validators.required],
      especialidad: ['', Validators.required],
      profesional: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      razon: ['', Validators.required],
    });

    this.turnoForm.disable()
    this.turnoForm.controls['cobertura'].enable()

    this.turnoForm.get('cobertura')?.valueChanges.subscribe((value) => {
      if (value) {
        this.turnoForm.get('especialidad')?.enable();
      } else {
        this.turnoForm.get('especialidad')?.disable();
      }
    });
    this.turnoForm.get('especialidad')?.valueChanges.subscribe((value) => {
      if (value) {
        this.turnoForm.get('profesional')?.enable();
        this.obtenerProfesionales(this.turnoForm.controls['especialidad'].value)
      } else {
        this.turnoForm.get('profesional')?.disable();
      }
    });
    this.turnoForm.get('profesional')?.valueChanges.subscribe((value) => {
      if (value) {
        this.turnoForm.get('fecha')?.enable();
      } else {
        this.turnoForm.get('fecha')?.disable();
      }
    });
    this.turnoForm.get('fecha')?.valueChanges.subscribe((value) => {
      if (value) {
        this.turnoForm.get('hora')?.enable();
        this.obtenerAgenda(this.turnoForm.controls['especialidad'].value);
      } else {
        this.turnoForm.get('hora')?.disable();
      }
    });
    this.turnoForm.get('hora')?.valueChanges.subscribe((value) => {
      if (value) {
        this.turnoForm.get('razon')?.enable();
      } else {
        this.turnoForm.get('razon')?.disable();
      }
    });

    this.obtenerEspecialidades()    
    this.obtenerCoberturas()   
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  cancelar(){
    this.router.navigate(['/pantalla-principal']);
  }

  guardarTurno(){
    let body = {
      nota: this.turnoForm.controls['razon'].value,
      id_agenda: 1, //harcodeado porque no hay formcontrol para eso
      fecha: this.turnoForm.controls['fecha'].value,
      hora: this.turnoForm.controls['hora'].value,
      id_paciente: this.id,
      id_cobertura: this.turnoForm.controls['cobertura'].value
      // id_especialidad: this.turnoForm.controls['especialidad'].value
    }

    this.turnosServie.asignarTurno(JSON.stringify(body), this.token).subscribe((data : any )=>{      
      if(data.codigo === 200){
        let fechaFormatted = this.turnoForm.controls['fecha'].value.getFullYear() + '-' + (this.turnoForm.controls['fecha'].value.getMonth() + 1) + '-' + this.turnoForm.controls['fecha'].value.getDate();
        this.openSnackBar('Turno confirmado con '+this.turnoForm.controls['profesional'].value
          +' el dia '+fechaFormatted+' a las '+this.turnoForm.controls['hora'].value)
        this.router.navigate(['/pantalla-principal']);
      } else if (data.codigo === -1){
        this.jwtExpirado()
      } else {
        this.openSnackBar(data.mensaje)
      }
    })

  }

  obtenerProfesionales(id:any) {
    this.especialidadesService.obtenerMedicoPorEspecialidad(id,this.token).subscribe((data:any)=>{
      if (data.codigo === 200){
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
      if (data.codigo === 200){
        this.especialidad = data.payload;
      } else if (data.codigo === -1){
        this.jwtExpirado()
      }else {
        this.openSnackBar(data.mensaje)
      }
    })
  }

  obtenerCoberturas(){
    this.especialidadesService.obtenerCobertura(this.token).subscribe((data : any)=>{
      if (data.codigo === 200){        
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
      console.log(data);
      
        if (data.codigo === 200) {
            // Aquí asumimos que las fechas están en el campo 'fecha'
            this.agenda = data.payload.map((item: any) => new Date(item.fecha));
            console.log('Fechas disponibles:', this.agenda);
        } else {
            console.error(data.mensaje);
        }
    }, error => {
        console.error('Error al obtener agenda:', error);
    });
  }
  disponibilidadDias = (d: Date | null): boolean => {
    if (!d) return false;
    return this.availableDates.some(date => date.getTime() === d.getTime());
  };


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
