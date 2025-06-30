import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { VisitorService } from '../../services/visitor.service';
// @ts-ignore
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [
    trigger('formAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'none' }))
      ])
    ]),
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
      ])
    ])
  ]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  showSuccess = false;
  showError = false;
  isAnonymousUser = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private visitorService: VisitorService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      contact: [''] // Optional contact field for anonymous users
    });
  }

  ngOnInit(): void {
    this.checkUserType();
  }

  private checkUserType(): void {
    const currentUser = this.authService.getCurrentUser();
    this.isAnonymousUser = currentUser?.role === 'anonymous';
  }

  getErrorMessage(field: string): string {
    if (field === 'name') return 'Name is required.';
    if (field === 'email') return 'Valid email is required.';
    if (field === 'message') return 'Message is required.';
    return '';
  }

  onContactInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // Remove all non-numeric characters
    input.value = input.value.replace(/[^0-9]/g, '');
    // Update the form control value
    this.contactForm.get('contact')?.setValue(input.value, { emitEvent: false });
  }

  async onSubmit() {
    if (this.contactForm.invalid) return;
    this.isSubmitting = true;
    this.showError = false;

    try {
      // Send email
      await emailjs.send(
        'service_3d095nj',  
        'template_ej5ujzi', 
        {
          from_name: this.contactForm.value.name,
          from_email: this.contactForm.value.email,
          message: this.contactForm.value.message
        },
        'xP-WHpvN68bH-I6Vn' 
      );

      // If anonymous user provided contact info, update visitor record
      if (this.isAnonymousUser && this.contactForm.value.contact) {
        await this.updateAnonymousVisitorInfo();
      }

      this.showSuccess = true;
      this.contactForm.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      this.showError = true;
    } finally {
      this.isSubmitting = false;
    }
  }

  private async updateAnonymousVisitorInfo(): Promise<void> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser?.role === 'anonymous') {
        await this.visitorService.saveVisitorInfo({
          name: this.contactForm.value.name,
          mobile: this.contactForm.value.contact,
          sessionId: (currentUser as any).sessionId,
          browserFingerprint: (currentUser as any).browserFingerprint
        });
      }
    } catch (error) {
      console.error('Error updating anonymous visitor info:', error);
    }
  }

  markFormGroupTouched() {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }
}
