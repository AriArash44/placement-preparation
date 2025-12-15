import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavButtonComponent } from './components/common/nav-button/nav-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavButtonComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
}
