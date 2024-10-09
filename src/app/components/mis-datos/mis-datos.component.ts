import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.css']
})
export class MisDatosComponent implements OnInit{

  id = localStorage.getItem('id');
  datos : any;
  usuarioForm: FormGroup;
  editing: boolean = false;
  private _snackBar = inject(MatSnackBar);

  constructor(private usuarioService: UsuariosService, private fb: FormBuilder){
    
    
    this.usuarioForm = this.fb.group({
      nombre: [''],
      apellido: [''],
      dni: [''],
      mail: [''],
      telefono: [''],
      contrasenia: [''],
      correo: [''],
    });
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(){
    this.usuarioService.obtenerUsuario(this.id).subscribe((data:any)=>{
      console.log(data);
      this.datos = data.payload[0];
      console.log(this.datos)
      this.usuarioForm.controls['nombre'].setValue(this.datos.nombre);
      this.usuarioForm.controls['apellido'].setValue(this.datos.apellido);
      this.usuarioForm.controls['dni'].setValue(this.datos.dni);
      this.usuarioForm.controls['mail'].setValue(this.datos.mail);
      this.usuarioForm.controls['telefono'].setValue(this.datos.telefono);
      this.usuarioForm.controls['contrasenia'].setValue(this.datos.password);
      this.usuarioForm.controls['correo'].setValue(this.datos.email);
      this.usuarioForm.disable();
    })
  }

  editar(){
    this.editing = true
    this.usuarioForm.controls['correo'].enable()
    this.usuarioForm.controls['contrasenia'].enable()
    this.usuarioForm.controls['telefono'].enable()
  }

  cancelar(){
    this.editing = false
    this.usuarioForm.controls['correo'].disable()
    this.usuarioForm.controls['contrasenia'].disable()
    this.usuarioForm.controls['telefono'].disable()
  }


  guardar(){

    let body= {
      dni: this.datos.dni,
      apellido: this.datos.apellido,
      nombre: this.datos.nombre,
      fecha_nacimiento: this.datos.fecha_nacimiento,
      password: this.usuarioForm.controls['contrasenia'].value,
      rol: this.datos.rol,
      email: this.usuarioForm.controls['correo'].value,
      telefono: this.usuarioForm.controls['telefono'].value
    }
    this.usuarioService.actualizarUsuario(this.id,body).subscribe((data: any) =>{
      if(data.codigo===200){
      this.editing=false;
      this.openSnackBar('Cambios guardados con exito', 'Aceptar');
      this.usuarioForm.controls['correo'].disable()
      this.usuarioForm.controls['contrasenia'].disable()
      this.usuarioForm.controls['telefono'].disable()
    } else{
      this.openSnackBar('No se pudo guardar los cambios correctamente', 'Aceptar');
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
