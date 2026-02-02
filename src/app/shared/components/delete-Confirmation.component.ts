import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="confirm-container">
      <h2 mat-dialog-title>¿Eliminar tarea?</h2>
      
      <mat-dialog-content>
        <p>Esta acción no se puede deshacer. La nota se borrará permanentemente.</p>
      </mat-dialog-content>
      
      <mat-dialog-actions align="center">
        <button mat-button class="btn-cancel" (click)="onNoClick()">
          Cancelar
        </button>
        <button mat-flat-button class="btn-delete" [mat-dialog-close]="true">
          Eliminar ahora
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-container { padding: 15px 10px; text-align: center; }
    h2 { font-weight: 700; color: #333; font-size: 1.6rem; margin: 0 0 10px 0 !important; }
    mat-dialog-content { color: #666; font-size: 1rem; line-height: 1.5; margin-bottom: 25px; }
    mat-dialog-actions { display: flex; justify-content: center; gap: 12px; }
    
    .btn-cancel { border-radius: 25px; font-weight: 500; color: #777; padding: 0 20px; }
    
    .btn-delete { 
      background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%) !important;
      color: white !important;
      border-radius: 25px;
      padding: 0 30px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
      transition: all 0.2s ease-in-out;
    }

    .btn-delete:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 15px rgba(211, 47, 47, 0.5);
    }
  `]
})
export class DeleteConfirmationComponent {
  constructor(public dialogRef: MatDialogRef<DeleteConfirmationComponent>) {}
  onNoClick(): void { this.dialogRef.close(); }
}