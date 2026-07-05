import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'; 

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, MenuComponent], 
  templateUrl: './feedback.html',
  styleUrl: './feedback.css'
})
export class Feedback {
  
}
