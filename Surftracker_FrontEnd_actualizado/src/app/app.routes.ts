import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { RegistroClienteComponent } from './components/registro-cliente/registro-cliente.component';
import { RegistroLocalizacionComponent } from './components/registro-localizacion/registro-localizacion.component';
import { Favoritos } from './components/favoritos/favoritos';
import { Feedback } from './components/feedback/feedback';
import { NotificacionesComponent } from './components/notificaciones/notificaciones';
import { Preferencias } from './components/preferencias/preferencias';
export const routes: Routes = [
  
  { path: '', component: IndexComponent },
  { path: 'registrar-cliente', component: RegistroClienteComponent },
  { path: 'registrar-localizacion', component: RegistroLocalizacionComponent },
  { path: 'favoritos', component: Favoritos },
  { path: 'feedback', component: Feedback },
  { path: 'notificaciones', component: NotificacionesComponent },
  { path: 'preferencias', component: Preferencias },
  { path: '**', redirectTo: '' }
];