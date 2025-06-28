import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
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

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  getErrorMessage(field: string): string {
    if (field === 'name') return 'Name is required.';
    if (field === 'email') return 'Valid email is required.';
    if (field === 'message') return 'Message is required.';
    return '';
  }

  onSubmit() {
    if (this.contactForm.invalid) return;
    this.isSubmitting = true;

    emailjs.send(
      'service_3d095nj',  
      'template_ej5ujzi', 
      {
        from_name: this.contactForm.value.name,
        from_email: this.contactForm.value.email,
        message: this.contactForm.value.message
      },
      'xP-WHpvN68bH-I6Vn' 
    ).then(
      (result: any) => {
        this.showSuccess = true;
        this.isSubmitting = false;
        this.contactForm.reset();
      },
      (error: any) => {
        alert('Failed to send message. Please try again later.');
        this.isSubmitting = false;
      }
    );
  }

  markFormGroupTouched() {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }
}
