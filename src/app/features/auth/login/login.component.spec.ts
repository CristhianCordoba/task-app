import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Para manejar las animaciones en pruebas

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, 
        ReactiveFormsModule, 
        NoopAnimationsModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('el formulario debe ser inválido si el email no es correcto', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('correo-invalido');
    expect(component.form.invalid).toBe(true);
  });

  it('el formulario debe ser válido con un email correcto', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('test@example.com');
    expect(component.form.valid).toBe(true);
  });
});