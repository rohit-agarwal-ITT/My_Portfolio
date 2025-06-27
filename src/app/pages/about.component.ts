import { Component, OnInit } from '@angular/core';
import { ResumeService, PersonalInfo } from '../services/resume.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  personalInfo: PersonalInfo | null = null;
  resumeUrl: string = '';

  constructor(private resumeService: ResumeService) {}

  ngOnInit(): void {
    this.loadPersonalInfo();
    this.resumeUrl = this.resumeService.getResumeUrl();
  }

  loadPersonalInfo(): void {
    this.resumeService.getPersonalInfo().subscribe(
      (info) => {
        this.personalInfo = info;
      },
      (error) => {
        console.error('Error loading personal info:', error);
      }
    );
  }

  downloadResume(): void {
    const link = document.createElement('a');
    link.href = this.resumeUrl;
    link.download = 'Rohit_Agarwal_Resume.pdf';
    link.click();
  }
} 