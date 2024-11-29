import { Component } from '@angular/core';
import { FacultadService } from './services/facultad.service';
import { Facultad } from './models/facultad';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Sede } from '../sede/models/sede';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SedeService } from '../sede/services/sede.service';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { NavegarComponent } from '../component/navegar/navegar.component';
@Component({
  selector: 'app-facultad',
  standalone: true,
  imports: [TableModule, ToastModule, FormsModule, DialogModule, ButtonModule, InputTextModule, ConfirmDialogModule, DropdownModule, CommonModule, NavegarComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './facultad.component.html',
  styleUrl: './facultad.component.css'
})
export class FacultadComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  facultades: Facultad[] = [];
  titulo: string = '';
  opc: string = '';
  facultad = new Facultad(0, '', new Sede());
  op = 0;
  visible: boolean = false;
  nombreTemp: string = '';
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';
  sedeOptions: Sede[] = [];
  sedeOriginal: string = '';

  constructor(
    private facultadService: FacultadService,
    private sedeService: SedeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.cargando = true;
    this.listarFacultades();
  }

  cargarSedes() {
    this.sedeService.getSedes().subscribe({
      next: (data) => {
        this.sedeOptions = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las sedes'
        });
      }
    });
  }

  listarFacultades() {
    this.facultadService.getFacultades().subscribe({
      next: (data) => {
        this.facultades = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de facultades',
        });
      },
    });
  }

  filtrarFacultades() {
    if (this.filtroNombre) {
      return this.facultades.filter(facultad =>
        facultad.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.facultades;
  }

  actualizarLista() {
    this.listarFacultades();
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Lista de facultades actualizada' });
  }

  showDialogCreate() {
    this.cargarSedes();
    this.titulo = 'Crear Facultad';
    this.opc = 'Agregar';
    this.op = 0;
    this.nombreTemp = '';
    this.visible = true;
    this.facultad = new Facultad(0, '', new Sede());
  }

  showDialogEdit(id: number) {
    this.cargarSedes();
    this.titulo = 'Editar Facultad';
    this.opc = 'Editar';
    this.facultadService.getFacultadById(id).subscribe((data) => {
      this.facultad = data;
      this.nombreTemp = this.facultad.nombre;
      this.sedeOriginal = this.facultad.sede.nombre;
      this.op = 1;
      this.visible = true;
    });
  }

  deleteFacultad(id: number) {

        this.facultadService.deleteFacultad(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Correcto',
              detail: 'Facultad eliminado',
            });
            this.isDeleteInProgress = false;
            this.listarFacultades();
          },
          error: () => {
            this.isDeleteInProgress = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el facultad',
            });
          },
        });
  
  }

  addFacultad(): void {
    if (!this.nombreTemp || this.nombreTemp.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todos los campos son obligatorios',
      });
      return;
    }

    this.facultad.nombre = this.nombreTemp;
    
    this.facultadService.createFacultad(this.facultad).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Facultad registrado',
        });
        this.listarFacultades();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el facultad',
        });
      },
    });
  }

  editFacultad() {
    if (!this.nombreTemp || this.nombreTemp.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todos los campos son obligatorios',
      });
      return;
    }

    if (!this.facultad.sede || !this.facultad.sede.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe seleccionar una sede',
      });
      return;
    }

    this.facultad.nombre = this.nombreTemp;
    const facultadToUpdate = {
      id: this.facultad.id,
      nombre: this.facultad.nombre,
      sede: {
        id: this.facultad.sede.id,
        nombre: this.facultad.sede.nombre
      }
    };

    this.facultadService.updateFacultad(facultadToUpdate, this.facultad.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Facultad actualizado',
        });
        this.listarFacultades();
        this.op = 0;
        this.visible = false;
      },
      error: (error) => {
        console.error('Error al actualizar facultad:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el facultad',
        });
      },
    });
  }

  opcion(): void {
    if (this.op == 0) {
      this.addFacultad();
      this.limpiar();
    } else if (this.op == 1) {
      this.editFacultad();
      this.limpiar();
    } else {
      this.limpiar();
    }
  }

  limpiar() {
    this.titulo = '';
    this.opc = '';
    this.op = 0;
    this.facultad = new Facultad(0, '',new Sede());
    this.nombreTemp = '';
  }

}