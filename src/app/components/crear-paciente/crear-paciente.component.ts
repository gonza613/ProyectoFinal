import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-crear-paciente',
  templateUrl: './crear-paciente.component.html',
  styleUrls: ['./crear-paciente.component.css']
})
export class CrearPacienteComponent {
  pacienteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearPacienteComponent>,
    private login: LoginService
  ) {
    this.pacienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      usuario: ['', Validators.required],
      dni: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      contrasenia: ['', Validators.required],
      confirmarContrasenia: ['', Validators.required],
      fechanac: ['', Validators.required],
    });
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
        rol: 'Paciente',
        email: this.pacienteForm.controls['mail'].value,
        telefono:this.pacienteForm.controls['telefono'].value,
        // usuario: this.pacienteForm.controls['usuario'].value
      }

      this.login.register(JSON.stringify(body)).subscribe((data : any) =>{
        console.log('Registro exitoso');
        this.dialogRef.close(this.pacienteForm.value);
      })
    }
  }
}
