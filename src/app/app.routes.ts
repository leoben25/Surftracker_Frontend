import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { RegistroClienteComponent } from './components/registro-cliente/registro-cliente.component';
import { RegistroLocalizacionComponent } from './components/registro-localizacion/registro-localizacion.component';
import { LoginComponent } from './login/login.component';
import { ListaLocalizacionesComponent } from './components/lista-localizaciones/lista-localizaciones.component';
import { authGuard, adminGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'registrar-usuario', component: RegistroClienteComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrar-localizacion', component: RegistroLocalizacionComponent, canActivate: [authGuard, adminGuard] },
  { path: 'lista-localizaciones', component: ListaLocalizacionesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];