import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';

export interface PortfolioConfig {
  portfolio: {
    title: string;
    description: string;
    resumePath: string;
    profileImage: string;
    theme: {
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
    };
    social: {
      linkedin: string;
      github: string;
      twitter: string;
      email: string;
    };
    contact: {
      email: string;
      phone: string;
      location: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configSubject = new BehaviorSubject<PortfolioConfig | null>(null);
  public config$ = this.configSubject.asObservable();

  constructor(
    private http: HttpClient,
    private titleService: Title
  ) {
    this.loadConfig();
  }

  private loadConfig(): void {
    this.http.get<PortfolioConfig>('assets/data/config.json').subscribe({
      next: (config) => {
        this.configSubject.next(config);
        this.setPageTitle(config.portfolio.title);
      },
      error: (error) => {
        console.error('Error loading config:', error);
        // Set default title if config fails to load
        this.setPageTitle('Portfolio');
      }
    });
  }

  private setPageTitle(title: string): void {
    this.titleService.setTitle(title);
  }

  getConfig(): Observable<PortfolioConfig | null> {
    return this.config$;
  }

  getCurrentConfig(): PortfolioConfig | null {
    return this.configSubject.value;
  }
} 