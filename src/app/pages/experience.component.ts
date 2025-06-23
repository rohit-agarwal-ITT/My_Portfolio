import { Component } from '@angular/core';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  animations: [
    trigger('timelineAnimation', [
      transition('* => *', [
        query('.timeline li', [
          style({ opacity: 0, transform: 'translateX(-50px)' }),
          stagger(200, [
            animate('500ms cubic-bezier(.35,0,.25,1)', 
              style({ opacity: 1, transform: 'none' })
            )
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ExperienceComponent {
  experiences = [
    {
      title: 'Software Developer',
      company: 'Tech Company',
      period: '2022 - Present',
      description: 'Working on modern web applications using Angular and Node.js.'
    },
    {
      title: 'Intern',
      company: 'Startup',
      period: '2021 - 2022',
      description: 'Contributed to frontend development and UI/UX improvements.'
    },
    {
      title: 'Freelance Developer',
      company: 'Various Clients',
      period: '2020 - 2021',
      description: 'Built responsive websites and small web applications.'
    }
  ];
} 