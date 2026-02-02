import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <mat-toolbar class="navbar mat-elevation-z4">
      <div class="brand">
        <mat-icon>description</mat-icon>
        <span class="brand-text">TASKS</span>
      </div>

      <div class="search-container">
        <mat-icon>search</mat-icon>
        <input type="text" placeholder="Buscar notas..." (input)="onSearchChange($event)">
      </div>

      <span class="spacer"></span>
      
      <div class="user-section" *ngIf="email">
        <div class="user-chip">
          <mat-icon>person</mat-icon>
          <span class="user-email">{{ email }}</span>
        </div>

        <button mat-flat-button color="warn" class="logout-btn" (click)="logout.emit()" matTooltip="Cerrar Sesión">
          <mat-icon>logout</mat-icon>
          <span class="btn-text">Salir</span>
        </button>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar { 
      background: #0d47a1 !important; 
      color: #ffffff; 
      gap: 15px; 
      height: 70px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15) !important;
      padding: 0 16px;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      box-sizing: border-box;
      display: flex;
      align-items: center;
    }

    .brand { 
      display: flex; 
      align-items: center; 
      gap: 10px; 
      font-weight: 700; 
      font-size: 1.4rem; 
      color: #4fc3f7; 
      text-transform: uppercase;
      flex-shrink: 0;
    }

    .spacer { flex: 1; }

    .search-container { 
      background: rgba(255, 255, 255, 0.15); 
      border-radius: 12px; 
      padding: 0 15px; 
      display: flex; 
      align-items: center; 
      flex: 0 1 420px;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .search-container:focus-within {
      background: rgba(255, 255, 255, 0.25);
      border-color: #4fc3f7;
    }

    input { 
      border: none; 
      background: transparent; 
      color: #ffffff; 
      outline: none; 
      width: 100%; 
      padding: 10px; 
      font-size: 0.95rem;
    }

    .user-section { 
      display: flex; 
      align-items: center; 
      gap: 10px; 
      flex-shrink: 0;
    }

    .user-chip { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      background: rgba(0, 0, 0, 0.2); 
      padding: 8px 12px; 
      border-radius: 10px; 
      font-size: 13px;
    }

    .logout-btn {
      border-radius: 10px;
      min-width: 40px;
      padding: 0 12px;
    }

    @media (max-width: 800px) {
      .search-container { display: none; }
    }

    @media (max-width: 600px) {
      .navbar { height: 60px; padding: 0 12px; }
      .brand-text, .user-email, .btn-text { display: none; }
      .brand { font-size: 1.1rem; }
      .user-chip { padding: 8px; background: transparent; }
      .logout-btn { 
        padding: 0; 
        min-width: 40px !important; 
        width: 40px; 
        height: 40px; 
        border-radius: 50%; 
      }
    }
  `]
})
export class NavbarComponent {
  @Input() email: string | null = '';
  @Output() logout = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  onSearchChange(event: any) {
    this.search.emit(event.target.value);
  }
}