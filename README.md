# TASKS Frontend - Angular

## Descripción
Interfaz de usuario moderna y reactiva construida con Angular (Standalone Components). Esta aplicación gestiona tareas en tiempo real mediante una arquitectura desacoplada, garantizando seguridad mediante JWT y una experiencia de usuario optimizada con animaciones y feedback constante.

## Tecnologías Principales
Angular 18+ (Standalone API)
RxJS para manejo de flujos asíncronos.
Jasmine & Karma para pruebas unitarias.

## Arquitectura
# El proyecto sigue una estructura limpia para facilitar el mantenimiento:
    core/: Singletons como el AuthService, interceptores de JWT y guardianes de ruta.
    features/: Componentes de página (Login, Dashboard) con carga perezosa (Lazy Loading).
    shared/: Interfaces de TypeScript, pipes personalizados y componentes UI reutilizables.
    environments/: Gestión de variables según el ciclo de vida (Dev/Prod).

## Calidad y Testing
# Hemos implementado una suite de pruebas para garantizar la estabilidad:
    Servicios: Pruebas de integración con HttpClientTestingModule para simular respuestas del API.
    Guards: Verificación de seguridad para rutas protegidas.
    Mocks: Uso de jasmine.SpyObj para aislar dependencias.

# Para ejecutar las pruebas localmente:
    npm test

## Pipeline de CI/CD
# Cada integración en la rama main pasa por un flujo automatizado de confianza:
    Instalación: Entorno limpio en Ubuntu con Node 20.
    Validación: Ejecución de pruebas en modo Headless.
    Compilación: Generación de bundle optimizado con AOT (Ahead-of-Time).
    Despliegue: Notificación vía Webhook a Render para actualización inmediata.

## Configuración de Entorno
# Crea o edita los archivos en src/environments/:
    // environment.prod.ts
    export const environment = {
    production: true,
    apiUrl: 'https://tu-api-en-render.com/api'
    };

## Comandos del Proyecto
Acción                  Comando
Instalar dependencias   npm install
Servidor de desarrollo  npm start
Correr tests            npm test
Build de producción     npm run build

## Notas de Despliegue en Render
# Para evitar errores 404 al recargar rutas profundas (ej. /dashboard), el sitio estático en Render cuenta con una regla de Rewrite:
    Source: /*
    Destination: /index.html