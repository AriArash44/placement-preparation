import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appFocusVisible]',
  standalone: true
})
export class FocusVisibleDirective {
  private usingKeyboard = false;

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      this.usingKeyboard = true;
    }
  }

  @HostListener('mousedown')
  onMouseDown() {
    this.usingKeyboard = false;
  }

  @HostBinding('class.focus-visible')
  get showFocus() {
    return this.usingKeyboard;
  }
}
