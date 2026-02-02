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
  // Referencia al editor 'contenteditable' del HTML
  @ViewChild('editor') editor!: ElementRef;

  // Setter para recibir datos cuando se va a editar una tarea existente
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

      // Inyectamos el contenido HTML en el editor visual
      if (this.editor) {
        this.editor.nativeElement.innerHTML = value.description || '';
      }
    } else {
      this.resetForm();
    }
  }

  // Eventos para comunicar resultados al componente padre
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  // Propiedades de estado del formulario
  taskForm: FormGroup;
  selectedNoteColor: string = '#fff9c4';
  isEditing: boolean = false;
  currentTaskId?: string | number;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private snackBar: MatSnackBar) {
    // Inicialización del formulario reactivo
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      color: ['#fff9c4']
    });
  }

  // Ejecuta comandos de edición de texto enriquecido (Negrita, Itálica, etc.)
  execCommand(command: string, value: string = '') {
    document.execCommand(command, false, value);
    this.updateDescription();
  }

  // Sincroniza el contenido del div editable con el valor del formulario
  updateDescription() {
    if (this.editor) {
      const html = this.editor.nativeElement.innerHTML;
      this.taskForm.patchValue({ description: html });
    }
  }

  /**
   * MÉTODOS QUE ARREGLAN EL ERROR DE GITHUB
   */

  // Cambia el color del texto seleccionado en el editor
  changeTextColor(event: Event) {
    const element = event.target as HTMLInputElement;
    this.execCommand('foreColor', element.value);
  }

  // Cambia el color de fondo de la nota (tarjeta)
  setNoteColor(color: string) {
    this.selectedNoteColor = color;
    this.taskForm.patchValue({ color: color });
  }

  // Lógica para enviar o actualizar la tarea
  saveTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.showError('Por favor, completa los campos requeridos');
      return;
    }

    const { title, description } = this.taskForm.value;

    // Validación extra para evitar contenido vacío o solo espacios
    if (!title?.trim() || !description?.trim()) {
      this.showError('El título y la descripción no pueden estar vacíos');
      return;
    }

    const taskData = {
      ...this.taskForm.value,
      id: this.currentTaskId,
      userId: localStorage.getItem('userId') // Asigna el dueño de la tarea
    };

    this.submit.emit(taskData);
    this.resetForm();

    this.snackBar.open('¡Nota guardada con éxito!', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  // Gestiona la acción de cancelar (limpia y avisa al padre)
  onCancel() {
    this.resetForm();
    this.cancel.emit();
  }

  // Restablece el formulario a su estado inicial
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
    // Forzamos la detección de cambios para evitar errores de vista
    this.cdr.detectChanges();
  }

  // Muestra mensajes de error estilizados
  private showError(message: string) {
    this.snackBar.open(message, 'Entendido', {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['error-snackbar']
    });
  }
}