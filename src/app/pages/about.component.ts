import { Component } from '@angular/core';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('600ms cubic-bezier(.35,0,.25,1)', 
              style({ opacity: 1, transform: 'none' })
            )
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class AboutComponent {
  aboutItems = [
    'Passionate software developer with 3+ years of experience',
    'Specialized in modern web technologies and frameworks',
    'Love creating intuitive and responsive user interfaces',
    'Always eager to learn new technologies and best practices'
  ];
} 