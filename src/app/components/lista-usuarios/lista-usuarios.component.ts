import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { MisDatosComponent } from '../mis-datos/mis-datos.component';
import { EditarPacienteComponent } from '../editar-paciente/editar-paciente.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})

export class ListaUsuariosComponent implements OnInit{
  displayedColumns: string[] = ['nombre', 'apellido', 'tipousuario','acciones'];
  listaUsuarios:any;
  dataSource: any;
  token: any = localStorage.getItem('jwt')

  constructor(private usuariosService: UsuariosService, 
    private dialog: MatDialog, 
    private router:Router,
    private snackBar: MatSnackBar
  ){

  }

  ngOnInit(){
    this.obtenerUsuario();
  }

  obtenerUsuario(){
    this.usuariosService.obtenerUsuarios(this.token).subscribe((data : any) =>{      
      if (data.codigo === 200){
      this.listaUsuarios = data.payload
      this.dataSource=this.listaUsuarios
      }else if(data.codigo === -1){
        this.jwtExpirado();
      } 
      else {
        this.openSnackBar(data.mensaje);
      }
    })
  }

  editarUsuario(id: any){
    const dialogRef = this.dialog.open(EditarPacienteComponent, {
      width: '450px',
      data: { id: id }
    });
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

