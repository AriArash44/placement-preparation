import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SharedImports } from '../../../../shared-imports';

@Component({
  selector: 'app-switch-button',
  templateUrl: './switch-button.component.html',
  imports: [ ...SharedImports ]
})
export class SwitchButtonComponent {
  @Input() isLeft!: boolean;
  @Input() leftIcon?: string;
  @Input() rightIcon?: string;

  @Output() valueChange = new EventEmitter<boolean>();
  @Output() isLeftChange = new EventEmitter<boolean>();

  onSwitch() {
    this.isLeft = !this.isLeft;
    this.valueChange.emit(this.isLeft);
    this.isLeftChange.emit(this.isLeft);
  }
}
