import { Component, OnInit } from '@angular/core';
import { ResumeService, Project } from '../services/resume.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = true;

  constructor(private resumeService: ResumeService) {}

  ngOnInit(): void {
    this.loadProjects();
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
} 