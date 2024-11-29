import { Component } from '@angular/core';
import { SedeService } from './services/sede.service';
import { MessageService } from 'primeng/api';
import { Sede } from './models/sede';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { NavegarComponent } from '../component/navegar/navegar.component';

@Component({
  selector: 'app-sede',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule, InputTextModule, 
    DialogModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule, 
    SkeletonModule, NavegarComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './sede.component.html',
  styleUrl: './sede.component.css'
})
export class SedeComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  sedes: Sede[] = [];
  titulo: string = '';
  opc: string = '';
  sede = new Sede();
  op = 0;
  visible: boolean = false;
  nombreTemp: string = '';
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';

  constructor(
    private sedeService: SedeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarSedes();
  }

  filtrarSedes() {
    if (this.filtroNombre) {
      return this.sedes.filter(sede => 
        sede.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.sedes;
  }

  listarSedes() {
    this.sedeService.getSedes().subscribe({
      next: (data) => {
        this.sedes = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de sedes',
        });
      },
    });
  }

  actualizarLista() {
    this.listarSedes();
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Lista de sedes actualizada' });
  }

  showDialogCreate() {
    this.titulo = 'Crear Sede';
    this.opc = 'Agregar';
    this.op = 0;
    this.nombreTemp = '';
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Sede';
    this.opc = 'Editar';
    this.sedeService.getSedeById(id).subscribe((data) => {
      this.sede = data;
      this.nombreTemp = this.sede.nombre;
      this.op = 1;
      this.visible = true;
    });
  }

  deleteSede(id: number) {
    this.isDeleteInProgress = true;
    this.sedeService.deleteSede(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Sede eliminada',
        });
        this.isDeleteInProgress = false;
        this.listarSedes();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la sede',
        });
      },
    });
  }

  addSede(): void {
    if (!this.nombreTemp || this.nombreTemp.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre de la sede no puede estar vacío',
      });
      return;
    }

    this.sede.nombre = this.nombreTemp;
    this.sedeService.createSede(this.sede).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Sede registrada',
        });
        this.listarSedes();
        this.op = 0;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar la sede',
        });
      },
    });
    this.visible = false;
  }

  editSede() {
    this.sedeService.updateSede(this.sede, this.sede.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Sede editada',
        });
        this.listarSedes();
        this.op = 0;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo editar la sede',
        });
      },
    });
    this.visible = false;
  }

  opcion(): void {
    if (this.op == 0) {
      this.addSede();
      this.limpiar();
    } else if (this.op == 1) {
      this.sede.nombre = this.nombreTemp;
      this.editSede();
      this.limpiar();
    } else {
      this.limpiar();
    }
  }

  limpiar() {
    this.titulo = '';
    this.opc = '';
    this.op = 0;
    this.sede.id = 0;
    this.sede.nombre = '';
  }
}
