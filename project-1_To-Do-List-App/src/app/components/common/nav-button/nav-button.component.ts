import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-button',
  imports: [],
  templateUrl: './nav-button.component.html',
})
export class NavButtonComponent {
  @Input() icon!: string;
  @Input() route!: string;

  constructor(private router: Router) {}
  
  navigate() {
    this.router.navigate([this.route]);
  }
}
