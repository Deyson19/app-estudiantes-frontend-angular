import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ActualizarResponse,
  CrearActualizar,
  CrearResponse,
  EliminarResponse,
  EstudianteResponse,
  EstudiantesResponse,
} from '../interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EstudiantesService {
  // private _baseUrl = 'https://localhost:7019/';
  private _baseUrl = 'http://localhost:5000/';

  private http = inject(HttpClient);
  constructor() {}

  getEstudiantes(): Observable<EstudiantesResponse> {
    return this.http.get<EstudiantesResponse>(
      `${this._baseUrl}api/Estudiantes`
    );
  }
  getEstudiante(id: string): Observable<EstudianteResponse> {
    return this.http.get<EstudianteResponse>(
      `${this._baseUrl}api/Estudiantes/${id}`
    );
  }
  postEstudiante(nuevoEstudiante: CrearActualizar): Observable<CrearResponse> {
    return this.http.post<CrearResponse>(
      `${this._baseUrl}api/Estudiantes`,
      nuevoEstudiante
    );
  }
  putEstudiante(
    id: string,
    estudiante: CrearActualizar
  ): Observable<ActualizarResponse> {
    return this.http.put<ActualizarResponse>(
      `${this._baseUrl}api/Estudiantes/${id}`,
      estudiante
    );
  }
  deleteEstudiante(id: string): Observable<EliminarResponse> {
    return this.http.delete<EliminarResponse>(
      `${this._baseUrl}api/Estudiantes/${id}`
    );
  }
}
