import { Component, inject, signal, computed, effect } from '@angular/core';
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
  model = signal({ title: '', dateDeadLine: '', timeDeadLine: '', description: '' }, {equal: _.isEqual});
  hasUnsavedChanges = computed(() => { 
    const m = this.model(); 
    return !!(m.title || m.dateDeadLine || m.timeDeadLine || m.description); 
  });

  constructor() { effect(() => { console.log(this.model()); }); }

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
