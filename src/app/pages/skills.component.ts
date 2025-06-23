import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {
  skills = [
    { name: 'Angular', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'JavaScript', level: 80 },
    { name: 'HTML & CSS', level: 95 },
    { name: 'Node.js', level: 75 }
  ];
} 