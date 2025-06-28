import { Component, OnInit, HostListener } from '@angular/core';
import { Project } from 'src/app/services/interfaces';
import { ResumeService } from 'src/app/services/resume.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = true;
  flippedIndex: number | null = null;
  isMobile = false;

  constructor(private resumeService: ResumeService) {}

  ngOnInit(): void {
    this.loadProjects();
    this.checkMobile();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 900;
  }

  loadProjects(): void {
    this.resumeService.getProjects().subscribe(
      (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    );
  }

  onCardHover(index: number): void {
    if (!this.isMobile) {
      this.flippedIndex = index;
    }
  }

  onCardLeave(): void {
    if (!this.isMobile) {
      this.flippedIndex = null;
    }
  }

  onCardClick(index: number): void {
    if (this.isMobile) {
      this.flippedIndex = this.flippedIndex === index ? null : index;
    } else {
      // On desktop, allow click to flip as well
      this.flippedIndex = this.flippedIndex === index ? null : index;
    }
  }

  projectTagline(name: string): string {
    switch (name) {
      case 'Pharos': return 'Securing enterprise printing across vendors';
      case 'Air Products': return 'Enterprise front-end excellence';
      case 'Rise – IdahoSTARS': return 'Childcare management for Idaho government';
      case 'HP – Services Estimator': return 'Optimizing HP service workflows';
      default: return '';
    }
  }

  getInitials(name: string): string {
    // Special case for HP projects
    if (name.trim().toLowerCase().startsWith('hp')) {
      return 'HP';
    }
    return name
      .split(' ')
      .filter(w => w && w[0].match(/[A-Za-z]/))
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }
} 