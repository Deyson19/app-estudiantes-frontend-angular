import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Estudiante } from '../../interfaces/estudiante.interface';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EstudiantesService } from '../../services/estudiantes.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-estudiante-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    MatIconModule,
    MatDividerModule,
    ConfirmDialogComponent,
    RouterModule,
  ],
  templateUrl: './estudiante-card.component.html',
  styleUrl: './estudiante-card.component.css',
})
export class EstudianteCardComponent {
  estudiante = input<Estudiante>();

  //*Inyectar servicios

  private _dialog = inject(MatDialog);

  private _toast = inject(ToastrService);

  private _estudiantesService = inject(EstudiantesService);

  //*Propiedad para comprobar cuando se elimina
  //*Output as signal
  wasRemove = output<boolean>();

  //*Metodo para eliminar registro
  onDelete() {
    if (!this.estudiante()?.id) {
      this._toast.error('Error al tratar de eliminar', 'Error!');
    } else {
      //*llamar el componente con el dialogo de confirmacion
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        data: true,
        enterAnimationDuration: '650ms',
        exitAnimationDuration: '450ms',
      });
      dialogRef
        .afterClosed()
        .pipe(
          //*proceder a eliminar si se confirma
          filter((x) => x),
          switchMap(() =>
            this._estudiantesService.deleteEstudiante(this.estudiante()!.id)
          )
        )
        .subscribe(
          (resp) => {
            if (resp.isSuccess) {
              this._toast.success(resp.message, 'Realizado');
              this.wasRemove.emit(true); //*emitir valor
            }
          },
          (isError: HttpErrorResponse) => {
            if (isError) {
              this._toast.error(isError.error.message, isError.statusText);
            }
          }
        );
    }
  }
}
