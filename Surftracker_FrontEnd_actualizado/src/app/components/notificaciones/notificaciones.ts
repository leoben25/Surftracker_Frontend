import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { NotificacionService } from '../../services/notificacion.service';
import { Notificacion } from '../../models/expus.model';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule, MenuComponent, DatePipe], 
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css'
})
export class NotificacionesComponent implements OnInit {
  notificaciones: Notificacion[] = [];
  idUsuarioSimulado = 1; 

  constructor(private notificacionService: NotificacionService) {}

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  cargarNotificaciones(): void {
    this.notificacionService.listarPorUsuario(this.idUsuarioSimulado).subscribe({
      next: (data) => this.notificaciones = data,
      error: (err) => console.error('Error al cargar alertas', err)
    });
  }

  marcarLeida(id?: number): void {
    if (!id) return;
    this.notificacionService.marcarComoLeida(id).subscribe({
      next: (notifActualizada) => {
        const index = this.notificaciones.findIndex(n => n.id === id);
        if (index !== -1) {
          this.notificaciones[index].estadoLectura = 'leida';
        }
      },
      error: (err) => console.error('Error al actualizar estado', err)
    });
  }
}