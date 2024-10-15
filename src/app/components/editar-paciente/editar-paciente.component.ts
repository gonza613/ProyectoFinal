import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-editar-paciente',
  templateUrl: './editar-paciente.component.html',
  styleUrls: ['./editar-paciente.component.css']
})
export class EditarPacienteComponent implements OnInit {

  editarUsuarioForm: FormGroup;
  datos : any;
  private _snackBar = inject(MatSnackBar);


  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<EditarPacienteComponent>, private usuarioService: UsuariosService, @Inject(MAT_DIALOG_DATA) public data: { id: any }){
    this.editarUsuarioForm = this.fb.group({
      nombre: [''],
      apellido: [''],
      usuario: [''],
      dni: [''],
      email: [''],
      telefono: [''],
      fechanac: [''],
      tipo_usuario: [''],
      contrasenia: ['']
    });
  }
  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(){
    this.usuarioService.obtenerUsuario(this.data.id).subscribe((data:any)=>{
      console.log(data);
      if(data.codigo === 200){

        this.datos = data.payload[0];
        console.log(this.datos)
        this.editarUsuarioForm.controls['nombre'].setValue(this.datos.nombre);
        this.editarUsuarioForm.controls['apellido'].setValue(this.datos.apellido);
        this.editarUsuarioForm.controls['usuario'].setValue(this.datos.usuario);
        this.editarUsuarioForm.controls['dni'].setValue(this.datos.dni);
        this.editarUsuarioForm.controls['email'].setValue(this.datos.email);
        this.editarUsuarioForm.controls['telefono'].setValue(this.datos.telefono);
        this.editarUsuarioForm.controls['fechanac'].setValue(this.datos.fecha_nacimiento);
        this.editarUsuarioForm.controls['tipo_usuario'].setValue(this.datos.rol);
        this.editarUsuarioForm.controls['contrasenia'].setValue(this.datos.password);
        this.editarUsuarioForm.enable();
      } else {
        console.warn(data.mensaje);
      }
    })
  }


  guardar(){
      let body= {
        nombre: this.editarUsuarioForm.controls['nombre'].value,
        apellido: this.editarUsuarioForm.controls['apellido'].value,
        usuario: this.editarUsuarioForm.controls['usuario'].value,
        dni: this.editarUsuarioForm.controls['dni'].value,
        email: this.editarUsuarioForm.controls['email'].value,
        telefono: this.editarUsuarioForm.controls['telefono'].value,
        fecha_nacimiento: this.editarUsuarioForm.controls['fechanac'].value,
        rol: this.editarUsuarioForm.controls['tipo_usuario'].value,
        password: this.editarUsuarioForm.controls['contrasenia'].value,
      }
      this.usuarioService.actualizarUsuario(this.data.id,body).subscribe((data: any) =>{
        console.log(data);
        if(data.codigo===200){
        this.openSnackBar('Cambios guardados con exito', 'Aceptar');
        this.dialogRef.close(true);
      } else{
        this.openSnackBar('No se pudo guardar los cambios correctamente', 'Aceptar');
        }
      })
    }
  
    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action);
    }
  
  onCancel(){
    this.dialogRef.close(true);
  }
}
