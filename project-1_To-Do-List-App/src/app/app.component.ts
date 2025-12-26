import { Component, computed, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconButtonComponent } from './components/common/icon-button/icon-button.component';
import { SwitchButtonComponent } from './components/common/switch-button/switch-button.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from './services/theme/theme.service';
import { SharedImports } from '../shared-imports';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IconButtonComponent, SwitchButtonComponent, UpperCasePipe, ...SharedImports],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private router = inject(Router); 
  themeService = inject(ThemeService);

  pageTitle = signal<string>('TODO');
  theme = this.themeService.theme();;
  isLight = computed(() => this.themeService.theme() === 'light');

  constructor() {
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
