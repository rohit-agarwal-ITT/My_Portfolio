import { Component, OnInit } from '@angular/core';
import { ResumeService, Skill } from '../services/resume.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  skills: Skill[] = [];
  skillCategories: string[] = [];
  loading = true;

  constructor(private resumeService: ResumeService) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.resumeService.getSkills().subscribe(
      (skills) => {
        this.skills = skills;
        this.skillCategories = [...new Set(skills.map(skill => skill.category))];
        this.loading = false;
      },
      (error) => {
        console.error('Error loading skills:', error);
        this.loading = false;
      }
    );
  }

  getSkillsByCategory(category: string): Skill[] {
    return this.skills.filter(skill => skill.category === category);
  }
} 