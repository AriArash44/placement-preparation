import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoDB } from '../../../services/db/todo-db.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  const mockTodos = [
    { id: 1, title: 'todo1', state: 'in_progress' },
    { id: 2, title: 'todo2', state: 'done' }
  ] as any;
  const mockDb = {
    todos: {
      toArray: jasmine.createSpy().and.resolveTo(mockTodos),
      delete: jasmine.createSpy().and.resolveTo()
    }
  };
  const mockBreakpointObserver = {
    observe: jasmine.createSpy().and.returnValue(of({ matches: false }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        { provide: TodoDB, useValue: mockDb },
        { provide: BreakpointObserver, useValue: mockBreakpointObserver }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockDb.todos.delete.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos from db', async () => {
    await fixture.whenStable();
    expect(mockDb.todos.toArray).toHaveBeenCalled();
  });

  it('should set isSmallScreen based on breakpoint', () => {
    expect(mockBreakpointObserver.observe).toHaveBeenCalled();
    expect(component.isSmallScreen()).toBe(false);
  });

  it('should open delete modal with selected todo', () => {
    const todo = mockTodos[0];
    const event = new Event('click');
    spyOn(event, 'stopPropagation');
    component.showUpdateOrDelete('delete', todo, event);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.currentTemplate()).toBe('delete');
    expect(component.selectedTodo()).toEqual(todo);
    expect(component.modalControler()).toBeTrue();
  });

  it('should delete todo and close modal', async () => {
    component.modalControler.set(true);
    component.selectedTodo.set(mockTodos[0]);
    await component.deleteTodo(1);
    expect(mockDb.todos.delete).toHaveBeenCalledWith(1);
    expect(component.modalControler()).toBeFalse();
    expect(component.selectedTodo()).toBeNull();
  });

  it('should not delete when id is null', async () => {
    await component.deleteTodo(null as any);
    expect(mockDb.todos.delete).not.toHaveBeenCalled();
  });

  it('should open update modal with selected todo', () => {
    const todo = mockTodos[0];
    const event = new Event('click');
    spyOn(event, 'stopPropagation');
    component.showUpdateOrDelete('update', todo, event);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.currentTemplate()).toBe('update');
    expect(component.selectedTodo()).toEqual(todo);
    expect(component.modalControler()).toBeTrue();
  });

  it('should switch modal template based on type', () => {
    component.currentTemplate.set('delete');
    expect(component.modalContent()).toBe(component.deleteFragment());
    component.currentTemplate.set('update');
    expect(component.modalContent()).toBe(component.updateFragment());
  });

  it('should reorder todos on drop', () => {
    component.todos.set([...mockTodos]);
    const event = {
      previousIndex: 0,
      currentIndex: 1
    } as any;
    component.drop(event);
    const todos = component.todos();
    expect(todos[0].id).toBe(2);
    expect(todos[1].id).toBe(1);
  });
});
