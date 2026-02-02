import { Component, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Task } from '../../../../shared/models/task.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule,
    MatButtonModule, MatIconModule, MatDividerModule, MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class TaskFormComponent {
  @ViewChild('editor') editor!: ElementRef;

  @Input() set taskData(value: Task | null) {
    if (value) {
      this.isEditing = true;
      this.currentTaskId = value.id;
      this.taskForm.patchValue({
        title: value.title,
        description: value.description,
        color: value.color
      });
      this.selectedNoteColor = value.color || '#fff9c4';

      if (this.editor) {
        this.editor.nativeElement.innerHTML = value.description || '';
      }
    } else {
      this.resetForm();
    }
  }

  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  taskForm: FormGroup;
  selectedNoteColor: string = '#fff9c4';
  isEditing: boolean = false;
  currentTaskId?: string | number;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private snackBar: MatSnackBar) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      color: ['#fff9c4']
    });
  }

  execCommand(command: string, value: string = '') {
    document.execCommand(command, false, value);
    this.updateDescription();
  }

  updateDescription() {
    if (this.editor) {
      const html = this.editor.nativeElement.innerHTML;
      this.taskForm.patchValue({ description: html });
    }
  }

  changeTextColor(event: Event) {
    const element = event.target as HTMLInputElement;
    this.execCommand('foreColor', element.value);
  }

  setNoteColor(color: string) {
    this.selectedNoteColor = color;
    this.taskForm.patchValue({ color: color });
  }

  saveTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.showError('Por favor, completa los campos requeridos');
      return;
    }

    const { title, description } = this.taskForm.value;

    if (!title?.trim() || !description?.trim()) {
      this.showError('El título y la descripción no pueden estar vacíos');
      return;
    }

    // Activamos el estado de carga
    this.loading = true;

    const taskData = {
      ...this.taskForm.value,
      id: this.currentTaskId,
      userId: localStorage.getItem('userId')
    };

    // Emitimos los datos. Nota: El componente padre debe setear 
    // loading = false cuando la petición termine.
    this.submit.emit(taskData);
    
    // Si el proceso es asíncrono, el resetForm se llamaría tras la respuesta.
    // Por ahora lo dejamos así para no romper tu flujo actual.
    this.resetForm();
    this.loading = false; 

    this.snackBar.open('¡Nota procesada!', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  onCancel() {
    this.resetForm();
    this.cancel.emit();
  }

  private resetForm() {
    this.isEditing = false;
    this.currentTaskId = undefined;
    this.taskForm.reset({
      title: '',
      description: '',
      color: '#fff9c4'
    });
    this.selectedNoteColor = '#fff9c4';
    if (this.editor) {
      this.editor.nativeElement.innerHTML = '';
    }
    this.cdr.detectChanges();
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Entendido', {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['error-snackbar']
    });
  }
}