export interface Pronostico {
  idPronostico?: number;
  idLocalizacion: number;
  idFuente?: number;
  idUsuarioCreador?: number;
  fechaGeneracion?: string;
  fechaPronostico: string;
  temperatura?: number;
  alturaOlas?: number;
  periodoOlas?: number;
  direccionOlas?: string;
  velocidadViento?: number;
  direccionViento?: string;
  humedad?: number;
  lluvia?: number;
  nubosidad?: number;
  radiacionSolar?: number;
}