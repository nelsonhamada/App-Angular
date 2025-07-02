import { Routes } from '@angular/router';
import { ContadorComponent } from './contador/contador.component';
import { SobreComponent } from './sobre/sobre.component';
import { PacientesComponent } from './pacientes/pacientes.component';

export const routes: Routes = [
  { path: '', component: ContadorComponent },
  { path: 'sobre', component: SobreComponent },
  { path: 'pacientes', component: PacientesComponent },
  { path: '**', redirectTo: '' } // Rota wildcard para URLs não encontradas
];
