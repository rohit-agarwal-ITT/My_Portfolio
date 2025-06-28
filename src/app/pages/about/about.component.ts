import { Component, OnInit } from '@angular/core';
import { PersonalInfo } from 'src/app/services/interfaces';
import { ResumeService } from 'src/app/services/resume.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  personalInfo: PersonalInfo | null = null;
  resumeUrl: string = '';
  isDownloading: boolean = false;

  constructor(
    private resumeService: ResumeService,
    private configService: ConfigService
  ) {}

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
      const config = this.configService.getCurrentConfig();
      const resumePath = config?.portfolio?.resumePath || 'assets/Rohit_Agarwal_ITT_Resume.pdf';
      const fileName = resumePath.split('/').pop() || 'Resume.pdf';
      
      const link = document.createElement('a');
      link.href = this.resumeUrl;
      link.download = fileName;
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