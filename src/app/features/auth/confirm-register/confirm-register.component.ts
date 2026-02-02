import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * ConfirmRegisterComponent
 * Este componente se muestra como un modal (diálogo) cuando el sistema
 * detecta que un email no está registrado, permitiendo al usuario decidir
 * si desea crear una cuenta nueva en ese instante.
 */
@Component({
  selector: 'app-confirm-register',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './confirm-register.component.html',
  styleUrls: ['./confirm-register.component.scss']
})
export class ConfirmRegisterComponent {
  /**
   * @param dialogRef Referencia al diálogo actual para poder cerrarlo 
   * y enviar una respuesta al componente que lo abrió (LoginComponent).
   */
  constructor(public dialogRef: MatDialogRef<ConfirmRegisterComponent>) {}

  /**
   * Cierra el modal enviando 'true'.
   * Esto activará la llamada al servicio de registro en el backend.
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * Cierra el modal enviando 'false'.
   * Cancela el proceso y devuelve al usuario al formulario de login.
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}