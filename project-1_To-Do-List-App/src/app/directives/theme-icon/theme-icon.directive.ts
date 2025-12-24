import { Directive, input, ElementRef, effect, inject } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';
import type { Theme } from '../../services/theme/theme.service';

@Directive({
  selector: 'img[appThemeIcon]',
})
export class ThemeIconDirective {
  themeService = inject(ThemeService);
  iconPath = input.required<string>({ alias: 'appThemeIcon' });

  constructor(private el: ElementRef<HTMLImageElement>) {
    effect(() => {
      this.updateSrc(this.themeService.theme());
    });
  }

  private updateSrc(theme: Theme) {
    const dir = theme === 'dark' ? 'white-icons' : 'black-icons';
    const parts = this.iconPath().split('/');
    parts.splice(parts.indexOf('icons') + 1, 0, dir);
    this.el.nativeElement.src = parts.join('/');
  }
}
