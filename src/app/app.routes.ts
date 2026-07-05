import { Routes } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { RegistroClienteComponent } from './components/registro-cliente/registro-cliente.component';
import { RegistroLocalizacionComponent } from './components/registro-localizacion/registro-localizacion.component';

import { RegistroPronosticoComponent } from './components/registro-pronostico/registro-pronostico';
import { ListaPronosticoComponent } from './components/lista-pronostico/lista-pronostico';

import { LoginComponent } from './login/login.component';
import { ListaLocalizacionesComponent } from './components/lista-localizaciones/lista-localizaciones.component';
import { authGuard, adminGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: IndexComponent },

  { path: 'login', component: LoginComponent },

  // Registro de cliente / usuario
  { path: 'registrar-cliente', component: RegistroClienteComponent },
  { path: 'registrar-usuario', component: RegistroClienteComponent },

  // Localizaciones
  {
    path: 'registrar-localizacion',
    component: RegistroLocalizacionComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'lista-localizaciones',
    component: ListaLocalizacionesComponent,
    canActivate: [authGuard]
  },

  // Pronósticos
  {
    path: 'registrar-pronostico',
    component: RegistroPronosticoComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'lista-pronostico',
    component: ListaPronosticoComponent,
    canActivate: [authGuard]
  },

  { path: '**', redirectTo: '' }
];