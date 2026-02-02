import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../../../shared/models/task.model';
import { environment } from '../../../../environments/environment';

/**
 * TaskService
 * Se encarga de realizar las operaciones CRUD (Create, Read, Update, Delete)
 * comunicándose con la API REST configurada en los environments.
 */
@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación mediante Inyección de Dependencias
})
export class TaskService {

  // URL base dinámica que cambia según el entorno (Local vs Render)
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las tareas del usuario autenticado.
   * Gracias al Interceptor, no necesitas pasar el token aquí manualmente.
   */
  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  /**
   * Crea una nueva tarea.
   * @param task Objeto parcial de la tarea (normalmente sin ID y sin fecha)
   */
  create(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  /**
   * Actualiza una tarea existente.
   * @param id Identificador único de la tarea
   * @param task Campos a actualizar (puede ser solo el título, el color o el estado 'completed')
   */
  update(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  /**
   * Elimina una tarea de forma permanente.
   * @param id Identificador único de la tarea a borrar
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}