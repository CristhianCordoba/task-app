import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  it('debe guardar el token en el localStorage', () => {
    service.saveToken('test-token', 'user@test.com');
    expect(localStorage.getItem('token')).toBe('test-token');
    expect(localStorage.getItem('userEmail')).toBe('user@test.com');
  });

  it('isLoggedIn() debe retornar true si hay un token', () => {
    localStorage.setItem('token', 'test-token');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('logout() debe limpiar el localStorage', () => {
    localStorage.setItem('token', 'test-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });
});