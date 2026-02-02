import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor de Autenticación
 * Se encarga de adjuntar el token JWT a todas las peticiones salientes
 * y de manejar errores globales de autorización.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // 1. Recuperamos el token almacenado (normalmente en el LocalStorage)
  const token = authService.getToken();

  let request = req;

  /**
   * 2. Inyección del Token:
   * Si existe un token, clonamos la petición y añadimos el Header 'Authorization'.
   * Usamos el formato 'Bearer <token>' que espera nuestro Backend en Node.js.
   */
  if (token) {
    request = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  /**
   * 3. Manejo de Respuesta y Errores (Pipeline):
   * Enviamos la petición y nos quedamos a la escucha de posibles errores.
   */
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      /**
       * 4. Gestión de Sesión Expirada (401/403):
       * Si el Backend responde que el token no es válido o expiró,
       * limpiamos el estado local y enviamos al usuario al Login.
       */
      if (error.status === 401 || error.status === 403) {
        console.warn('Sesión inválida o expirada. Redirigiendo al login...');
        
        authService.logout(); // Limpia el LocalStorage/Estado
        router.navigate(['/login']); // Redirección forzada por seguridad
      }
      
      // Propagamos el error para que el componente que hizo la llamada pueda manejarlo si es necesario
      return throwError(() => error);
    })
  );
};