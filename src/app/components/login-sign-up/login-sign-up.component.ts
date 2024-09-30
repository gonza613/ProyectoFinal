import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    if (this.loginForm.valid) {
      this.dialogRef.close(true);
    }
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
