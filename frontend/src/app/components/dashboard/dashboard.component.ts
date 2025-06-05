import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskService, TaskDto } from '../../services/task.service';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { DeleteTaskModalComponent } from '../delete-task-modal/delete-task-modal.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TaskListComponent, 
    TaskFormComponent,
    TaskDetailsComponent,
    DeleteTaskModalComponent,
    NavbarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasks: TaskDto[] = [];
  filteredTasks: TaskDto[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  selectedTask: TaskDto | null = null;
  showTaskForm = false;
  showTaskDetails = false;
  showDeleteModal = false;
  taskForDetails: TaskDto | null = null;
  taskForDelete: TaskDto | null = null;
  isDeleting = false;
  currentFilter = 'ALL';
  currentUser = '';

  // Statistics
  totalTasks = 0;
  todoTasks = 0;
  inProgressTasks = 0;
  doneTasks = 0;

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser() || '';
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        console.log('Received tasks:', tasks);
        this.tasks = tasks;
        this.applyFilter(this.currentFilter);
        this.calculateStatistics();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to load tasks';
        if (error.message.includes('Unauthorized')) {
          this.authService.logout();
        }
      }
    });
  }
  applyFilter(filter: string): void {
    this.currentFilter = filter;
    
    switch (filter) {
      case 'TO_DO':
        this.filteredTasks = this.tasks.filter(task => task.status === 'TO_DO');
        break;
      case 'IN_PROGRESS':
        this.filteredTasks = this.tasks.filter(task => task.status === 'IN_PROGRESS');
        break;
      case 'DONE':
        this.filteredTasks = this.tasks.filter(task => task.status === 'DONE');
        break;
      default:
        this.filteredTasks = [...this.tasks];
    }
  }

  calculateStatistics(): void {
    this.totalTasks = this.tasks.length;
    this.todoTasks = this.tasks.filter(task => task.status === 'TO_DO').length;
    this.inProgressTasks = this.tasks.filter(task => task.status === 'IN_PROGRESS').length;
    this.doneTasks = this.tasks.filter(task => task.status === 'DONE').length;
  }

  onCreateTask(): void {
    this.selectedTask = null;
    this.showTaskForm = true;
  }

  onEditTask(task: TaskDto): void {
    this.selectedTask = task;
    this.showTaskForm = true;
    this.showTaskDetails = false;
  }

  onViewTask(task: TaskDto): void {
    this.taskForDetails = task;
    this.showTaskDetails = true;
    this.showTaskForm = false;
  }

  onDeleteTask(taskId: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      this.taskForDelete = task;
      this.showDeleteModal = true;
    }
  }

  onConfirmDelete(): void {
    if (this.taskForDelete && this.taskForDelete.id) {
      this.isDeleting = true;
      this.taskService.deleteTask(this.taskForDelete.id).subscribe({
        next: () => {
          this.successMessage = 'Task deleted successfully';
          this.loadTasks();
          this.closeDeleteModal();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to delete task';
          this.isDeleting = false;
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.taskForDelete = null;
    this.isDeleting = false;
  }

  onTaskFormSubmit(taskData: Partial<TaskDto>): void {
    if (this.selectedTask) {
      // Update existing task
      this.taskService.updateTask(this.selectedTask.id!, taskData).subscribe({
        next: () => {
          this.successMessage = 'Task updated successfully';
          this.loadTasks();
          this.closeTaskForm();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to update task';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    } else {
      // Create new task
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.successMessage = 'Task created successfully';
          this.loadTasks();
          this.closeTaskForm();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to create task';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  closeTaskForm(): void {
    this.showTaskForm = false;
    this.selectedTask = null;
  }

  closeTaskDetails(): void {
    this.showTaskDetails = false;
    this.taskForDetails = null;
  }

  onTaskDetailsEdit(task: TaskDto): void {
    this.selectedTask = task;
    this.showTaskForm = true;
    this.showTaskDetails = false;
  }

  onTaskDetailsDelete(taskId: string): void {
    this.showTaskDetails = false;
    this.taskForDetails = null;
    this.onDeleteTask(taskId);
  }

  onLogout(): void {
    this.authService.logout();
  }
}