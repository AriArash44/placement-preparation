import { Directive, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ThemeService, Theme } from '../../services/theme/theme.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: 'img[appThemeIcon]'
})
export class ThemeIconDirective implements OnInit, OnDestroy {
  @Input('appThemeIcon') iconPath!: string;

  private sub!: Subscription;

  constructor(private el: ElementRef<HTMLImageElement>, private themeService: ThemeService) {}

  ngOnInit() {
    this.sub = this.themeService.theme$.subscribe(theme => {
      this.updateSrc(theme);
    });
    this.updateSrc(this.themeService.currentTheme);
  }

  private updateSrc(theme: Theme) {
    const dir = theme === 'dark' ? 'white-icons' : 'black-icons';
    const parts = this.iconPath.split("/");
    parts.splice(parts.indexOf("icons") + 1, 0, dir);
    this.el.nativeElement.src = parts.join("/");
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
