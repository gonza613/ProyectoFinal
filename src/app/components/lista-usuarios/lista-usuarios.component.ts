import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';


export interface PeriodicElement {
  fecha: string;
  hora: string;
  especialista: string;
  especialidad: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {fecha: 'Lunes 1 de octubre', hora: '12:00', especialista: 'Pedro', especialidad: 'H'},
  {fecha: 'Martes 2 de octubre', hora: '13:00', especialista: 'Goiak', especialidad: 'He'},
  {fecha: 'Miercoles 3 de octubre', hora: '14:00', especialista: 'Medico', especialidad: 'Li'},
  {fecha: 'Jueves 4 de octubre', hora: '15:00', especialista: 'Doctor', especialidad: 'Be'},
  {fecha: 'Viernes 5 de octubre', hora: '16:00', especialista: 'doc', especialidad: 'B'},
];

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})

export class ListaUsuariosComponent implements OnInit{
  displayedColumns: string[] = ['nombre', 'apellido', 'tipousuario'];
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
      console.log(this.listaUsuarios);
      
      } else {
        console.error(data.mensaje);
        
      }
    })
  }

}

