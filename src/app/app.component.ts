import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms cubic-bezier(.35,0,.25,1)',
          style({ opacity: 1, transform: 'none' })
        )
      ])
    ]),
    trigger('sidebarAnimation', [
      state('closed', style({
        transform: 'translateX(-100%)'
      })),
      state('open', style({
        transform: 'translateX(0)'
      })),
      transition('closed <=> open', [
        animate('300ms cubic-bezier(.35,0,.25,1)')
      ])
    ]),
    trigger('themeToggle', [
      transition('* <=> *', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class AppComponent {
  title = 'portfolio';
  isMobile = false;
  sidebarOpen = false;
  isDarkMode = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkMobile();
  }

  ngOnInit() {
    this.checkMobile();
    this.loadTheme();
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 800;
    if (!this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
  }

  applyTheme() {
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
