import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task } from '../../../../shared/models/task.model';

/**
 * TaskItemComponent: Representa la visualización individual de una nota.
 * Diseñado como una "Sticky Note" (nota adhesiva) con estilos dinámicos.
 */
@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <mat-card class="sticky-note" [style.background-color]="task.color || '#fff9c4'">
      
      <div class="note-header">
        <mat-checkbox [checked]="task.completed" (change)="toggle.emit(task)" color="primary">
          <span [class.done]="task.completed">{{ task.title }}</span>
        </mat-checkbox>
      </div>
      
      <mat-card-content>
        <div [innerHTML]="task.description" class="preview"></div>
      </mat-card-content>
      
      <mat-card-actions align="end">
        <button mat-icon-button color="primary" (click)="edit.emit(task)" matTooltip="Editar nota">
          <mat-icon>edit_note</mat-icon>
        </button>
        <button mat-icon-button color="warn" (click)="delete.emit(task.id!)" matTooltip="Eliminar nota">
          <mat-icon>delete_outline</mat-icon>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .sticky-note { 
      border-radius: 12px; 
      margin-bottom: 15px; 
      transition: all 0.2s ease;
      border: 1px solid rgba(0,0,0,0.05) !important;
    }
    /* Efecto de elevación al pasar el mouse */
    .sticky-note:hover { 
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.1) !important;
    }
    .done { text-decoration: line-through; opacity: 0.6; }
    /* Limitador de líneas para la previsualización (clamping) */
    .preview { 
      font-size: 0.9rem; 
      line-height: 1.4; 
      color: #444; 
      margin-top: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 4; /* Muestra máximo 4 líneas antes de cortar */
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    mat-card-actions { padding: 0 8px 8px 8px; }
    button mat-icon { font-size: 22px; }
  `]
})
export class TaskItemComponent {
  // Recibe la tarea desde el componente padre (TaskListComponent)
  @Input() task!: Task;

  // Emisores de eventos para que el padre gestione la lógica de negocio
  @Output() toggle = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Task>();
}