import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { TASKS_ROUTES } from './features/tasks/tasks.routes';

/**
 * Configuración de Rutas Principal
 * Aquí definimos qué componentes se muestran según la URL.
 */
export const routes: Routes = [
  {
    path: 'login',
    // Carga directa del componente de Login
    loadComponent: () => LoginComponent
  },
  {
    path: 'tasks',
    /**
     * Seguridad (Guard): Solo permite el acceso si authGuard devuelve 'true'.
     * Si no hay token, el Guard redirigirá automáticamente a /login.
     */
    canActivate: [authGuard],
    /**
     * Lazy Loading: No carga el módulo de tareas hasta que el usuario entra en /tasks.
     * Esto optimiza el tamaño del bundle inicial.
     */
    loadChildren: () => TASKS_ROUTES
  },
  {
    /**
     * Ruta por defecto: Si el usuario entra a la raíz '/', 
     * lo enviamos a 'tasks'. Si no está logueado, el Guard lo rebotará a 'login'.
     */
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    /**
     * Wildcard (404): Cualquier ruta no definida redirige a 'tasks'.
     * Evita que el usuario vea una pantalla en blanco.
     */
    path: '**',
    redirectTo: 'tasks'
  }
];