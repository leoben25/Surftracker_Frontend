import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { RegistroClienteComponent } from './components/registro-cliente/registro-cliente.component';
import { RegistroLocalizacionComponent } from './components/registro-localizacion/registro-localizacion.component';
import { RegistroPronosticoComponent } from './components/registro-pronostico/registro-pronostico';
import { ListaPronosticoComponent } from './components/lista-pronostico/lista-pronostico';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'registrar-cliente', component: RegistroClienteComponent },
  { path: 'registrar-localizacion', component: RegistroLocalizacionComponent },
  { path: 'registrar-pronostico', component: RegistroPronosticoComponent },
  { path: 'lista-pronostico', component: ListaPronosticoComponent },
  { path: '**', redirectTo: '' }

];