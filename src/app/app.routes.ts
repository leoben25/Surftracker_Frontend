import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { RegistroClienteComponent } from './components/registro-cliente/registro-cliente.component';
import { RegistroLocalizacionComponent } from './components/registro-localizacion/registro-localizacion.component';
import { ConsultaPronosticoComponent } from './components/consulta-pronostico/consulta-pronostico.component';
import { RegistroReporteComponent } from './components/registro-reporte/registro-reporte.component';
import { RegistroObservacionComponent } from './components/registro-observacion/registro-observacion.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'registrar-cliente', component: RegistroClienteComponent },
  { path: 'registrar-localizacion', component: RegistroLocalizacionComponent },
  { path: 'consulta-pronostico', component: ConsultaPronosticoComponent },
  { path: 'registrar-observacion', component: RegistroObservacionComponent },
  { path: 'registrar-reporte', component: RegistroReporteComponent },
  { path: '**', redirectTo: '' }
];