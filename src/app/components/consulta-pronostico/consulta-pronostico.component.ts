import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import Swal from 'sweetalert2';

import { MenuComponent } from '../../menu/menu.component';
import { ApiService } from '../../services/api.service';
import { FavoritoService } from '../../services/favorito.service';
import { AuthService } from '../../services/auth.service';

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
  styleUrl: './consulta-pronostico.component.css'
})
export class ConsultaPronosticoComponent implements OnInit, AfterViewInit {
  forms: FormGroup;

  listaLocalizaciones: any[] = [];
  listaFavoritos: any[] = [];

  dataSource = new MatTableDataSource<any>([]);
  hayConsulta = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    'playa',
    'fechaPronostico',
    'temperatura',
    'alturaOlas',
    'periodoOlas',
    'direccionOlas',
    'velocidadViento',
    'humedad',
    'acciones'
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private favoritoService: FavoritoService,
    private authService: AuthService
  ) {
    this.forms = this.fb.group({
      idLocalizacion: ['']
    });
  }

  ngOnInit(): void {
    this.cargarLocalizaciones();
    this.cargarFavoritos();
    this.listarTodos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  cargarLocalizaciones(): void {
    this.apiService.consultarLocalizaciones().subscribe({
      next: (data) => {
        this.listaLocalizaciones = data;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las localizaciones.'
        });
      }
    });
  }

  cargarFavoritos(): void {
    const usuario = this.authService.getCurrentUser();

    if (!usuario?.idUsuario) {
      return;
    }

    this.favoritoService.listarPorUsuario(usuario.idUsuario).subscribe({
      next: (data) => {
        this.listaFavoritos = data;
      },
      error: () => {
        console.error('No se pudieron cargar favoritos');
      }
    });
  }

  listarTodos(): void {
    this.apiService.listarTodosPronosticos().subscribe({
      next: (data) => {
        this.hayConsulta = true;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;

        if (data.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin registros',
            text: 'No hay pronósticos registrados.'
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los pronósticos.'
        });
      }
    });
  }

  consultaPronostico(): void {
    const idLocalizacion = this.forms.value.idLocalizacion;

    if (!idLocalizacion) {
      this.listarTodos();
      return;
    }

    this.apiService.listaPorLocalizacion(Number(idLocalizacion)).subscribe({
      next: (data) => {
        this.hayConsulta = true;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;

        if (data.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin resultados',
            text: 'No se encontraron pronósticos para la playa seleccionada.'
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al conectar con el servidor.'
        });
      }
    });
  }

  agregarAFavoritos(pronostico: any): void {
    const usuario = this.authService.getCurrentUser();

    if (!usuario?.idUsuario) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión requerida',
        text: 'Debe iniciar sesión para agregar favoritos.'
      });
      return;
    }

    const idLocalizacion = this.obtenerIdLocalizacionPronostico(pronostico);

    if (!idLocalizacion) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró la localización del pronóstico.'
      });
      return;
    }

    if (this.esFavorito(pronostico)) {
      Swal.fire({
        icon: 'info',
        title: 'Ya está en favoritos',
        text: 'Esta playa ya fue agregada a tus favoritos.'
      });
      return;
    }

    this.favoritoService.guardarFavorito(usuario.idUsuario, idLocalizacion).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Agregado',
          text: 'La playa fue agregada a favoritos.'
        });

        this.cargarFavoritos();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar a favoritos.'
        });
      }
    });
  }

  esFavorito(pronostico: any): boolean {
    const idLocalizacion = this.obtenerIdLocalizacionPronostico(pronostico);

    return this.listaFavoritos.some(fav =>
      this.obtenerIdLocalizacion(fav.localizacion) === idLocalizacion
    );
  }

  obtenerIdLocalizacionPronostico(pronostico: any): number {
    return pronostico?.idLocalizacion
      || pronostico?.idlocalizacion
      || pronostico?.localizacion?.id
      || pronostico?.localizacion?.idLocalizacion
      || pronostico?.localizacion?.idlocalizacion;
  }

  obtenerIdLocalizacion(localizacion: any): number {
    return localizacion?.id
      || localizacion?.idLocalizacion
      || localizacion?.idlocalizacion;
  }

  obtenerNombreLocalizacionPorPronostico(pronostico: any): string {
    const idLocalizacion = this.obtenerIdLocalizacionPronostico(pronostico);

    const localizacion = this.listaLocalizaciones.find(loc =>
      this.obtenerIdLocalizacion(loc) === idLocalizacion
    );

    if (!localizacion) {
      return `Localización ${idLocalizacion || '-'}`;
    }

    return this.obtenerTextoLocalizacion(localizacion);
  }

  obtenerTextoLocalizacion(localizacion: any): string {
    if (!localizacion) {
      return 'Sin localización';
    }

    const playa =
      localizacion.playa ||
      localizacion.nombrePlaya ||
      localizacion.nombreplaya ||
      localizacion.nombre ||
      localizacion.descripcion ||
      'Playa sin nombre';

    const distrito = localizacion.distrito || '';
    const provincia = localizacion.provincia || '';
    const departamento = localizacion.departamento || '';
    const pais = localizacion.pais || '';

    return `${playa}${distrito ? ' - ' + distrito : ''}${provincia ? ' - ' + provincia : ''}${departamento ? ' - ' + departamento : ''}${pais ? ' - ' + pais : ''}`;
  }

  obtenerValor(valor: any): string {
    return valor !== null && valor !== undefined && valor !== '' ? valor : '-';
  }
}