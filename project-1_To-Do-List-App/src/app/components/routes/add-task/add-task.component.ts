import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { FocusVisibleDirective } from '../../../directives/focus-visible/focus-visible.directive';
import { db, Todo } from '../../../services/db/todo-db.service';
import { ToastrService } from 'ngx-toastr';

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
  model: Todo = { title: '', dateDeadLine: '', timeDeadLine: '', description: '' };

  private toastr = inject(ToastrService);

  async onSubmit(todoForm: NgForm) { 
    await db.todos.add({...this.model}); 
    todoForm.resetForm();
    this.toastr.success('Task saved successfully!', 'Success');
  }
}
