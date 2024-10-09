import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginSignUpComponent } from './components/login-sign-up/login-sign-up.component';
import { PantallaPrincipalComponent } from './components/pantalla-principal/pantalla-principal.component';
import { NuevoTurnoComponent } from './components/nuevo-turno/nuevo-turno.component';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatNativeDateModule } from '@angular/material/core';
import { CrearPacienteComponent } from './components/crear-paciente/crear-paciente.component';
import { HttpClientModule } from '@angular/common/http';
import { MisDatosComponent } from './components/mis-datos/mis-datos.component';
import {MatListModule} from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginSignUpComponent,
    PantallaPrincipalComponent,
    NavbarComponent,
    FooterComponent,
    NuevoTurnoComponent,
    CrearPacienteComponent,
    MisDatosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    FontAwesomeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    MatListModule,
  ],
  providers: [MatSnackBar],
  bootstrap: [AppComponent]
})
export class AppModule { }
