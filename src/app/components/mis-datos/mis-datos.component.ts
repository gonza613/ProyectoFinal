import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private usuarioService: UsuariosService, private fb: FormBuilder){
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      contrasenia: ['', Validators.required],
      confirmarContrasenia: ['', Validators.required]
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
      this.usuarioForm.controls['contrasenia'].setValue(this.datos.contrasenia);
      this.usuarioForm.disable();
    })
  }

}
