import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { EstudiantesService } from '../../services/estudiantes.service';
import { ToastrService } from 'ngx-toastr';
import { CrearActualizar, Estudiante } from '../../interfaces';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    RouterModule,
    MatButtonModule,
    SpinnerComponent,
  ],
  templateUrl: './upsert.component.html',
  styleUrl: './upsert.component.css',
})
export class UpsertComponent implements OnInit {
  private _activeRoute = inject(ActivatedRoute);
  private _route = inject(Router);
  private _estudiantesService = inject(EstudiantesService);
  private _toast = inject(ToastrService);
  private _fb = inject(FormBuilder);

  //*Variables
  private crearEstudiante?: CrearActualizar;
  private estudiante?: Estudiante;
  titulo = 'Crear nuevo estudiante';
  isLoading = false;
  mensaje = 'Consultando los datos del estudiante';
  public formEstudiante: FormGroup;

  constructor() {
    this.formEstudiante = this._fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      documento: ['', [Validators.required, Validators.minLength(5)]],
      edad: ['', [Validators.required, Validators.minLength(2)]],
      genero: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['', [Validators.required, Validators.minLength(5)]],
      correo: ['', [Validators.required, Validators.minLength(5)]],
      curso: ['', [Validators.required, Validators.minLength(5)]],
    });
  }
  ngOnInit() {
    const id = this._activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this._estudiantesService.getEstudiante(id).subscribe(
        (resp) => {
          if (resp.isSuccess) {
            this.estudiante = resp.result;
            this.titulo = 'Editar datos del estudiante';
            this.formEstudiante.patchValue(this.estudiante);
            setTimeout(() => {
              this.isLoading = false;
            }, 1600);
          }
        },
        (isError: HttpErrorResponse) => {
          if (isError.status === 404) {
            this._toast.error(isError.error.message, isError.statusText);
          } else {
            this._toast.error(
              'Error al obtener el estudiante',
              isError.statusText
            );
          }
          this.isLoading = false;
          this._route.navigate(['/home']);
        }
      );
    }
  }

  onSubmit() {
    //*Si el formulario es valido se procede a enviar los datos
    //*Se evalúa si estudiante.id existe, si existe se actualiza, sino se crea uno
    if (this.formEstudiante.valid) {
      this.estudiante?.id ? this.editarEstudiante() : this.nuevoEstudiante();
    } else {
      this._toast.warning('El formulario no es correcto', 'Comprueba');
      this.formEstudiante.reset();
    }
  }

  //*Metodos para crear y editar

  private nuevoEstudiante() {
    this.crearEstudiante = this.formEstudiante.value;
    if (this.crearEstudiante) {
      this._estudiantesService.postEstudiante(this.crearEstudiante).subscribe(
        (resp) => {
          if (resp.isSuccess) {
            this._toast.success(resp.message, 'Realizado');
            this.formEstudiante.reset();
            this._route.navigate(['/home']);
          }
        },
        (isError: HttpErrorResponse) => {
          this._toast.error(isError.error.message, isError.statusText);
          this.formEstudiante.reset();
          this._route.navigate(['/home']);
        }
      );
    }
  }

  private editarEstudiante() {
    this.crearEstudiante = this.formEstudiante.value;
    if (this.crearEstudiante) {
      this._estudiantesService
        .putEstudiante(this.estudiante!.id, this.crearEstudiante)
        .subscribe(
          (resp) => {
            if (resp.isSuccess) {
              this._toast.success(resp.message, 'Realizado');
              this.formEstudiante.reset();
              this._route.navigate(['/home']);
            }
          },
          (isError: HttpErrorResponse) => {
            this._toast.error(isError.error.message, isError.statusText);
            this.formEstudiante.reset();
            this._route.navigate(['/home']);
          }
        );
    }
  }
}
