import { Component, OnInit } from '@angular/core';
import { Skill } from 'src/app/services/interfaces';
import { ResumeService } from 'src/app/services/resume.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  skills: Skill[] = [];
  skillCategories: string[] = [];
  loading = true;
  selectedSkill: Skill | null = null;
  isModalOpen = false;

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

  openSkillModal(skill: Skill): void {
    this.selectedSkill = skill;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeSkillModal(): void {
    this.isModalOpen = false;
    this.selectedSkill = null;
    document.body.style.overflow = 'auto';
  }

  getSkillTooltip(skill: Skill): string {
    let tooltip = `${skill.name} - ${skill.level}% proficiency`;
    
    if (skill.experience) {
      tooltip += `\n${skill.experience}`;
    }
    
    if (skill.description) {
      tooltip += `\n${skill.description}`;
    }
    
    return tooltip;
  }
} 