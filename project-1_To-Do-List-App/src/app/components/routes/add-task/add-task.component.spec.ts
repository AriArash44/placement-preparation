import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTaskComponent } from './add-task.component';
import { TodoDB } from '../../../services/db/todo-db.service';
import { DeadlineWatcherService } from '../../../services/deadline/deadline-watcher';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;

  const mockDb = {
    todos: {
      add: jasmine.createSpy().and.resolveTo(1),
      update: jasmine.createSpy().and.resolveTo(),
      get: jasmine.createSpy().and.resolveTo(null)
    }
  };
  const mockDeadlineWatcher = {
    checkOverdueOrNotif: jasmine.createSpy()
  };
  const mockToastr = {
    error: jasmine.createSpy(),
    success: jasmine.createSpy()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskComponent],
      providers: [
        { provide: DeadlineWatcherService, useValue: mockDeadlineWatcher },
        { provide: ToastrService, useValue: mockToastr },
        { provide: TodoDB, useValue: mockDb }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update field properly', () => {
    component.updateField('title', 'New Todo Title');
    expect(component.model().title).toBe('New Todo Title');
  });

  it('should set state to done when checkbox is clicked', () => {
    const event = { target: { checked: true } } as any;
    component.toggleDone(event);
    expect(component.model().state).toBe('done');
  });

  it('should call toastr error when form invalid', async () => {
    const form = { valid: false } as NgForm;
    await component.onSubmit(form);
    expect(mockToastr.error).toHaveBeenCalled();
  });

  it('should add new task when not in edit mode', async () => {
    const form = { valid: true, resetForm: jasmine.createSpy() } as any;
    await component.onSubmit(form);
    expect(mockDb.todos.add).toHaveBeenCalled();
    expect(mockToastr.success).toHaveBeenCalled();
    expect(mockDeadlineWatcher.checkOverdueOrNotif).toHaveBeenCalled();
  });

  it('should update task when edit mode', async () => {
    fixture.componentRef.setInput('todoId', 10);
    fixture.detectChanges();
    const form = { valid: true } as any;
    await component.onSubmit(form);
    expect(mockDb.todos.update).toHaveBeenCalled();
    expect(mockToastr.success).toHaveBeenCalled();
  });
});
