import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Skill } from 'src/app/services/interfaces';

@Component({
  selector: 'app-skill-modal',
  templateUrl: './skill-modal.component.html',
  styleUrls: ['./skill-modal.component.scss'],
  animations: [
    trigger('modalAnimation', [
      state('closed', style({
        opacity: 0,
        transform: 'translateY(-50px) scale(0.9)'
      })),
      state('open', style({
        opacity: 1,
        transform: 'translateY(0) scale(1)'
      })),
      transition('closed => open', [
        animate('0.3s ease-out')
      ]),
      transition('open => closed', [
        animate('0.2s ease-in')
      ])
    ])
  ]
})
export class SkillModalComponent {
  @Input() skill: Skill | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  close(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
} 