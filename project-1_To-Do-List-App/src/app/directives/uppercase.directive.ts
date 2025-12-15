import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {
  @Input('appUppercase') text: string = '';

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    this.el.nativeElement.textContent = this.text.toUpperCase();
  }
}
