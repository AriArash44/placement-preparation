import { ThemeIconDirective } from './theme-icon.directive';
import { ElementRef } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';

describe('ThemeIconDirective', () => {
  it('should create an instance', () => {
    const mockEl = new ElementRef(document.createElement('img'));
    const mockThemeService = {
      currentTheme: 'light',
      theme$: { subscribe: () => ({ unsubscribe: () => {} }) }
    } as unknown as ThemeService;

    const directive = new ThemeIconDirective(mockEl);
    expect(directive).toBeTruthy();
  });
});
