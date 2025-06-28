# Modern Angular Portfolio

A beautiful, responsive, and modern portfolio website built with Angular. Features a dark/light theme, smooth animations, and a professional design perfect for showcasing your skills and experience.

## ✨ Features

- **Modern Design**: Clean, professional UI with glass morphism effects
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Automatic theme switching based on system preferences
- **Smooth Animations**: Engaging transitions and hover effects
- **Interactive Skills**: Detailed skill information with proficiency levels
- **Project Showcase**: Flipping cards to display project details
- **Contact Form**: Integrated contact form with EmailJS
- **Resume Download**: Direct PDF download functionality
- **Fully Customizable**: Easy to customize with JSON configuration files

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

## 🚀 Installation & Setup

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

### Step 5: Customize Your Data
1. **Update personal information**: Edit `src/assets/data/personal-info.json`
2. **Add your skills**: Modify `src/assets/data/skills.json`
3. **Update projects**: Edit `src/assets/data/projects.json`
4. **Add education**: Modify `src/assets/data/education.json`
5. **Configure settings**: Update `src/assets/data/config.json`

### Step 6: Replace Assets
1. **Profile Picture**: Replace `src/assets/profile_pic.jpg` with your photo
2. **Resume PDF**: Replace `src/assets/Rohit_Agarwal_ITT_Resume.pdf` with your resume

### Step 7: Run the Application
```bash
ng serve
```

### Step 8: Open in Browser
Navigate to `http://localhost:4200/`

## 🎨 Customization

This portfolio is designed to be easily customizable. You only need to modify JSON files to create your own portfolio:

- **Personal Info**: `src/assets/data/personal-info.json`
- **Skills**: `src/assets/data/skills.json`
- **Projects**: `src/assets/data/projects.json`
- **Education**: `src/assets/data/education.json`
- **Configuration**: `src/assets/data/config.json`

For detailed customization instructions, see the [Customization Guide](./CUSTOMIZATION.md).

## 🛠️ Built With

- **Angular 15.2.0**: Modern web framework
- **TypeScript 4.9.4**: Type-safe JavaScript
- **SCSS**: Advanced CSS with variables and mixins
- **EmailJS**: Contact form integration
- **Font Awesome**: Icon library
- **Google Fonts**: Typography

## 📱 Pages

- **About**: Personal information and professional summary
- **Skills**: Interactive skills showcase with categories
- **Projects**: Work experience with detailed project information
- **Contact**: Contact form and social links

## 🎯 Key Features

### Skills Section
- Categorized skills with proficiency levels
- Interactive skill cards with detailed information
- Modal popups for additional details
- Animated progress bars

### Projects Section
- Flipping cards for project details
- Professional experience showcase
- Responsive grid layout
- Smooth hover animations

### Theme System
- Automatic dark/light theme detection
- Manual theme toggle
- Consistent color scheme across components
- Smooth theme transitions

## 📦 Build

```bash
# Development build
ng build

# Production build
ng build --configuration production
```

## 🧪 Testing

```bash
# Unit tests
ng test

# End-to-end tests
ng e2e
```

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

### Getting Help

- **Check browser console** for JavaScript errors
- **Validate JSON files** using [JSONLint](https://jsonlint.com/)
- **Check file paths** in configuration files
- **Ensure all required fields** are present in JSON files

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help with customization, please open an issue on GitHub.

---

**Note**: This portfolio template is designed to be easily reusable. Simply update the JSON files to create your own professional portfolio!
