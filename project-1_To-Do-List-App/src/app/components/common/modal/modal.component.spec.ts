import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modal } from './modal.component';

describe('Modal', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modal]
    }).compileComponents();
    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isOpened false by default', () => {
    expect(component.isOpened()).toBeFalse();
  });

  it('should close when host is clicked', () => {
    component.isOpened.set(true);
    fixture.detectChanges();
    fixture.nativeElement.click();
    expect(component.isOpened()).toBeFalse();
  });
});
