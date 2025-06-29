import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { ConfigService } from './services/config.service';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

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
  config: any = null;
  showBanner = true;
  bannerMessage = '';
  showWelcomeModal = true;
  isAdminRoute = false;
  currentUser$ = this.authService.currentUser$;

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

  constructor(
    private configService: ConfigService,
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.checkMobile();
    this.loadTheme();
    this.loadConfig();
    this.setupRouteDetection();

    // Show welcome modal only if not visited before
    if (localStorage.getItem('visitedPortfolio') !== 'true') {
      this.showWelcomeModal = true;
    } else {
      this.showWelcomeModal = false;
    }

    // Show access denied toast if redirected
    this.route.queryParams.subscribe(params => {
      if (params['denied']) {
        this.showAccessDeniedToast();
      }
    });
  }

  private setupRouteDetection() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute = event.url.includes('/admin');
    });
  }

  private loadConfig() {
    this.configService.getConfig().subscribe(config => {
      if (config) {
        this.config = config;
      }
    });
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
    this.isDarkMode = savedTheme === 'dark' || !savedTheme;
    this.applyTheme();
  }

  private applyTheme() {
    document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.classList.remove('no-scroll');
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
    const config = this.configService.getCurrentConfig();
    const resumePath = config?.portfolio?.resumePath || 'assets/Rohit_Agarwal_ITT_Resume.pdf';
    const fileName = resumePath.split('/').pop() || 'Resume.pdf';
    
    const link = document.createElement('a');
    link.href = resumePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onBannerClosed() {
    this.showBanner = false;
  }

  onWelcomeClose() {
    this.showWelcomeModal = false;
  }

  onWelcomeSubmit(data: { name: string; contact: string }) {
    // Authentication is now handled in the welcome modal component
    // This method is just for any additional app-level logic if needed
    console.log('Welcome modal submitted:', data);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  exitUser() {
    localStorage.removeItem('visitedPortfolio');
    this.authService.logout();
    this.showWelcomeModal = true;
    this.router.navigate(['/about']);
  }

  showAccessDeniedToast() {
    const toast = document.createElement('div');
    toast.textContent = 'Access Denied: You are not authorized to view the dashboard.';
    toast.style.position = 'fixed';
    toast.style.bottom = '2.5rem';
    toast.style.right = '2.5rem';
    toast.style.background = 'linear-gradient(90deg, #fce4ec 0%, #fcb7e7 100%)';
    toast.style.color = '#d32f2f';
    toast.style.fontWeight = '700';
    toast.style.padding = '0.6rem 1.1rem 0.6rem 0.9rem';
    toast.style.borderRadius = '1.1rem';
    toast.style.boxShadow = '0 8px 32px rgba(244,67,54,0.13), 0 1.5px 8px 0 rgba(140, 82, 255, 0.10)';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '0.97rem';
    toast.style.letterSpacing = '0.01em';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '0.3rem';
    toast.style.border = '1.5px solid #f44336';
    (toast.style as any).backdropFilter = 'blur(6px)';
    toast.style.transition = 'transform 0.35s cubic-bezier(.4,2,.6,1), opacity 0.25s';
    toast.style.transform = 'translateY(60px)';
    toast.style.opacity = '0';
    toast.style.maxWidth = '320px';
    toast.style.minWidth = '180px';
    toast.style.whiteSpace = 'pre-line';

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 50);
    setTimeout(() => {
      toast.style.transform = 'translateY(60px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  }
}
