import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskDto } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() task: TaskDto | null = null;
  @Input() isVisible = false;
  @Output() submitTask = new EventEmitter<Partial<TaskDto>>();
  @Output() closeForm = new EventEmitter<void>();

  taskForm: FormGroup;
  isEditMode = false;

  statusOptions = [
    { value: 'TO_DO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Done' }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.taskForm = this.createForm();
  }

  ngOnInit(): void {
    this.setupForm();
  }

  ngOnChanges(): void {
    this.setupForm();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.maxLength(500)
      ]],
      status: ['TO_DO', [Validators.required]]
    });
  }

  private setupForm(): void {
    if (this.task) {
      this.isEditMode = true;
      this.taskForm.patchValue({
        title: this.task.title || '',
        description: this.task.description || '',
        status: this.task.status || 'TO_DO'
      });
    } else {
      this.isEditMode = false;
      this.taskForm.reset({
        title: '',
        description: '',
        status: 'TO_DO'
      });
    }
  }
  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const taskData: Partial<TaskDto> = {
        title: formValue.title.trim(),
        description: formValue.description?.trim() || '',
        status: formValue.status
      };
      
      this.submitTask.emit(taskData);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.closeForm.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getter methods for easy access to form controls
  get title() {
    return this.taskForm.get('title');
  }

  get description() {
    return this.taskForm.get('description');
  }

  get status() {
    return this.taskForm.get('status');
  }

  // Check if field has error and is touched
  hasError(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Get specific error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  // Get character count for description
  getDescriptionCharCount(): number {
    return this.description?.value?.length || 0;
  }
}