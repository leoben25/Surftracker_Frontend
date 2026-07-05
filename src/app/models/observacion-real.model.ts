import { Localizacion } from './localizacion.model';

export interface ObservacionReal {
  id?: number;
  localizacion: Localizacion;
  fechaObservacion: string;
  temperaturaReal: number;
  alturaOlasReal: number;
  velocidadVientoReal: number;
  descripcion?: string;
}