import { Component, inject, signal, computed, input, effect } from '@angular/core';
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
export class AddTaskComponent {
  todoId = input<number>();
  model = signal({ title: '', dateDeadLine: '', timeDeadLine: '', description: '' }, { equal: _.isEqual });
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
            description: todo.description || ''
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
    await db.todos.add({...this.model()}); 
    todoForm.resetForm();
    this.model.set({ title: '', dateDeadLine: '', timeDeadLine: '', description: '' });
    this.toastr.success('Task saved successfully!', 'Success');
  }
}
