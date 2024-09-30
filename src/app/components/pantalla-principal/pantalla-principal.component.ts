import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pantalla-principal',
  templateUrl: './pantalla-principal.component.html',
  styleUrls: ['./pantalla-principal.component.css']
})
export class PantallaPrincipalComponent {

  userName: string = 'Nombre del Usuario'; 
  userType: string = 'Tipo de Usuario'; 

  constructor(private router: Router){}

  navigate(path: string) {
    this.router.navigate([path]);
  }
  logout() {
    this.router.navigate(['/home']);

  }
}
