import { Directive, input, ElementRef, effect } from '@angular/core';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {
  text = input<string>('', {alias: "appUppercase"})

  constructor(private el: ElementRef) {
    effect(() => {
      this.el.nativeElement.textContent = this.text().toUpperCase();
    })
  }
}
