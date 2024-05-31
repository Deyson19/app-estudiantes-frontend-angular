import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ListadoComponent } from './pages/listado/listado.component';
import { UpsertComponent } from './pages/upsert/upsert.component';
import { DetalleComponent } from './pages/detalle/detalle.component';

//*Configurar rutas
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'home',
        component: ListadoComponent,
      },
      {
        path: 'nuevo',
        component: UpsertComponent,
      },
      {
        path: 'detalle/:id',
        component: DetalleComponent,
      },
      {
        path: 'editar/:id',
        component: UpsertComponent,
      },
      {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
