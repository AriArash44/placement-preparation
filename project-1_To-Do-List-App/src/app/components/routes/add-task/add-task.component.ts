import { Component, inject, signal, computed, input, effect } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { FocusVisibleDirective } from '../../../directives/focus-visible/focus-visible.directive';
import { TodoDB, Todo } from '../../../services/db/todo-db.service';
import { DeadlineWatcherService } from '../../../services/deadline/deadline-watcher';
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
export class AddTaskComponent {
  todoId = input<number>();
  model = signal<Todo>(
    { title: '', dateDeadLine: '', timeDeadLine: '', description: '', state: 'in_progress', notified: false }, 
    { equal: _.isEqual }
  );
  hasUnsavedChanges = computed(() => { 
    const m = this.model(); 
    return !!(m.title || m.dateDeadLine || m.timeDeadLine || m.description); 
  });

  isEditMode = computed(() => !!this.todoId());
  deadlineWatcherService = inject(DeadlineWatcherService);
  private db = inject(TodoDB);

  constructor() {
    effect(() => {
      if (this.todoId()) {
        this.db.todos.get(this.todoId()!).then(todo => {
          if (todo) {
            this.model.set({
              title: todo.title,
              dateDeadLine: todo.dateDeadLine,
              timeDeadLine: todo.timeDeadLine,
              description: todo.description || '',
              state: todo.state === "overdue" ? "in_progress" : todo.state,
              notified: false
            });
          }
        }).catch(error => {
          console.error('Error fetching todo:', error);
        });
      }
    })
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
      await this.db.todos.add({...this.model()}); 
      todoForm.resetForm();
      this.model.set(
        { title: '', dateDeadLine: '', timeDeadLine: '', description: '', state: 'in_progress', notified: false }
      );
      this.toastr.success('Task saved successfully!', 'Success');
    }
    else {
      await this.db.todos.update(this.todoId()!, { ...this.model() });
      this.toastr.success('Task updated successfully!', 'Success');
    }

    this.deadlineWatcherService.checkOverdueOrNotif();
  }

  toggleDone(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.model.update(m => ({
      ...m,
      state: checked ? 'done' : 'in_progress'
    }));
  }
}
