import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de Autenticación (Funcional)
 * Se encarga de proteger las rutas de la aplicación verificando la existencia de una sesión activa.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  /**
   * Verificación de sesión:
   * Si el método isLoggedIn() del servicio retorna false (no hay token),
   * se redirige al usuario a la página de login y se deniega el acceso.
   */
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false; // Bloquea la navegación
  }

  // Si hay token, permite el acceso a la ruta solicitada
  return true;
};