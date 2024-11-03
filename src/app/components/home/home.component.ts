import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginSignUpComponent } from '../login-sign-up/login-sign-up.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})  
export class HomeComponent {

  constructor(private router: Router, private dialog: MatDialog
  ){
    localStorage.clear()
  }

  openLoginDialog(isLoginMode: boolean) {
    const dialogRef = this.dialog.open(LoginSignUpComponent, {
      width: '450px',
      data: { isLoginMode: isLoginMode }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/pantalla-principal']);
      }
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
