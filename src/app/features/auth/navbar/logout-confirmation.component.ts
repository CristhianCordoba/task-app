import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="confirm-container">
      <h2 mat-dialog-title>Cerrar Sesión</h2>
      
      <mat-dialog-content>
        <p>¿Estás seguro de que quieres salir?</p>
      </mat-dialog-content>
      
      <mat-dialog-actions align="center">
        <button mat-button class="btn-cancel" (click)="onNoClick()">
          Mantenerme aquí
        </button>
        <button mat-flat-button class="btn-logout" [mat-dialog-close]="true">
          Cerrar Sesión
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-container {
      padding: 15px 10px;
      text-align: center;
    }
    h2 {
      font-weight: 700;
      color: #333;
      font-size: 1.6rem;
      margin: 0 0 10px 0 !important;
    }
    mat-dialog-content {
      color: #666;
      font-size: 1rem;
      line-height: 1.5;
      margin-bottom: 25px;
    }
    mat-dialog-actions {
      padding: 0;
      gap: 12px;
      display: flex;
      justify-content: center;
    }
    .btn-cancel {
      border-radius: 25px;
      font-weight: 500;
      color: #777;
      padding: 0 20px;
    }
    .btn-logout {
      background: linear-gradient(135deg, #ff5252 0%, #d32f2f 100%) !important;
      color: white !important;
      border-radius: 25px;
      padding: 0 30px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(211, 47, 47, 0.25);
      transition: transform 0.2s ease;

      &:hover {
        transform: translateY(-1px);
      }
    }
  `]
})
export class LogoutConfirmationComponent {
  constructor(public dialogRef: MatDialogRef<LogoutConfirmationComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}