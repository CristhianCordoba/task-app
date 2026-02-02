import { Component, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task } from '../../../../shared/models/task.model';
import { MatSnackBar } from '@angular/material/snack-bar';
/**
 * TaskFormComponent: Gestiona la creación y edición de notas.
 * Implementa un editor de texto enriquecido usando contentEditable.
 */
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule,
    MatButtonModule, MatIconModule, MatDividerModule, MatTooltipModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  // Referencia al elemento HTML que actúa como editor de texto
  @ViewChild('editor') editor!: ElementRef;

  /**
   * Input reactivo: Detecta si recibimos una tarea para editar.
   * Si hay valor, rellena el formulario; si es null, lo resetea.
   */
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

      // Sincroniza el contenido HTML del editor manualmente
      if (this.editor) {
        this.editor.nativeElement.innerHTML = value.description || '';
      }
    } else {
      this.resetForm();
    }
  }

  // Emisores de eventos para comunicación con el componente padre (Smart Component)
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  taskForm: FormGroup;
  selectedNoteColor: string = '#fff9c4'; // Color por defecto de la nota
  isEditing: boolean = false;
  currentTaskId?: string | number;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private snackBar: MatSnackBar) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      color: ['#fff9c4']
    });
  }

  /**
   * Ejecuta comandos de formato de texto (Negrita, Itálica, etc.)
   * sobre el área editable.
   */
  execCommand(command: string, value: string = '') {
    document.execCommand(command, false, value);
    this.updateDescription();
  }

  /**
   * Sincroniza el contenido del editor HTML con el valor del AbstractControl 'description'
   */
  updateDescription() {
    if (this.editor) {
      const html = this.editor.nativeElement.innerHTML;
      this.taskForm.patchValue({ description: html });
    }
  }

  /**
   * Guarda la tarea validando que el contenido no sea solo espacios en blanco.
   */
  saveTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.showError('Por favor, completa los campos requeridos');
      return;
    }

    const { title, description } = this.taskForm.value;

    // Validación extra de limpieza de datos
    if (!title?.trim() || !description?.trim()) {
      this.showError('El título y la descripción no pueden estar vacíos');
      return;
    }

    const taskData = {
      ...this.taskForm.value,
      id: this.currentTaskId,
      userId: localStorage.getItem('userId') // Asocia la tarea al usuario actual
    };

    this.submit.emit(taskData);
    this.resetForm();

    this.snackBar.open('¡Nota guardada con éxito!', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Limpia el formulario y el estado de edición al terminar o cancelar.
   */
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
    this.cdr.detectChanges(); // Fuerza la actualización de la vista
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