import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { MisDatosComponent } from '../mis-datos/mis-datos.component';
import { EditarPacienteComponent } from '../editar-paciente/editar-paciente.component';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})

export class ListaUsuariosComponent implements OnInit{
  displayedColumns: string[] = ['nombre', 'apellido', 'tipousuario','acciones'];
  listaUsuarios:any;
  dataSource: any;
  token: any = localStorage.getItem('token')

  constructor(private usuariosService: UsuariosService, private dialog: MatDialog){

  }

  ngOnInit(){
    this.obtenerUsuario();
  }

  obtenerUsuario(){
    this.usuariosService.obtenerUsuarios().subscribe((data : any) =>{      
      if (data.codigo === 200){
      this.listaUsuarios = data.payload
      this.dataSource=this.listaUsuarios
      } else {
        console.error(data.mensaje);
      }
    })
  }

  editarUsuario(id: any){
    const dialogRef = this.dialog.open(EditarPacienteComponent, {
      width: '450px',
      data: { id: id }
    });
  }

}

