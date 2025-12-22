import { Directive, Input, ElementRef, effect } from '@angular/core';
import { ThemeService, Theme } from '../../services/theme/theme.service';

@Directive({
  selector: 'img[appThemeIcon]',
})
export class ThemeIconDirective {
  @Input('appThemeIcon') iconPath!: string;

  constructor(private el: ElementRef<HTMLImageElement>, private themeService: ThemeService) {
    effect(() => {
      this.updateSrc(this.themeService.theme());
    });
  }

  private updateSrc(theme: Theme) {
    const dir = theme === 'dark' ? 'white-icons' : 'black-icons';
    const parts = this.iconPath.split('/');
    parts.splice(parts.indexOf('icons') + 1, 0, dir);
    this.el.nativeElement.src = parts.join('/');
  }
}
