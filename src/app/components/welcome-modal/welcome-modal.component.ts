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

  ngOnInit(): void {
    this.triggerConfettiBurst();
  }

  triggerConfettiBurst() {
    const confettiColors = [
      '#fffbe6', '#ffe082', '#fbc2eb', '#ffb347', '#ff5e62', '#a18cd1', '#fbc2eb', '#f9d423', '#fcb69f', '#fd6e6a'
    ];
    const confettiContainer = this.el.nativeElement.querySelector('.confetti-container');
    if (!confettiContainer) return;
    for (let i = 0; i < 32; i++) {
      const confetti = this.renderer.createElement('div');
      this.renderer.addClass(confetti, 'confetti');
      const size = 8 + Math.random() * 10;
      this.renderer.setStyle(confetti, 'width', `${size}px`);
      this.renderer.setStyle(confetti, 'height', `${size * (0.4 + Math.random() * 0.8)}px`);
      this.renderer.setStyle(confetti, 'background', confettiColors[Math.floor(Math.random() * confettiColors.length)]);
      this.renderer.setStyle(confetti, 'borderRadius', `${Math.random() > 0.5 ? '50%' : '2px'}`);
      this.renderer.setStyle(confetti, 'position', 'absolute');
      this.renderer.setStyle(confetti, 'left', '50%');
      this.renderer.setStyle(confetti, 'top', '50%');
      this.renderer.setStyle(confetti, 'opacity', '0.85');
      const angle = Math.random() * 2 * Math.PI;
      const velocity = 80 + Math.random() * 120;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity;
      const rotate = Math.random() * 360;
      this.renderer.setStyle(confetti, 'transform', `translate(-50%, -50%) rotate(${rotate}deg)`);
      this.renderer.appendChild(confettiContainer, confetti);
      setTimeout(() => {
        this.renderer.setStyle(confetti, 'transition', 'transform 1.1s cubic-bezier(.61,1.13,.66,1), opacity 1.1s');
        this.renderer.setStyle(confetti, 'transform', `translate(${dx}px, ${dy}px) rotate(${rotate + 180}deg)`);
        this.renderer.setStyle(confetti, 'opacity', '0');
      }, 10);
      setTimeout(() => {
        this.renderer.removeChild(confettiContainer, confetti);
      }, 1200);
    }
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

  onBackdropClick(event: MouseEvent) {
    // Do not close the modal in thank you state
    // Only allow closing via the cross icon
    return;
  }

  closeModal() {
    this.close.emit();
  }

  onContactInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // Remove all non-numeric characters
    input.value = input.value.replace(/[^0-9]/g, '');
    // Update the form control value
    this.welcomeForm.get('contact')?.setValue(input.value, { emitEvent: false });
  }
} 