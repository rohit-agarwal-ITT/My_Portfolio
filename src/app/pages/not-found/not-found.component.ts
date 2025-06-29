import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="not-found-container">
      <h1 *ngIf="!message">404</h1>
      <h1 *ngIf="message">Access Denied</h1>
      <p>{{ message || 'Page Not Found' }}</p>
      <a routerLink="/about" class="back-link">Go to Home</a>
    </div>
  `,
  styles: [`
    .not-found-container {
      text-align: center;
      padding: 4rem 1rem;
      color: #a259ff;
    }
    .not-found-container h1 {
      font-size: 5rem;
      margin-bottom: 1rem;
      font-weight: 900;
    }
    .not-found-container p {
      font-size: 1.5rem;
      margin-bottom: 2rem;
    }
    .back-link {
      color: #fff;
      background: linear-gradient(90deg, #e0c3fc 0%, #fcb7e7 100%);
      padding: 0.7rem 2rem;
      border-radius: 2rem;
      text-decoration: none;
      font-weight: 700;
      font-size: 1.1rem;
      box-shadow: 0 2px 8px rgba(140, 82, 255, 0.13);
      transition: background 0.2s, color 0.2s;
    }
    .back-link:hover {
      background: #a259ff;
      color: #fff;
    }
  `]
})
export class NotFoundComponent {
  @Input() message?: string;
} 