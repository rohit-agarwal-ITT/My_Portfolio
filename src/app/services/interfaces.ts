export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string[];
  technologies: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  github?: string;
  live?: string;
  image?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
} 