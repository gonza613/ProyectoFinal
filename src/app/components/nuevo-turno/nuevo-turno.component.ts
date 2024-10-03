import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css']
})
export class NuevoTurnoComponent {
  turnoForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router){
    this.turnoForm = this.fb.group({
      cobertura: ['', Validators.required],
      especialidad: ['', Validators.required],
      profesional: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      campoTexto: ['', Validators.required],
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  cancelar(){
    this.router.navigate(['/pantalla-principal']);
  }
  
}
