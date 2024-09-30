import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginSignUpComponent } from './components/login-sign-up/login-sign-up.component';
import { PantallaPrincipalComponent } from './components/pantalla-principal/pantalla-principal.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'login-signUp', component: LoginSignUpComponent},
  { path: 'pantalla-principal', component: PantallaPrincipalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
