import { Component, input, output } from '@angular/core';
import { SharedImports } from '../../../../shared-imports';

@Component({
  selector: 'app-icon-button',
  imports: [...SharedImports],
  templateUrl: './icon-button.component.html',
  standalone: true,
})
export class IconButtonComponent {
  icon = input.required<string>();
  route = input.required<string>();
  clicked = output<void>();

  onClick() {
    this.clicked.emit();
  }
}
