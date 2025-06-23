import { Component } from '@angular/core';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  animations: [
    trigger('projectAnimation', [
      transition('* => *', [
        query('.project-card', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(150, [
            animate('500ms cubic-bezier(.35,0,.25,1)', 
              style({ opacity: 1, transform: 'none' })
            )
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ProjectsComponent {
  projects = [
    {
      title: 'Portfolio Website',
      description: 'A personal website to showcase my work and skills.',
      tech: ['Angular', 'TypeScript', 'SCSS'],
      link: '#'
    },
    {
      title: 'Task Manager App',
      description: 'A productivity app to manage daily tasks efficiently.',
      tech: ['React', 'Node.js', 'MongoDB'],
      link: '#'
    },
    {
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration.',
      tech: ['Angular', 'Express', 'PostgreSQL'],
      link: '#'
    }
  ];
} 