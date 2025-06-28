import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonalInfo, Skill, Experience, Project, Education } from './interfaces';
import { RESUME_PATH } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private resumePath = RESUME_PATH;

  constructor(private http: HttpClient) {}

  // ========================================
  // UPDATE YOUR PERSONAL INFORMATION HERE
  // ========================================
  getPersonalInfo(): Observable<PersonalInfo> {
    return of({
      name: 'Rohit Agarwal', // ✅ UPDATE: Your full name
      title: 'Software Developer', // ✅ UPDATE: Your job title
      email: 'rohitagarwal516@gmail.com', // ✅ UPDATE: Your real email
      phone: '+91 8118807991', // ✅ UPDATE: Your real phone number
      location: 'Jaipur, Rajasthan, India', // ✅ UPDATE: Your city, state, country
      linkedin: 'http://linkedin.com/in/rohit-agarwal-a92795188', // ✅ UPDATE: Your LinkedIn profile
      github: 'https://github.com/rohit-agarwal-ITT' // ✅ UPDATE: Your GitHub profile
    });
  }

  // ========================================
  // UPDATE YOUR SKILLS HERE
  // ========================================
  getSkills(): Observable<Skill[]> {
    const skills = [
      // Frontend Skills
      { name: 'Angular', level: 90, category: 'Frontend' },
      { name: 'TypeScript', level: 85, category: 'Frontend' },
      { name: 'JavaScript', level: 90, category: 'Frontend' },
      { name: 'HTML/CSS', level: 95, category: 'Frontend' },
      { name: 'React', level: 80, category: 'Frontend' },
      
      // Backend Skills
      { name: 'Node.js', level: 75, category: 'Backend' },
      { name: 'Python', level: 70, category: 'Backend' },
      { name: 'Java', level: 65, category: 'Backend' },
      
      // Database Skills
      { name: 'SQL', level: 80, category: 'Database' },
      { name: 'MongoDB', level: 75, category: 'Database' },
      { name: 'PostgreSQL', level: 70, category: 'Database' },
      
      // Tools & DevOps
      { name: 'Git', level: 85, category: 'Tools' },
      { name: 'Docker', level: 60, category: 'DevOps' },
      { name: 'AWS', level: 55, category: 'Cloud' }
      
      // ✅ ADD MORE SKILLS: Copy the format above and add your skills
      // Example: { name: 'Your Skill', level: 85, category: 'Category' }
    ];
    
    return of(skills);
  }

  // ========================================
  // UPDATE YOUR WORK EXPERIENCE HERE
  // ========================================
  getExperience(): Observable<Experience[]> {
    const experiences = [
      {
        company: 'Tech Company Inc.', // ✅ UPDATE: Your company name
        position: 'Senior Software Developer', // ✅ UPDATE: Your job title
        duration: '2022 - Present', // ✅ UPDATE: Your employment period
        description: [
          'Led development of enterprise web applications using Angular and TypeScript', // ✅ UPDATE: Your achievements
          'Mentored junior developers and conducted code reviews',
          'Implemented CI/CD pipelines and automated testing',
          'Collaborated with cross-functional teams to deliver high-quality software'
        ],
        technologies: ['Angular', 'TypeScript', 'Node.js', 'Docker', 'AWS'] // ✅ UPDATE: Technologies used
      },
      {
        company: 'Startup XYZ', // ✅ UPDATE: Your previous company
        position: 'Full Stack Developer', // ✅ UPDATE: Your previous job title
        duration: '2020 - 2022', // ✅ UPDATE: Your employment period
        description: [
          'Developed and maintained multiple web applications', // ✅ UPDATE: Your achievements
          'Optimized application performance and user experience',
          'Integrated third-party APIs and payment systems',
          'Participated in agile development processes'
        ],
        technologies: ['React', 'JavaScript', 'Python', 'PostgreSQL', 'Redis'] // ✅ UPDATE: Technologies used
      }
      // ✅ ADD MORE EXPERIENCE: Copy the format above and add your work history
    ];
    
    return of(experiences);
  }

  // ========================================
  // UPDATE YOUR PROJECTS HERE
  // ========================================
  getProjects(): Observable<Project[]> {
    const projects = [
      {
        name: 'E-Commerce Platform', // ✅ UPDATE: Your project name
        description: 'A full-stack e-commerce platform with user authentication, product management, and payment integration.', // ✅ UPDATE: Project description
        technologies: ['Angular', 'Node.js', 'MongoDB', 'Stripe'], // ✅ UPDATE: Technologies used
        github: 'https://github.com/rohit-agarwal/ecommerce', // ✅ UPDATE: Your GitHub repo link
        live: 'https://ecommerce-demo.com' // ✅ UPDATE: Your live demo link
      },
      {
        name: 'Task Management App', // ✅ UPDATE: Your project name
        description: 'A collaborative task management application with real-time updates and team collaboration features.', // ✅ UPDATE: Project description
        technologies: ['React', 'Firebase', 'Material-UI'], // ✅ UPDATE: Technologies used
        github: 'https://github.com/rohit-agarwal/task-manager', // ✅ UPDATE: Your GitHub repo link
        live: 'https://task-manager-demo.com' // ✅ UPDATE: Your live demo link
      },
      {
        name: 'Weather Dashboard', // ✅ UPDATE: Your project name
        description: 'A weather dashboard that displays current weather and forecasts using multiple weather APIs.', // ✅ UPDATE: Project description
        technologies: ['Angular', 'TypeScript', 'OpenWeather API'], // ✅ UPDATE: Technologies used
        github: 'https://github.com/rohit-agarwal/weather-dashboard', // ✅ UPDATE: Your GitHub repo link
        live: 'https://weather-dashboard-demo.com' // ✅ UPDATE: Your live demo link
      }
      // ✅ ADD MORE PROJECTS: Copy the format above and add your projects
    ];
    
    return of(projects);
  }

  // ========================================
  // UPDATE YOUR EDUCATION HERE
  // ========================================
  getEducation(): Observable<Education[]> {
    const education = [
      {
        degree: 'Bachelor of Science in Computer Science', // ✅ UPDATE: Your degree
        institution: 'University of Technology', // ✅ UPDATE: Your university/college
        year: '2018', // ✅ UPDATE: Your graduation year
        gpa: '3.8/4.0' // ✅ UPDATE: Your GPA (optional)
      },
      {
        degree: 'Associate Degree in Information Technology', // ✅ UPDATE: Your degree
        institution: 'Community College', // ✅ UPDATE: Your college
        year: '2016', // ✅ UPDATE: Your graduation year
        gpa: '3.9/4.0' // ✅ UPDATE: Your GPA (optional)
      }
      // ✅ ADD MORE EDUCATION: Copy the format above and add your education
    ];
    
    return of(education);
  }

  // Method to get resume download URL
  getResumeUrl(): string {
    return this.resumePath;
  }
} 