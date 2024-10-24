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
  agendaHoras: any[] = [];
  availableDates: Date[] = [];
  hora_entrada:any;
  hora_salida:any;
  horas:any[] = [];
  numArray: number = 0;
  turnos:any;
  horasSinConfirmar:any [] =[];

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
      minutos: ['', Validators.required],
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
      id_agenda: this.agendaHoras[this.numArray].id,
      fecha: this.turnoForm.controls['fecha'].value,
      hora: this.turnoForm.controls['hora'].value+':'+this.turnoForm.controls['minutos'].value,
      id_paciente: this.id,
      id_cobertura: this.turnoForm.controls['cobertura'].value
    }

    this.turnosServie.asignarTurno(JSON.stringify(body), this.token).subscribe((data : any )=>{      
      if(data.codigo === 200){
        let fechaFormatted = this.turnoForm.controls['fecha'].value.getFullYear() + '-' + (this.turnoForm.controls['fecha'].value.getMonth() + 1) + '-' + this.turnoForm.controls['fecha'].value.getDate();
        this.openSnackBar('Turno confirmado con '+this.turnoForm.controls['profesional'].value
          +' el dia '+fechaFormatted+' a las '+this.turnoForm.controls['hora'].value+':'+this.turnoForm.controls['minutos'].value)
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
        if (data.codigo === 200) {
          console.log(data);
          
            // Aquí asumimos que las fechas están en el campo 'fecha'
            this.agenda = data.payload.map((item: any) => new Date(item.fecha));
            
            let fecha = new Date(this.turnoForm.controls['fecha'].value).toISOString()
            
            this.agendaHoras = data.payload.filter((obj: { fecha: any; }) => obj.fecha.startsWith(fecha));
            console.log(this.agendaHoras);
            
            if (this.agendaHoras) {
              this.horas = [];  // Inicializa el array de horas
            
              // Itera sobre los objetos en agendaHoras y concatena las horas
              for (let i = 0; i < this.agendaHoras.length; i++) {
                const horasEntre = this.obtenerHorasEntre(this.agendaHoras[i].hora_entrada, this.agendaHoras[i].hora_salida);
                
                this.numArray = i

                // Concatenar las horas al array
                this.horas = this.horas.concat(horasEntre).sort();
              }
            
              console.log(this.horas);  // Esto mostrará todas las horas concatenadas
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
    // horaEntrada.setHours(horaEntrada.getHours() - 1);
  
    return horas;
  }


  // Función que filtra las fechas permitidas
dateFilter = (fecha: Date | null): boolean => {
  // Si la fecha es null, no la permitimos
  if (!fecha) return false;

  // Convertimos el día actual a un string sin la hora para comparar solo la fecha
  const fechaStr = fecha.toDateString();

  // Comprobamos si la fecha está en el array de fechas válidas
  return this.agenda.some(f => f.toDateString() === fechaStr);
};


obtenerTurnosMedico(fecha: any){
  if (fecha == ''){
    fecha=this.turnoForm.controls['fecha'].value
    fecha=fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();
  }    

  let body = {
    id_medico : this.turnoForm.controls['profesional'].value,
    fecha : fecha
  }
  this.turnosServie.obtenerTurnoMedico(JSON.stringify(body), this.token).subscribe((data: any) => {
    if(data.codigo === 200){
      this.turnos = data.payload;
      
      let turnosConfirmados: any[] = [];
      let minutosConfirmados: any[] = [];
      let horaConfirmada: any[] = [];
      turnosConfirmados = data.payload.filter((obj: { fecha: any; }) => obj.fecha.startsWith(fecha));
      console.log(turnosConfirmados);

      for (let i = 0; i < turnosConfirmados.length; i++) {
       horaConfirmada = data.payload.map((obj: { hora: any; }) => obj.hora.substr(0,2));
      }
      
      minutosConfirmados =  data.payload.map((obj: { hora: any; }) => obj.hora.substr(3,2));
      console.log(minutosConfirmados);
      
      if (minutosConfirmados[0] == '30') {
        
      }

      // this.horasSinConfirmar = horaConfirmada.filter((valor, indice, self) => 
      //   self.indexOf(valor) === self.lastIndexOf(valor)
      // );
      // console.log(this.horasSinConfirmar);

      for (let i = 0; i < turnosConfirmados.length; i++) {
        horaConfirmada = data.payload.map((obj: { hora: any; }) => obj.hora.substr(0, 2));
      }
      
      // Contar las ocurrencias de cada hora
      const contadorHoras: { [key: string]: number } = {};
      horaConfirmada.forEach(hora => {
        contadorHoras[hora] = (contadorHoras[hora] || 0) + 1;
      });
      
      // Filtrar solo las horas que se repiten
      this.horasSinConfirmar = Object.keys(contadorHoras).filter(hora => contadorHoras[hora] > 1);
      console.log(this.horasSinConfirmar);

      this.horas = this.horas.filter(hora => !this.horasSinConfirmar.includes(hora));

      console.log(this.horas); // Este será el nuevo array con las horas filtradas
      
     
  }else if(data.codigo === -1){
    this.jwtExpirado();
  } else {
      this.openSnackBar(data.mensaje);
    }
  })
}
minutosConfirmados:any [] = ['00','30']
obtenerMinutos(hora:any){
let turnosConfirmados: any[]= this.turnos.filter((obj: { hora: any; }) => obj.hora.startsWith(hora));
if(turnosConfirmados.length >0){
  turnosConfirmados = turnosConfirmados[0].hora.substr(3,2)
} else {
  turnosConfirmados = []
}
//  this.minutosConfirmados =  turnosConfirmados.map((obj: { hora: any; }) => obj.hora.substr(3,2));
 console.log(this.minutosConfirmados);
 console.log(turnosConfirmados);
//  this.minutosConfirmados = this.minutosConfirmados.splice(turnosConfirmados)
 let index;
 while ((index = this.minutosConfirmados.indexOf(turnosConfirmados)) !== -1) {
     this.minutosConfirmados.splice(index, 1);
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
