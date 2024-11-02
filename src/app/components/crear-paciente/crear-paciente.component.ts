import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-crear-paciente',
  templateUrl: './crear-paciente.component.html',
  styleUrls: ['./crear-paciente.component.css']
})
export class CrearPacienteComponent {

  token: any = localStorage.getItem('jwt'); 
  pacienteForm: FormGroup;
  rol = localStorage.getItem('rol');
  titulo: string ='';
  especialidades: any = [];
  mostrarEspecialidades: boolean = false;
  hoy: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearPacienteComponent>,
    private login: LoginService,
    private router: Router,
    private snackBar:MatSnackBar,
    private especialidadesService : EspecialidadService
  ) {
    this.pacienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      usuario: ['', Validators.required],
      dni: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      contrasenia: ['', Validators.required],
      tipo_usuario: [''],
      confirmarContrasenia: ['', Validators.required],
      fechanac: ['', Validators.required],
      especialidad: ['']
    });

    if(this.rol === 'administrador'){
      this.titulo = 'Usuario'
    } else {
      this.titulo = 'Paciente'
    }


    if(this.rol === 'administrador'){
    this.pacienteForm.controls['especialidad'].setValidators(Validators.required);
    this.pacienteForm.get('tipo_usuario')?.valueChanges.subscribe(value => {
      if ( value === 'medico') {
        this.pacienteForm.controls['especialidad'].setValidators(Validators.required);
        this.mostrarEspecialidades = true;
        this.obtenerEspecialidades();
      } else {
        this.mostrarEspecialidades = false;
        this.pacienteForm.controls['especialidad'].clearValidators()
        this.pacienteForm.get('especialidad')?.reset();
      }
    });
  }
}

  obtenerEspecialidades(){
    this.especialidadesService.obtenerEspecialidades(this.token).subscribe((data : any)=>{
      if (data.codigo === 200){
        this.especialidades = data.payload;
      } else if (data.codigo === -1){
        this.jwtExpirado()
      }else {
        this.openSnackBar(data.mensaje)
      }
    })
  }

  contraseniasCoinciden(): boolean {
    return this.pacienteForm.get('contrasenia')?.value === this.pacienteForm.get('confirmarContrasenia')?.value;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.pacienteForm.valid) {
      
      let body = {
        dni : this.pacienteForm.controls['dni'].value,
        apellido: this.pacienteForm.controls['apellido'].value,
        nombre: this.pacienteForm.controls['nombre'].value,
        fecha_nacimiento: this.pacienteForm.controls['fechanac'].value,
        password: this.pacienteForm.controls['contrasenia'].value,
        email: this.pacienteForm.controls['mail'].value,
        telefono:this.pacienteForm.controls['telefono'].value,
        rol:''
      }

      if (this.rol == 'operador') {
        body.rol = 'paciente';
      } else {
        body.rol = this.pacienteForm.controls['tipo_usuario'].value;
      }

      this.login.register(JSON.stringify(body)).subscribe((data : any) =>{
        if (data.codigo === 200){
          if (body.rol === 'medico'){
            const medicoEspecialidadBody = {
              id_medico: data.payload[0].id_usuario,
              id_especialidad: this.pacienteForm.controls['especialidad'].value
            };
            this.especialidadesService.crearMedicoEspecialidad(medicoEspecialidadBody,this.token).subscribe((data:any) => {
              if (data.codigo === 200) {
                this.dialogRef.close(this.pacienteForm.value);
                this.openSnackBar('Registro exitoso');
              } else {
                this.openSnackBar('Error al guardar la especialidad');
              }
            });
          } else {
            this.dialogRef.close(this.pacienteForm.value);
            this.openSnackBar('Registro exitoso');
          }
        } else if (data.codigo === -1) {
          this.jwtExpirado();
        } else {
          this.openSnackBar(data.mensaje);
        }
      });
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
