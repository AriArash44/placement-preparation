import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconButtonComponent } from './components/common/icon-button/icon-button.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UppercaseDirective } from './directives/uppercase.directive';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IconButtonComponent, UppercaseDirective],
  templateUrl: './app.component.html'
})
export class AppComponent {
  pageTitle = signal<string>('TODO');

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.pageTitle.set(event.urlAfterRedirects === '/add' ? 'add' : 'todo');
      });
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }
}
