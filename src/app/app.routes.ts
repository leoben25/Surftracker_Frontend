import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { RegistroClienteComponent } from './components/registro-cliente/registro-cliente.component';
import { RegistroLocalizacionComponent } from './components/registro-localizacion/registro-localizacion.component';
import { RegistroPronosticoComponent } from './components/registro-pronostico/registro-pronostico';
import { ListaPronosticoComponent } from './components/lista-pronostico/lista-pronostico';
import { LoginComponent } from './login/login.component';
import { ListaLocalizacionesComponent } from './components/lista-localizaciones/lista-localizaciones.component';
import { authGuard, adminGuard } from './auth.guard';
import { Favoritos } from './components/favoritos/favoritos';
import { Feedback } from './components/feedback/feedback';
import { NotificacionesComponent } from './components/notificaciones/notificaciones';
import { Preferencias } from './components/preferencias/preferencias';
import { ConsultaPronosticoComponent } from './components/consulta-pronostico/consulta-pronostico.component';
import { RegistroObservacionComponent } from './components/registro-observacion/registro-observacion.component';
import { RegistroReporteComponent } from './components/registro-reporte/registro-reporte.component';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },

  { path: 'login', component: LoginComponent },

  { path: 'registrar-cliente', component: RegistroClienteComponent },
  { path: 'registrar-usuario', component: RegistroClienteComponent },

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

  {
    path: 'registrar-pronostico',
    component: RegistroPronosticoComponent,
    canActivate: [authGuard, adminGuard]
  },
  
  {
    path: 'lista-pronostico',
    redirectTo: 'consulta-pronostico',
    pathMatch: 'full'
  },

  {
    path: 'favoritos',
    component: Favoritos,
    canActivate: [authGuard]
    },
  {
    path: 'feedback',
    component: Feedback,
    canActivate: [authGuard]
  },

  {
    path: 'notificaciones',
    component: NotificacionesComponent,
    canActivate: [authGuard]
  },

  {
    path: 'preferencias',
    component: Preferencias,
    canActivate: [authGuard]
  },

  {
    path: 'consulta-pronostico',
    component: ConsultaPronosticoComponent,
    canActivate: [authGuard]
  },

  {
    path: 'registro-observacion',
    component: RegistroObservacionComponent,
    canActivate: [authGuard]
  },

  {
    path: 'registro-reporte',
    component: RegistroReporteComponent,
    canActivate: [authGuard]
  },
  
  {
  path: 'lista-usuarios',
  component: ListaUsuariosComponent,
  canActivate: [authGuard, adminGuard]
},

  { path: '**', redirectTo: '' }
];