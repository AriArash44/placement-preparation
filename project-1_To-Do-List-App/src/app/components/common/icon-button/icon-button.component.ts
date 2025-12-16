import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SharedImports } from '../../../../shared-imports';

@Component({
  selector: 'app-icon-button',
  imports: [...SharedImports],
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
