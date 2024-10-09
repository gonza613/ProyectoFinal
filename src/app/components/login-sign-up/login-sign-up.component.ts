import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-sign-up',
  templateUrl: './login-sign-up.component.html',
  styleUrls: ['./login-sign-up.component.css']
})
export class LoginSignUpComponent {

  loginForm: FormGroup;
  signUpForm: FormGroup;
  isLoginMode : boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginSignUpComponent>,
    private loginService: LoginService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { isLoginMode: boolean } // trae la info del isLoginMode desde el homeComponent
  ) {
    this.isLoginMode = data.isLoginMode;

    this.loginForm = this.fb.group({
      dni: ['', Validators.required],
      contrasenia: ['', Validators.required],
    });

    this.signUpForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      contrasenia: ['', Validators.required],
      confirmarContrasenia: ['', Validators.required]
    });
  }

  login() {
    let body = {
        usuario: this.loginForm.controls['dni'].value,
        password: this.loginForm.controls['contrasenia'].value
    };

    this.loginService.login(JSON.stringify(body)).subscribe((data: any) => {
        if (data.codigo === 200) {
            console.log('Login exitoso:', data);
            
            localStorage.setItem('nombreUsuario', data.payload.nombre + ' ' + data.payload.apellido); 
            localStorage.setItem('rol', data.payload.rol); 
            localStorage.setItem('id', data.payload.id); 

            this.router.navigate(['/pantalla-principal']);
            this.dialogRef.close(true);
        } else {
            console.error(data.mensaje); 
        }
    }, (error) => {
        console.error('Error en el login:', error);
    });
  }

  signUp() {
    if (this.signUpForm.valid && this.contraseniasCoinciden()) {
      this.dialogRef.close(true);
    }
  }

  contraseniasCoinciden(): boolean {
    return this.signUpForm.get('contrasenia')?.value === this.signUpForm.get('confirmarContrasenia')?.value;
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
