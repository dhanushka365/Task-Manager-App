import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  // Custom validator for password confirmation
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const registerData = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.password
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Registration successful:', response);
          
          // Handle the new JSON response format
          let message = 'Account created successfully!';
          let username = registerData.username;
          
          if (response && response.message) {
            message = response.message;
          }
          if (response && response.username) {
            username = response.username;
          }
          
          this.successMessage = `${message} for "${username}"! Redirecting to login...`;
          
          // Auto-redirect after 3 seconds with countdown
          let countdown = 3;
          const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
              this.successMessage = `${message} for "${username}"! Redirecting to login in ${countdown} seconds...`;
            } else {
              clearInterval(interval);
              this.router.navigate(['/login'], { 
                queryParams: { username: username } 
              });
            }
          }, 1000);
        },
        error: (error) => {
          this.isLoading = false;
          console.log('Registration error:', error);
          
          // Handle structured validation errors from backend
          if (error.error && error.error.errors) {
            // Backend validation errors - structured response
            const validationErrors = error.error.errors;
            const errorMessages = [];
            
            if (validationErrors.username) {
              errorMessages.push(`Username: ${validationErrors.username}`);
            }
            if (validationErrors.password) {
              errorMessages.push(`Password: ${validationErrors.password}`);
            }
            
            this.errorMessage = errorMessages.length > 0 
              ? errorMessages.join('. ') 
              : 'Validation failed. Please check your input.';
          } else {
            // Simple error message from backend
            const errorMsg = error.error || error.message || 'Registration failed. Please try again.';
            
            if (typeof errorMsg === 'string') {
              if (errorMsg.toLowerCase().includes('username already exists') || 
                  errorMsg.toLowerCase().includes('already exists')) {
                this.errorMessage = `Username "${registerData.username}" is already taken. Please choose a different username.`;
              } else {
                this.errorMessage = errorMsg;
              }
            } else {
              this.errorMessage = 'Registration failed. Please try again.';
            }
          }
        }
      });
    } else {
      this.markFormGroupTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getter methods for easy access to form controls
  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  // Check if field has error and is touched
  hasError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Get specific error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
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
      if (field.errors['pattern']) {
        if (fieldName === 'username') {
          return 'Username can only contain letters, numbers, and underscores';
        }
        if (fieldName === 'password') {
          return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
      }
      if (field.errors['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }
    return '';
  }
}