import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task.service';
import { Task } from '../../../../shared/models/task.model';
import { AuthService } from '../../../../core/services/auth.service';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { NavbarComponent } from '../../../auth/navbar/navbar.component';
import { LogoutConfirmationComponent } from '../../../auth/navbar/logout-confirmation.component';
import { TaskItemComponent } from '../items/task-item.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../../shared/components/delete-Confirmation.component';
/**
 * TaskListComponent
 * Componente principal que actúa como contenedor (Smart Component) para la gestión de tareas.
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule, TaskFormComponent, NavbarComponent, TaskItemComponent,
    MatProgressSpinnerModule, MatDividerModule, MatIconModule,
    DragDropModule // Módulo vital para arrastrar y soltar
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  userEmail: string | null = '';
  isInitialLoading = true; // Controla la visualización del spinner de carga
  searchText = ''; // Almacena el valor de búsqueda para el filtrado dinámico
  taskToEdit: Task | null = null; // Tarea seleccionada actualmente para edición

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail');
    this.loadTasks(); // Carga inicial de datos al montar el componente
  }

  // Getters para segmentar las tareas según su estado de completado
  get pendingTasks() {
    return this.filteredTasks.filter(t => !t.completed);
  }

  get completedTasks() {
    return this.filteredTasks.filter(t => t.completed);
  }

  /**
   * Obtiene todas las tareas del usuario desde el servidor.
   */
  loadTasks() {
    this.isInitialLoading = true;
    this.cdr.detectChanges();
    this.taskService.getAll().subscribe({
      next: (data) => {
        this.tasks = data;
        this.isInitialLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isInitialLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Retorna la lista de tareas filtrada por título o descripción en base a searchText.
   */
  get filteredTasks() {
    const filter = this.searchText.toLowerCase();
    return this.tasks.filter(t =>
      t.title.toLowerCase().includes(filter) ||
      t.description?.toLowerCase().includes(filter)
    );
  }

  /**
   * Maneja el evento de soltar un elemento (Drag and Drop).
   * Actualiza la UI localmente y sincroniza el cambio de estado con el backend.
   */
  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      // Reordenamiento dentro de la misma lista
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Movimiento entre listas (Pendiente <-> Completado)
      const task = event.previousContainer.data[event.previousIndex];

      this.toggleTask(task); // Sincroniza el cambio de estado con el servidor

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  handleLogout() {
    const dialogRef = this.dialog.open(LogoutConfirmationComponent, {
      width: '350px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  handleSearch(val: string) {
    this.searchText = val;
  }

  /**
   * Prepara una tarea para su edición y desplaza la vista hacia el formulario.
   */
  handleEdit(task: Task) {
    this.taskToEdit = { ...task };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.taskToEdit = null;
  }

  /**
   * Decide si la acción del formulario es una creación o una actualización.
   */
  handleFormSubmit(taskData: Task) {
    if (this.taskToEdit) {
      this.updateTask(taskData);
    } else {
      this.createTask(taskData);
    }
  }

  /**
   * Envía una nueva tarea al backend y la añade al inicio de la lista local.
   */
  createTask(newTask: Task) {
    this.taskService.create(newTask).subscribe({
      next: (taskCreated) => {
        if (taskCreated) {
          this.tasks = [taskCreated, ...this.tasks];
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error al crear:', err)
    });
  }

  /**
   * Actualiza una tarea existente y refresca la lista local.
   */
  updateTask(taskData: Task) {
    this.taskService.update(taskData.id!, taskData).subscribe({
      next: (updated) => {
        this.tasks = this.tasks.map(t => t.id === updated.id ? updated : t);
        this.taskToEdit = null;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al actualizar:', err)
    });
  }

  /**
   * Cambia el estado de completado de una tarea.
   */
  toggleTask(task: Task) {
    this.taskService.update(task.id!, { completed: !task.completed }).subscribe({
      next: (updated) => {
        this.tasks = this.tasks.map(t =>
          t.id === updated.id ? { ...t, completed: updated.completed } : t
        );
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        this.loadTasks(); // Recarga en caso de error para revertir cambios visuales
      }
    });
  }

  /**
   * Elimina una tarea permanentemente.
   */
  deleteTask(id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.delete(id).subscribe({
          next: () => {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Error al eliminar:', err)
        });
      }
    });
  }
}