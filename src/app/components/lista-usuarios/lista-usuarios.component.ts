import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { MenuComponent } from '../../menu/menu.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent implements OnInit {

  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];

  textoBusqueda = '';
  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.apiService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
      },
      error: () => {
        this.usuarios = [];
        this.usuariosFiltrados = [];
        this.tipoMensaje = 'error';
        this.mensaje = 'No se pudieron cargar los usuarios.';
      }
    });
  }

  filtrarUsuarios(): void {
    const texto = this.textoBusqueda.trim().toLowerCase();

    if (!texto) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const nombres = (usuario.nombres || '').toLowerCase();
      const apellidos = (usuario.apellidos || '').toLowerCase();
      const login = (usuario.login || '').toLowerCase();
      const correo = (usuario.correo || '').toLowerCase();
      const rol = (usuario.rol || '').toLowerCase();
      const estado = (usuario.estado || '').toLowerCase();

      return nombres.includes(texto)
        || apellidos.includes(texto)
        || login.includes(texto)
        || correo.includes(texto)
        || rol.includes(texto)
        || estado.includes(texto);
    });
  }

  limpiarBusqueda(): void {
    this.textoBusqueda = '';
    this.usuariosFiltrados = [...this.usuarios];
  }

  eliminarUsuario(usuario: any): void {
    const idUsuario = this.obtenerIdUsuario(usuario);
    const usuarioActual = this.authService.getCurrentUser();

    if (!idUsuario) {
      this.tipoMensaje = 'error';
      this.mensaje = 'No se encontró el ID del usuario.';
      return;
    }

    if (usuarioActual?.idUsuario === idUsuario) {
      Swal.fire({
        icon: 'warning',
        title: 'Acción no permitida',
        text: 'No puedes eliminar tu propio usuario mientras estás logueado.'
      });
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar usuario?',
      text: `Se eliminará el usuario ${usuario.login || usuario.correo || idUsuario}.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.apiService.eliminarUsuario(idUsuario).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Usuario eliminado correctamente.'
          });

          this.cargarUsuarios();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo eliminar',
            text: 'El usuario puede estar relacionado con favoritos, feedbacks, pronósticos u otros registros.'
          });
        }
      });
    });
  }

  obtenerIdUsuario(usuario: any): number {
    return usuario?.idUsuario || usuario?.idusuario || usuario?.id;
  }

  obtenerNombreCompleto(usuario: any): string {
    const nombres = usuario?.nombres || '';
    const apellidos = usuario?.apellidos || '';

    const nombreCompleto = `${nombres} ${apellidos}`.trim();

    return nombreCompleto || '-';
  }

  obtenerRol(usuario: any): string {
    return usuario?.rol || 'CLIENTE';
  }

  obtenerEstado(usuario: any): string {
    return usuario?.estado || '-';
  }
}