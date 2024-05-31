import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { EstudiantesService } from '../../services/estudiantes.service';
import { ToastrService } from 'ngx-toastr';
import { Estudiante } from '../../interfaces';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [
    SpinnerComponent,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css',
})
export class DetalleComponent implements OnInit {
  private _activeRouter = inject(ActivatedRoute);
  private _estudiantesService = inject(EstudiantesService);
  private _router = inject(Router);
  private _toast = inject(ToastrService);
  mensaje = 'Buscando el estudiante';

  //*Propiedades
  isLoading = true;
  estudiante?: Estudiante;
  ngOnInit() {
    const id = this._activeRouter.snapshot.paramMap.get('id');
    if (!id) {
      this._router.navigate(['/home']);
    } else {
      this._estudiantesService.getEstudiante(id).subscribe(
        (x) => {
          if (x.isSuccess) {
            this.estudiante = x.result;
            setTimeout(() => {
              this.isLoading = false;
            }, 1400);
          } else {
            this._toast.error(x.message);
            this._router.navigate(['/home']);
          }
        },
        (error: HttpErrorResponse) => {
          this._toast.error(error.error.message);
          this._router.navigate(['/home']);
        }
      );
    }
  }
}
