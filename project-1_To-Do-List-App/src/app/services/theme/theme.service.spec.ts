import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to light theme when nothing is in localStorage', () => {
    expect(service.theme()).toBe('light');
  });

  it('should load dark theme from localStorage on init', () => {
    localStorage.setItem('app-theme', 'dark');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const newService = TestBed.inject(ThemeService);
    expect(newService.theme()).toBe('dark');
  });

  it('should load light theme from localStorage on init', () => {
    localStorage.setItem('app-theme', 'light');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const newService = TestBed.inject(ThemeService);
    expect(newService.theme()).toBe('light');
  });

  it('should set theme to dark', () => {
    service.setTheme('dark');
    expect(service.theme()).toBe('dark');
  });

  it('should set theme to light', () => {
    service.setTheme('dark');
    service.setTheme('light');
    expect(service.theme()).toBe('light');
  });

  it('should toggle from light to dark', () => {
    service.setTheme('light');
    service.toggleTheme();
    expect(service.theme()).toBe('dark');
  });

  it('should toggle from dark to light', () => {
    service.setTheme('dark');
    service.toggleTheme();
    expect(service.theme()).toBe('light');
  });

  it('should add "dark" class to html when theme is dark', () => {
    service.setTheme('dark');
    TestBed.flushEffects();
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
  });

  it('should remove "dark" class from html when theme is light', () => {
    service.setTheme('dark');
    TestBed.flushEffects();
    service.setTheme('light');
    TestBed.flushEffects();
    expect(document.documentElement.classList.contains('dark')).toBeFalse();
  });
});
