import { Component, EventEmitter, Output, OnInit, Renderer2, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.scss']
})
export class WelcomeModalComponent implements OnInit {
  @Output() submitInfo = new EventEmitter<{ name: string; contact: string }>();
  @Output() close = new EventEmitter<void>();
  welcomeForm: FormGroup;
  submitted = false;
  showThanks = false;
  userName = '';
  isSaving = false;
  isAdmin = false;
  showForm = false;
  showOptions = true;

  constructor(
    private fb: FormBuilder, 
    private renderer: Renderer2, 
    private el: ElementRef,
    private authService: AuthService
  ) {
    this.welcomeForm = this.fb.group({
      name: ['', Validators.required],
      contact: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]]
    });
  }

  ngOnInit() {
    this.renderer.addClass(document.body, 'modal-open');
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'modal-open');
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  closeModal() {
    this.close.emit();
  }

  // Handle anonymous browsing option
  async onAnonymousBrowse() {
    this.isSaving = true;
    
    try {
      // Initialize anonymous visitor tracking
      await this.authService.initializeAnonymousVisitor();
      
      this.userName = 'Guest';
      this.isAdmin = false;
      this.showThanks = true;
      
      // Store that user has visited
      localStorage.setItem('visitedPortfolio', 'true');
    } catch (error) {
      console.error('Error in anonymous browsing:', error);
      // Still show thanks even if there's an error
      this.userName = 'Guest';
      this.showThanks = true;
      localStorage.setItem('visitedPortfolio', 'true');
    } finally {
      this.isSaving = false;
    }
  }

  // Handle option to provide information
  onProvideInfo() {
    this.showOptions = false;
    this.showForm = true;
  }

  // Handle skip option (same as anonymous)
  onSkip() {
    this.onAnonymousBrowse();
  }

  async onSubmit() {
    this.submitted = true;
    if (this.welcomeForm.valid) {
      this.isSaving = true;
      
      try {
        const formData = this.welcomeForm.value;
        
        // Authenticate user through auth service
        const result = await this.authService.authenticateUser(formData.name, formData.contact);
        
        if (result.success) {
          this.userName = formData.name;
          this.isAdmin = result.isAdmin;
          
          // Emit the info for other components
          this.submitInfo.emit({
            name: formData.name,
            contact: formData.contact
          });
          
          this.showThanks = true;
          
          // Store that user has visited
          localStorage.setItem('visitedPortfolio', 'true');
        } else {
          // Handle error - still show thanks but with error message
          this.userName = formData.name;
          this.showThanks = true;
          localStorage.setItem('visitedPortfolio', 'true');
        }
      } catch (error) {
        console.error('Error in welcome modal:', error);
        // Still show thanks even if there's an error
        this.userName = this.welcomeForm.value.name;
        this.showThanks = true;
        localStorage.setItem('visitedPortfolio', 'true');
      } finally {
        this.isSaving = false;
      }
    }
  }

  onContactInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // Remove all non-numeric characters
    input.value = input.value.replace(/[^0-9]/g, '');
    // Update the form control value
    this.welcomeForm.get('contact')?.setValue(input.value, { emitEvent: false });
  }
} 