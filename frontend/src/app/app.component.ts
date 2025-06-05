import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="app">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Task Manager';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Handle navigation based on authentication status
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      const currentRoute = this.router.url;
      
      if (!isAuthenticated && !currentRoute.includes('/login') && !currentRoute.includes('/register')) {
        this.router.navigate(['/login']);
      } else if (isAuthenticated && (currentRoute.includes('/login') || currentRoute.includes('/register'))) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}