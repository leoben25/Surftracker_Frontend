import { ObservacionReal } from './observacion-real.model';
import { Pronostico } from './pronostico.model';

export interface ReportePrecision {
  idReporte?: number;
  observacion: ObservacionReal;
  porcentajePrecision: number;
  diferencia: number;
  fechaReporte: string;
  pronostico: Pronostico;
}