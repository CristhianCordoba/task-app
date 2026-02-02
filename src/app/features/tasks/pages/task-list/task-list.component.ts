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
import { TaskItemComponent } from '../items/task-item.component';

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
  isInitialLoading = true;
  searchText = '';
  taskToEdit: Task | null = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail');
    this.loadTasks();
  }

  get pendingTasks() {
    return this.filteredTasks.filter(t => !t.completed);
  }

  get completedTasks() {
    return this.filteredTasks.filter(t => t.completed);
  }

  loadTasks() {
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

  get filteredTasks() {
    const filter = this.searchText.toLowerCase();
    return this.tasks.filter(t =>
      t.title.toLowerCase().includes(filter) ||
      t.description?.toLowerCase().includes(filter)
    );
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      
      this.toggleTask(task);

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  handleLogout() { 
    this.authService.logout(); 
    this.router.navigate(['/login']); 
  }

  handleSearch(val: string) { 
    this.searchText = val; 
  }

  handleEdit(task: Task) {
    this.taskToEdit = { ...task };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.taskToEdit = null;
  }

  handleFormSubmit(taskData: Task) {
    if (this.taskToEdit) {
      this.updateTask(taskData);
    } else {
      this.createTask(taskData);
    }
  }

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
        this.loadTasks();
      }
    });
  }

  deleteTask(id: string) {
    this.taskService.delete(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al eliminar:', err)
    });
  }
}