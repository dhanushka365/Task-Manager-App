import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDto } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  @Input() tasks: TaskDto[] = [];
  @Input() isLoading = false;
  @Output() editTask = new EventEmitter<TaskDto>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() viewTask = new EventEmitter<TaskDto>();

  onEdit(task: TaskDto): void {
    this.editTask.emit(task);
  }

  onDelete(taskId: string): void {
    this.deleteTask.emit(taskId);
  }

  onView(task: TaskDto): void {
    this.viewTask.emit(task);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'TO_DO':
        return 'status-todo';
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'DONE':
        return 'status-done';
      default:
        return 'status-todo';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'TO_DO':
        return 'To Do';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'DONE':
        return 'Done';
      default:
        return status;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  trackByTaskId(index: number, task: TaskDto): string {
    return task.id || index.toString();
  }
}