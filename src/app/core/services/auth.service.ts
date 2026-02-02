import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** * La URL se construye dinámicamente usando el archivo de environment.
   * En producción (Render), usará la URL del backend real.
   */
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  /**
   * Envía la solicitud de registro al servidor.
   * @param email Correo del nuevo usuario.
   */
  register(email: string) {
    return this.http.post<any>(`${this.apiUrl}/register`, { email });
  }

  /**
   * Autentica al usuario y retorna el JWT generado por el backend.
   */
  login(email: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email });
  }

  /**
   * Persistencia de sesión:
   * Guarda el token y el email en el almacenamiento local del navegador.
   * Esto permite que la sesión persista aunque se recargue la página.
   */
  saveToken(token: string, userEmail: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', userEmail);
  }

  /**
   * Recupera el token para que el Interceptor lo adjunte a las peticiones.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Cierre de sesión:
   * Limpia toda la información del usuario del navegador.
   */
  logout() {
    localStorage.clear();
  }

  /**
   * Helper para verificar si el usuario tiene una sesión activa.
   * El operador '!!' convierte el valor (string o null) a un booleano real.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}