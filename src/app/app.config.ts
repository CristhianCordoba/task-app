import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

/**
 * appConfig: Configuración Global de la Aplicación
 * Aquí definimos los "Providers", que son los servicios y herramientas 
 * disponibles para toda la app desde el momento en que arranca.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * 1. Configuración de Rutas:
     * Registra el árbol de navegación definido en 'app.routes.ts'.
     */
    provideRouter(routes),

    /**
     * 2. Configuración del Cliente HTTP:
     * Habilitamos el cliente para hacer peticiones al Backend.
     * * 'withInterceptors': Registramos nuestro 'authInterceptor' para que 
     * actúe como un peaje, añadiendo el token JWT a cada petición saliente.
     */
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};