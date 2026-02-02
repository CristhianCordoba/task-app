# TASKS Frontend - Angular

## Descripción
Interfaz de usuario moderna y reactiva construida con **Angular** standalone. Esta aplicación se comunica con el Backend para gestionar tareas en tiempo real, ofreciendo una experiencia de usuario fluida y segura.

## Estructura del Proyecto
Basado en una arquitectura modular para escalabilidad:

- **src/app/core**: Servicios globales (Auth), interceptores y guards de seguridad.
- **src/app/features**: Módulos funcionales (Login, Registro, Dashboard de Tareas).
- **src/app/shared**: Modelos de datos y componentes reutilizables.
- **src/environments**: Configuración de URLs para desarrollo y producción.


## Pipeline de CI/CD (Frontend)
El despliegue está automatizado con el siguiente flujo de calidad:

1. **Trigger:** Se activa automáticamente al hacer `push` a la rama `main`.
2. **Linting:** Se revisa que el código siga las reglas de estilo de Angular.
3. **Validación (Testing):** Se ejecutan los tests unitarios. El despliegue se detiene si hay fallos.
4. **Optimización (Build):** Se ejecuta `ng build --configuration production` para generar archivos estáticos ligeros.
5. **Deployment:** Se sirven los archivos a través de un servidor de contenido estático en **Render**.


## Configuración de Entornos
Asegúrate de configurar la URL del API en los archivos de entorno:

**src/environments/environment.prod.ts**:
export const environment = {
  production: true,
  apiUrl: 'tu Api'
};

## Comandos del Proyecto
# Instalación
    npm install

# Desarrollo (Local)
    npm start

# Ejecución de Tests
    npm test

# Compilación para Producción
    npm run build