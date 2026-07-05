import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { ApiService } from '../../services/api.service'; 
import { Pronostico } from '../../models/pronostico.model'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-consulta-pronostico',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MenuComponent
  ],
  templateUrl: './consulta-pronostico.component.html', 
  styleUrl: './consulta-pronostico.component.css',     
})
export class ConsultaPronosticoComponent {
  forms: FormGroup;

  dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  displayedColumns = [
    "idPronostico", 
    "idLocalizacion", 
    "fechaPronostico", 
    "temperatura", 
    "alturaOlas", 
    "velocidadViento", 
    "acciones"
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService 
  ) {
   
    this.forms = this.fb.group({
      idLocalizacion: [''],
    });
  }

  consultaPronostico() {
    console.log(">>> consultaPronostico >> Iniciando búsqueda");

    const filtro = this.forms.value.idLocalizacion;

  
this.apiService.listaPorLocalizacion(filtro).subscribe({
  next: (data) => {
    console.log(">>> consultaPronostico >> Datos recibidos", data);
    
    if (data.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin resultados',
        text: 'No se encontraron pronósticos para el criterio ingresado.'
      });
    }

    
    this.dataSource = new MatTableDataSource<Pronostico>(data);
    this.dataSource.paginator = this.paginator;
  },
  error: (err) => {
    console.error("Error al consultar pronósticos", err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al conectar con el servidor.'
    });
  }
});
  }
}