import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginSignUpComponent } from '../login-sign-up/login-sign-up.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})  
export class HomeComponent {

  constructor(private router: Router, private dialog: MatDialog
  ){
  }

  openLoginDialog(isLoginMode: boolean) {
    const dialogRef = this.dialog.open(LoginSignUpComponent, {
      width: '450px',
      data: { isLoginMode: isLoginMode }
    });
    console.log(isLoginMode);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/pantalla-principal']);
      } else {
        console.log('Acción cancelada');
      }
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
