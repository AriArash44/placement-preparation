import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  imports: [],
  templateUrl: './icon-button.component.html',
})
export class IconButtonComponent {
  @Input() icon!: string;
  @Input() route!: string;
  @Output() clicked = new EventEmitter<void>();
  
  onClick() {
    this.clicked.emit();
  }
}
