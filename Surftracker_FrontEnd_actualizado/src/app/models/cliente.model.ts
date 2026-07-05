export interface Cliente {
  idCliente?: number;
  idUsuario?: number;
  nombres: string;
  apellidos: string;
  dni: string;
  login: string;
  password?: string;
  correo: string;
  telefono?: string;
  fechanacimiento: string;
  direccion: string;
}
