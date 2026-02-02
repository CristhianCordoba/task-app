# TASKS Frontend - Angular

## Descripción
Interfaz de usuario moderna y reactiva construida con Angular (Standalone Components). Esta aplicación gestiona tareas en tiempo real mediante una arquitectura desacoplada, garantizando seguridad mediante JWT y una experiencia de usuario optimizada con animaciones y feedback constante.

## Tecnologías Principales
Angular 18+ (Standalone API)
RxJS para manejo de flujos asíncronos.
Jasmine & Karma para pruebas unitarias.

## ¿Por qué estas tecnologías? (Ventajas)
# Hemos seleccionado este stack tecnológico para garantizar un producto de nivel profesional, priorizando la mantenibilidad y la velocidad:
    Angular 18+ (Standalone Components):
        Modularidad sin fricción: Al eliminar los NgModules, el código es más ligero y fácil de leer.
        Rendimiento: El uso de componentes independientes permite una carga más rápida y una mejor optimización del bundle.

    TypeScript:
        Seguridad: Detección de errores en tiempo de compilación (como los que el CI/CD detectó anteriormente), evitando fallos en producción.
        Autocompletado: Mejora la velocidad de desarrollo gracias al tipado fuerte.

    Jasmine & Karma:
        Confianza: Garantizamos que cada funcionalidad (como el guard de autenticación o el servicio de tareas) funcione correctamente antes de subir cambios.
        Regresión: Evita que al añadir una función nueva, rompamos algo que ya funcionaba.

    CI/CD con GitHub Actions & Render:
        Despliegue Sin Estrés: Automatizamos el proceso de prueba y subida. Si el código no es perfecto, no se publica. Esto garantiza que la versión en vivo sea siempre estable.

## Arquitectura
# El proyecto sigue una estructura limpia para facilitar el mantenimiento:
    core/: Singletons como el AuthService, interceptores de JWT y guardianes de ruta.
    features/: Componentes de página (Login, Dashboard) con carga perezosa (Lazy Loading).
    shared/: Interfaces de TypeScript, pipes personalizados y componentes UI reutilizables.
    environments/: Gestión de variables según el ciclo de vida (Dev/Prod).

## Configuración de Variables de Entorno
# Para que el Frontend pueda comunicarse con el Backend, es necesario configurar las URLs del API. El proyecto utiliza dos archivos de configuración según el entorno:
    Desarrollo (Local) : Edita el archivo src/environments/environment.ts:
        export const environment = {
            production: false,
            apiUrl: 'http://localhost:3000' // URL de tu backend local
        };
    
    Producción (Render) : Edita el archivo src/environments/environment.prod.ts:
        export const environment = {
            production: true,
            apiUrl: 'https://tu-backend-en-render.onrender.com/api' // URL del backend desplegado
        };

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