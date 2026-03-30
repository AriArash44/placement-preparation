import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ThemeIconDirective } from './theme-icon.directive';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  standalone: true,
  imports: [ThemeIconDirective],
  template: `<img [appThemeIcon]="path()" />`
})
class TestHostComponent {
  path = signal('/icons/test.svg');
}

describe('ThemeIconDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let themeSignal = signal<'light' | 'dark'>('light');

  beforeEach(async () => {
    const mockThemeService = {
      theme: themeSignal
    };
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ThemeIconDirective],
      providers: [
        { provide: ThemeService, useValue: mockThemeService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges(); 
  });

  it('should create an instance', () => {
    const directiveEl = fixture.debugElement.query(By.directive(ThemeIconDirective));
    expect(directiveEl).toBeTruthy();
  });

  it('should set black-icons path for light theme', () => {
    themeSignal.set('light');
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('img')).nativeElement as HTMLImageElement;
    expect(img.src).toContain('/icons/black-icons/test.svg');
  });

  it('should set white-icons path for dark theme', () => {
    themeSignal.set('dark');
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('img')).nativeElement as HTMLImageElement;
    expect(img.src).toContain('/icons/white-icons/test.svg');
  });

  it('should update path when input signal changes', () => {
    fixture.componentInstance.path.set('/icons/user.png');
    themeSignal.set('dark');
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('img')).nativeElement as HTMLImageElement;
    expect(img.src).toContain('/icons/white-icons/user.png');
  });
});
