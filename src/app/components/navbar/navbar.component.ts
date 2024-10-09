import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  usuario = localStorage.getItem('nombreUsuario');
  rol = localStorage.getItem('rol');

  constructor(private router: Router){
  }

  logout() {
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('rol');
    
    this.router.navigate(['/home']);
  }

  home() {
    this.router.navigate(['/pantalla-principal']);
  }
}
