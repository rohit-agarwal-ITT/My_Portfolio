# Angular Portfolio

A modern, customizable portfolio web app built with Angular. Showcases your skills, projects, experience, and more, with a beautiful responsive design and dark/light mode support.

---

## 🚀 Features
- Responsive, mobile-friendly design
- Dark and light mode with smooth switching
- Easy customization via JSON files (no code required)
- Animated UI, modals, and micro-interactions
- Admin dashboard for visitor analytics (optional)
- Dynamic browser title and resume download
- Modular Angular architecture

---

## 🛠️ Tech Stack
- **Angular** (v15+ recommended)
- **Node.js** (v16+ recommended)
- **Angular CLI**
- **RxJS**, **SCSS**, **FontAwesome**

---

## ⚡ Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
- Git (to clone the repo)

---

## 📦 Installation
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```
2. **Install dependencies:**
   ```bash
   npm install
   cd portfolio
   npm install
   ```

---

## 🖥️ Running Locally
1. **Start the Angular app:**
   ```bash
   cd portfolio
   ng serve
   # or
   npm start
   ```
2. **Open your browser:**
   - Visit [http://localhost:4200](http://localhost:4200)

---

## 🏗️ Building for Production
```bash
cd portfolio
ng build --configuration production
```
The output will be in `portfolio/dist/`.

---

## ⚙️ Environment Setup
- No special environment variables are required for basic use.
- If using Firebase or other APIs, update `src/environments/environment.ts` as needed.
- All editable content (profile, skills, projects, etc.) is in `src/assets/data/` as JSON files.

---

## 📝 Customization
- See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for a full guide.
- **Edit JSON files:**
  - `src/assets/data/personal-info.json` — your name, contact, social links
  - `src/assets/data/skills.json` — your skills
  - `src/assets/data/projects.json` — your projects
  - `src/assets/data/education.json` — your education
  - `src/assets/data/config.json` — app title, theme, etc.
- **Replace assets:**
  - `src/assets/profile_pic.jpg` — your photo
  - `src/assets/Rohit_Agarwal_ITT_Resume.pdf` — your resume
- **Change theme:**
  - Edit colors in `src/styles.scss` or `config.json`

---

## 🧩 Architecture & Techniques
- **Angular best practices:** modular components, services, guards
- **Theming:** CSS variables, `[data-theme]` attribute for dark/light mode
- **Data loading:** All content loaded from JSON for easy editing
- **Admin dashboard:** (optional) for visitor analytics, protected by login

---

## 🛠️ Troubleshooting
- **Port already in use:** Stop other apps using port 4200 or run `ng serve --port 4300`
- **Missing dependencies:** Run `npm install` in both root and `portfolio/` folders
- **CORS or API errors:** Check your environment and API keys
- **App not updating:** Try a hard refresh (Ctrl+F5) or clear browser cache

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first.

---

## 📬 Contact
For help or questions, open an issue or contact the maintainer.
