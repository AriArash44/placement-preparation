import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { FocusVisibleDirective } from '../../../directives/focus-visible/focus-visible.directive';

class AddTodoFormFeilds {
  constructor(    
    public title: string,    
    public dateDeadLine: string,
    public timeDeadLine: string,
    public description?: string,    
  ) {}
}

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
  model = new AddTodoFormFeilds('', '', '', '');
  onSubmit() { 
    console.log('Form submitted:', this.model); 
  }
}
