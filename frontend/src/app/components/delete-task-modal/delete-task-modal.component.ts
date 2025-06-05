import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDto } from '../../services/task.service';

@Component({
  selector: 'app-delete-task-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-task-modal.component.html',
  styleUrls: ['./delete-task-modal.component.css']
})
export class DeleteTaskModalComponent {
  @Input() isVisible = false;
  @Input() task: TaskDto | null = null;
  @Input() isDeleting = false;
  
  @Output() delete = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    if (!this.isDeleting) {
      this.close.emit();
    }
  }

  onDelete(): void {
    if (!this.isDeleting) {
      this.delete.emit();
    }
  }

  formatDate(dateString: string | Date | undefined): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  }
}
