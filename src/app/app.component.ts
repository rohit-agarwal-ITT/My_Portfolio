import { Component, OnInit, HostListener } from '@angular/core';
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
export class AppComponent implements OnInit {
  title = 'portfolio';
  isMobile = false;
  sidebarOpen = false;
  isDarkMode = false;
  isMobileMenuOpen = false;
  showScrollToTop = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkMobile();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollToTop = window.scrollY > 300;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
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
    this.isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.applyTheme();
  }

  private applyTheme() {
    document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  scrollToTopAndNavigate(route: string) {
    this.scrollToTop();
    setTimeout(() => {
      // You can add navigation logic here if needed
      // For now, just scroll to top
    }, 100);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  downloadResume(event: Event): void {
    event.preventDefault();
    const link = document.createElement('a');
    link.href = 'assets/Rohit_Agarwal_ITT_Resume.pdf';
    link.download = 'Rohit_Agarwal_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
