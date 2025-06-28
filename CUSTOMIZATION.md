# Portfolio Customization Guide

This Angular portfolio is designed to be easily customizable. You only need to modify the JSON files in the `src/assets/data/` directory to create your own portfolio.

## 🛠️ Environment Requirements

### Prerequisites
- **Node.js**: Version 16.x or higher (Recommended: 16.16.0+)
- **npm**: Version 8.x or higher (Recommended: 8.19.3+)
- **Angular CLI**: Version 15.2.11
- **Git**: For cloning the repository

### System Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB (Recommended: 8GB+)
- **Storage**: At least 2GB free space
- **Browser**: Modern browser with ES6+ support (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Start

### Step 1: Install Node.js
1. **Download Node.js** from [nodejs.org](https://nodejs.org/)
2. **Choose LTS version** (Recommended: 16.x or 18.x)
3. **Run the installer** and follow the setup wizard
4. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Angular CLI
```bash
npm install -g @angular/cli@15.2.11
```

**Verify installation**:
```bash
ng version
```

### Step 3: Clone the Repository
```bash
git clone <repository-url>
cd portfolio
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Update the JSON files** (see sections below)
### Step 6: Replace assets** (profile picture, resume PDF)
### Step 7: Run the application**
```bash
ng serve
```

## Files to Customize

### 1. Personal Information (`src/assets/data/personal-info.json`)

Update your basic information:

```json
{
  "name": "Your Name",
  "title": "Your Title",
  "email": "your.email@example.com",
  "phone": "+1 234 567 8900",
  "location": "Your City, State, Country",
  "linkedin": "https://linkedin.com/in/your-profile",
  "github": "https://github.com/your-username"
}
```

### 2. Skills (`src/assets/data/skills.json`)

Add your skills with proficiency levels (0-100):

```json
[
  {
    "name": "Skill Name",
    "level": 85,
    "category": "Category Name",
    "description": "Brief description of the skill",
    "experience": "Years of experience",
    "projects": ["Project 1", "Project 2"],
    "certifications": ["Certification 1"],
    "icon": "🎯"
  }
]
```

**Categories**: You can use any category names like "Frontend", "Backend", "DevOps", "Tools", etc.

**Icons**: Use emoji icons or leave empty for default styling.

### 3. Projects (`src/assets/data/projects.json`)

Add your work experience and projects:

```json
[
  {
    "name": "Project Name",
    "role": "Your Role",
    "company": "Company Name",
    "period": "Duration (e.g., 'Jan 2023 - Present')",
    "details": [
      "Key achievement or responsibility 1",
      "Key achievement or responsibility 2",
      "Key achievement or responsibility 3"
    ]
  }
]
```

### 4. Education (`src/assets/data/education.json`)

Add your educational background:

```json
[
  {
    "degree": "Degree Name",
    "institution": "Institution Name",
    "year": "Graduation Year",
    "gpa": "GPA (e.g., '3.8/4.0')"
  }
]
```

### 5. Configuration (`src/assets/data/config.json`)

Customize portfolio settings:

```json
{
  "portfolio": {
    "title": "Your Name - Portfolio",
    "description": "Your Professional Description",
    "resumePath": "assets/your-resume.pdf",
    "profileImage": "assets/your-profile-pic.jpg",
    "theme": {
      "primaryColor": "#6366f1",
      "secondaryColor": "#7c3aed",
      "accentColor": "#10b981"
    },
    "social": {
      "linkedin": "https://linkedin.com/in/your-profile",
      "github": "https://github.com/your-username",
      "twitter": "https://twitter.com/your-handle",
      "email": "your.email@example.com"
    },
    "contact": {
      "email": "your.email@example.com",
      "phone": "+1 234 567 8900",
      "location": "Your City, State, Country"
    }
  }
}
```

**Important**: The `title` field in the config file automatically sets the browser tab title. This replaces any hardcoded names in the application.

## Assets to Replace

### Profile Picture
- Replace `src/assets/profile_pic.jpg` with your own photo
- Recommended size: 400x400px or larger
- Format: JPG, PNG, or WebP

### Resume PDF
- Replace `src/assets/Rohit_Agarwal_ITT_Resume.pdf` with your resume
- Update the path in `config.json` if you change the filename
- The download filename will automatically use your resume's filename

## Advanced Customization

### Adding New Sections
To add new sections (like "Certifications", "Awards", etc.):

1. Create a new JSON file in `src/assets/data/`
2. Add a new method in `src/app/services/resume.service.ts`
3. Create a new component for the section
4. Update the routing in `src/app/app-routing.module.ts`

### Styling Customization
- Colors: Update the theme colors in `config.json`
- CSS Variables: Modify `src/styles.scss` for global styling
- Component Styles: Each component has its own SCSS file

### Adding New Features
- The codebase is modular and follows Angular best practices
- Services are injectable and reusable
- Components are standalone and can be easily modified

## 🚨 Troubleshooting

### Common Issues

1. **Node.js Version Issues**
   ```bash
   # Check your Node.js version
   node --version
   
   # If version is too old, update Node.js
   # Download from nodejs.org or use nvm
   ```

2. **Angular CLI Issues**
   ```bash
   # Uninstall global Angular CLI
   npm uninstall -g @angular/cli
   
   # Install the correct version
   npm install -g @angular/cli@15.2.11
   ```

3. **Dependency Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Port Already in Use**
   ```bash
   # Use a different port
   ng serve --port 4201
   ```

5. **Build Errors**
   ```bash
   # Clear Angular cache
   ng cache clean
   
   # Rebuild
   ng build --configuration production
   ```

### JSON Validation
Use these tools to validate your JSON:
- [JSONLint](https://jsonlint.com/)
- [JSON Schema Validator](https://www.jsonschemavalidator.net/)

## Deployment

### Build for Production
```bash
ng build --configuration production
```

### Deploy to GitHub Pages
1. Update `angular.json` with your repository name
2. Run: `ng deploy --base-href=https://yourusername.github.io/your-repo/`

### Deploy to Netlify/Vercel
1. Connect your GitHub repository
2. Set build command: `ng build`
3. Set output directory: `dist/portfolio`

## Support

If you encounter issues:
1. Check the browser console for errors
2. Validate your JSON files
3. Ensure all required fields are present
4. Check file paths and asset locations
5. Verify Node.js and Angular CLI versions

## License

This portfolio template is open source. Feel free to use it for your personal portfolio! 