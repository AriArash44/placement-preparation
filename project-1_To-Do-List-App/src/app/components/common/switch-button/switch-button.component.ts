import { Component, model, input, output } from '@angular/core';
import { SharedImports } from '../../../../shared-imports';

@Component({
  selector: 'app-switch-button',
  templateUrl: './switch-button.component.html',
  imports: [ ...SharedImports ],
  standalone: true,
})
export class SwitchButtonComponent {
  isLeft = model.required<boolean>();
  leftIcon = input<string>();
  rightIcon = input<string>();

  valueChange = output<boolean>();

  onSwitch() {
    this.isLeft.update(value => !value);
    this.valueChange.emit(this.isLeft());
  }
}
