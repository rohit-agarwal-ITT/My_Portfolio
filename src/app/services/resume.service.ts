import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PersonalInfo, Skill, Experience, Project, Education } from './interfaces';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  getPersonalInfo(): Observable<PersonalInfo> {
    return this.http.get<PersonalInfo>('assets/data/personal-info.json');
  }

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>('assets/data/skills.json');
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('assets/data/projects.json');
  }

  getEducation(): Observable<Education[]> {
    return this.http.get<Education[]>('assets/data/education.json');
  }

  getConfig(): Observable<any> {
    return this.http.get<any>('assets/data/config.json');
  }

  getResumeUrl(): string {
    const config = this.configService.getCurrentConfig();
    return config?.portfolio?.resumePath || 'assets/Rohit_Agarwal_ITT_Resume.pdf';
  }
} 