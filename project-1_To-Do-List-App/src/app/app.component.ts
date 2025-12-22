import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconButtonComponent } from './components/common/icon-button/icon-button.component';
import { SwitchButtonComponent } from './components/common/switch-button/switch-button.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UppercaseDirective } from './directives/uppercase/uppercase.directive';
import { ThemeService } from './services/theme/theme.service';
import type { Theme } from './services/theme/theme.service';
import { SharedImports } from '../shared-imports';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IconButtonComponent, UppercaseDirective, SwitchButtonComponent, ...SharedImports],
  templateUrl: './app.component.html',
})
export class AppComponent {
  pageTitle = signal<string>('TODO');
  theme: Theme;
  isLight = computed(() => this.themeService.theme() === 'light');

  constructor(private router: Router, public themeService: ThemeService) {
    this.theme = this.themeService.theme();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.pageTitle.set(event.urlAfterRedirects === '/add' ? 'add' : 'todo');
      });
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  onThemeChange() {
    this.themeService.toggleTheme();
  }
}
