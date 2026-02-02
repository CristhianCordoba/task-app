import { Component, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task } from '../../../../shared/models/task.model';

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

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
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
      return;
    }

    const taskData = {
      ...this.taskForm.value,
      id: this.currentTaskId,
      userId: localStorage.getItem('userId')
    };

    this.submit.emit(taskData);
    this.resetForm();
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
}