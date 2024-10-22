import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AgendaService } from 'src/app/services/agenda.service';

@Component({
  selector: 'app-alta-horarios',
  templateUrl: './alta-horarios.component.html',
  styleUrls: ['./alta-horarios.component.css']
})
export class AltaHorariosComponent {
  forma: FormGroup;
  fecha: string;
  constructor(private fb: FormBuilder, 
    private router: Router,
    private snackBar: MatSnackBar,
    private agendaService: AgendaService,
    @Inject(MAT_DIALOG_DATA) public data: { fecha: string }){
    this.forma = this.fb.group({
      hora_desde: ['', Validators.required],
      hora_hasta: ['', Validators.required]
    });
    this.fecha = data.fecha;
    console.log(this.fecha)
  }
}
