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
          console.log('Response type:', typeof response);
          console.log('Response keys:', response ? Object.keys(response) : 'null');
          
          // Handle the new JSON response format
          let message = 'Account created successfully!';
          let username = registerData.username;
          
          // Check if response is valid and has expected properties
          if (response && typeof response === 'object') {
            if (response.message && typeof response.message === 'string') {
              message = response.message;
            }
            if (response.username && typeof response.username === 'string') {
              username = response.username;
            }
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
          console.log('Error status:', error.status);
          console.log('Error error:', error.error);
          console.log('Full error object:', JSON.stringify(error, null, 2));
          
          // Handle errors directly here
          let errorMsg = 'Registration failed. Please try again.';
          
          // Check if it's an HTTP error response
          if (error.status !== undefined) {
            switch (error.status) {
              case 400:
                if (error.error) {
                  if (typeof error.error === 'string') {
                    if (error.error.toLowerCase().includes('username already exists')) {
                      errorMsg = `Username "${registerData.username}" is already taken. Please choose a different username.`;
                    } else {
                      errorMsg = error.error.replace('Error: ', '');
                    }
                  } else if (error.error.message) {
                    errorMsg = error.error.message;
                  } else if (Array.isArray(error.error) && error.error.length > 0) {
                    // Handle array response like ["Error: Username already exists"]
                    errorMsg = error.error[0].replace('Error: ', '');
                    if (errorMsg.toLowerCase().includes('username already exists')) {
                      errorMsg = `Username "${registerData.username}" is already taken. Please choose a different username.`;
                    }
                  } else {
                    errorMsg = 'Invalid request. Please check your input.';
                  }
                } else {
                  errorMsg = 'Invalid request. Please check your input.';
                }
                break;
              case 500:
                errorMsg = 'Internal server error. Please try again later.';
                break;
              default:
                if (error.error) {
                  if (typeof error.error === 'string') {
                    errorMsg = error.error;
                  } else if (error.error.message) {
                    errorMsg = error.error.message;
                  } else if (Array.isArray(error.error) && error.error.length > 0) {
                    errorMsg = error.error[0];
                  } else {
                    errorMsg = `Request failed with status ${error.status}`;
                  }
                } else if (error.message) {
                  errorMsg = error.message;
                } else {
                  errorMsg = `Request failed with status ${error.status}`;
                }
            }
          } else if (error.message) {
            errorMsg = error.message;
          } else if (typeof error === 'string') {
            errorMsg = error;
          } else {
            // If it's still an object, convert to string for debugging
            errorMsg = `Unexpected error occurred. Please try again.`;
          }
          
          this.errorMessage = errorMsg;
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