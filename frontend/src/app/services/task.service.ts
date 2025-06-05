import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Task {
  id?: string;
  title: string;
  description?: string;
  status: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskDto {
  id?: string;
  title: string;
  description?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8081/api/tasks';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get all tasks for the authenticated user
   */
  getAllTasks(): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get task by ID
   */
  getTaskById(id: string): Observable<TaskDto> {
    return this.http.get<TaskDto>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create a new task
   */
  createTask(task: Partial<TaskDto>): Observable<TaskDto> {
    const taskData = {
      title: task.title,
      description: task.description || '',
      status: task.status || 'TO_DO'
    };
    
    return this.http.post<TaskDto>(this.apiUrl, taskData, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }
  /**
   * Update an existing task
   */
  updateTask(id: string, task: Partial<TaskDto>): Observable<TaskDto> {
    const taskData = {
      title: task.title,
      description: task.description || '',
      status: task.status || 'TO_DO'
    };
    
    return this.http.put<TaskDto>(`${this.apiUrl}/${id}`, taskData, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete a task
   */
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: string): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.apiUrl}/status/${status}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Unauthorized. Please login again.';
          break;
        case 403:
          errorMessage = 'Access denied';
          break;
        case 404:
          errorMessage = 'Task not found';
          break;
        case 500:
          errorMessage = 'Internal server error';
          break;
        default:
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else {
            errorMessage = `Error: ${error.status} - ${error.statusText}`;
          }
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}