import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})

export class ListaUsuariosComponent implements OnInit{
  displayedColumns: string[] = ['nombre', 'apellido', 'tipousuario','acciones'];
  listaUsuarios:any;
  dataSource: any;

  constructor(private usuariosService: UsuariosService){

  }

  ngOnInit(){
    this.obtenerUsuario();
  }

  obtenerUsuario(){
    this.usuariosService.obtenerUsuarios().subscribe((data : any) =>{
      console.warn(data);
      
      if (data.codigo === 200){
      this.listaUsuarios = data.payload
      this.dataSource=this.listaUsuarios
      } else {
        console.error(data.mensaje);
      }
    })
  }

  editarUsuario(){
    
  }

}

