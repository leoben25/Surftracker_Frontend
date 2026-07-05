import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'; 

@Component({
  selector: 'app-preferencias',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './preferencias.html',
  styleUrl: './preferencias.css'
})
export class Preferencias {
  // Aquí irá la lógica de tu formulario
}