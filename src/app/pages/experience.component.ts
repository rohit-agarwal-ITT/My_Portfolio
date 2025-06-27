import { Component, OnInit } from '@angular/core';
import { ResumeService, Experience } from '../services/resume.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  experiences: Experience[] = [];
  loading = true;

  constructor(private resumeService: ResumeService) {}

  ngOnInit(): void {
    this.loadExperience();
  }

  loadExperience(): void {
    this.resumeService.getExperience().subscribe(
      (experiences) => {
        this.experiences = experiences;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading experience:', error);
        this.loading = false;
      }
    );
  }
} 