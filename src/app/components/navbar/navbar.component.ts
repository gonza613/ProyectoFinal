import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userName: string = 'Nombre del Usuario'; 
  userType: string = 'Tipo de Usuario'; 

  constructor(private router: Router){
  }

  logout() {
    this.router.navigate(['/home']);

  }
}
