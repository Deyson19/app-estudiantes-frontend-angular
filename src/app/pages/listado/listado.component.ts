import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { EstudianteCardComponent } from '../../components/estudiante-card/estudiante-card.component';
import { RouterModule } from '@angular/router';
import { EstudiantesService } from '../../services/estudiantes.service';
import { Estudiante } from '../../interfaces';

@Component({
  standalone: true,
  imports: [
    SpinnerComponent,
    MatButtonModule,
    EstudianteCardComponent,
    RouterModule,
  ],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css',
})
export class ListadoComponent implements OnInit {
  private _estudiantesService = inject(EstudiantesService);
  public estudiantes: WritableSignal<Estudiante[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(true);
  mensaje = 'Cargando listado de estudiantes';
  //*Recibir output del hijo
  wasDelete(x: boolean) {
    if (x) {
      this.isLoading.set(true);
      setTimeout(() => {
        this.getAll();
      }, 1500);
    }
  }

  ngOnInit() {
    this.getAll();
  }
  getAll() {
    this._estudiantesService.getEstudiantes().subscribe((x) => {
      if (x.isSuccess) {
        this.estudiantes.set(x.result);
        setTimeout(() => {
          this.isLoading.set(false);
        }, 1400);
      }
    });
  }
}
