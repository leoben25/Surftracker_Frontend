import { Localizacion } from './localizacion.model';


export interface Favorito {
  id?: number;
  idUsuario?: number;
  localizacion: Localizacion;
  fechaAgregado?: string;
}

export interface Feedback {
  id?: number; 
  comentario: string;
  calificacion: number;
  fechaFeedback?: string;
   idUsuario?: number;
  //pronostico?: Pronostico | null;
}

export interface Notificacion {
  id?: number;
  titulo: string;
  mensaje: string;
  tipoAlerta: string;
  nivelRiesgo: string;
  estadoLectura?: string;
  fechaEnvio?: string;
  idUsuario?: number;
  localizacion?: Localizacion;
}

export interface Preferencia {
  idPreferencia?: number;
  idUsuario: number;
  tema: string;
  recibirAlertas: boolean;
}

export interface PreferenciaResponse {
  data: Preferencia;
  mensaje: string;
}