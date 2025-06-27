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
  isDownloading: boolean = false;

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
    if (this.isDownloading) return;
    
    this.isDownloading = true;
    
    try {
      const link = document.createElement('a');
      link.href = this.resumeUrl;
      link.download = 'Rohit_Agarwal_Resume.pdf';
      link.target = '_blank';
      
      // Add link to DOM temporarily
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        this.isDownloading = false;
      }, 100);
      
    } catch (error) {
      console.error('Error downloading resume:', error);
      this.isDownloading = false;
      
      // Fallback: open in new tab
      window.open(this.resumeUrl, '_blank');
    }
  }
} 