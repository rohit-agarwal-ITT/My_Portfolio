import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bottom-right-banner',
  templateUrl: './bottom-right-banner.component.html',
  styleUrls: ['./bottom-right-banner.component.scss']
})
export class BottomRightBannerComponent {
  @Input() message = '';
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();

  onClose() {
    this.closed.emit();
  }
} 