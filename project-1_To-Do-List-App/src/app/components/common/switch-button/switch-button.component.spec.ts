import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchButtonComponent } from './switch-button.component';

describe('SwitchButtonComponent', () => {
  let component: SwitchButtonComponent;
  let fixture: ComponentFixture<SwitchButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchButtonComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(SwitchButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isLeft', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle isLeft when onSwitch is called', () => {
    expect(component.isLeft()).toBeTrue();
    component.onSwitch();
    expect(component.isLeft()).toBeFalse();
    component.onSwitch();
    expect(component.isLeft()).toBeTrue();
  });

  it('should emit valueChange on switch', () => {
    spyOn(component.valueChange, 'emit');
    component.onSwitch();
    expect(component.valueChange.emit).toHaveBeenCalledWith(false);
  });
});
