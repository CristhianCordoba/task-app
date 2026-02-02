/**
 * Interface Task
 * Define la estructura de datos para las notas/tareas en toda la aplicación.
 * Asegura la consistencia entre la API de Node.js y la interfaz de Angular.
 */
export interface Task {
  // Identificador único generado usualmente por la base de datos (MongoDB/Firestore)
  id: string;

  // Referencia al ID del usuario propietario para filtrar tareas privadas
  userId: string;

  // Título de la nota
  title: string;

  // Código hexadecimal del color de fondo de la nota (ej: '#fff9c4')
  color: string;

  // Contenido de la nota (soporta strings con formato HTML del editor enriquecido)
  description: string;

  // Estado de la tarea (Pendiente/Completada)
  completed: boolean;

  // Fecha de creación para ordenamiento cronológico
  createdAt: Date;
}