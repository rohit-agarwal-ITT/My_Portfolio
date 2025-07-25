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
  description?: string;
  experience?: string;
  projects?: string[];
  certifications?: string[];
  icon?: string;
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
  role: string;
  company: string;
  period: string;
  details: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
} 