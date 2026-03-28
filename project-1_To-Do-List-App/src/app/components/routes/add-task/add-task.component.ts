import { Component, inject, signal, computed, input, effect, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { FocusVisibleDirective } from '../../../directives/focus-visible/focus-visible.directive';
import { db, Todo } from '../../../services/db/todo-db.service';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';

@Component({
  selector: 'app-add-task',
  imports: [FormsModule, NgxMatTimepickerModule, FocusVisibleDirective],
  templateUrl: './add-task.component.html',
  standalone: true,
  host:{
    class: "w-full"
  }
})
export class AddTaskComponent implements OnInit, OnDestroy {
  todoId = input<number>();
  model = signal<Todo>({ title: '', dateDeadLine: '', timeDeadLine: '', description: '', state: 'in_progress' }, { equal: _.isEqual });
  hasUnsavedChanges = computed(() => { 
    const m = this.model(); 
    return !!(m.title || m.dateDeadLine || m.timeDeadLine || m.description); 
  });

  isEditMode = computed(() => !!this.todoId());

  constructor() {
    effect(() => {
      if (this.todoId()) {
        db.todos.get(this.todoId()!).then(todo => {
          if (todo) {
            console.log(todo)
            this.model.set({
            title: todo.title,
            dateDeadLine: todo.dateDeadLine,
            timeDeadLine: todo.timeDeadLine,
            description: todo.description || '',
            state: 'in_progress'
          });
          }
        }).catch(error => {
          console.error('Error fetching todo:', error);
        });
      }
    })
  }

  private deadlineChecker?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.deadlineChecker = setInterval(async () => {
      const todos = await db.todos.toArray();
      for (const todo of todos) {
        if (todo.state === 'done') continue;
        const deadline = new Date(`${todo.dateDeadLine}T${todo.timeDeadLine}`);
        if (new Date() > deadline) {
          await db.todos.update(todo.id!, { state: 'overdue' });
        }
      }
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.deadlineChecker) {
      clearInterval(this.deadlineChecker);
    }
  }

  private toastr = inject(ToastrService);

  updateField<K extends keyof Todo>(field: K, value: Todo[K]) {
    this.model.update(m => ({ ...m, [field]: value }));
  }

  async onSubmit(todoForm: NgForm) { 
    if (!todoForm.valid) { 
      this.toastr.error('Please fill all the reqired fields!', 'Error'); 
      return;
    }

    if (!this.isEditMode()) {
      await db.todos.add({...this.model()}); 
      todoForm.resetForm();
      this.model.set({ title: '', dateDeadLine: '', timeDeadLine: '', description: '', state: 'in_progress' });
      this.toastr.success('Task saved successfully!', 'Success');
    }
    else {
      await db.todos.update(this.todoId()!, { ...this.model() });
      this.toastr.success('Task updated successfully!', 'Success');
    }
  }

  checkDeadline(todo: Todo): Todo["state"] {
    if (todo.state === 'done') return 'done';
    const deadline = new Date(`${todo.dateDeadLine}T${todo.timeDeadLine}`);
    const now = new Date();
    if (now > deadline) {
      return 'overdue';
    }
    return 'in_progress';
  }

  toggleDone(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.model.update(m => ({
      ...m,
      state: checked ? 'done' : 'in_progress'
    }));
  }
}
