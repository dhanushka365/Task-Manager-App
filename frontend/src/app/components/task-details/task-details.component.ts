import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDto } from '../../services/task.service';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent {
  @Input() task: TaskDto | null = null;
  @Input() isVisible = false;
  @Output() editTask = new EventEmitter<TaskDto>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() closeDetails = new EventEmitter<void>();

  onEdit(): void {
    if (this.task) {
      this.editTask.emit(this.task);
    }
  }

  onDelete(): void {
    if (this.task) {
      this.deleteTask.emit(this.task.id!);
    }
  }

  onClose(): void {
    this.closeDetails.emit();
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

  formatDate(dateString: string | Date | undefined): string {
    if (!dateString) return 'Not set';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  }
}