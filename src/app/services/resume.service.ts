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

  getPersonalInfo(): Observable<PersonalInfo> {
    return of({
      name: 'Rohit Agarwal',
      title: 'Software Developer',
      email: 'rohitagarwal516@gmail.com',
      phone: '+91 8118807991',
      location: 'Jaipur, Rajasthan, India',
      linkedin: 'http://linkedin.com/in/rohit-agarwal-a92795188',
      github: 'https://github.com/rohit-agarwal-ITT'
    });
  }

  getSkills(): Observable<Skill[]> {
    const skills = [
      { 
        name: 'Angular', 
        level: 90, 
        category: 'Frontend',
        description: 'Modern web framework for building scalable single-page applications with TypeScript.',
        experience: '4+ years of professional experience building enterprise applications',
        projects: ['HP Services Estimator', 'AEYC-Idaho Government Project', 'Air Poroducts'],
        certifications: ['Angular Developer Certification from Edureka'],
        icon: '⚡'
      },
      { 
        name: 'React', 
        level: 70, 
        category: 'Frontend',
        description: 'JavaScript library for building user interfaces with component-based architecture.',
        experience: '3+ years developing interactive web applications',
        projects: ['Tic Tac Toe Game', 'Advance Calculator'],
        icon: '⚛️'
      },
      { 
        name: 'Vue', 
        level: 70, 
        category: 'Frontend',
        description: 'Progressive JavaScript framework for building user interfaces.',
        experience: '1+ year of experience with Vue 3 and Composition API',
        projects: ['To Do List'],
        icon: '💚'
      },
      { 
        name: 'JavaScript', 
        level: 80, 
        category: 'Frontend',
        description: 'Core programming language for web development with ES6+ features.',
        experience: '4+ years of professional JavaScript development',
        projects: ['Multiple Web Applications', 'API Integrations', 'Browser Extensions'],
        certifications: ['JavaScript Algorithms and Data Structures'],
        icon: '🟨'
      },
      { 
        name: 'TypeScript', 
        level: 80, 
        category: 'Frontend',
        description: 'Typed superset of JavaScript that enhances code quality and developer experience.',
        experience: '3+ years using TypeScript in production applications',
        projects: ['Angular Applications'],
        icon: '🔷'
      },

      { 
        name: 'C#', 
        level: 70, 
        category: 'Backend',
        description: 'Object-oriented programming language for .NET framework development.',
        experience: '4+ years developing .NET applications',
        projects: ['Web APIs', 'Desktop Applications', 'Microservices'],
        icon: '🟪'
      },

      { 
        name: 'Jenkins', 
        level: 70, 
        category: 'CI/CD',
        description: 'Open-source automation server for building, testing, and deploying software.',
        experience: '1+ years setting up and maintaining CI/CD pipelines',
        projects: ['Automated Testing Pipelines'],
        icon: '🔴'
      },
     
      { 
        name: 'GitHub', 
        level: 85, 
        category: 'Version Control',
        description: 'Web-based platform for version control and collaboration.',
        experience: '4+ years using Git and GitHub for project management',
        projects: ['Open Source Contributions', 'Team Collaboration', 'Project Management'],
        icon: '📚'
      },
      { 
        name: 'Bitbucket', 
        level: 70, 
        category: 'Version Control',
        description: 'Git-based source code hosting and collaboration platform.',
        experience: '2+ years using Bitbucket in enterprise environments',
        projects: ['Team Repositories', 'Code Reviews', 'Pipeline Integration'],
        icon: '🔵'
      },

      { 
        name: 'Visual Studio', 
        level: 80, 
        category: 'Tools',
        description: 'Microsoft\'s integrated development environment for .NET development.',
        experience: '3+ years developing .NET applications',
        projects: ['C# Applications', 'Web APIs', 'Desktop Software'],
        icon: '🟦'
      },
      { 
        name: 'VS Code', 
        level: 90, 
        category: 'Tools',
        description: 'Lightweight but powerful source code editor with extensive extensions.',
        experience: '4+ years as primary development environment',
        projects: ['Web Development', 'Extension Development', 'Team Configuration'],
        icon: '💻'
      },
      { 
        name: 'Postman', 
        level: 80, 
        category: 'Tools',
        description: 'API development and testing platform for building and testing APIs.',
        experience: '3+ years testing and documenting APIs',
        projects: ['API Testing', 'Documentation', 'Team Collaboration'],
        icon: '📮'
      },
     
      { 
        name: 'Jasmine/Karma', 
        level: 70, 
        category: 'Testing',
        description: 'Behavior-driven development framework for testing JavaScript code.',
        experience: '2+ years writing unit tests',
        projects: ['Angular Unit Tests', 'Component Testing', 'Service Testing'],
        icon: '🧪'
      },

      { 
        name: 'Chrome DevTools', 
        level: 85, 
        category: 'Testing',
        description: 'Web developer tools built into Google Chrome for debugging and profiling.',
        experience: '4+ years debugging web applications',
        projects: ['Performance Optimization', 'Debugging', 'Network Analysis'],
        icon: '🔍'
      }
    ];
    
    return of(skills);
  }

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
        name: 'Pharos',
        role: 'Technical Lead',
        company: 'In Time Tec',
        period: 'April 25 – Present',
        details: [
          'Assigned as Technical Lead to the PHAROS project, focused on securing multifunction printers (MFPs) across multiple vendors to prevent unauthorized access to printing and scanning functionalities.',
          'Collaborating with vendors like Lexmark, integrating their Java-based embedded solutions with PHAROS to enforce security protocols and compliance.',
          'Working on the C#-based site service, responsible for communication and authentication workflows between the PHAROS system and connected printers.',
          'Actively participating in client discussions to understand requirements, provide progress updates, and ensure alignment with business objectives.'
        ]
      },
      {
        name: 'Air Products',
        role: 'Sr. Software Engineer',
        company: 'In Time Tec',
        period: 'June 23 – April 25',
        details: [
          'Solely responsible for managing and enhancing 7 enterprise-level front-end applications, leading full-cycle development from requirements gathering to production deployment.',
          'Developed dynamic and responsive UIs using Angular, TypeScript, Kendo UI, and object-oriented programming (OOP) principles.',
          'Implemented real-time data visualizations and graph-based analytics to improve operational insights.',
          'Actively collaborated with stakeholders and backend teams, ensuring alignment with business goals and timely delivery.'
        ]
      },
      {
        name: 'Rise – IdahoSTARS',
        role: 'Software Engineer',
        company: 'In Time Tec',
        period: 'September 22 – May 23',
        details: [
          'Led a team of 4–5 developers to deliver a high-impact childcare management system under the Idaho Government\'s initiative.',
          'Orchestrated sprint planning, task assignment, and delivery tracking using Agile methodologies.',
          'Enhanced UI functionality and user engagement using Angular and modern JavaScript libraries.',
          'Engaged directly with stakeholders for requirement gathering, performed code reviews, and implemented thorough testing protocols for quality assurance.'
        ]
      },
      {
        name: 'HP – Services Estimator',
        role: 'Software Engineer',
        company: 'In Time Tec',
        period: 'March 21 – September 22',
        details: [
          'Developed and maintained complex modules in Angular, resulting in a 90% reduction in compilation time through version upgrades and library optimizations.',
          'Ensured robust application quality with 80%+ unit test coverage using Jasmine/Karma and performed regular integration with backend APIs.',
          'Utilized CI/CD pipelines (Jenkins and Azure) for seamless code deployment.',
          'Participated in sprint ceremonies, created detailed flowcharts and architecture diagrams, and closely coordinated with cross-functional teams for smooth delivery.'
        ]
      }
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