import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmRegisterComponent } from './../confirm-register/confirm-register.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatDialogModule,
        ConfirmRegisterComponent
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [
        trigger('fadeInCard', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(-20px)' }),
                animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ]),
        trigger('fadeInButton', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('500ms 300ms ease-in', style({ opacity: 1 }))
            ])
        ]),
        trigger('fadeInText', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateX(-30px)' }),
                animate('800ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
            ])
        ])
    ]
})
export class LoginComponent implements OnInit {
    loading = false;
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef
    ) {
        this.form = this.fb.group({
            email: ['', [
                Validators.required,
                Validators.email,
                Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
            ]]
        });
    }

    ngOnInit(): void {
        this.checkSession();
    }

    private checkSession() {
        const token = this.authService.getToken();
        if (token) {
            this.loading = true;
            this.router.navigate(['/tasks']).then(() => this.loading = false);
        }
    }

    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const email = this.form.value.email!.trim();
        this.loading = true;

        this.authService.login(email).subscribe({
            next: (res) => {
                if (res && res.token) {
                    this.completeSession(res.token, res.user.email, res.user.id);
                } else {
                    this.handleNewUser(email);
                }
            },
            error: (err) => {
                this.loading = false;
                if (err.status === 404) {
                    this.handleNewUser(email);
                }
            }
        });
    }

    private handleNewUser(email: string) {
        this.loading = false;
        const dialogRef = this.dialog.open(ConfirmRegisterComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;
                this.authService.register(email).subscribe({
                    next: (res) => {
                        if (res && res.token) {
                            this.completeSession(res.token, res.user.email, res.user.id);
                        }
                    },
                    error: () => this.loading = false
                });
            }
        });
    }

    private completeSession(token: string, email: string, userId: string) {
        this.authService.saveToken(token, email);
        this.router.navigate(['/tasks']);
        this.loading = false;
        this.cdr.detectChanges();
    }
}