import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FocusVisibleDirective } from './focus-visible.directive';

@Component({
  template: `<button appFocusVisible>Test Button</button>`,
  standalone: true,
  imports: [FocusVisibleDirective]
})
class TestHostComponent {}

describe('FocusVisibleDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let button: HTMLButtonElement;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    button = fixture.debugElement.query(By.css('button')).nativeElement;
  });

  it('should create directive instance', () => {
    const directive = fixture.debugElement.query(By.directive(FocusVisibleDirective));
    expect(directive).toBeTruthy();
  });

  it('should add focus-visible class when Tab key is pressed', () => {
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    button.dispatchEvent(event);
    fixture.detectChanges();
    expect(button.classList.contains('focus-visible')).toBeTrue();
  });

  it('should remove focus-visible class on mouse down', () => {
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    fixture.detectChanges();
    button.dispatchEvent(new MouseEvent('mousedown'));
    fixture.detectChanges();
    expect(button.classList.contains('focus-visible')).toBeFalse();
  });
});
